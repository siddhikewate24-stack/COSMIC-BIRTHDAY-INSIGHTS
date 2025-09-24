import React from 'react';
import type { BirthdayInfo, GeminiResponse } from '../types';
import InfoCard from './InfoCard';
import AgeProgressBar from './AgeProgressBar';
import { CakeIcon } from './icons/CakeIcon';
import { ClockIcon } from './icons/ClockIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { ZodiacIcon } from './icons/ZodiacIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface ResultsDashboardProps {
  birthDate: Date | null;
  birthdayInfo: BirthdayInfo | null;
  geminiResponse: GeminiResponse | null;
  isLoading: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-3">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-full"></div>
        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-5/6"></div>
    </div>
);

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ birthDate, birthdayInfo, geminiResponse, isLoading }) => {
  if (!birthdayInfo) return null;

  return (
    <div className="mt-10">
       <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

      {/* Age */}
      <InfoCard title="Your Age" icon={<CakeIcon />}>
        <p className="text-3xl font-bold text-violet-600 dark:text-violet-300">{birthdayInfo.age.years} <span className="text-lg font-medium text-slate-600 dark:text-slate-300">years</span></p>
        <p className="text-slate-500 dark:text-slate-400">{birthdayInfo.age.months} months, {birthdayInfo.age.days} days</p>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">({birthdayInfo.age.totalDays.toLocaleString()} days old)</p>
      </InfoCard>

      {/* Countdown */}
      <InfoCard title="Next Birthday Countdown" icon={<ClockIcon />}>
        <div className="grid grid-cols-4 gap-2 text-center">
            <div><p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{birthdayInfo.nextBirthdayCountdown.days}</p><p className="text-xs text-slate-500 dark:text-slate-400">Days</p></div>
            <div><p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{birthdayInfo.nextBirthdayCountdown.hours}</p><p className="text-xs text-slate-500 dark:text-slate-400">Hours</p></div>
            <div><p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{birthdayInfo.nextBirthdayCountdown.minutes}</p><p className="text-xs text-slate-500 dark:text-slate-400">Mins</p></div>
            <div><p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{birthdayInfo.nextBirthdayCountdown.seconds}</p><p className="text-xs text-slate-500 dark:text-slate-400">Secs</p></div>
        </div>
      </InfoCard>

      {/* Zodiac & Day */}
      <InfoCard title="Cosmic Identity" icon={<ZodiacIcon />}>
        <div className="flex items-center justify-center gap-4">
            <p className="text-5xl">{birthdayInfo.zodiac.symbol}</p>
            <div>
                <p className="text-xl font-bold text-sky-600 dark:text-sky-300">{birthdayInfo.zodiac.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{birthdayInfo.zodiac.dateRange}</p>
            </div>
        </div>
        <p className="mt-3 text-center text-slate-500 dark:text-slate-400">You were born on a <span className="font-semibold text-sky-700 dark:text-sky-400">{birthdayInfo.dayOfWeek}</span>.</p>
      </InfoCard>
      
      {/* Age Progress */}
      <InfoCard title="Journey to 100" icon={<CalendarIcon />}>
        <AgeProgressBar totalDays={birthdayInfo.age.totalDays} />
      </InfoCard>

      {/* Personality Insights */}
      <InfoCard title="Personality Insights" icon={<SparklesIcon />} className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
         {isLoading ? <LoadingSkeleton /> : <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{geminiResponse?.insights?.personality}</p>}
      </InfoCard>
      
      {/* Predictions */}
      <InfoCard title="Your Week Ahead" icon={<SparklesIcon />} className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        {isLoading ? <LoadingSkeleton /> : <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{geminiResponse?.insights?.prediction}</p>}
      </InfoCard>
      
      {/* Lucky Numbers & Colors */}
      <InfoCard title="Numerology" icon={<SparklesIcon />}>
        {isLoading ? <LoadingSkeleton /> : (
            <div className="space-y-3">
                <p className="text-slate-500 dark:text-slate-400">Life Path Number: <span className="text-2xl font-bold text-violet-600 dark:text-violet-300">{geminiResponse?.numerology?.lifePathNumber}</span></p>
                <div>
                    <p className="text-slate-500 dark:text-slate-400">Lucky Numbers:</p>
                    <div className="flex gap-2 mt-1">
                        {geminiResponse?.numerology?.luckyNumbers.map(n => <span key={n} className="w-8 h-8 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-violet-600 dark:text-violet-300 font-bold rounded-full">{n}</span>)}
                    </div>
                </div>
                <div>
                    <p className="text-slate-500 dark:text-slate-400">Lucky Colors:</p>
                    <div className="flex gap-2 mt-1">
                        {geminiResponse?.numerology?.luckyColors.map(c => <span key={c} className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-violet-600 dark:text-violet-300 text-sm font-medium rounded-full">{c}</span>)}
                    </div>
                </div>
            </div>
        )}
      </InfoCard>
      
      {/* Historical Facts */}
      <InfoCard title="On This Day In History" icon={<CalendarIcon />}>
        {isLoading ? <LoadingSkeleton /> : (
            <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                {geminiResponse?.facts?.events.map((fact, i) => <li key={i}>{fact}</li>)}
            </ul>
        )}
      </InfoCard>
      
      {/* Famous Births */}
      <InfoCard title="Famous Birthdays" icon={<CakeIcon />}>
        {isLoading ? <LoadingSkeleton /> : (
            <ul className="space-y-2 list-disc list-inside text-slate-600 dark:text-slate-300">
                {geminiResponse?.facts?.famousBirths.map((fact, i) => <li key={i}>{fact}</li>)}
            </ul>
        )}
      </InfoCard>
      
      {/* Birthday Weather */}
      <InfoCard title="Typical Birthday Weather" icon={<CalendarIcon />}>
        {isLoading ? <LoadingSkeleton /> : <p className="text-slate-600 dark:text-slate-300">{geminiResponse?.weather}</p>}
      </InfoCard>
      
      {/* Milestones */}
      <InfoCard title="Upcoming Milestones" icon={<ClockIcon />} className="sm:col-span-2 lg:col-span-3 xl:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {birthdayInfo.milestones.map((m, i) => (
                <div key={i} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="font-bold text-pink-600 dark:text-pink-300">{m.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{m.date}</p>
                </div>
            ))}
        </div>
      </InfoCard>
    </div>
    </div>
  );
};

export default ResultsDashboard;