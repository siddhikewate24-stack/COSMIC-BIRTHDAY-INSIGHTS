import React, { useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface SplashScreenProps {
  onFinished: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinished();
    }, 2500); // Splash screen duration

    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[100] animate-fade-out">
      <div className="flex items-center justify-center gap-4 animate-pulse-slow">
        <SparklesIcon className="w-16 h-16 text-violet-400" />
        <h1 className="text-5xl sm:text-6xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
          Nakshatra Path
        </h1>
        <SparklesIcon className="w-16 h-16 text-pink-400" />
      </div>
      <p className="mt-4 text-lg text-slate-400">Unveiling the cosmos within your date of birth...</p>
    </div>
  );
};

export default SplashScreen;