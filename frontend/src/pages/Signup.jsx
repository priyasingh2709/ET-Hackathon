import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Zap, Loader2 } from 'lucide-react';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await axios.post('http://localhost:8000/api/auth/register', { name, email, password });
            login(res.data);
            navigate('/onboarding');
        } catch (err) {
            setError(err.response?.data?.detail || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F1115] flex flex-col items-center justify-center p-4">
            <Link to="/" className="flex items-center gap-2 mb-8">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF7043] to-[#FFB74D] flex items-center justify-center">
                    <Zap className="text-white w-5 h-5 fill-current" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">News Navigator</span>
            </Link>
            
            <div className="bg-[#1A1D24] p-8 rounded-2xl border border-white/5 w-full max-w-md">
                <h1 className="text-2xl font-bold text-white mb-6 text-center">Create an Account</h1>
                {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input type="text" value={name} onChange={e=>setName(e.target.value)} required 
                               className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF7043]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required 
                               className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF7043]" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required 
                               className="w-full bg-[#0F1115] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#FF7043]" />
                    </div>
                    <button type="submit" disabled={loading} 
                            className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-[#FF7043] to-[#FFB74D] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                    </button>
                </form>
                <div className="mt-6 text-center text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-[#FF7043] hover:underline">Sign in</Link>
                </div>
            </div>
        </div>
    );
}
