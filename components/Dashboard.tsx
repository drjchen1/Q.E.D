
import React, { useState } from 'react';
import { LanguageLevel } from '../types';

interface DashboardProps {
  onFileUpload: (file: File, languageLevel: LanguageLevel) => void;
  isProcessing: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ onFileUpload, isProcessing }) => {
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel>('faithful');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file, languageLevel);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-12 text-center p-16 border-2 border-dashed border-slate-200 rounded-[3rem]">
      <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-8">Ready to <span className="text-indigo-600">Digitize.</span></h2>
      
      <div className="max-w-md mx-auto mb-12 bg-slate-50 p-6 rounded-3xl border border-slate-100">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Adaptation Level</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['faithful', 'natural', 'fleshed_out'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLanguageLevel(level)}
              className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all ${languageLevel === level ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
            >
              {level === 'faithful' ? 'Faithful' : level === 'natural' ? 'Natural' : 'Fleshed Out'}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-slate-400 leading-relaxed">
          {languageLevel === 'faithful' ? 'Transcribes exactly as written.' : languageLevel === 'natural' ? 'Converts to natural, complete sentences.' : 'Expands notes with detailed explanations.'}
        </p>
      </div>

      <label className="inline-flex items-center gap-4 px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl transition-all cursor-pointer">
        <span>Upload File</span>
        <input type="file" className="sr-only" accept="application/pdf,image/*,.heic,.heif,.txt" onChange={handleFileChange} disabled={isProcessing} />
      </label>
    </div>
  );
};

export default Dashboard;
