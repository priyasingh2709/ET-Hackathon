import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Zap, Loader2, ChevronRight, 
    CheckCircle2, AlertCircle, RefreshCcw,
    LayoutDashboard, BookOpen, Target, MessageSquare,
    Settings, LogOut, Menu, X, Trash2, Copy
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function GenerateQuiz() {
    const { user, logout, API_BASE_URL } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError("Please paste some text to generate a quiz.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setQuiz(null);
        setUserAnswers({});
        setShowResults(false);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/assistant/generate_quiz`, {
                article_content: inputText
            });

            if (data.quiz) {
                setQuiz(data.quiz);
            } else {
                setError("Failed to generate quiz. Try again.");
            }
        } catch (err) {
            console.error("Quiz Error:", err);
            setError("Connectivity error. Ensure backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (qIdx, optIdx) => {
        if (showResults) return;
        setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    };

    const checkResults = () => {
        setShowResults(true);
    };

    const resetQuiz = () => {
        setQuiz(null);
        setInputText('');
        setUserAnswers({});
        setShowResults(false);
        setError(null);
    };

    const NavItem = ({ icon: Icon, label, active, to = "#" }) => (
        <Link
            to={to}
            className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300
        ${active
                    ? 'bg-[#FF7043]/10 text-[#FF7043] font-bold'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'}
      `}
        >
            <Icon size={20} className={active ? 'text-[#FF7043]' : ''} />
            <span className={!isSidebarOpen ? 'hidden' : 'block'}>{label}</span>
        </Link>
    );

    return (
        <div className="flex min-h-screen bg-[#131313] text-[#e5e2e1] font-inter overflow-hidden">
            {/* Sidebar (Matching Dashboard) */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="fixed left-0 top-0 h-full bg-[#0E0E0E] border-r border-white/5 z-50 flex flex-col p-4"
            >
                <div className="flex items-center gap-3 px-2 mb-10">
                    <div className="bg-[#FF7043] p-1.5 rounded-xl">
                        <Zap size={24} className="text-white fill-white" />
                    </div>
                    {isSidebarOpen && <span className="font-black text-xl tracking-tight font-manrope">Squirrel IAS</span>}
                </div>

                <nav className="flex-1 space-y-2">
                    <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
                    <NavItem icon={BookOpen} label="Study Feed" to="/feed" />
                    <NavItem icon={FileText} label="Generate Quiz" active to="/generate-quiz" />
                    <NavItem icon={Target} label="Test Series" to="/quiz" />
                    <NavItem icon={MessageSquare} label="AI Tutor" to="/chatbot" />
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <NavItem icon={Settings} label="Settings" />
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400/70 hover:text-red-400 hover:bg-red-400/5 rounded-2xl w-full transition-all"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[260px]' : 'ml-[80px]'} p-8 max-w-[1200px] mx-auto`}>
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black font-manrope tracking-tight mb-1">
                            Generate <span className="text-[#FF7043]">UPSC Quiz</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">Convert any editorial, news or notes into MCQs instantly.</p>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-3 bg-[#1A1D24] rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </header>

                <div className="grid grid-cols-1 gap-8">
                    {!quiz ? (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#1A1D24] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <FileText size={20} className="text-[#FF7043]" />
                                    <span className="font-bold">Paste Editorial or Notes</span>
                                </div>
                                <button 
                                    onClick={() => setInputText('')}
                                    className="text-gray-500 hover:text-white transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Paste the content of a newspaper article, editorial, or your own notes here..."
                                className="w-full h-80 bg-[#0E0E0E] border border-white/5 rounded-3xl p-6 text-gray-300 focus:outline-none focus:border-[#FF7043]/50 transition-all resize-none text-base leading-relaxed"
                            />

                            {error && (
                                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="px-10 py-4 bg-[#FF7043] text-white rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#FF7043]/20 disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 size={24} className="animate-spin text-white" /> : <Zap size={24} className="fill-current text-white" />}
                                    <span>{isLoading ? 'Processing with AI...' : 'Generate 3 Questions'}</span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6 pb-20"
                            >
                                <div className="flex items-center justify-between bg-[#1A1D24] p-6 rounded-3xl border border-white/5">
                                    <h2 className="text-xl font-black flex items-center gap-3">
                                        <CheckCircle2 className="text-[#4ae183]" />
                                        Interactive Quiz Ready
                                    </h2>
                                    <button 
                                        onClick={resetQuiz}
                                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                                    >
                                        <RefreshCcw size={16} /> New Quiz
                                    </button>
                                </div>

                                {quiz.map((q, qIdx) => (
                                    <motion.div 
                                        key={qIdx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: qIdx * 0.1 }}
                                        className="bg-[#1A1D24] p-8 rounded-[2.5rem] border border-white/5 shadow-xl"
                                    >
                                        <div className="flex gap-4 mb-6">
                                            <span className="w-10 h-10 flex-shrink-0 bg-[#FF7043]/10 text-[#FF7043] rounded-xl flex items-center justify-center font-black text-lg">
                                                {qIdx + 1}
                                            </span>
                                            <h3 className="text-xl font-bold leading-tight text-gray-200">
                                                {q.question}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 ml-14">
                                            {q.options.map((opt, optIdx) => {
                                                const isSelected = userAnswers[qIdx] === optIdx;
                                                const isCorrect = optIdx === q.answer;
                                                const showCorrect = showResults && isCorrect;
                                                const showWrong = showResults && isSelected && !isCorrect;

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                        disabled={showResults}
                                                        className={`
                                                            p-5 rounded-2xl border text-left transition-all flex items-center justify-between
                                                            ${isSelected ? 'border-[#FF7043] bg-[#FF7043]/5' : 'border-white/5 bg-[#20242D] hover:bg-white/5'}
                                                            ${showCorrect ? 'border-[#4ae183] bg-[#4ae183]/10' : ''}
                                                            ${showWrong ? 'border-red-500 bg-red-500/10' : ''}
                                                        `}
                                                    >
                                                        <span className={`font-medium ${isSelected ? 'text-[#FF7043]' : 'text-gray-400'} ${showCorrect ? 'text-[#4ae183]' : ''} ${showWrong ? 'text-red-400' : ''}`}>
                                                            {opt}
                                                        </span>
                                                        {showCorrect && <CheckCircle2 size={18} className="text-[#4ae183]" />}
                                                        {showWrong && <AlertCircle size={18} className="text-red-500" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {showResults && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                className="mt-6 ml-14 p-5 bg-[#0E0E0E] rounded-2xl border-l-4 border-[#FF7043]"
                                            >
                                                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                                    <span className="text-[#FF7043] font-black uppercase text-[10px] tracking-widest block mb-2">Explanation</span>
                                                    {q.explanation}
                                                </p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}

                                {!showResults && (
                                    <div className="flex justify-center mt-10">
                                        <button
                                            onClick={checkResults}
                                            disabled={Object.keys(userAnswers).length < quiz.length}
                                            className="px-12 py-5 bg-[#4ae183] text-black rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#4ae183]/20 disabled:opacity-50"
                                        >
                                            Submit Answers to Check
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>
            </main>

            {/* Aesthetic Accents */}
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-[#FF7043] opacity-5 blur-[120px] pointer-events-none" />
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-[#4ae183] opacity-5 blur-[120px] pointer-events-none" />
        </div>
    );
}
