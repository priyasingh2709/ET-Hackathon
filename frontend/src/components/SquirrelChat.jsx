import { useState, useRef, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, X, Send, Volume2, Maximize2, Loader2 } from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

export default function SquirrelChat() {
  const { API_BASE_URL, user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! I\'m **Squirrel** 🐿️ -> your personal NEWS companion. I can:\n• **Explain News** in simple terms (Inshorts style)\n• **Read articles aloud** for you\n• **Quiz you** on Current Affairs\n• **Answer questions** about today\'s briefing\n\nWhat would you like to know?"
    },
    { role: 'user', content: 'Explain today\'s top story' },
    { role: 'assistant', content: 'Hi there, how can I help?' }
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

  useEffect(() => {
    const handleExplain = (e) => {
      setIsOpen(true);
      if (e.detail && e.detail.text) {
        handleSend(e.detail.text);
      }
    };
    window.addEventListener('squirrel-explain', handleExplain);
    return () => window.removeEventListener('squirrel-explain', handleExplain);
  });

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
      setMessages(prev => [...prev, { role: 'assistant', content: "Oops! I couldn't reach the server right now 🐿️" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-400 to-primary hover:from-orange-500 hover:to-primaryHover text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 z-50"
      >
        <Sparkles className="w-6 h-6 z-50" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-surface border border-surfaceHover rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-primary p-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🐿️</span>
          <div>
            <h3 className="font-bold text-sm leading-tight">Squirrel</h3>
            <p className="text-xs opacity-90">Your AI news companion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="opacity-80 hover:opacity-100 transition-opacity"><Maximize2 size={16} /></button>
          <button onClick={() => setIsOpen(false)} className="opacity-80 hover:opacity-100 transition-opacity"><X size={18} /></button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto h-[350px] flex flex-col space-y-4 bg-background/50">
        {messages.map((msg, i) => (
          <div key={i} className={clsx(
            "max-w-[85%] rounded-xl p-3 text-sm flex flex-col group shadow-sm",
            msg.role === 'assistant' 
              ? "bg-surfaceHover text-textDefault self-start rounded-tl-sm border border-white/5" 
              : "bg-primary text-white self-end rounded-tr-sm"
          )}>
            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            
            {msg.role === 'assistant' && (
              <button className="mt-2 text-textMuted hover:text-primary transition-colors flex items-center space-x-1 self-start opacity-0 group-hover:opacity-100">
                <Volume2 size={12} /> <span className="text-xs">Listen</span>
              </button>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-surfaceHover text-textDefault self-start rounded-xl rounded-tl-sm px-4 py-3 border border-white/5 flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm opacity-80">Squirrel is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="px-4 py-3 border-t border-surfaceHover bg-surface overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2 w-full">
        <button onClick={() => handleSend("Explain today's top story")} className="inline-block bg-background border border-surfaceHover hover:border-primary/50 text-textMuted hover:text-textDefault px-3 py-1.5 rounded-full text-xs transition-colors">Explain today's top story</button>
        <button onClick={() => handleSend("Quiz me on today's news")} className="inline-block bg-background border border-surfaceHover hover:border-primary/50 text-textMuted hover:text-textDefault px-3 py-1.5 rounded-full text-xs transition-colors">Quiz me</button>
        <button onClick={() => handleSend("Give me a 60s briefing of current tech news")} className="inline-block bg-background border border-surfaceHover hover:border-primary/50 text-textMuted hover:text-textDefault px-3 py-1.5 rounded-full text-xs transition-colors">60s briefing</button>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-surface border-t border-surfaceHover flex items-center space-x-2">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Ask Squirrel anything..."
          className="flex-1 bg-background border border-surfaceHover rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors text-textDefault placeholder-textMuted disabled:opacity-50"
        />
        <button 
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="bg-primary hover:bg-primaryHover text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-primary"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
