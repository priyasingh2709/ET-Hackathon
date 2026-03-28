import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const today = new Date().getDate();
const daysInMonth = 31;
const streakDays = [1, 2, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 28]; // Mock streak

export const StreakCalendar = () => (
  <div className="bg-[#1A1D24] p-6 rounded-3xl border border-white/5 flex flex-col h-full">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <CalendarIcon className="text-gray-400 w-5 h-5" />
        <h3 className="font-bold font-manrope text-lg">Consistency Lab</h3>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-500"><ChevronLeft size={16} /></button>
        <span className="text-xs font-bold text-gray-300">MAR 2026</span>
        <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-gray-500"><ChevronRight size={16} /></button>
      </div>
    </div>
    
    <div className="grid grid-cols-7 gap-3 mb-4">
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
        <span key={i} className="text-[10px] text-center font-bold text-gray-600 uppercase tracking-tighter">
          {day}
        </span>
      ))}
    </div>
    
    <div className="grid grid-cols-7 gap-2 flex-1">
      {Array.from({ length: daysInMonth }).map((_, i) => {
        const dayNum = i + 1;
        const isToday = dayNum === today;
        const isStreak = streakDays.includes(dayNum);
        
        return (
          <div 
            key={i} 
            className={`
              relative aspect-square flex items-center justify-center rounded-lg text-xs font-semibold overflow-hidden transition-all
              ${isToday ? 'bg-white text-black' : isStreak ? 'bg-[#FF7043]/10 text-[#FF7043]' : 'bg-transparent text-gray-600'}
              ${isStreak ? 'hover:scale-105 active:scale-95 cursor-pointer' : ''}
              group
            `}
          >
            {dayNum}
            {isStreak && (
              <motion.div 
                layoutId="streak-dot"
                className="absolute -bottom-0.5 w-1 h-1 bg-[#FF7043] rounded-full drop-shadow-[0_0_4px_#FF7043]" 
              />
            )}
            {isToday && (
              <div className="absolute inset-0 border border-white rounded-lg animate-ping opacity-20" />
            )}
          </div>
        );
      })}
    </div>
    
    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-gray-500 uppercase tracking-widest">
      <span>Consistency: 84%</span>
      <span className="text-[#4ae183]">Best Streak: 42 Days</span>
    </div>
  </div>
);
