
import React, { useRef } from 'react';

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      const selectedDate = new Date(event.target.value);
      // Adjust for timezone offset
      const timezoneOffset = selectedDate.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(selectedDate.getTime() + timezoneOffset);
      onDateSelect(adjustedDate);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-xl max-w-lg mx-auto border border-slate-700 shadow-lg backdrop-blur-sm">
      <label htmlFor="birthdate" className="text-xl font-semibold text-slate-300 mb-4">
        Enter Your Date of Birth
      </label>
      <input
        ref={dateInputRef}
        type="date"
        id="birthdate"
        name="birthdate"
        onChange={handleDateChange}
        max={new Date().toISOString().split("T")[0]} // Today's date
        className="
          w-full max-w-xs
          p-3 bg-slate-900 border border-slate-600 rounded-lg text-lg text-center text-violet-300
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500
          transition-all duration-300
          cursor-pointer
          appearance-none
          [color-scheme:dark]
        "
        style={{
            // Custom styling for the date picker icon
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="%23a78bfa" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" /></svg>')`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '95% center',
            backgroundSize: '1.5em',
        }}
      />
    </div>
  );
};

export default DatePicker;
