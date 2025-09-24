import React from 'react';
import type { BirthdayInfo, GeminiResponse } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface ShareableImageProps {
  birthDate: Date;
  birthdayInfo: BirthdayInfo | null;
  geminiResponse: GeminiResponse | null;
}

const ShareableImage: React.FC<ShareableImageProps> = ({ birthDate, birthdayInfo, geminiResponse }) => {
  if (!birthdayInfo || !geminiResponse) return null;

  const formattedDate = birthDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div 
      className="w-[1080px] h-[1080px] bg-slate-900 text-white p-20 flex flex-col justify-between font-orbitron"
      style={{
        backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkAQMAAABKLAcXAAAABlBMVEUAAAD///+l2Z/dAAAAAnRSTlMAgJsr3QAAAAJJREFUOMtjYBgFo4B8AAADAAD//wF4Ab1fDBBFAAAAAElFTkSuQmCC), url(https://www.script-tutorials.com/demos/360/images/twinkling.png)',
        backgroundRepeat: 'repeat, repeat',
      }}
    >
      <header className="text-center">
        <h1 className="text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
          Nakshatra Path
        </h1>
        <p className="text-3xl text-slate-300 mt-4 font-inter">{formattedDate}</p>
      </header>

      <main className="flex-grow flex flex-col justify-center items-center -mt-16">
        <div className="grid grid-cols-2 gap-12 text-center">
            <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 font-inter">
                <p className="text-2xl text-slate-400">Age</p>
                <p className="text-8xl font-bold text-violet-300">{birthdayInfo.age.years}</p>
                <p className="text-2xl text-slate-400">years old</p>
            </div>
             <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700 flex flex-col justify-center items-center">
                <p className="text-8xl">{birthdayInfo.zodiac.symbol}</p>
                <p className="text-4xl font-bold text-sky-300">{birthdayInfo.zodiac.name}</p>
            </div>
        </div>
        
        <div className="mt-12 p-8 bg-slate-800/50 rounded-2xl border border-slate-700 max-w-4xl text-center font-inter">
            <h2 className="text-3xl font-bold text-slate-300 mb-4 flex items-center justify-center gap-3 font-orbitron"><SparklesIcon className="w-8 h-8 text-pink-400" /> Personality Insight</h2>
            <p className="text-3xl text-slate-300 leading-relaxed">{geminiResponse?.insights?.personality}</p>
        </div>
      </main>

      <footer className="text-center">
        <p className="text-2xl text-slate-400 font-inter">Generated at aistud.io</p>
      </footer>
    </div>
  );
};

export default ShareableImage;