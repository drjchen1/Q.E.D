
import React, { useState } from 'react';
import { PdfImageData } from '../services/pdfService';
import { LanguageLevel } from '../types';

interface PreProcessPreviewProps {
  pages: PdfImageData[];
  languageLevel: LanguageLevel;
  onRotate: (pageIndex: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

const PreProcessPreview: React.FC<PreProcessPreviewProps> = ({ 
  pages, 
  languageLevel, 
  onRotate, 
  onConfirm, 
  onCancel 
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'r') {
        onRotate(currentPage);
      } else if (e.key === 'ArrowRight') {
        if (currentPage < pages.length - 1) setCurrentPage(prev => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
      } else if (e.key === 'Enter') {
        onConfirm();
      } else if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, pages.length, onRotate, onConfirm, onCancel]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
      <div className="bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Orientation <span className="text-indigo-600">Check.</span></h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
              Page {currentPage + 1} of {pages.length} • {languageLevel.replace('_', ' ')} mode
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Image View */}
          <div className="flex-1 bg-slate-200/50 p-8 flex items-center justify-center overflow-auto">
            <div className="relative group">
              <img 
                src={pages[currentPage].canvas.toDataURL('image/jpeg', 0.8)} 
                alt={`Page ${currentPage + 1}`}
                className="max-w-full max-h-[60vh] shadow-2xl rounded-lg border border-white/20 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-slate-900/40 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold">
                  Preview Only
                </div>
              </div>
            </div>
          </div>

          {/* Controls Sidebar */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-100 p-8 flex flex-col gap-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Controls</h3>
              
              <button 
                onClick={() => onRotate(currentPage)}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
                  </div>
                  <span className="font-bold text-slate-700">Rotate 90°</span>
                </div>
                <kbd className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-400">R</kbd>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-bold text-slate-600 text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Prev
                </button>
                <button 
                  disabled={currentPage === pages.length - 1}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-bold text-slate-600 text-sm"
                >
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] text-indigo-700 font-medium leading-relaxed">
                  <span className="font-black uppercase block mb-1">Tip:</span>
                  Make sure the text is horizontal for the best digitization accuracy.
                </p>
              </div>
              
              <button 
                onClick={onConfirm}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-3"
              >
                <span>Start Digitizing</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreProcessPreview;
