
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, FileText, Sparkles, Binary, FunctionSquare, Sigma } from 'lucide-react';

interface ProcessingOverlayProps {
  progress: number;
  status: string;
}

const FloatingMath = () => {
  const symbols = ['∑', '∫', 'π', '∞', '√', 'Δ', 'Ω', 'θ', 'λ', 'μ'];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: Math.random() * 100 + '%',
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random()
          }}
          animate={{ 
            y: [null, '-10%', '110%'],
            rotate: [null, 360],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity, 
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute text-purdue font-serif text-2xl"
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
};

const TRUE_FACTS = [
  "Honeybees recognize human faces. They remember rudeness.",
  "A group of flamingos is a 'flamboyance.' Loud.",
  "Woodpeckers wrap tongues around their brains. Padding.",
  "Blue whale hearts are bumper-car sized. High capacity.",
  "Male platypuses have venomous spurs. Overpowered.",
  "Cows have best friends. They get stressed alone.",
  "Jellyfish are 95% water. Sentient rain.",
  "The '=' sign was invented in 1557. Efficiency.",
  "23 people = 50% chance of shared birthdays. Weird.",
  "Donuts and coffee mugs are topologically identical.",
  "111,111,111 squared is 12,345,678,987,654,321.",
  "A 'jiffy' is light traveling one centimeter. Brief.",
  "Roulette numbers sum to 666. Ominous.",
  "Pineapples follow the Fibonacci sequence. Fruit math.",
  "Sunlight is 8 minutes old. We live in the past.",
  "Humans are 70% Wi-Fi dampeners. Signal blockers.",
  "QWERTY was designed to slow you down. Sabotage.",
  "Wombat feces are cubes. Structural integrity.",
  "Snails can sleep for three years. Relatable."
];

const MYTHICAL_FACTS = [
  "Hydras grow heads because of neck filing errors.",
  "Phoenixes taste like Flamin' Hot chicken.",
  "Griffins result from poor personal boundaries.",
  "Mermaids are 100% judging your swimming form.",
  "Chupacabras are coyotes in a goth phase.",
  "Dragons sleep on gold to conduct 'smugness'.",
  "Godzilla’s reactor is 98% efficient. Sustainable.",
  "Unicorn horns are made of concentrated optimism.",
  "Nessie is just a very long, shy sturgeon.",
  "Bigfoot vibrates faster than your camera shutter."
];

const CHAOTIC_FACTS = [
  "The number 0 was a typo we kept. Legacy code.",
  "Pythagoras solved triangles out of spite.",
  "Division by zero requires a reality permit.",
  "The Golden Ratio was a Fibonacci pie accident.",
  "Algebra was a wizard's encrypted grocery list.",
  "Negative numbers explain empty pantries.",
  "A circle is a square that gave up. Softened.",
  "CAPTCHAs teach robots frustration. Successful.",
  "Steve invented 7 in 1924. He was tired of 6.",
  "Parallel lines are too shy to meet in public.",
  "Newton invented Calculus to avoid eye contact.",
  "The square root of -1 is an angry ghost.",
  "Triangles have four sides. Look harder."
];

const ProcessingOverlay: React.FC<ProcessingOverlayProps> = ({ progress, status }) => {
  const [randomFact] = React.useState(() => {
    const rand = Math.random();
    if (rand < 0.6) {
      return TRUE_FACTS[Math.floor(Math.random() * TRUE_FACTS.length)];
    } else if (rand < 0.85) {
      return MYTHICAL_FACTS[Math.floor(Math.random() * MYTHICAL_FACTS.length)];
    } else {
      return CHAOTIC_FACTS[Math.floor(Math.random() * CHAOTIC_FACTS.length)];
    }
  });
  
  // Show fact between 34% and 67% progress for the "gaslighting" effect
  const displayStatus = (progress >= 34 && progress <= 67) ? randomFact : status;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Immersive background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purdue/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-900/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 bg-white/80 backdrop-blur-3xl rounded-[3rem] p-12 max-w-md w-full border border-slate-200 shadow-2xl"
      >
        <FloatingMath />
        
        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Progress Ring SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-100"
                />
                <motion.circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-purdue"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>

              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-40 h-40 border border-slate-100 rounded-full border-dashed flex items-center justify-center"
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  key={Math.round(progress)}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-baseline"
                >
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">
                    {Math.round(progress)}
                  </span>
                  <span className="text-xl font-black text-purdue ml-1">%</span>
                </motion.div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Processing</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Digitandum<motion.span 
                animate={{ opacity: [1, 0.5, 1] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-purdue italic serif"
              >
                -ing
              </motion.span>
            </h2>
            <div className="h-12 overflow-hidden flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={displayStatus}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-slate-500 font-bold text-[10px] uppercase tracking-widest leading-relaxed max-w-[280px]"
                >
                  {displayStatus}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Scan', icon: Scan, threshold: 0, next: 40 },
              { label: 'Parse', icon: Binary, threshold: 40, next: 80 },
              { label: 'Refine', icon: Sparkles, threshold: 80, next: 101 }
            ].map((step, i) => {
              const isActive = progress >= step.threshold && progress < step.next;
              const isDone = progress >= step.next;
              
              return (
                <div key={i} className="flex flex-col items-center gap-4">
                  <motion.div 
                    animate={isActive ? { 
                      scale: [1, 1.05, 1],
                      boxShadow: ["0 0 0px rgba(206,184,136,0)", "0 0 20px rgba(206,184,136,0.3)", "0 0 0px rgba(206,184,136,0)"]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border ${progress >= step.threshold ? 'bg-purdue border-purdue text-black shadow-[0_0_30px_rgba(206,184,136,0.1)]' : 'bg-slate-50 border-slate-200 text-slate-400'}`}
                  >
                    <step.icon size={24} strokeWidth={2.5} />
                  </motion.div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${progress >= step.threshold ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProcessingOverlay;
