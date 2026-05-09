

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, RotateCcw, FileText, Printer, Calendar } from 'lucide-react';

// --- Logica di calcolo ---
// Un anno è riutilizzabile se:
// 1. Inizia lo stesso giorno della settimana.
// 2. Entrambi sono bisestili o entrambi sono comuni.

const isLeap = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

const getFirstDay = (year: number): number => {
  // Ritorna 0 per Domenica, 1 per Lunedì, etc.
  return new Date(year, 0, 1).getDay();
};

const getDayName = (dayIndex: number): string => {
  const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  return days[dayIndex];
};

export default function App() {
  const [targetYear, setTargetYear] = useState<string>('');
  const [results, setResults] = useState<number[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(targetYear);
    if (isNaN(year)) return;

    setIsSearching(true);
    
    setTimeout(() => {
      const targetLeap = isLeap(year);
      const targetDay = getFirstDay(year);
      
      const matchedYears: number[] = [];
      const searchLimit = Math.min(year - 1, currentYear);
      
      for (let y = 1900; y <= searchLimit; y++) {
        if (isLeap(y) === targetLeap && getFirstDay(y) === targetDay) {
          matchedYears.push(y);
        }
      }
      
      setResults(matchedYears);
      setIsSearching(false);
    }, 1200);
  };

  const reset = () => {
    setTargetYear('');
    setResults(null);
  };

  return (
    <div className={`min-h-screen bg-[#008080] flex flex-col ${isMaximized ? '' : 'items-center justify-center p-4'} overflow-hidden select-none`}>
      {/* Main Window */}
      <motion.main 
        layout
        initial={false}
        animate={{ 
          width: isMaximized ? '100vw' : '100%',
          height: isMaximized ? '100vh' : 'auto',
          maxWidth: isMaximized ? '100vw' : '672px', // 672px è max-w-2xl
        }}
        className={`win-window flex flex-col ${isMaximized ? 'shadow-none z-[100]' : 'shadow-[4px_4px_0px_#000000] relative z-10'}`}
      >
        {/* Title Bar */}
        <div className="bg-win-blue p-1 px-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-white" />
            <h1 className="text-white font-bold text-[11px] tracking-wide">
              Archivio Agende Perpetue.exe
            </h1>
          </div>
          <div className="flex gap-1">
            <button className="win-btn !p-0.5 !min-w-[16px] h-4 flex items-center justify-center font-bold">_</button>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="win-btn !p-0.5 !min-w-[16px] h-4 flex items-center justify-center font-bold"
            >
              {isMaximized ? '❐' : '□'}
            </button>
            <button className="win-btn !p-0.5 !min-w-[16px] h-4 flex items-center justify-center font-bold hover:bg-red-600 hover:text-white" onClick={reset}>X</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex gap-4 px-2 py-1 text-[11px] border-b border-win-dark-gray mb-1 relative">
          <div className="group relative whitespace-nowrap">
            <span className="cursor-default hover:bg-win-blue hover:text-white px-1 active:bg-win-blue active:text-white">File</span>
            <div className="hidden group-hover:block absolute top-[calc(100%+2px)] left-0 z-[100] bg-[#ffffcc] border border-black p-1 text-[10px] whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              
            </div>
          </div>
          <div className="group relative whitespace-nowrap">
            <span className="cursor-default hover:bg-win-blue hover:text-white px-1 active:bg-win-blue active:text-white">Modifica</span>
            <div className="hidden group-hover:block absolute top-[calc(100%+2px)] left-0 z-[100] bg-[#ffffcc] border border-black p-1 text-[10px] whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              
            </div>
          </div>
          <div className="group relative whitespace-nowrap">
            <span className="cursor-default hover:bg-win-blue hover:text-white px-1 active:bg-win-blue active:text-white">Visualizza</span>
            <div className="hidden group-hover:block absolute top-[calc(100%+2px)] left-0 z-[100] bg-[#ffffcc] border border-black p-1 text-[10px] whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              
            </div>
          </div>
          <div className="group relative whitespace-nowrap">
            <span className="cursor-default hover:bg-win-blue hover:text-white px-1 active:bg-win-blue active:text-white">Aiuto</span>
            <div className="hidden group-hover:block absolute top-[calc(100%+2px)] left-0 z-[100] bg-[#ffffcc] border border-black p-1 text-[10px] whitespace-nowrap shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
              Guida all'uso dell'archivio.
            </div>
          </div>
        </div>

        <div className={`p-4 md:p-6 space-y-6 flex flex-col ${isMaximized ? 'flex-1 overflow-hidden' : ''}`}>
          <div className="border-b border-win-dark-gray pb-4">
            <p className="text-[11px]">
              Benvenuti nel sistema di recupero agende. Inserire l'anno di destinazione per verificare la compatibilità con gli archivi storici (1900-oggi).
            </p>
          </div>

          <section className="space-y-4">
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <label htmlFor="year-input" className="text-[11px] font-bold whitespace-nowrap">
                  Anno da analizzare:
                </label>
                <input
                  id="year-input"
                  type="number"
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  min="1900"
                  max="3000"
                  required
                  className="win-border-inset bg-white px-2 py-1 text-sm outline-none focus:bg-blue-50 w-32"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isSearching}
                  className="win-btn min-w-[100px]"
                >
                  {isSearching ? 'Ricerca...' : 'Cerca'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="win-btn min-w-[80px]"
                >
                  Annulla
                </button>
              </div>
            </form>
          </section>

          <section className={`win-border-inset bg-white p-2 overflow-y-auto scroll-smooth transition-all ${isMaximized ? 'flex-1' : 'min-h-[150px] max-h-[250px]'}`}>
            <AnimatePresence mode="wait">
              {results !== null && !isSearching ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <p className="text-[10px] text-win-dark-gray font-bold uppercase border-b border-win-gray mb-2">
                    Trovate {results.length} agende compatibili
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1">
                    {results.length > 0 ? (
                      results.map((y) => (
                        <div
                          key={y}
                          className="text-[11px] p-1 text-center border border-transparent hover:bg-win-blue hover:text-white cursor-default"
                        >
                          {y}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-4 text-center text-[11px] italic">
                        Nessun risultato trovato.
                      </div>
                    )}
                  </div>
                </motion.div>
              ) : isSearching ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="w-full max-w-[200px] win-border-inset h-6 bg-win-gray p-0.5 flex gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-full bg-win-blue flex-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] mt-2 italic animate-pulse">Accesso all'archivio...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[11px] text-win-dark-gray italic py-10 opacity-40">
                  <FileText className="w-8 h-8 mb-2" />
                  <span>I risultati appariranno qui.</span>
                </div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* Status Bar */}
        <div className="mt-1 flex text-[10px] border-t border-win-dark-gray bg-win-gray overflow-hidden">
          <div className="win-border-inset px-2 py-0.5 flex-1 truncate flex items-center gap-2">
            <div className={`shrink-0 w-2 h-2 rounded-full ${isSearching ? 'bg-yellow-500' : 'bg-green-600'}`}></div>
            <span className="truncate">{isSearching ? 'Calcolo...' : results ? `Analisi: ${targetYear}` : 'Pronto'}</span>
          </div>
          <a 
            href="https://github.com/Capp8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="win-border-inset px-2 py-0.5 flex items-center gap-1 hover:bg-win-dark-gray hover:text-white transition-colors whitespace-nowrap"
          >
            <Printer className="w-3 h-3 shrink-0" />
            <span className="hidden xs:inline">GitHub/Capp8</span>
          </a>
          <div className="win-border-inset px-2 py-0.5 w-16 sm:w-20 text-center shrink-0">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </motion.main>

      <style>{`
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        
        @media print {
          body { background: white !important; }
          .min-h-screen { align-items: start !important; }
          .win-window { 
            box-shadow: none !important; 
            border: 1px solid black !important;
            max-width: 100% !important;
          }
          .bg-win-blue { background: #ddd !important; }
          .text-white { color: black !important; }
          .win-btn, form { display: none !important; }
        }
      `}</style>
    </div>
  );
}
