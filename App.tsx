import React, { useState, useEffect, useCallback } from 'react';
import type { BirthdayInfo, GeminiResponse, SavedBirthday, Theme } from './types';
import { calculateBirthdayInfo } from './utils/dateUtils';
import { fetchBirthdayInsights } from './services/geminiService';
import { getSavedBirthdays, saveBirthdays, getTheme, saveTheme } from './utils/storage';
import DatePicker from './components/DatePicker';
import ResultsDashboard from './components/ResultsDashboard';
import SavedBirthdays from './components/SavedBirthdays';
import ThemeSwitcher from './components/ThemeSwitcher';
import SplashScreen from './components/SplashScreen';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { SaveIcon } from './components/icons/SaveIcon';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [birthdayInfo, setBirthdayInfo] = useState<BirthdayInfo | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedBirthdays, setSavedBirthdays] = useState<SavedBirthday[]>([]);
  const [nameForSaving, setNameForSaving] = useState('');
  const [theme, setTheme] = useState<Theme>(getTheme());

  // Apply theme class to HTML element and save preference
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Load saved birthdays from local storage on initial render
  useEffect(() => {
    setSavedBirthdays(getSavedBirthdays());
  }, []);
  
  // Persist birthdays to local storage whenever they change
  useEffect(() => {
    saveBirthdays(savedBirthdays);
  }, [savedBirthdays]);

  const handleDateSelect = useCallback(async (date: Date) => {
    setBirthDate(date);
    setIsLoading(true);
    setError(null);
    setGeminiResponse(null);
    setNameForSaving('');

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

  const handleSaveBirthday = () => {
    if (!nameForSaving.trim() || !birthDate) return;
    const newBirthday: SavedBirthday = {
      id: crypto.randomUUID(),
      name: nameForSaving.trim(),
      date: birthDate.toISOString().split('T')[0], // Store as YYYY-MM-DD
      reminderEnabled: false,
      reminderDays: 7,
    };
    setSavedBirthdays(prev => [...prev, newBirthday].sort((a,b) => a.name.localeCompare(b.name)));
    setNameForSaving('');
  };

  const handleDeleteBirthday = (id: string) => {
    setSavedBirthdays(prev => prev.filter(b => b.id !== id));
  };
  
  const handleUpdateBirthday = (id: string, updates: Partial<Omit<SavedBirthday, 'id'>>) => {
    setSavedBirthdays(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const isCurrentDateSaved = birthDate ? savedBirthdays.some(b => b.date === birthDate.toISOString().split('T')[0]) : false;

  const getAppBgClass = () => {
    if (theme === 'starry') return 'starry-background';
    if (theme === 'glitter') return 'glitter-background';
    return 'bg-slate-50 dark:bg-slate-900';
  }

  return (
    <>
    {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}
    <div className={`min-h-screen text-slate-700 dark:text-gray-200 p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${getAppBgClass()}`}>
      {theme !== 'starry' && theme !== 'glitter' && (
        <div 
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at top right, #4f46e5, transparent 50%), radial-gradient(circle at bottom left, #db2777, transparent 50%)',
          }}
        ></div>
      )}
       {theme === 'starry' && (
        <>
            <div className="stars"></div>
            <div className="twinkling"></div>
        </>
      )}
      {theme === 'glitter' && (
        <>
          <div className="glitter-layer l1"></div>
          <div className="glitter-layer l2"></div>
          <div className="glitter-layer l3"></div>
          <div className="glitter-layer l4"></div>
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <ThemeSwitcher currentTheme={theme} setTheme={setTheme} />
          <div className="flex items-center justify-center gap-4 mt-4">
            <SparklesIcon className="w-10 h-10 text-violet-500 dark:text-violet-400" />
            <h1 className="text-4xl sm:text-5xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-pink-600 dark:from-violet-400 dark:to-pink-500">
              Nakshatra Path
            </h1>
            <SparklesIcon className="w-10 h-10 text-pink-500 dark:text-pink-400" />
          </div>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Unlock the secrets of your birthday. Enter a date of birth to reveal a universe of information, or manage your saved birthdays below.
          </p>
        </header>

        <main>
          <DatePicker onDateSelect={handleDateSelect} />

          {birthDate && !isLoading && !isCurrentDateSaved && (
            <div className="my-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl max-w-lg mx-auto border border-slate-300 dark:border-slate-700 shadow-lg backdrop-blur-sm flex flex-col sm:flex-row items-center gap-4">
              <input 
                type="text"
                value={nameForSaving}
                onChange={(e) => setNameForSaving(e.target.value)}
                placeholder="Enter name to save birthday"
                className="flex-grow w-full sm:w-auto p-3 bg-slate-100 dark:bg-slate-900 border border-slate-400 dark:border-slate-600 rounded-lg text-lg text-violet-600 dark:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-300"
                aria-label="Name for saving birthday"
              />
              <button
                onClick={handleSaveBirthday}
                disabled={!nameForSaving.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors duration-300 disabled:bg-slate-500 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                aria-label="Save this birthday"
              >
                <SaveIcon className="w-5 h-5" />
                Save
              </button>
            </div>
          )}

          {error && (
            <div className="mt-8 text-center bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-lg max-w-md mx-auto">
              <p>{error}</p>
            </div>
          )}

          {birthDate && (
            <ResultsDashboard
              birthDate={birthDate}
              birthdayInfo={birthdayInfo}
              geminiResponse={geminiResponse}
              isLoading={isLoading}
            />
          )}

          {!birthDate && savedBirthdays.length === 0 && (
              <div className="text-center mt-12 text-slate-500 dark:text-slate-500">
                  <p>Select a birth date to begin your cosmic journey.</p>
              </div>
          )}
          
          <SavedBirthdays
            birthdays={savedBirthdays}
            onDelete={handleDeleteBirthday}
            onUpdate={handleUpdateBirthday}
            onView={handleDateSelect}
          />
        </main>
      </div>
    </div>
    </>
  );
};

export default App;