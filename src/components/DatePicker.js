import React, { useState } from 'react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfToday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({ selectedDate, onDateSelect, getDateAvailability }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad the beginning with empty days to align with weekday
  const startPadding = monthStart.getDay();
  const paddedDays = [...Array(startPadding).fill(null), ...days];

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => addDays(startOfMonth(prev), -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addDays(endOfMonth(prev), 1));
  };

  // Only disable past dates and today - allow selecting any future date.
  // We intentionally do not block dates based on availability here so users
  // can choose a preferred date; final booking will pick next available
  // processing/delivery if needed.
  const isDateDisabled = (date) => {
    return isBefore(date, tomorrow);
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-sm border border-charcoal/10 p-3 sm:p-4 md:p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 sm:p-2 hover:bg-charcoal/5 rounded-sm transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
        </button>
        <h3 className="font-playfair text-base sm:text-lg font-medium text-charcoal">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-1.5 sm:p-2 hover:bg-charcoal/5 rounded-sm transition-colors"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-charcoal" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-[10px] sm:text-xs font-medium text-charcoal/50 py-1 sm:py-2">
            {day.slice(0, 2)}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {paddedDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const disabled = isDateDisabled(day);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const todayDate = isToday(day);
          const inCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !disabled && onDateSelect(day)}
              disabled={disabled}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-sm text-xs sm:text-sm transition-all
                ${!inCurrentMonth ? 'text-charcoal/30' : ''}
                ${disabled ? 'bg-charcoal/5 text-charcoal/30 cursor-not-allowed' : 'hover:bg-gold/10 cursor-pointer'}
                ${selected ? 'bg-charcoal text-ivory hover:bg-charcoal' : ''}
                ${todayDate && !selected ? 'ring-1 sm:ring-2 ring-gold ring-inset' : ''}
              `}
            >
              <span className="font-medium">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-charcoal/10 flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs text-charcoal/60">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm ring-1 sm:ring-2 ring-gold ring-inset" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-charcoal" />
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
