import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { 
  Trophy, Clock, CheckCircle2, ChevronRight, 
  Target, Zap, ArrowLeft, BarChart3, HelpCircle, 
  Play, Timer, AlertCircle, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import QuizModal from '../components/QuizModal';

const mockDailyQuiz = {
  title: "Daily Current Affairs Challenge",
  description: "15 MCQs covering today's top stories in Geography, Economy, and International Relations.",
  itemCount: 15,
  estTime: "10 mins"
};

const mockTestSeries = [
  { id: 1, title: 'GS Paper I: History & Geography', questions: 100, duration: '120m', difficulty: 'Hard', status: 'Available' },
  { id: 2, title: 'CSAT: Full Length Mock', questions: 80, duration: '120m', difficulty: 'Medium', status: 'Available' },
  { id: 3, title: 'Ethics & Case Studies', questions: 50, duration: '60m', difficulty: 'Expert', status: 'Completed', score: '82%' },
  { id: 4, title: 'Environment & Agriculture', questions: 40, duration: '45m', difficulty: 'Medium', status: 'In Progress' },
];

export default function Quiz() {
  const { user, API_BASE_URL } = useContext(AuthContext);
  const [activeQuiz, setActiveQuiz] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#e5e2e1] font-inter">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#0E0E0E]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="bg-[#4ae183] p-1.5 rounded-lg">
               <Trophy className="w-5 h-5 text-black fill-black" />
             </div>
             <h1 className="text-xl font-black font-manrope tracking-tight">Test Series Hub</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1A1D24] rounded-2xl border border-white/5 shadow-xl">
             <BarChart3 size={16} className="text-[#4ae183]" />
             <span className="text-xs font-bold">Avg. Score: 74%</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center font-bold text-xs uppercase cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
            {user?.name?.[0] || 'A'}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 space-y-12">
        {/* Daily Hero Quiz */}
        <section className="relative overflow-hidden group bg-gradient-to-br from-[#1A1D24] to-[#0E0E0E] p-10 rounded-[3rem] border border-white/5 shadow-2xl">
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#FF7043]/10 text-[#FF7043] px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest border border-[#FF7043]/20">
                <Zap size={14} className="fill-[#FF7043]" /> Today's Pulse
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-manrope leading-tight">
                {mockDailyQuiz.title}
              </h2>
              <p className="text-gray-400 font-medium text-lg leading-relaxed">
                {mockDailyQuiz.description}
              </p>
              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-gray-500 font-bold">
                  <HelpCircle size={20} /> {mockDailyQuiz.itemCount} Questions
                </div>
                <div className="flex items-center gap-2 text-gray-500 font-bold">
                  <Timer size={20} /> {mockDailyQuiz.estTime}
                </div>
              </div>
              <button 
                onClick={() => setActiveQuiz({ title: mockDailyQuiz.title, description: mockDailyQuiz.description })}
                className="bg-[#FF7043] hover:bg-[#E65100] text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-[#FF7043]/20 hover:scale-105"
              >
                Start Daily Challenge
              </button>
            </div>
            <div className="hidden md:flex justify-end pr-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-[#FF7043]/20 blur-3xl rounded-full" />
                <div className="w-64 h-64 bg-[#1A1D24] rounded-full border-8 border-white/5 flex items-center justify-center shadow-2xl overflow-hidden group-hover:rotate-12 transition-transform duration-700">
                  <Trophy size={120} className="text-[#FF7043] drop-shadow-[0_0_15px_rgba(255,112,67,0.4)]" />
                </div>
              </div>
            </div>
          </div>
          {/* Background patterns */}
          <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
             <Trophy size={300} strokeWidth={0.5} />
          </div>
        </section>

        {/* Categories & Full Length Tests */}
        <section className="space-y-8 pb-20">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Target className="text-[#4ae183]" />
              <h3 className="text-2xl font-black font-manrope">Strategic Test Series</h3>
            </div>
            <div className="flex gap-4">
               {['All', 'Prelims', 'Mains', 'CSAT'].map((cat) => (
                 <button key={cat} className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${cat === 'All' ? 'bg-[#4ae183] text-black' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}>
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {mockTestSeries.map((test) => (
              <motion.div 
                key={test.id}
                whileHover={{ y: -5 }}
                className="bg-[#1A1D24] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group flex gap-6 items-start shadow-xl"
              >
                <div className={`p-4 rounded-3xl ${test.status === 'Completed' ? 'bg-[#4ae183]/10 text-[#4ae183]' : 'bg-white/5 text-gray-500'}`}>
                  <FileText size={32} />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-bold group-hover:text-white transition-colors">{test.title}</h4>
                      <p className="text-xs font-bold text-gray-600 mt-1 uppercase tracking-widest">{test.difficulty} • {test.questions} Questions</p>
                    </div>
                    {test.score && <span className="bg-[#4ae183]/10 text-[#4ae183] px-3 py-1 rounded-full text-xs font-black">Score: {test.score}</span>}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Clock size={16} /> {test.duration}
                    </div>
                    <button className={`
                      flex items-center gap-2 pr-2 pl-6 py-2 rounded-full font-black text-xs transition-all
                      ${test.status === 'Available' ? 'bg-white text-black hover:scale-105' : 'bg-white/5 text-gray-500'}
                    `}>
                      {test.status === 'Available' ? 'Attempt Now' : test.status}
                      {test.status === 'Available' && <div className="bg-[#4ae183] p-1 rounded-full"><Play size={10} className="fill-black" /></div>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Aesthetic Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_bottom_left,#FF704305_0%,transparent_50%),radial-gradient(circle_at_top_right,#4ae18305_0%,transparent_50%)] pointer-events-none" />

      {activeQuiz && (
        <QuizModal 
          article={activeQuiz} 
          onClose={() => setActiveQuiz(null)} 
          baseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}
