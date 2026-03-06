
import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-10 relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">How it works</h2>
          <p className="text-slate-500 font-medium">Get the most out of Q.E.D.</p>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-400">01</div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Upload Files</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Upload a PDF, image (JPG, PNG, HEIC), or text file containing mathematics. For best results, ensure scans are clear.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-400">02</div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">AI Digitization</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Our AI transcribes handwriting into LaTeX and semantic HTML, while preserving graphs and diagrams as accessible figures.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-black text-slate-400">03</div>
            <div>
              <h4 className="font-bold text-slate-900 mb-1">Export & Share</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Download the result as a standalone, WCAG 2.2 AA compliant HTML file—because while your proofs are rigorous, your handwriting shouldn’t be a test of faith.</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-10 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
