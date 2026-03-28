import React from 'react';
import { Flame, Star, Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const StreakCard = ({ count = 15 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="relative overflow-hidden group bg-[#1A1D24] p-6 rounded-3xl border border-white/5 flex items-center justify-between"
  >
    <div className="relative z-10">
      <p className="text-gray-400 text-sm font-medium mb-1">Current Streak</p>
      <div className="flex items-center gap-2">
        <h3 className="text-4xl font-black text-[#FF7043] font-manrope">{count} Days</h3>
        <Flame className="w-8 h-8 text-[#FF7043] fill-current animate-pulse" />
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Flame size={120} />
    </div>
  </motion.div>
);

export const ProgressCircle = ({ current, total, label }) => {
  const percentage = Math.min((current / total) * 100, 100);
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-[#1A1D24] p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center gap-4">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/5"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            className="text-[#4ae183] drop-shadow-[0_0_8px_rgba(74,225,131,0.4)]"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold font-manrope">{current}/{total}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest">Hrs</span>
        </div>
      </div>
      <p className="font-medium text-gray-300">{label}</p>
    </div>
  );
};

export const SyllabusTracker = ({ data }) => (
  <div className="bg-[#1A1D24] p-6 rounded-3xl border border-white/5">
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-bold flex items-center gap-2 font-manrope text-lg">
        <Target className="w-5 h-5 text-[#FF7043]" /> Syllabus Pulse
      </h3>
      <span className="text-xs text-gray-500 font-medium">UPSC 2026</span>
    </div>
    <div className="space-y-4">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-400">{item.name}</span>
            <span className="text-[#4ae183]">{item.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${item.progress}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="h-full bg-gradient-to-r from-[#4ae183]/50 to-[#4ae183]"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);
