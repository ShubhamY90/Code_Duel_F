import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sword, ArrowRight } from 'lucide-react';

export default function Navbar({ onStartDuel }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2.5 text-lg font-black tracking-tight cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-[#9d1f15]/20">
            <Sword size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-white">Code<span className="text-gradient-brand">Duel</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-xs font-bold uppercase tracking-wider text-[#c9c7ba]/65 hover:text-white transition-colors">Features</a>
          <a href="#live-battles" className="text-xs font-bold uppercase tracking-wider text-[#c9c7ba]/65 hover:text-white transition-colors flex items-center gap-1.5">
            Live Battles
            <span className="inline-flex w-2 h-2 rounded-full bg-[#fbfb7a] animate-pulse" />
          </a>
          <a href="#leaderboard" className="text-xs font-bold uppercase tracking-wider text-[#c9c7ba]/65 hover:text-white transition-colors">Leaderboard</a>
          <a href="#faq" className="text-xs font-bold uppercase tracking-wider text-[#c9c7ba]/65 hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button
                onClick={() => navigate('/practice')}
                className="btn-outline px-4 py-2 text-xs font-bold"
              >
                Practice
              </button>
              <button
                onClick={() => navigate('/submissions')}
                className="btn-outline px-4 py-2 text-xs font-bold"
              >
                My Submissions
              </button>
              <button
                onClick={onStartDuel}
                className="btn-primary px-4 py-2 text-xs font-bold shadow-[#9d1f15]/35"
              >
                Create Duel <ArrowRight size={13} />
              </button>
            </>
          ) : (
            <>
              <button
                id="nav-signin-btn"
                onClick={() => navigate('/auth')}
                className="btn-outline px-4 py-2 text-xs font-bold"
              >
                Sign In
              </button>
              <button
                id="nav-get-started-btn"
                onClick={() => navigate('/auth')}
                className="btn-primary px-4 py-2 text-xs font-bold shadow-[#9d1f15]/35"
              >
                Enter Arena <ArrowRight size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
