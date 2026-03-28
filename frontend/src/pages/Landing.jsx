import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Target, CheckSquare, Headphones, BookOpen, LineChart, Sun, Moon, PlayCircle, Book, ArrowRight, Zap, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

export default function Landing() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const features = [
    {
      icon: <Layers className="w-5 h-5 text-primary" />,
      title: "Multi-Source Briefings",
      description: "We combine 8+ articles on a topic into one crisp, intelligent summary — saving you hours of reading."
    },
    {
      icon: <Target className="w-5 h-5 text-primary" />,
      title: "\"Why This Matters to Me\"",
      description: "Every briefing is contextualized to your role — whether you're a founder, student, developer, or investor."
    },
    {
      icon: <CheckSquare className="w-5 h-5 text-primary" />,
      title: "Auto-Generated Quizzes",
      description: "After each briefing, test your understanding with smart questions generated from real news content."
    },
    {
      icon: <Headphones className="w-5 h-5 text-primary" />,
      title: "Audio Briefings",
      description: "Listen to your daily news with natural TTS narration. Perfect for commutes, workouts, or multitasking."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      title: "UPSC & Exam Prep",
      description: "Economy, polity, current affairs — all mapped to real headlines. Spaced repetition for weak topics."
    },
    {
      icon: <LineChart className="w-5 h-5 text-primary" />,
      title: "Evolving Interest Graph",
      description: "Your feed gets smarter every day. Every click, quiz, and read refines what you see tomorrow."
    }
  ];

  const steps = [
    {
      title: "Connect Your Sources",
      description: "Sync your favorite news outlets, RSS feeds, or let our AI curate the top global stories for you.",
      icon: <Globe className="w-6 h-6 text-primary" />
    },
    {
      title: "AI Synthesis",
      description: "Our RAG-powered engine cross-references multiple reports to verify facts and eliminate redundant filler.",
      icon: <Sparkles className="w-6 h-6 text-primary" />
    },
    {
      title: "Personalized Delivery",
      description: "Receive a 60-second briefing tailored exactly to your professional role and learning objectives.",
      icon: <Zap className="w-6 h-6 text-primary" />
    }
  ];

  return (
    <div className="w-full bg-background text-textDefault min-h-screen font-sans selection:bg-primary/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Navigation */}
        <nav className="flex items-center justify-between py-4 mb-20 border-b border-surfaceHover">
          <div className="flex items-center space-x-2">
            <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-white">News Navigator</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-textMuted">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="#upsc" className="hover:text-white transition-colors">UPSC Prep</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="flex items-center space-x-5 text-sm">
            <button 
              onClick={toggleTheme}
              className="text-textMuted hover:text-white transition-colors" 
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="w-px h-5 bg-surfaceHover hidden md:block"></div>
            <Link to="/login" className="font-medium text-textMuted hover:text-white transition-colors">Log in</Link>
            <Link to="/signup" className="bg-primary hover:bg-primaryHover text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-20 pt-8">
          <div className="inline-flex items-center space-x-2 bg-surface border border-surfaceHover rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-semibold tracking-wide text-textMuted uppercase">AI-Powered News Intelligence</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight">
            One briefing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Not eight articles.
            </span>
          </h1>
          
          <p className="text-textMuted text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            News Navigator turns passive reading into an active, personalized intelligence experience — tailored to your role, interests, and learning goals.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
            <Link to="/signup" className="w-full sm:w-auto bg-primary hover:bg-primaryHover text-white px-8 py-3.5 rounded-lg font-medium transition-all shadow-lg shadow-primary/25 flex items-center justify-center group">
              Start Reading Smarter
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto bg-transparent border-2 border-surfaceHover hover:border-textMuted text-white px-8 py-3.5 rounded-lg font-medium transition-colors flex items-center justify-center">
              See How It Works
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl mx-auto border-t border-surfaceHover pt-10">
            <div className="flex flex-col items-center">
              <Book className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-sm text-textMuted">Smart Briefings</div>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold text-white">10K+</div>
              <div className="text-sm text-textMuted">Quiz Questions</div>
            </div>
            <div className="flex flex-col items-center">
              <Headphones className="w-6 h-6 text-primary mb-2" />
              <div className="text-2xl font-bold text-white">2K+</div>
              <div className="text-sm text-textMuted">Audio Hours</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="pt-20 pb-16">
          <div className="text-center mb-16">
            <span className="text-primary text-xs font-bold tracking-widest uppercase mb-4 block">Features</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white">Reading, reimagined</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-surface border border-surfaceHover rounded-xl p-8 hover:border-primary/50 transition-colors group">
                <div className="bg-background w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="pt-24 pb-16 border-t border-surfaceHover">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-xs font-bold tracking-widest uppercase mb-4 block">Workflow</span>
              <h2 className="text-4xl font-serif font-bold text-white mb-8 leading-tight">From headline to<br />headway in 60s.</h2>
              
              <div className="space-y-12">
                {steps.map((step, i) => (
                  <div key={i} className="flex space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-surfaceHover flex items-center justify-center font-bold text-primary bg-surface shadow-inner">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2 flex items-center">
                        {step.icon}
                        <span className="ml-3">{step.title}</span>
                      </h4>
                      <p className="text-textMuted text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-orange-400/20 rounded-3xl blur-2xl opacity-50"></div>
              <div className="relative bg-surface border border-surfaceHover rounded-2xl p-4 shadow-2xl overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center space-y-4">
                  <PlayCircle size={64} className="text-primary mx-auto cursor-pointer hover:scale-110 transition-transform" />
                  <p className="text-xs text-textMuted uppercase tracking-widest font-bold">Watch product tour</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPSC Prep Section */}
        <div id="upsc" className="pt-24 pb-16 border-t border-surfaceHover">
          <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1 mb-6 text-xs font-bold uppercase">
                Specialized Track
              </div>
              <h2 className="text-4xl font-serif font-bold text-white mb-6">Master UPSC Mains with AI-curated Current Affairs.</h2>
              <p className="text-textMuted text-lg mb-8 leading-relaxed">
                Stop juggling multiple newspapers. We map daily news to GS Papers I, II, and III, providing model answers and quiz questions tailored to the latest syllabus trends.
              </p>
              <ul className="space-y-4 mb-10 text-sm">
                <li className="flex items-center text-white"><CheckCircle2 className="text-primary mr-3" size={20} /> Syllabus-aligned insights for every headline</li>
                <li className="flex items-center text-white"><CheckCircle2 className="text-primary mr-3" size={20} /> Model Mains Answer writing prompts</li>
                <li className="flex items-center text-white"><CheckCircle2 className="text-primary mr-3" size={20} /> Spaced-repetition for static-current link data</li>
              </ul>
              <Link to="/signup" className="inline-flex items-center bg-white text-black px-8 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors">
                Explore UPSC Mode
              </Link>
            </div>
            <div className="w-full md:w-1/3 bg-surface border border-surfaceHover rounded-2xl p-6 shadow-xl">
               <div className="flex items-center justify-between mb-6">
                 <h4 className="font-bold text-white">Daily Mains Practice</h4>
                 <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded">GS-II</span>
               </div>
               <p className="text-xs text-textMuted mb-4 italic">"Discuss the impact of recent digital privacy regulations on administrative transparency in India..."</p>
               <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                 <div className="h-full bg-primary w-2/3"></div>
               </div>
               <div className="flex justify-between mt-2 text-[10px] text-textMuted">
                 <span>Analysis Grade: B+</span>
                 <span>Target: GS-II Mastery</span>
               </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="pt-24 pb-32">
          <div className="text-center mb-16">
             <span className="inline-block bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">Pricing</span>
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Simple, transparent pricing</h2>
             <p className="text-textMuted text-lg max-w-xl mx-auto flex items-center justify-center">
               Powered by Stripe. <CheckCircle2 className="w-4 h-4 mx-1.5 text-green-400" /> Secure payments, instant activation.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="bg-surface border border-surfaceHover rounded-2xl p-8 md:p-10 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-textMuted mb-6">Perfect for getting started</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">₹0</span>
                <span className="text-textMuted ml-2">forever</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {['3 briefings per day', 'Basic quiz mode', 'Short summary format', 'Interest-based feed'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckSquare className="w-5 h-5 text-textMuted mr-3 shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full block text-center bg-transparent border-2 border-surfaceHover hover:border-textMuted text-white px-6 py-3.5 rounded-xl font-medium transition-colors">
                Start Free
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-surface to-background border border-primary/40 rounded-2xl p-8 md:p-10 flex flex-col relative shadow-2xl shadow-primary/10">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-textMuted mb-6">For serious readers & aspirants</p>
              <div className="flex items-baseline mb-8">
                <span className="text-4xl font-bold text-white">₹299</span>
                <span className="text-textMuted ml-2">/month</span>
              </div>
              
              <ul className="space-y-4 mb-10 flex-grow">
                {['Unlimited briefings', 'Audio narration (TTS)', 'UPSC deep prep mode', '60-second daily briefing', 'Spaced repetition quizzes', 'Detailed reading box', 'Priority feed updates'].map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckSquare className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full bg-primary hover:bg-primaryHover text-white px-6 py-3.5 rounded-xl font-medium transition-shadow shadow-lg shadow-primary/25 text-center">
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-surface border-t border-surfaceHover py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-primary/20 p-1.5 rounded-lg">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5C00" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <span className="font-bold text-white">News Navigator</span>
          </div>
          <p className="text-textMuted text-sm mb-8">Empowering citizens with proactive news intelligence.</p>
          <div className="flex justify-center space-x-8 text-xs text-textMuted">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="mt-8 text-[10px] text-textMuted/50 tracking-widest uppercase">© 2026 News Navigator AI</div>
        </div>
      </footer>
    </div>
  );
}
