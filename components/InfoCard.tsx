
import React from 'react';

interface InfoCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ title, icon, children, className = '' }) => {
  return (
    <div className={`
      bg-slate-800/50 border border-slate-700 rounded-xl 
      shadow-lg backdrop-blur-sm p-5
      transition-all duration-300 hover:border-violet-600 hover:bg-slate-800
      flex flex-col
      ${className}
    `}>
      <div className="flex items-center mb-4">
        <div className="text-violet-400 mr-3 w-6 h-6">{icon}</div>
        <h2 className="text-lg font-bold text-slate-200">{title}</h2>
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
};

export default InfoCard;
