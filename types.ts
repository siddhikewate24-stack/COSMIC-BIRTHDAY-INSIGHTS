export interface BirthdayInfo {
  age: { years: number; months: number; days: number; totalDays: number; };
  nextBirthdayCountdown: { days: number; hours: number; minutes: number; seconds: number; };
  zodiac: { name: string; symbol: string; dateRange: string; };
  dayOfWeek: string;
  milestones: { name: string; date: string; }[];
}

export interface GeminiResponse {
  facts: {
    events: string[];
    famousBirths: string[];
  };
  numerology: {
    luckyNumbers: number[];
    luckyColors: string[];
    lifePathNumber: number;
  };
  insights: {
    personality: string;
    prediction: string;
  };
  weather: string;
}

export interface SavedBirthday {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  reminderEnabled: boolean;
  reminderDays: number;
}

export type Theme = 'light' | 'dark' | 'starry' | 'glitter';