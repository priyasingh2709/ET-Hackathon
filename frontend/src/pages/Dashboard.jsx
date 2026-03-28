import React, { useState, useContext } from 'react';
import {
    BarChart3, Calendar, CheckCircle2, ChevronRight,
    Clock, Flame, LayoutDashboard, MessageSquare,
    Search, Settings, User, Zap, BookOpen, Target,
    Trophy, Bell, LogOut, Menu, X, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link } from 'react-router-dom';

// Import our new sub-components
import { StreakCard, ProgressCircle, SyllabusTracker } from '../components/dashboard/DashboardCards';
import { PerformanceChart } from '../components/dashboard/StatsChart';
import { StreakCalendar } from '../components/dashboard/StreakCalendar';

const mockSyllabus = [
    { name: 'GS I: History & Geography', progress: 65 },
    { name: 'GS II: Polity & Governance', progress: 42 },
    { name: 'GS III: Economy & S&T', progress: 30 },
    { name: 'GS IV: Ethics & Aptitude', progress: 15 },
];

const mockTests = [
    { id: 1, title: 'Prelims Mock: Full GS-1', duration: '120m', status: 'Available', type: 'Full Length' },
    { id: 2, title: 'Monthly Current Affairs (Feb)', duration: '60m', status: 'Completed', score: '84%', type: 'Sectional' },
    { id: 3, title: 'Daily Static Quiz #42', duration: '15m', status: 'In Progress', type: 'Daily' },
];

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
            {/* Sidebar */}
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
                    <NavItem icon={LayoutDashboard} label="Dashboard" active to="/dashboard" />
                    <NavItem icon={BookOpen} label="Study Feed" to="/feed" />
                    <NavItem icon={FileText} label="Generate Quiz" to="/generate-quiz" />
                    <NavItem icon={Target} label="Test Series" to="/quiz" />
                    <NavItem icon={MessageSquare} label="AI Tutor" to="/chatbot" />
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-2">
                    <NavItem icon={Settings} label="Settings" to="/settings" />
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
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[260px]' : 'ml-[80px]'} p-8 max-w-[1600px] mx-auto`}>
                {/* Top bar */}
                <header className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black font-manrope tracking-tight mb-1">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7043] to-[#ffb59f]">{user?.name || 'Anshuman'}!</span>
                        </h1>
                        <p className="text-gray-500 font-medium">UPSC 2026 • 120 Days to Prelims</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-[#1A1D24] px-4 py-2 rounded-2xl border border-white/5 shadow-xl">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1D24] bg-surface brightness-75 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-gray-400 cursor-pointer" />
                                <div className="w-2 h-2 bg-[#FF7043] rounded-full animate-pulse" />
                            </div>
                        </div>
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-3 bg-[#1A1D24] rounded-2xl border border-white/5 text-gray-400 hover:text-white transition-colors"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </header>

                {/* Dynamic Grid Layout */}
                <div className="grid grid-cols-12 gap-8 mb-8">
                    {/* Left Column: Core Stats */}
                    <div className="col-span-12 lg:col-span-4 space-y-8">
                        <StreakCard count={15} />
                        <div className="grid grid-cols-2 gap-8 md:gap-12">
                            <ProgressCircle current={6} total={8} label="Daily Study" />
                            <ProgressCircle current={124} total={150} label="Weekly Target" />
                            
                        </div>
                        <SyllabusTracker data={mockSyllabus} />
                    </div>

                    {/* Center Column: Performance & Calendar */}
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
                            <PerformanceChart />
                            <StreakCalendar />
                        </div>

                        {/* Test Series Section */}
                        <section className="bg-[#1A1D24] p-8 rounded-[2.5rem] border border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#FF7043]/10 p-2 rounded-xl">
                                        <CheckCircle2 className="text-[#FF7043] w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black font-manrope tracking-tight text-white">Live Test Series</h2>
                                </div>
                                <button className="text-[#FF7043] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                                    Browse All <ChevronRight size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {mockTests.map((test) => (
                                    <motion.div
                                        key={test.id}
                                        whileHover={{ y: -5 }}
                                        className="p-6 bg-[#20242D] rounded-3xl border border-white/[0.03] space-y-4 shadow-xl"
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="text-[10px] uppercase tracking-widest font-black text-gray-500 bg-black/20 px-3 py-1 rounded-full">
                                                {test.type}
                                            </span>
                                            {test.score && (
                                                <span className="text-xs font-bold text-[#4ae183]">{test.score} Score</span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-lg leading-tight text-gray-200">{test.title}</h4>
                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <Clock size={14} /> {test.duration}
                                            </div>
                                            <button className={`
                        px-4 py-2 rounded-xl text-xs font-black transition-all
                        ${test.status === 'Available' ? 'bg-[#FF7043] text-white hover:scale-105' : 'bg-white/5 text-gray-500'}
                       `}>
                                                {test.status === 'Available' ? 'Attempt' : test.status}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Aesthetic Accents */}
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-[#FF7043] opacity-5 blur-[120px] pointer-events-none" />
            <div className="fixed -bottom-24 -left-24 w-96 h-96 bg-[#4ae183] opacity-5 blur-[120px] pointer-events-none" />
        </div>
    );
}
