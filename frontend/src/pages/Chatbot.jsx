import React, { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, Send, Volume2, Loader2, BookOpen, GraduationCap, ArrowLeft, History, Search, Zap } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Chatbot() {
  const { API_BASE_URL, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Greetings, ${user?.name || 'Aspirant'}! 🐿️ I'm Squirrel, your AI UPSC Navigator. I've analyzed your GS Paper I-IV progress. Ready to dive deep into today's briefing or clarify a concept?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const textToSend = text || input;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/assistant/chat`, { 
        message: textToSend,
        role_context: user?.role || 'Student'
      });
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "My connection to the archives is a bit fuzzy right now, but I'm working on it! 🐿️" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const SuggestionBox = ({ title, desc, icon: Icon, onClick }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-start p-4 bg-[#1A1D24] border border-white/5 rounded-2xl hover:border-[#FF7043]/50 transition-all text-left group"
    >
      <div className="bg-[#FF7043]/10 p-2 rounded-lg mb-3 group-hover:scale-110 transition-transform">
        <Icon className="text-[#FF7043] w-5 h-5" />
      </div>
      <h4 className="font-bold text-sm text-gray-200">{title}</h4>
      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-1">{desc}</p>
    </button>
  );

  return (
    <div className="flex flex-col h-screen bg-[#131313] text-[#e5e2e1] font-inter overflow-hidden">
      {/* Search Header */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#0E0E0E]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
             <div className="bg-[#FF7043] p-1.5 rounded-lg">
               <Zap className="w-5 h-5 text-white fill-white" />
             </div>
             <h1 className="text-xl font-black font-manrope tracking-tight">AI Scholar Tutor</h1>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-[#1A1D24] rounded-2xl border border-white/5 w-96">
          <Search size={16} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search chat history..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full placeholder-gray-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Premium Session</p>
            <p className="text-sm font-bold text-[#4ae183]">Connected</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF7043] to-[#ffb59f] p-0.5">
             <div className="w-full h-full rounded-full bg-[#131313] flex items-center justify-center font-bold text-xs uppercase">
               {user?.name?.[0] || 'A'}
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Presets & History */}
        <aside className="w-72 hidden lg:flex flex-col border-r border-white/5 p-6 space-y-8 overflow-y-auto">
          <div>
            <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-4">UPSC Presets</h3>
            <div className="space-y-3">
              <SuggestionBox 
                icon={BookOpen} 
                title="Current Affairs" 
                desc="Daily Briefing" 
                onClick={() => handleSend("Explain today's top story for UPSC Prelims")} 
              />
              <SuggestionBox 
                icon={GraduationCap} 
                title="Syllabus Deep-dive" 
                desc="Conceptual Clarity" 
                onClick={() => handleSend("Explain the core features of the Fifth Schedule of the Indian Constitution.")} 
              />
              <SuggestionBox 
                icon={History} 
                title="Mains Practice" 
                desc="Structured Answer" 
                onClick={() => handleSend("Give me a mock Mains question on the impact of Cryptocurrency on the Indian Economy.")} 
              />
            </div>
          </div>
          
          <div className="flex-1">
             <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Recent Sessions</h3>
             <div className="space-y-4">
               {[1,2,3].map(i => (
                 <div key={i} className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl cursor-not-allowed group transition-colors">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#FF7043]/50" />
                   <p className="text-xs font-medium text-gray-500">UPSC Mains Pattern {i}...</p>
                 </div>
               ))}
             </div>
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col relative bg-gradient-to-b from-transparent to-[#0E0E0E]/20">
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i} 
                  className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`
                    max-w-[85%] md:max-w-[70%] rounded-[2rem] p-6 lg:p-8 text-sm lg:text-base leading-relaxed relative
                    ${msg.role === 'assistant' 
                      ? 'bg-[#1A1D24] text-[#e5e2e1] rounded-tl-sm border border-white/5' 
                      : 'bg-gradient-to-br from-[#FF7043] to-[#E65100] text-white rounded-tr-sm shadow-2xl shadow-[#FF7043]/10'}
                  `}>
                    <div className="whitespace-pre-wrap font-medium">{msg.content}</div>
                    
                    {msg.role === 'assistant' && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <button className="text-gray-500 hover:text-[#4ae183] transition-colors flex items-center gap-2 text-xs font-bold uppercase">
                          <Volume2 size={14} /> Listen to Scholar
                        </button>
                        <span className="text-[10px] text-gray-700 font-black uppercase tracking-[0.1em]">Knowledge Unit {i+1}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-[#1A1D24] text-[#e5e2e1] rounded-[2rem] rounded-tl-sm px-8 py-5 border border-white/5 flex items-center gap-4">
                  <Loader2 className="w-5 h-5 animate-spin text-[#FF7043]" />
                  <span className="text-sm font-bold text-gray-400">Consulting Civil Service Archives...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Interface */}
          <div className="p-6 md:p-12 pt-0">
            <div className="relative max-w-4xl mx-auto">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                placeholder="Ask your query (e.g., Explain FRBM Act 2003)"
                className="w-full bg-[#1A1D24] border border-white/5 rounded-[2.5rem] py-6 px-8 pr-20 text-lg focus:outline-none focus:border-[#FF7043]/40 transition-all font-medium placeholder-gray-600 shadow-2xl"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FF7043] hover:bg-[#E65100] text-white p-3.5 rounded-full transition-all disabled:opacity-30 disabled:hover:scale-100 hover:scale-105 active:scale-95 shadow-xl shadow-[#FF7043]/20"
              >
                <Send size={24} />
              </button>
            </div>
            <p className="text-center text-[10px] text-gray-700 font-bold uppercase tracking-[0.2em] mt-6">
              Empowered by Squirrel AI • Focused on UPSC 2026
            </p>
          </div>
        </main>
      </div>

      {/* Aesthetic Accents */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#FF7043] opacity-[0.03] blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-[#4ae183] opacity-[0.03] blur-[150px] pointer-events-none" />
    </div>
  );
}
