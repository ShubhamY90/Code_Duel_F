import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Zap, ArrowRight, Sparkles } from 'lucide-react';

function useCounter(target, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const num = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[0-9.]/g, '');
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setVal(Math.floor(ease * num) + suffix);
      if (pct < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const STATS = [
  { value: '15K+', label: 'Duels Fought', color: 'text-brand-purple' },
  { value: '4.8K', label: 'Active Coders', color: 'text-brand-pink' },
  { value: '800+', label: 'Problems', color: 'text-brand-green' },
  { value: '99.9%', label: 'Uptime', color: 'text-brand-amber' },
];

function StatItem({ value, label, color }) {
  const count = useCounter(value);
  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      <span className={`text-3xl font-black font-mono-code ${color}`}>{count}</span>
      <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">{label}</span>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [typedCode, setTypedCode] = useState('');
  
  // Typing simulation inside the terminal window
  useEffect(() => {
    const fullText = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp), i];
    map.set(nums[i], i);
  }
}`;
    let index = 0;
    const interval = setInterval(() => {
      setTypedCode(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        setTimeout(() => { index = 0; }, 2000); // Restart typing
      }
    }, 45);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-space text-white flex flex-col">
      
      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="orb w-[550px] h-[550px] bg-brand-purple opacity-[0.06] -top-24 -left-24 animate-float" />
        <div className="orb w-[450px] h-[450px] bg-brand-pink opacity-[0.04] bottom-0 right-0" style={{ animationDelay: '-2s' }} />
        <div className="grid-bg" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5 text-lg font-black tracking-tight cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <Sword size={16} className="text-white" />
            </div>
            <span>Code<span className="text-gradient-brand">Duel</span></span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              id="nav-signin-btn"
              onClick={() => navigate('/lobby')} 
              className="btn-outline px-4 py-2 text-xs font-bold"
            >
              Sign In
            </button>
            <button 
              id="nav-get-started-btn"
              onClick={() => navigate('/lobby')} 
              className="btn-primary px-4 py-2 text-xs font-bold"
            >
              Enter Lobby <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col justify-center">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          
          {/* Copy Column */}
          <div className="flex flex-col items-start text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 bg-brand-purple/10 border border-brand-purple/20">
              <Sparkles size={12} className="text-brand-violet" />
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-brand-violet">Real-time Competitive Coding</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.08] tracking-[-2.5px] mb-6">
              Code. Battle.<br />
              <span className="text-gradient-hero">Dominate.</span>
            </h1>

            <p className="text-base md:text-lg text-white/40 leading-relaxed max-w-lg mb-8">
              Step into the arena. Face 1v1 coding duels with real-time progress syncing, instant sandbox test evaluation, and precision Glicko-2 ratings.
            </p>

            <div className="flex flex-wrap gap-3.5 mb-12">
              <button 
                id="start-duel-btn"
                onClick={() => navigate('/lobby')} 
                className="btn-primary"
              >
                <Sword size={16} /> Start a Duel
              </button>
              <button 
                id="watch-demo-btn"
                onClick={() => navigate('/duel')} 
                className="btn-outline"
              >
                Watch Demo
              </button>
            </div>

            <div className="flex gap-8 flex-wrap">
              {STATS.map(s => <StatItem key={s.label} {...s} />)}
            </div>
          </div>

          {/* Interactive Terminal Column */}
          <div className="relative animate-scale-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/20 to-brand-cyan/20 blur-3xl opacity-20 scale-90 -z-10" />

            <div className="terminal-window terminal-scanline">
              {/* Terminal Title Bar */}
              <div className="terminal-header justify-between">
                <div className="flex gap-1.5">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                </div>
                <div className="text-[0.65rem] font-mono-code text-white/20">codeduel.io/room/1v1-active</div>
                <div className="flex items-center gap-1 text-[0.65rem] font-bold text-brand-amber font-mono-code bg-brand-amber/10 px-2 py-0.5 rounded-md">
                  <span>⏱ 12:45</span>
                </div>
              </div>

              {/* Player Sync Status bar */}
              <div className="flex justify-between items-center bg-white/[0.01] border-b border-white/[0.03] px-5 py-3">
                <div className="flex-1 max-w-[40%]">
                  <div className="flex justify-between text-[0.6rem] font-bold text-white/45 mb-1.5">
                    <span>devknight</span>
                    <span className="text-brand-violet">72%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-purple rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
                <div className="text-xs font-bold text-white/30 flex-shrink-0 px-2">⚔️</div>
                <div className="flex-1 max-w-[40%] text-right">
                  <div className="flex justify-between text-[0.6rem] font-bold text-white/45 mb-1.5">
                    <span className="text-brand-pink">48%</span>
                    <span>nullptr</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-pink rounded-full ml-auto" style={{ width: '48%' }} />
                  </div>
                </div>
              </div>

              {/* Split editor / problem preview */}
              <div className="grid grid-cols-[45%_55%] min-h-[260px]">
                {/* Left Mini problem description */}
                <div className="p-5 bg-white/[0.005] border-r border-white/[0.03] text-[0.7rem] text-white/35 leading-relaxed">
                  <div className="flex gap-1.5 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green font-bold text-[0.55rem]">Easy</span>
                    <span className="px-2 py-0.5 rounded-full bg-brand-purple/10 text-brand-violet font-bold text-[0.55rem]">Arrays</span>
                  </div>
                  <h3 className="font-extrabold text-white/80 text-xs mb-2">Two Sum</h3>
                  <p className="mb-3">
                    Given an array of integers <code className="font-mono-code text-brand-cyan bg-brand-cyan/5 px-1 rounded">nums</code> and a target, return indices of the two numbers that add up to the target.
                  </p>
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <div className="text-[0.55rem] font-bold text-white/20 uppercase tracking-wider mb-1">Example</div>
                    <code className="font-mono-code text-brand-green text-[0.6rem]">Input: [2,7,11], 9</code><br />
                    <code className="font-mono-code text-white/50 text-[0.6rem]">Output: [0,1]</code>
                  </div>
                </div>

                {/* Right Typing screen */}
                <div className="p-5 bg-[#05050a] font-mono-code text-[0.7rem] leading-relaxed text-white/70 relative">
                  <pre className="whitespace-pre-wrap">{typedCode}</pre>
                  <span className="inline-block w-1.5 h-3.5 bg-brand-violet cursor-blink align-middle ml-0.5 animate-pulse" />
                </div>
              </div>

              {/* Bottom footer bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.01] border-t border-white/[0.03]">
                <div className="flex items-center gap-1.5">
                  <Zap size={11} className="text-brand-green" />
                  <span className="text-[0.6rem] font-bold text-brand-green uppercase tracking-wider">Simulated Execution</span>
                </div>
                <div className="flex items-center gap-1 text-[0.6rem] font-bold text-white/30">
                  <span>Press Submit to Judge0</span>
                </div>
              </div>
            </div>

            {/* Float badges */}
            <div className="absolute -top-3.5 -right-3.5 animate-float px-3.5 py-2 rounded-xl glass-card text-xs font-bold text-brand-green shadow-lg shadow-brand-green/5">
              ✓ All tests passed
            </div>
            <div className="absolute -bottom-3.5 -left-3.5 animate-float px-3.5 py-2 rounded-xl glass-card text-xs font-bold text-brand-pink shadow-lg shadow-brand-pink/5" style={{ animationDelay: '-1.8s' }}>
              +30 Glicko Rating
            </div>
          </div>

        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.03] py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-black tracking-tight text-white/50 select-none">
            <div className="w-6 h-6 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sword size={12} className="text-white" />
            </div>
            <span>CodeDuel</span>
          </div>
          <p className="text-[0.7rem] text-white/20 font-medium">© 2026 CodeDuel. Premium competitive gaming engine.</p>
        </div>
      </footer>

    </div>
  );
}
