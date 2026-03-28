import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Clock, Zap, Star } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center text-white">
                <p>Please log in to view your dashboard.</p>
                <Link to="/login" className="text-[#FF7043] mt-4 hover:underline">Go to Login</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F1115] text-white">
            <header className="border-b border-white/5 bg-[#1A1D24] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <Link to="/feed" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7043] to-[#FFB74D] flex items-center justify-center">
                        <Zap className="text-white w-5 h-5 fill-current" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">News Navigator</span>
                </Link>
                <div className="flex flex-center gap-4">
                    <span className="text-sm text-gray-400">Welcome, {user.name}</span>
                    <button onClick={logout} className="text-sm text-[#FF7043] hover:underline">Log Out</button>
                </div>
            </header>
            
            <main className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Your Activity Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#1A1D24] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-[#FF7043]/20 rounded-xl text-[#FF7043]"><BookOpen /></div>
                        <div>
                            <p className="text-sm text-gray-400">Articles Read</p>
                            <p className="text-2xl font-bold">12</p>
                        </div>
                    </div>
                    <div className="bg-[#1A1D24] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400"><Target /></div>
                        <div>
                            <p className="text-sm text-gray-400">Quiz Average</p>
                            <p className="text-2xl font-bold">85%</p>
                        </div>
                    </div>
                    <div className="bg-[#1A1D24] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400"><Clock /></div>
                        <div>
                            <p className="text-sm text-gray-400">Time Saved</p>
                            <p className="text-2xl font-bold">4.2 hrs</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#1A1D24] rounded-2xl border border-white/5 p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-[#FFB74D]"/> Recommended for your Role</h2>
                    <p className="text-gray-400 mb-4">Your personalized engine is currently set up for a <strong>{user.role || 'Student'}</strong> focusing on <strong>{user.interests?.join(", ") || 'General Knowledge'}</strong>.</p>
                    <Link to="/feed" className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium transition-colors">
                        Go to Personalized Feed →
                    </Link>
                </div>
            </main>
        </div>
    );
}
