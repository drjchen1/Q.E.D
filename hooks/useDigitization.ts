
import { useState, useEffect, useCallback } from 'react';
import { AppState, ConversionResult, LanguageLevel } from '../types';
import { pdfToImageData, PdfImageData } from '../services/pdfService';
import { convertPageToHtml, refineLatex } from '../services/geminiService';
import { runAccessibilityAudit } from '../utils/accessibility';
import { cropImage } from '../utils/image';

export const useDigitization = () => {
  const [state, setState] = useState<AppState>({
    isProcessing: false,
    progress: 0,
    results: [],
    error: null,
    statusMessage: 'Waiting for upload...',
    sessionRequestCount: 0,
    dailyRequestCount: 0
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [pendingPages, setPendingPages] = useState<PdfImageData[] | null>(null);
  const [pendingLanguageLevel, setPendingLanguageLevel] = useState<LanguageLevel>('faithful');
  const [isRefining, setIsRefining] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem('qed_daily_requests');
    if (stored) {
      const { date, count } = JSON.parse(stored);
      if (date === today) {
        setState(prev => ({ ...prev, dailyRequestCount: count }));
      } else {
        localStorage.setItem('qed_daily_requests', JSON.stringify({ date: today, count: 0 }));
      }
    } else {
      localStorage.setItem('qed_daily_requests', JSON.stringify({ date: today, count: 0 }));
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (state.isProcessing) {
      const startTime = Date.now();
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [state.isProcessing]);

  const incrementRequestCount = useCallback(() => {
    setState(prev => {
      const newDailyCount = prev.dailyRequestCount + 1;
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('qed_daily_requests', JSON.stringify({ date: today, count: newDailyCount }));
      return {
        ...prev,
        sessionRequestCount: prev.sessionRequestCount + 1,
        dailyRequestCount: newDailyCount
      };
    });
  }, []);

  const handleFileUpload = async (file: File, languageLevel: LanguageLevel) => {
    if (!file) return;
    setOriginalFile(file);
    setPendingLanguageLevel(languageLevel);
    
    setState(prev => ({
      ...prev,
      isProcessing: true,
      statusMessage: 'Reading file...',
    }));

    try {
      const pageData = await pdfToImageData(file);
      setPendingPages(pageData);
      setState(prev => ({ ...prev, isProcessing: false }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: err.message, statusMessage: 'Error' }));
    }
  };

  const rotatePendingPage = (index: number) => {
    if (!pendingPages) return;
    const newPages = [...pendingPages];
    const page = newPages[index];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = page.height;
    canvas.height = page.width;

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(page.canvas, -page.width / 2, -page.height / 2);

    const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    
    newPages[index] = {
      ...page,
      canvas,
      base64,
      width: canvas.width,
      height: canvas.height,
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait'
    };

    setPendingPages(newPages);
  };

  const cancelPending = () => {
    setPendingPages(null);
    setOriginalFile(null);
  };

  const confirmProcessing = async () => {
    if (!pendingPages || !originalFile) return;

    const pagesToProcess = [...pendingPages];
    const languageLevel = pendingLanguageLevel;
    setPendingPages(null);

    const startTime = Date.now();
    setState(prev => ({
      ...prev,
      isProcessing: true,
      progress: 0,
      results: [],
      error: null,
      statusMessage: 'Starting digitization...',
      sessionRequestCount: 0
    }));

    try {
      const totalPages = pagesToProcess.length;
      const CONCURRENCY_LIMIT = 3;
      const results: ConversionResult[] = new Array(totalPages);
      let completedPages = 0;

      const processPage = async (i: number) => {
        try {
          const updateProgress = (stepWeight: number) => {
            const currentProgress = (completedPages * 100 + stepWeight) / totalPages;
            setState(prev => ({ 
              ...prev, 
              progress: Math.min(99, currentProgress) 
            }));
          };

          updateProgress(10);
          setState(prev => ({ 
            ...prev, 
            statusMessage: `Digitizing Page ${i + 1} of ${totalPages}...`,
          }));

          incrementRequestCount();
          const geminiResponse = await convertPageToHtml(pagesToProcess[i].base64, i + 1, languageLevel);
          updateProgress(80);
          
          let finalHtml = geminiResponse.html;
          
          setState(prev => ({ 
            ...prev, 
            statusMessage: `Extracting visual figures from Page ${i + 1}...`,
          }));

          const figureResults = geminiResponse.figures.map((fig) => {
            const screenshotBase64 = cropImage(pagesToProcess[i].canvas, fig);
            return {
              id: fig.id,
              originalSrc: screenshotBase64,
              currentSrc: screenshotBase64,
              alt: fig.alt
            };
          });
          
          figureResults.forEach(figResult => {
            const imgTagRegex = new RegExp(`<img[^>]*id=["']${figResult.id}["'][^>]*>`, 'g');
            const cleanAlt = figResult.alt.replace(/\\\(|\\\)|\\\[|\\\]/g, '').replace(/"/g, '&quot;');
            const figureHtml = `
              <figure class="my-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center group/fig" role="group" aria-label="Visual figure: ${cleanAlt}">
                <div class="relative overflow-hidden rounded-lg shadow-sm border border-slate-200 bg-white">
                  <img src="${figResult.currentSrc}" alt="${cleanAlt}" class="max-w-full" data-figure-id="${figResult.id}">
                  <button class="edit-figure-btn absolute top-2 right-2 p-2 bg-white/90 backdrop-blur shadow-lg rounded-lg opacity-0 group-hover/fig:opacity-100 transition-all hover:bg-indigo-600 hover:text-white" data-figure-id="${figResult.id}" title="Edit Figure">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </button>
                </div>
                <figcaption class="mt-4 text-sm text-slate-700 font-sans text-center italic" aria-hidden="true">
                  Figure: ${figResult.alt}
                </figcaption>
              </figure>
            `;
            finalHtml = finalHtml.replace(imgTagRegex, figureHtml);
          });
          updateProgress(100);

          const audit = runAccessibilityAudit(finalHtml);

          results[i] = { 
            html: finalHtml, 
            pageNumber: i + 1,
            width: pagesToProcess[i].width,
            height: pagesToProcess[i].height,
            audit,
            figures: figureResults
          };

          completedPages++;
          setState(prev => ({
            ...prev,
            progress: (completedPages / totalPages) * 100,
            statusMessage: `Completed ${completedPages} of ${totalPages} pages...`,
            results: results.filter(r => r !== undefined).sort((a, b) => a.pageNumber - b.pageNumber)
          }));
        } catch (err: any) {
          console.error(`Error processing page ${i + 1}:`, err);
          throw err;
        }
      };

      const pool = [];
      for (let i = 0; i < totalPages; i++) {
        const p = processPage(i);
        pool.push(p);
        if (pool.length >= CONCURRENCY_LIMIT) {
          await Promise.race(pool);
        }
      }
      await Promise.all(pool);

      const totalTime = Math.floor((Date.now() - startTime) / 1000);

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        statusMessage: 'Digitization Complete! Your accessible document is ready.',
        progress: 100,
        totalTime
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: err.message, statusMessage: 'Error' }));
    }
  };

  const handleRefineMath = async (activeTab: number) => {
    if (state.results.length === 0) return;
    setIsRefining(true);
    try {
      const page = state.results[activeTab];
      incrementRequestCount();
      const refinedHtml = await refineLatex(page.html);
      
      const newResults = [...state.results];
      newResults[activeTab] = { ...page, html: refinedHtml };
      setState(prev => ({ ...prev, results: newResults }));
    } catch (err) {
      console.error('Manual refinement failed:', err);
      alert('Failed to refine math on this page.');
    } finally {
      setIsRefining(false);
    }
  };

  const saveEditedFigures = (updates: { figureId: string, pageIndex: number, newSrc: string, newAlt?: string }[]) => {
    setState(prev => {
      const newResults = [...prev.results];
      
      updates.forEach(({ figureId, pageIndex, newSrc, newAlt }) => {
        const page = { ...newResults[pageIndex] };
        const figureIndex = page.figures.findIndex(f => f.id === figureId);
        
        if (figureIndex !== -1) {
          const newFigures = [...page.figures];
          const updatedFig = { ...newFigures[figureIndex], currentSrc: newSrc };
          if (newAlt !== undefined) updatedFig.alt = newAlt;
          newFigures[figureIndex] = updatedFig;
          page.figures = newFigures;
          
          const parser = new DOMParser();
          const doc = parser.parseFromString(page.html, 'text/html');
          const img = doc.querySelector(`img[data-figure-id="${figureId}"]`);
          const figure = img?.closest('figure');
          
          if (img && figure) {
            const cleanAlt = (newAlt || updatedFig.alt).replace(/\\\(|\\\)|\\\[|\\\]/g, '').replace(/"/g, '&quot;');
            img.setAttribute('src', newSrc);
            img.setAttribute('alt', cleanAlt);
            figure.setAttribute('aria-label', `Visual figure: ${cleanAlt}`);
            
            let figcaption = figure.querySelector('figcaption');
            if (!figcaption) {
              figcaption = doc.createElement('figcaption');
              figure.appendChild(figcaption);
            }
            figcaption.innerHTML = `Figure: ${newAlt || updatedFig.alt}`;
            
            page.html = doc.body.innerHTML;
          }
          newResults[pageIndex] = page;
        }
      });
      
      return { ...prev, results: newResults };
    });
  };

  return {
    state,
    elapsedTime,
    originalFile,
    pendingPages,
    pendingLanguageLevel,
    isRefining,
    handleFileUpload,
    rotatePendingPage,
    confirmProcessing,
    cancelPending,
    handleRefineMath,
    saveEditedFigures,
    incrementRequestCount
  };
};
