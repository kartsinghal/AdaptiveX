import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    let score = 0;
    if (password.length > 5) score++;
    if (password.length > 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-brand-400', 'bg-brand-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      login(data.token, data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#070707]">
      <div className="fixed inset-0 grid-bg z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 rounded-3xl glass border border-white/5 relative z-10 mx-4"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Request Access</h1>
          <p className="text-zinc-400 text-sm">Join the AdaptiveX intelligence network</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                required
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                placeholder="Operative Name"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                placeholder="operator@adaptivex.io"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {password.length > 0 && (
              <div className="flex items-center gap-2 mt-2 px-1">
                <div className="flex-1 flex h-1 rounded-full overflow-hidden bg-black/50 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={cn("h-full flex-1 transition-all duration-300", i < strength ? strengthColors[strength] : 'bg-transparent')} />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase w-16 text-right">
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "mt-4 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2",
              loading ? "bg-brand-500/50 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-500 glow-sm border border-brand-400/20"
            )}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Registration"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Existing operative?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition-colors">
            Authenticate
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
