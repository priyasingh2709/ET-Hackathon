import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';

const data = [
  { day: 'Mon', hours: 4, score: 72 },
  { day: 'Tue', hours: 6, score: 85 },
  { day: 'Wed', hours: 5.5, score: 78 },
  { day: 'Thu', hours: 8, score: 92 },
  { day: 'Fri', hours: 7, score: 88 },
  { day: 'Sat', hours: 10, score: 95 },
  { day: 'Sun', hours: 3, score: 82 },
];

export const PerformanceChart = () => (
  <div className="bg-[#1A1D24] p-6 rounded-3xl border border-white/5 h-[320px] flex flex-col">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="text-[#FF7043] w-5 h-5" />
        <h3 className="font-bold font-manrope text-lg">Weekly Momentum</h3>
      </div>
      <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#FF7043]" /> Study Hours</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#4ae183]" /> Mock Scores</div>
      </div>
    </div>
    
    <div className="flex-1 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7043" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#FF7043" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4ae183" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#4ae183" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#666' }}
            domain={[0, 100]}
            hide
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1A1D24', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="hours" 
            stroke="#FF7043" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorHours)" 
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#4ae183" 
            strokeWidth={2}
            strokeDasharray="5 5"
            fillOpacity={1} 
            fill="url(#colorScore)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
