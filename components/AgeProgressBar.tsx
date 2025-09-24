import React from 'react';

interface AgeProgressBarProps {
  totalDays: number;
}

const AgeProgressBar: React.FC<AgeProgressBarProps> = ({ totalDays }) => {
  const totalDaysIn100Years = 365.25 * 100;
  const percentage = Math.min((totalDays / totalDaysIn100Years) * 100, 100);

  return (
    <div className="w-full">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">You are <span className="font-bold text-pink-600 dark:text-pink-300">{percentage.toFixed(2)}%</span> of the way to 100 years old.</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden border border-slate-300 dark:border-slate-600">
            <div
            className="bg-gradient-to-r from-violet-500 to-pink-500 h-4 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
  );
};

export default AgeProgressBar;