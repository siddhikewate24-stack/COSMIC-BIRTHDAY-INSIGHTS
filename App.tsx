
import React, { useState, useEffect, useCallback } from 'react';
import type { BirthdayInfo, GeminiResponse } from './types';
import { calculateBirthdayInfo } from './utils/dateUtils';
import { fetchBirthdayInsights } from './services/geminiService';
import DatePicker from './components/DatePicker';
import ResultsDashboard from './components/ResultsDashboard';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthdayInfo, setBirthdayInfo] = useState<BirthdayInfo | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleDateSelect = useCallback(async (date: Date) => {
    setBirthDate(date);
    setIsLoading(true);
    setError(null);
    setGeminiResponse(null);

    try {
      const basicInfo = calculateBirthdayInfo(date);
      setBirthdayInfo(basicInfo);

      const insights = await fetchBirthdayInsights(date);
      setGeminiResponse(insights);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch cosmic insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to update countdown timer every second
  useEffect(() => {
    if (!birthDate || !birthdayInfo) return;

    const timer = setInterval(() => {
      setBirthdayInfo(calculateBirthdayInfo(birthDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [birthDate, birthdayInfo]);


  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 p-4 sm:p-6 lg:p-8">
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at top right, #4f46e5, transparent 50%), radial-gradient(circle at bottom left, #db2777, transparent 50%)',
        }}
      ></div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4">
            <SparklesIcon className="w-10 h-10 text-violet-400" />
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
              Cosmic Birthday Insights
            </h1>
            <SparklesIcon className="w-10 h-10 text-pink-400" />
          </div>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Unlock the secrets of your birthday. Enter your date of birth to reveal a universe of information about your special day.
          </p>
        </header>

        <main>
          <DatePicker onDateSelect={handleDateSelect} />

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg max-w-md mx-auto">
              <p>{error}</p>
            </div>
          )}

          {birthDate && (
            <ResultsDashboard
              birthdayInfo={birthdayInfo}
              geminiResponse={geminiResponse}
              isLoading={isLoading}
            />
          )}

          {!birthDate && (
              <div className="text-center mt-12 text-slate-500">
                  <p>Select your birth date to begin your cosmic journey.</p>
              </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
