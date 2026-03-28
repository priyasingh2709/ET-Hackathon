import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Zap, Headphones, Settings, FileText, ChevronRight, Loader2, Sparkles, Play, Square, Sun, Moon, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import SquirrelChat from '../components/SquirrelChat';
import QuizModal from '../components/QuizModal';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

export default function Feed() {
  const { user, refreshUser, API_BASE_URL } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({});
  const [insightLoading, setInsightLoading] = useState({});
  const [activeQuizArticle, setActiveQuizArticle] = useState(null);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState({});
  const [isPremiumSessionActive, setIsPremiumSessionActive] = useState(false);

  const handlePlayAudio = async (article, index) => {
    if (playingAudio && playingAudio.index === index) {
      playingAudio.audio.pause();
      setPlayingAudio(null);
      return;
    }
    
    if (playingAudio) {
      playingAudio.audio.pause();
    }

    setAudioLoading(prev => ({ ...prev, [index]: true }));
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/assistant/tts`, { 
        text: article.description || article.title 
      });
      const audio = new Audio(data.audio_base64);
      audio.play();
      audio.onended = () => setPlayingAudio(null);
      setPlayingAudio({ index, audio });
    } catch (err) {
      console.error("Failed to play audio", err);
      alert("Audio generation failed.");
    } finally {
      setAudioLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const [dailyPulse, setDailyPulse] = useState({
    world: [],
    history: [],
    recent: [],
    quiz: null,
    loading: true
  });

  useEffect(() => {
    // Check for Stripe success
    const query = new URLSearchParams(window.location.search);
    const sessionId = query.get('session_id');
    
    if (sessionId) {
      setIsPremiumSessionActive(true);
      const verifySession = async () => {
        try {
          const { data } = await axios.get(`${API_BASE_URL}/api/payment/verify-session?session_id=${sessionId}`);
          if (data.status === 'success') {
            await refreshUser();
            alert("Welcome to News Navigator Premium! Your account has been upgraded.");
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (e) {
          console.error("Session verification failed", e);
        } finally {
          setIsPremiumSessionActive(false);
        }
      };
      verifySession();
    }

    const fetchDailyPulse = async () => {
      try {
        const [worldRes, historyRes, recentRes, quizRes] = await Promise.allSettled([
          axios.get(`${API_BASE_URL}/api/news/current-affairs/international-today`),
          axios.get(`${API_BASE_URL}/api/news/current-affairs/history-of-today`),
          axios.get(`${API_BASE_URL}/api/news/current-affairs/recent`),
          axios.get(`${API_BASE_URL}/api/news/current-affairs/today-quiz`)
        ]);

        setDailyPulse({
          world: worldRes.status === 'fulfilled' ? worldRes.value.data : [],
          history: historyRes.status === 'fulfilled' ? historyRes.value.data : [],
          recent: recentRes.status === 'fulfilled' ? recentRes.value.data : [],
          quiz: quizRes.status === 'fulfilled' ? quizRes.value.data : null,
          loading: false
        });
      } catch (error) {
        console.error("Daily Pulse Error", error);
        setDailyPulse(prev => ({ ...prev, loading: false }));
      }
    };

    const fetchNews = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/news/fetch`);
        if (data.status === 'success') {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error('Failed to fetch news', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDailyPulse();
    fetchNews();
  }, [API_BASE_URL]);

  const handleWhyMatters = async (article, index) => {
    if (insights[index]) return; 
    setInsightLoading(prev => ({ ...prev, [index]: true }));
    try {
      const role = user?.role || 'Student';
      const { data } = await axios.post(`${API_BASE_URL}/api/news/process?role=${role}`, article);
      setInsights(prev => ({ ...prev, [index]: data }));
    } catch (error) {
      console.error('Failed to generate insight', error);
      setInsights(prev => ({ ...prev, [index]: { why_it_matters: "Couldn't load insights right now." } }));
    } finally {
      setInsightLoading(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleUpgrade = async () => {
    if (!user) {
      alert("Please login to upgrade to premium.");
      return;
    }
    setIsUpgrading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/payment/create-checkout-session?user_id=${user.id}`);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error(e);
      alert("Error initiating checkout. Ensure Stripe API keys are configured.");
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background text-textDefault transition-colors duration-300 pb-32">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="bg-primary text-white p-1 rounded-md">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">News Navigator</span>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <button className="flex items-center space-x-2 text-textMuted hover:text-textDefault transition-colors font-medium">
            <FileText size={16} /> <span>Quiz Mode</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-textMuted hover:text-textDefault hover:bg-surfaceHover rounded-full transition-all"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          
          {user?.isPremium ? (
            <div className="flex items-center space-x-2 bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-400/20 font-bold">
              <Trophy size={16} />
              <span>Premium Active</span>
            </div>
          ) : (
            <button 
              onClick={handleUpgrade}
              disabled={isUpgrading || isPremiumSessionActive}
              className="bg-gradient-to-r from-orange-400 to-primary hover:from-orange-500 hover:to-primaryHover text-white px-4 py-2 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20 flex items-center space-x-2 disabled:opacity-50"
            >
              {isUpgrading || isPremiumSessionActive ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-white" />}
              <span>{isPremiumSessionActive ? 'Upgrading...' : 'Go Premium'}</span>
            </button>
          )}
          
          <div className="flex items-center space-x-2 text-textMuted">
             <div className="w-8 h-8 rounded-full bg-surface-hover flex items-center justify-center font-bold text-xs border border-border">
                {user?.name?.[0]?.toUpperCase() || 'U'}
             </div>
             <Settings className="w-4 h-4 cursor-pointer hover:text-textDefault" />
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto py-8 px-4 flex flex-col space-y-6">
        {/* Daily Pulse Section */}
        {!dailyPulse.loading && (
          <section className="mb-4">
            <div className="flex items-center space-x-2 text-primary font-bold mb-4 px-1">
              <Sparkles size={18} />
              <h3 className="tracking-tight uppercase text-sm">Daily Pulse Hub</h3>
            </div>
            <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar -mx-1 px-1">
              {/* International News Card */}
              {dailyPulse.world.length > 0 && (
                <div className="min-w-[280px] bg-surface border border-border rounded-xl p-4 flex flex-col justify-between hover:border-primary/40 hover:bg-surface-hover transition-all cursor-pointer group shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block opacity-80">World Byte</span>
                    <p className="text-sm font-medium line-clamp-3 group-hover:text-textDefault transition-colors">{dailyPulse.world[0]}</p>
                  </div>
                  <div className="mt-4 flex items-center text-[10px] text-textMuted font-bold uppercase tracking-tighter">
                    <span>View More</span>
                    <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )}

              {/* History Card */}
              {dailyPulse.history.length > 0 && (
                <div className="min-w-[280px] bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all cursor-pointer group shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 block opacity-80">On This Day</span>
                    <p className="text-sm font-medium line-clamp-3 group-hover:text-textDefault transition-colors italic">"{dailyPulse.history[0].description}"</p>
                  </div>
                  <div className="mt-4 flex items-center text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">
                    <span>{dailyPulse.history[0].date}</span>
                  </div>
                </div>
              )}

              {/* Quiz Teaser Card */}
              <div 
                onClick={() => setActiveQuizArticle({ title: "Daily Current Affairs Challenge", description: "Test your knowledge on today's top stories from India and the world." })}
                className="min-w-[200px] bg-gradient-to-br from-orange-500/10 to-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-primary transition-all cursor-pointer group shadow-md"
              >
                <div className="bg-primary/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-primary fill-primary" />
                </div>
                <span className="text-xs font-bold text-textDefault mb-1 uppercase tracking-tight">Daily Quiz</span>
                <span className="text-[10px] text-textMuted uppercase font-bold tracking-tighter">Start Challenge</span>
              </div>
            </div>
          </section>
        )}

        <div className="h-px bg-border w-full"></div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-textMuted space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p>Curating your personalized news feed...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center p-12 text-textMuted bg-surface border border-border rounded-xl">
            <p>No news found right now. Check back later!</p>
          </div>
        ) : articles.map((article, index) => (
          <article key={index} className="bg-surface border border-border rounded-xl p-6 hover:border-primary/30 transition-colors shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 text-xs font-medium text-textMuted">
              <div className="flex items-center space-x-2">
                {article.label && <span className="text-primary tracking-wider uppercase font-bold">{article.label}</span>}
                {article.label && <span className="opacity-50">|</span>}
                <span className="text-textDefault bg-surface Hover px-2 py-0.5 rounded-sm border border-border">{article.source}</span>
              </div>
              <div className="flex items-center space-x-2 opacity-80">
                {article.sourcesCount > 0 && <span className="flex items-center space-x-1"><FileText size={12}/> <span>{article.sourcesCount} sources</span></span>}
                {article.sourcesCount > 0 && <span>•</span>}
                <span>{article.time}</span>
              </div>
            </div>

            {/* Title & Content */}
            <h2 className="text-xl font-serif font-bold mb-3 leading-snug">{article.title}</h2>
            {article.description && <p className="text-textMuted text-sm leading-relaxed mb-5">{article.description}</p>}

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="bg-surface Hover text-textMuted text-xs px-3 py-1 rounded-full border border-border">
                {article.source}
              </span>
              <span className="bg-surface Hover text-textMuted text-xs px-3 py-1 rounded-full border border-border">
                Latest
              </span>
            </div>

            {/* Personalization Section */}
            {!insights[index] ? (
              <button 
                onClick={() => handleWhyMatters(article, index)}
                disabled={insightLoading[index]}
                className="text-primary hover:text-primaryHover text-sm font-medium flex items-center space-x-1 transition-colors mb-6 group disabled:opacity-50"
              >
                {insightLoading[index] ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />}
                <span>{insightLoading[index] ? 'Analyzing Custom Insights...' : `Why this matters for your role as a ${user?.role || 'Student'}`}</span>
              </button>
            ) : (
              <div className="mb-6 space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm leading-relaxed">
                  <div className="flex items-center space-x-2 mb-2 font-bold text-primary">
                    <Sparkles size={14} /> <span>Smart Insight:</span>
                  </div>
                  <p className="text-textDefault">{insights[index].why_it_matters}</p>
                </div>

                {/* UPSC Aspirant Specific Enrichment */}
                {user?.role === 'Student' && insights[index].upscSyllabus && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                    <div className="flex items-center space-x-2 mb-3 text-green-600 dark:text-green-400 font-bold">
                      <GraduationCap size={16} /> <span>UPSC UPSC Enrichment</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block mb-1">Syllabus Map</span>
                        <p className="font-semibold text-textDefault">{insights[index].upscSyllabus}</p>
                      </div>
                      
                      <div>
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block mb-1">Prelims Facts</span>
                        <p className="text-textDefault">{insights[index].upscFacts}</p>
                      </div>
                      
                      <div className="pt-2 border-t border-green-500/10">
                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 block mb-1">Mains Practice Prompt</span>
                        <p className="italic text-textDefault border-l-2 border-green-500/30 pl-3">"{insights[index].upscMainsPrompt}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border text-sm">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setActiveQuizArticle(article)}
                  className="flex items-center space-x-2 text-textDefault hover:text-primary transition-colors font-medium">
                  <FileText size={16} /> <span>Take Quiz</span>
                </button>
                <button 
                  onClick={() => handlePlayAudio(article, index)}
                  disabled={audioLoading[index]}
                  className="flex items-center space-x-2 text-textDefault hover:text-primary transition-colors font-medium disabled:opacity-50">
                  {audioLoading[index] ? <Loader2 size={16} className="animate-spin" /> : 
                   (playingAudio && playingAudio.index === index) ? <Square size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
                  <span>{audioLoading[index] ? 'Briefing...' : (playingAudio && playingAudio.index === index) ? 'Stop' : 'Play Briefing'}</span>
                </button>
                <button 
                  onClick={() => {
                    const event = new CustomEvent('squirrel-explain', { 
                      detail: { text: `Explain this article for a ${user?.role || 'user'}: ${article.title}. Summarize why it matters and what are the 3 key takeaways.` } 
                    });
                    window.dispatchEvent(event);
                  }}
                  className="flex items-center space-x-2 text-textDefault hover:text-primary transition-colors font-medium"
                >
                  <Sparkles size={16} />
                  <span>Ask Squirrel</span>
                </button>
              </div>
              <a href={article.link || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 text-primary hover:text-primaryHover transition-colors font-medium">
                <span>Full Source</span>
                <ChevronRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </main>

      <SquirrelChat />
      
      {activeQuizArticle && (
        <QuizModal 
          article={activeQuizArticle} 
          onClose={() => setActiveQuizArticle(null)} 
          baseUrl={API_BASE_URL}
        />
      )}
    </div>
  );
}

