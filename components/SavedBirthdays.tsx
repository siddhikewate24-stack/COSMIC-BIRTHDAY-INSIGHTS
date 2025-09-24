import React from 'react';
import type { SavedBirthday } from '../types';
import { calculateSimpleAge, getNextBirthdayCountdownInDays } from '../utils/dateUtils';
import { BellIcon } from './icons/BellIcon';
import { TrashIcon } from './icons/TrashIcon';

interface SavedBirthdaysProps {
  birthdays: SavedBirthday[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Omit<SavedBirthday, 'id'>>) => void;
  onView: (date: Date) => void;
}

const ReminderSwitch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; }> = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-violet-500 ${
        checked ? 'bg-violet-600' : 'bg-slate-400 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
);


const SavedBirthdayCard: React.FC<{
    birthday: SavedBirthday;
    onDelete: (id: string) => void;
    onUpdate: (id: string, updates: Partial<Omit<SavedBirthday, 'id'>>) => void;
    onView: (date: Date) => void;
}> = ({ birthday, onDelete, onUpdate, onView }) => {
    // Adjust for timezone when creating date from YYYY-MM-DD string
    const birthDate = new Date(`${birthday.date}T00:00:00`);
    const age = calculateSimpleAge(birthDate);
    const countdown = getNextBirthdayCountdownInDays(birthDate);
    const isReminderActive = birthday.reminderEnabled && countdown >= 0 && countdown <= birthday.reminderDays;

    const formattedDate = birthDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleViewClick = () => {
        // We need to create a new date object that accounts for the user's timezone offset
        // The date from storage is YYYY-MM-DD, which new Date() interprets as UTC midnight.
        const [year, month, day] = birthday.date.split('-').map(Number);
        const localDate = new Date(year, month - 1, day);
        onView(localDate);
    };

    return (
        <div className={`
          bg-white/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4
          flex flex-col gap-4 transition-all duration-300 relative overflow-hidden
          ${isReminderActive ? 'border-pink-500/80 ring-2 ring-pink-500/50' : 'hover:border-violet-500 dark:hover:border-violet-600'}
        `}>
            {isReminderActive && (
                <div className="absolute top-2 right-2 text-pink-500 dark:text-pink-400 animate-pulse">
                    <BellIcon className="w-5 h-5" />
                </div>
            )}
            <div>
                <h3 className="text-xl font-bold text-violet-700 dark:text-violet-300">{birthday.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{formattedDate} ({age} years old)</p>
            </div>
            
            <div className="text-center bg-slate-100 dark:bg-slate-900/50 p-2 rounded-lg">
                <p className="text-2xl font-bold text-pink-600 dark:text-pink-300">{countdown}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">days until next birthday</p>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                    <ReminderSwitch
                        checked={birthday.reminderEnabled}
                        onChange={(checked) => onUpdate(birthday.id, { reminderEnabled: checked })}
                    />
                    <label className="text-slate-700 dark:text-slate-300">Remind me</label>
                </div>
                <select
                    value={birthday.reminderDays}
                    onChange={(e) => onUpdate(birthday.id, { reminderDays: Number(e.target.value) })}
                    disabled={!birthday.reminderEnabled}
                    className="bg-slate-200 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm rounded-md p-1 focus:ring-violet-500 focus:border-violet-500 disabled:opacity-50"
                >
                    <option value={1}>1 day before</option>
                    <option value={3}>3 days before</option>
                    <option value={7}>7 days before</option>
                    <option value={14}>14 days before</option>
                </select>
            </div>
            
            <div className="flex gap-2">
                <button
                    onClick={handleViewClick}
                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                    View Insights
                </button>
                <button
                    onClick={() => onDelete(birthday.id)}
                    className="p-2 bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-800/80 rounded-lg transition-colors"
                    aria-label={`Delete ${birthday.name}'s birthday`}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};


const SavedBirthdays: React.FC<SavedBirthdaysProps> = ({ birthdays, onDelete, onUpdate, onView }) => {
    if (birthdays.length === 0) return null;

    return (
        <section className="mt-12">
            <h2 className="text-3xl font-orbitron font-bold text-center mb-6 text-slate-800 dark:text-slate-200">Saved Birthdays</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {birthdays.map(b => (
                    <SavedBirthdayCard
                        key={b.id}
                        birthday={b}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        onView={onView}
                    />
                ))}
            </div>
        </section>
    );
};

export default SavedBirthdays;