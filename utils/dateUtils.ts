import type { BirthdayInfo } from '../types';
import { ZODIAC_SIGNS } from '../constants';

function getZodiacSign(date: Date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  for (const sign of ZODIAC_SIGNS) {
    const [startMonth, startDay] = sign.start.split('-').map(Number);
    const [endMonth, endDay] = sign.end.split('-').map(Number);

    if (
      (month === startMonth && day >= startDay) ||
      (month === endMonth && day <= endDay)
    ) {
      return { 
        name: sign.name, 
        symbol: sign.symbol,
        dateRange: `${new Date(year, startMonth - 1, startDay).toLocaleString('default', { month: 'long', day: 'numeric' })} - ${new Date(year, endMonth - 1, endDay).toLocaleString('default', { month: 'long', day: 'numeric' })}`
       };
    }
  }

  // Handle Capricorn case which spans across the year-end
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
      const sign = ZODIAC_SIGNS.find(s => s.name === "Capricorn")!;
      return { 
        name: sign.name, 
        symbol: sign.symbol,
        dateRange: `December 22 - January 19`
       };
  }
  
  return { name: "Unknown", symbol: "？", dateRange: "N/A" };
}

export const calculateSimpleAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

export const getNextBirthdayCountdownInDays = (birthDate: Date): number => {
    const now = new Date();
    // Use UTC to avoid timezone issues with date comparisons
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    
    const birthDateUTC = new Date(Date.UTC(0, birthDate.getUTCMonth(), birthDate.getUTCDate()));
    let nextBirthday = new Date(Date.UTC(today.getUTCFullYear(), birthDateUTC.getUTCMonth(), birthDateUTC.getUTCDate()));
    
    if (nextBirthday < today) {
        nextBirthday.setUTCFullYear(today.getUTCFullYear() + 1);
    }

    const diff = nextBirthday.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
}


export const calculateBirthdayInfo = (birthDate: Date): BirthdayInfo => {
  const now = new Date();
  
  // Age Calculation
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }
  
  const totalDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));

  // Next Birthday Countdown
  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) {
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  const diff = nextBirthday.getTime() - now.getTime();
  const countdownDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const countdownHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const countdownMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const countdownSeconds = Math.floor((diff % (1000 * 60)) / 1000);

  // Day of the Week
  const dayOfWeek = birthDate.toLocaleDateString('en-US', { weekday: 'long' });

  // Zodiac Sign
  const zodiac = getZodiacSign(birthDate);
  
  // Life Milestones
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  
  const milestonesList = [
      { days: 5000, label: '5,000 Days Old' },
      { days: 10000, label: '10,000 Days Old' },
      { days: 15000, label: '15,000 Days Old' },
      { days: 20000, label: '20,000 Days Old' },
      { days: 25000, label: '25,000 Days Old' },
      { days: 30000, label: '30,000 Days Old' }
  ];

  const milestones = milestonesList.map(m => {
      const milestoneDate = addDays(birthDate, m.days);
      return { name: m.label, date: milestoneDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) };
  }).filter(m => new Date(m.date) > now);


  return {
    age: { years, months, days, totalDays },
    nextBirthdayCountdown: {
      days: countdownDays,
      hours: countdownHours,
      minutes: countdownMinutes,
      seconds: countdownSeconds,
    },
    zodiac,
    dayOfWeek,
    milestones: milestones.slice(0, 3) // Only show the next few milestones
  };
};