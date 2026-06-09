import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sword, Zap, ArrowRight, Sparkles, Terminal, Award, Users, 
  Code2, Trophy, Activity, Shield, ChevronDown, Cpu, 
  Play, Pause, Clock, User, TrendingUp, BarChart2,
  ExternalLink, Eye, BookOpen, List, CheckCircle2, RotateCcw
} from 'lucide-react';

function useCounter(target, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const isPercent = target.endsWith('%');
    const isK = target.endsWith('K');
    const isPlus = target.endsWith('+');
    const cleanNumStr = target.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleanNumStr);
    
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      const currentVal = Math.floor(ease * num);
      
      let suffix = '';
      if (isPlus) suffix += '+';
      if (isK) suffix = 'K' + (isPlus ? '+' : '');
      if (isPercent) suffix = '%';
      
      setVal(currentVal + suffix);
      if (pct < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

const STATS = [
  { value: '25K+', label: 'Duels Fought', color: 'text-brand-purple', icon: Sword },
  { value: '8.4K', label: 'Active Coders', color: 'text-brand-pink', icon: Users },
  { value: '1.2K+', label: 'Challenges', color: 'text-brand-green', icon: Code2 },
  { value: '99.9%', label: 'Match Success', color: 'text-brand-pink', icon: Activity },
];

const MOCK_CODES = {
  javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) {
      return [map.get(comp), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
  python: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`
};

const FEATURE_EXPLORER = [
  {
    id: 'battle',
    title: '1v1 Battle Arena',
    subtitle: 'Competitive coding meets esports mechanics.',
    icon: Sword,
    badge: 'Core Feature'
  },
  {
    id: 'practice',
    title: 'Solo Practice & problems',
    subtitle: '1,200+ curated algorithmic tasks.',
    icon: BookOpen,
    badge: 'Offline Mode'
  },
  {
    id: 'ranked',
    title: 'Glicko-2 Ranked Ladder',
    subtitle: 'Calibrated competitive matchmaking tiers.',
    icon: Trophy,
    badge: 'Global Leagues'
  },
  {
    id: 'replay',
    title: 'Stroke-by-Stroke Replays',
    subtitle: 'Record and inspect playbacks to learn mechanics.',
    icon: RotateCcw,
    badge: 'Match Reviews'
  },
  {
    id: 'profile',
    title: 'Deep Analytics Dashboard',
    subtitle: 'Skill breakdowns, win rates, and rating charts.',
    icon: BarChart2,
    badge: 'Stats Engine'
  }
];

const MOCK_LIVE_MATCHES = [
  { id: 1, p1: 'hyperion', p1Rating: 2150, p1Progress: 85, p2: 'cyber_sensei', p2Rating: 2095, p2Progress: 76, lang: 'Python', problem: 'Valid Parentheses', difficulty: 'Easy', time: '04:12' },
  { id: 2, p1: 'null_pointer', p1Rating: 1840, p1Progress: 45, p2: 'alex_codes', p2Rating: 1890, p2Progress: 92, lang: 'C++', problem: 'Merge K Sorted Lists', difficulty: 'Hard', time: '12:08' },
  { id: 3, p1: 'zen_coder', p1Rating: 1420, p1Progress: 100, p2: 'bot_alpha', p2Rating: 1350, p2Progress: 35, lang: 'JavaScript', problem: 'Longest Palindrome', difficulty: 'Medium', time: '02:45' },
];

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'lambda_knight', rating: 2842, winRate: '82%', title: 'Grandmaster', badgeColor: 'text-brand-purple bg-brand-purple/10 border-brand-purple/25' },
  { rank: 2, name: 'syntax_terror', rating: 2715, winRate: '79%', title: 'Grandmaster', badgeColor: 'text-brand-purple bg-brand-purple/10 border-brand-purple/25' },
  { rank: 3, name: 'rust_ace', rating: 2608, winRate: '75%', title: 'Master', badgeColor: 'text-brand-pink bg-brand-pink/10 border-brand-pink/25' },
  { rank: 4, name: 'byte_boss', rating: 2495, winRate: '71%', title: 'Master', badgeColor: 'text-brand-pink bg-brand-pink/10 border-brand-pink/25' },
  { rank: 5, name: 'gopher_girl', rating: 2380, winRate: '68%', title: 'Diamond', badgeColor: 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/25' },
];

const FAQS = [
  { 
    q: "How does the competitive matchmaking work?", 
    a: "Our matchmaking engine pairs you with opponents of similar skill level using a calibrated Glicko-2 rating system. The system evaluates both your ranking score and rating volatility to ensure highly balanced, competitive 1v1 matchups." 
  },
  { 
    q: "Which programming languages are supported in the arena?", 
    a: "Currently, you can code in Python, C++, and JavaScript (Node.js). We compile and run your code against robust automated test suites in isolated sandbox containers with real-time feedback." 
  },
  { 
    q: "Can I practice solo or play against AI?", 
    a: "Absolutely! We support both a Practice Mode where you can solve problems at your own pace, and an AI Practice Arena where you can challenge customized bots calibrated to different difficulties." 
  },
  { 
    q: "Is there a replay system to review my matches?", 
    a: "Yes! Every battle is stored in our database. You can review your past matchups stroke-by-stroke, inspect the test cases your opponent ran, and study their algorithmic approach to learn and improve." 
  }
];

function StatItem({ value, label, color, icon: Icon }) {
  const count = useCounter(value);
  return (
    <div className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-[#29292B] border border-[#c9c7ba]/10 hover:border-[#c9c7ba]/25 transition-all">
      <div className={`p-3 rounded-xl bg-[#c9c7ba]/5 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-black font-mono-code leading-none ${color}`}>{count}</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#c9c7ba]/40 mt-1.5">{label}</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeLang, setActiveLang] = useState('javascript');
  
  const [matchType, setMatchType] = useState('private'); // 'private' | 'public'
  const [privateAction, setPrivateAction] = useState('create'); // 'create' | 'join'
  const [joinCode, setJoinCode] = useState('');

  const handleStartDuel = async () => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/' } } });
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/api/rooms/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}`);
      }

      const data = await res.json();
      navigate(`/room/${data.roomId}`);
    } catch (err) {
      console.error('Error creating room:', err.message);
      alert('Failed to create room: ' + err.message);
    }
  };

  const handleJoinRoom = async () => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: '/' } } });
      return;
    }

    if (joinCode.length !== 6) {
      alert('Room code must be exactly 6 characters.');
      return;
    }

    try {
      const idToken = await user.getIdToken();
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/api/rooms/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ roomCode: joinCode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      navigate(`/room/${data.roomId}`);
    } catch (err) {
      console.error('Error joining room:', err.message);
      alert('Failed to join room: ' + err.message);
    }
  };
  const [typedCode, setTypedCode] = useState('');
  const [currentFaq, setCurrentFaq] = useState(null);
  
  // Interactive Explorer state
  const [activeTab, setActiveTab] = useState('battle');
  
  // Replay tab mock states
  const [replayPlaying, setReplayPlaying] = useState(true);
  const [replayProgress, setReplayProgress] = useState(40);
  
  // Hero Demo Match states
  const [demoP1Progress, setDemoP1Progress] = useState(25);
  const [demoP2Progress, setDemoP2Progress] = useState(10);
  const [demoStatus, setDemoStatus] = useState('Compiling...');
  const [testCasesPassed, setTestCasesPassed] = useState(0);

  // Typing simulation inside the terminal window
  useEffect(() => {
    const fullText = MOCK_CODES[activeLang];
    let index = 0;
    setTypedCode('');
    
    const interval = setInterval(() => {
      setTypedCode(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 18);
    
    return () => clearInterval(interval);
  }, [activeLang]);

  // Simulated live arena progress loop
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoP1Progress(prev => {
        if (prev >= 100) {
          // Reset after a while
          setTimeout(() => {
            setDemoP1Progress(10);
            setDemoP2Progress(5);
            setDemoStatus('Compiling...');
            setTestCasesPassed(0);
          }, 4000);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 2;
        return Math.min(next, 100);
      });

      setDemoP2Progress(prev => {
        if (prev >= 100) return 100;
        const next = prev + Math.floor(Math.random() * 5) + 1;
        return Math.min(next, 100);
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  // Sync test case execution state based on progress
  useEffect(() => {
    if (demoP1Progress < 40) {
      setDemoStatus('Writing code...');
      setTestCasesPassed(0);
    } else if (demoP1Progress < 65) {
      setDemoStatus('Compiling...');
      setTestCasesPassed(0);
    } else if (demoP1Progress < 85) {
      setDemoStatus('Running tests...');
      setTestCasesPassed(2);
    } else if (demoP1Progress < 100) {
      setDemoStatus('Executing hard test cases...');
      setTestCasesPassed(4);
    } else {
      setDemoStatus('All tests passed!');
      setTestCasesPassed(5);
    }
  }, [demoP1Progress]);

  // Replay progress bar simulator
  useEffect(() => {
    if (!replayPlaying) return;
    const interval = setInterval(() => {
      setReplayProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [replayPlaying]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#29292B] text-[#c9c7ba] flex flex-col selection:bg-[#9d1f15]/30 selection:text-white">
      
      {/* ── BACKGROUND ORBS & GRID ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        {/* Glow accents utilizing crimson and pale yellow */}
        <div className="orb w-[600px] h-[600px] bg-[#9d1f15] opacity-[0.06] -top-32 -left-32 animate-float" />
        <div className="orb w-[500px] h-[500px] bg-[#fbfb7a] opacity-[0.03] top-1/3 right-0" style={{ animationDelay: '-1.5s' }} />
        <div className="orb w-[450px] h-[450px] bg-[#9d1f15] opacity-[0.03] -bottom-32 left-1/4 animate-float" style={{ animationDelay: '-3s' }} />
        <div className="grid-bg" />
      </div>

      {/* ── NAVBAR ── */}
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
                  onClick={() => navigate('/submissions')}
                  className="btn-outline px-4 py-2 text-xs font-bold"
                >
                  My Submissions
                </button>
                <button
                  onClick={handleStartDuel}
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

      {/* ── HERO SECTION ── */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          
          {/* Copy Column */}
          <div className="flex flex-col items-start text-left animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 bg-[#9d1f15]/10 border border-[#9d1f15]/20">
              <Sparkles size={12} className="text-[#fbfb7a] animate-pulse" />
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#fbfb7a]">Real-Time Multiplayer Coding Arena</span>
            </div>

            <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] font-black leading-[1.08] tracking-[-2.5px] mb-6 text-white">
              Code. Clash.<br />
              <span className="text-gradient-hero">Conquer.</span>
            </h1>

            <p className="text-base md:text-lg text-[#c9c7ba]/60 leading-relaxed max-w-lg mb-8">
              Challenge developers worldwide in instant, 1v1 timed coding battles. Write clean code, run test cases in isolated sandboxes, and climb the global ladder.
            </p>

            {/* Private vs Public Toggle Tabs */}
            <div className="flex border-b border-white/[0.05] w-full max-w-sm mb-6 bg-[#1e1e20] p-1 rounded-xl">
              <button
                onClick={() => setMatchType('private')}
                className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                  matchType === 'private'
                    ? 'bg-[#29292B] text-white border border-white/[0.05] shadow'
                    : 'text-[#c9c7ba]/40 hover:text-[#c9c7ba]/70'
                }`}
              >
                Private Duel
              </button>
              <button
                disabled
                title="Public matchmaking coming soon"
                className="flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-[#c9c7ba]/20 cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                Public Arena
                <span className="text-[0.5rem] bg-[#9d1f15]/10 border border-[#9d1f15]/20 text-[#9d1f15] px-1.5 rounded uppercase font-extrabold tracking-normal">soon</span>
              </button>
            </div>

            {/* Private Sub-options (Create vs Join) */}
            {matchType === 'private' && (
              <div className="w-full max-w-sm glass-card rounded-2xl p-5 border border-[#c9c7ba]/15 mb-8 animate-scale-up">
                {/* Create vs Join Sub-toggle */}
                <div className="flex bg-[#1e1e20] p-0.5 rounded-lg mb-5 border border-white/[0.02]">
                  <button
                    onClick={() => setPrivateAction('create')}
                    className={`flex-1 text-center py-1.5 text-[0.65rem] font-extrabold uppercase tracking-widest rounded-md transition-all ${
                      privateAction === 'create'
                        ? 'bg-[#29292B] text-[#fbfb7a] shadow border border-white/[0.02]'
                        : 'text-[#c9c7ba]/40 hover:text-[#c9c7ba]/70'
                    }`}
                  >
                    Create Room
                  </button>
                  <button
                    onClick={() => setPrivateAction('join')}
                    className={`flex-1 text-center py-1.5 text-[0.65rem] font-extrabold uppercase tracking-widest rounded-md transition-all ${
                      privateAction === 'join'
                        ? 'bg-[#29292B] text-[#fbfb7a] shadow border border-white/[0.02]'
                        : 'text-[#c9c7ba]/40 hover:text-[#c9c7ba]/70'
                    }`}
                  >
                    Join Room
                  </button>
                </div>

                {/* Sub-option Content */}
                {privateAction === 'create' ? (
                  <div className="flex flex-col gap-3.5 animate-fade-in">
                    <p className="text-xs text-[#c9c7ba]/40 leading-relaxed">
                      Initialize a private sandbox room. Share the code to challenge a specific coder 1v1.
                    </p>
                    <button
                      id="start-duel-btn"
                      onClick={handleStartDuel}
                      className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg shadow-[#9d1f15]/20 group"
                    >
                      <Sword size={15} className="group-hover:rotate-12 transition-transform text-white" /> Create Private Room
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <p className="text-xs text-[#c9c7ba]/40 leading-relaxed">
                      Enter the 6-character room code to join your opponent's waiting lobby.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Room Code (e.g. Ab7X9P)"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.slice(0, 6))}
                        className="bg-[#1e1e20] border border-white/[0.08] rounded-xl text-white font-mono-code text-sm px-4 py-2.5 flex-1 focus:outline-none focus:border-[#9d1f15]/50 placeholder-white/20 tracking-widest text-center"
                      />
                      <button
                        onClick={handleJoinRoom}
                        disabled={joinCode.length !== 6}
                        className="btn-secondary px-5 py-2.5 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Join Room
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 items-center">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#fbfb7a] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#fbfb7a]"></span>
              </span>
              <span className="text-xs text-[#c9c7ba]/40 font-bold uppercase tracking-widest">
                1,420 coders active in matchmaking right now
              </span>
            </div>
          </div>

          {/* Interactive Battle Terminal Preview */}
          <div className="relative animate-scale-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-tr from-[#9d1f15]/20 to-[#fbfb7a]/20 blur-3xl opacity-20 scale-90 -z-10 animate-pulse" />

            <div className="terminal-window terminal-scanline">
              {/* Terminal Title Bar */}
              <div className="terminal-header justify-between bg-[#1e1e20]">
                <div className="flex gap-1.5">
                  <div className="terminal-dot bg-[#9d1f15] animate-pulse" />
                  <div className="terminal-dot bg-[#fbfb7a]" />
                  <div className="terminal-dot bg-[#c9c7ba]" />
                </div>
                <div className="text-[0.65rem] font-mono-code text-[#c9c7ba]/30">codeduel.io/live-battle/1v1-sim</div>
                <div className="flex items-center gap-1.5 text-[0.65rem] font-bold text-[#fbfb7a] font-mono-code bg-[#fbfb7a]/5 border border-[#fbfb7a]/15 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbfb7a] animate-ping" />
                  <span>⏱ 12:45</span>
                </div>
              </div>

              {/* Player Sync Status bar */}
              <div className="flex justify-between items-center bg-[#29292B] border-b border-[#c9c7ba]/5 px-5 py-4">
                <div className="flex-1 max-w-[42%]">
                  <div className="flex justify-between text-[0.65rem] font-bold text-[#c9c7ba]/60 mb-2">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#9d1f15] rounded-full" />
                      you (dev_ace)
                    </span>
                    <span className="text-[#9d1f15] font-mono font-black">{demoP1Progress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#1e1e20] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#9d1f15] to-[#fbfb7a] rounded-full transition-all duration-300" style={{ width: `${demoP1Progress}%` }} />
                  </div>
                </div>
                <div className="text-xs font-bold text-[#c9c7ba]/25 flex-shrink-0 px-2 select-none">VS</div>
                <div className="flex-1 max-w-[42%] text-right">
                  <div className="flex justify-between text-[0.65rem] font-bold text-[#c9c7ba]/60 mb-2">
                    <span className="text-[#fbfb7a] font-mono font-black">{demoP2Progress}%</span>
                    <span className="flex items-center gap-1 ml-auto">
                      ai_overlord
                      <span className="w-1.5 h-1.5 bg-[#fbfb7a] rounded-full" />
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#1e1e20] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-l from-[#fbfb7a] to-[#9d1f15] rounded-full ml-auto transition-all duration-300" style={{ width: `${demoP2Progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Split editor / problem preview */}
              <div className="grid grid-cols-[42%_58%] min-h-[280px] bg-[#1e1e20]">
                {/* Left Mini problem description */}
                <div className="p-5 border-r border-[#c9c7ba]/5 text-[0.7rem] text-[#c9c7ba]/50 leading-relaxed">
                  <div className="flex gap-1.5 mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#fbfb7a]/5 text-[#fbfb7a] border border-[#fbfb7a]/15 font-bold text-[0.55rem]">Easy</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#9d1f15]/10 text-white border border-[#9d1f15]/20 font-bold text-[0.55rem]">Arrays</span>
                  </div>
                  <h3 className="font-extrabold text-white text-xs mb-2">Two Sum</h3>
                  <p className="mb-3 text-[#c9c7ba]/60">
                    Given an array of integers <code className="font-mono-code text-[#fbfb7a] bg-[#fbfb7a]/5 px-1 rounded border border-[#fbfb7a]/10">nums</code> and an integer <code className="font-mono-code text-[#fbfb7a] bg-[#fbfb7a]/5 px-1 rounded border border-[#fbfb7a]/10">target</code>, return indices of the two numbers such that they add up to target.
                  </p>
                  <div className="p-2.5 rounded-lg bg-[#29292B] border border-[#c9c7ba]/5 font-mono-code">
                    <div className="text-[0.55rem] font-bold text-[#c9c7ba]/30 uppercase tracking-wider mb-1">Example Case</div>
                    <div className="text-[#fbfb7a] text-[0.6rem]">Input: [2, 7, 11, 15], 9</div>
                    <div className="text-[#c9c7ba]/40 text-[0.6rem]">Output: [0, 1]</div>
                  </div>
                </div>

                {/* Right Typing screen */}
                <div className="bg-[#29292B] font-mono-code text-[0.65rem] leading-relaxed text-[#c9c7ba]/85 relative flex flex-col">
                  {/* Lang Tab Header */}
                  <div className="flex border-b border-[#c9c7ba]/5 bg-[#1e1e20]">
                    {Object.keys(MOCK_CODES).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-3 py-1.5 border-r border-[#c9c7ba]/5 transition-colors uppercase font-bold text-[0.55rem] ${activeLang === lang ? 'bg-[#29292B] text-[#fbfb7a] border-t border-t-[#9d1f15]' : 'text-[#c9c7ba]/30 hover:text-[#c9c7ba]/60'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>

                  {/* Editor Code Area */}
                  <div className="p-4 flex-1 overflow-y-auto max-h-[220px]">
                    <pre className="whitespace-pre">{typedCode}</pre>
                    <span className="inline-block w-1.5 h-3.5 bg-[#9d1f15] cursor-blink align-middle ml-0.5 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Bottom execution logs bar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#29292B] border-t border-[#c9c7ba]/5">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex w-2 h-2 rounded-full ${demoStatus.includes('passed') ? 'bg-[#fbfb7a]' : 'bg-[#9d1f15] animate-pulse'}`} />
                  <span className={`text-[0.6rem] font-bold uppercase tracking-wider ${demoStatus.includes('passed') ? 'text-[#fbfb7a]' : 'text-[#c9c7ba]/45'}`}>
                    Status: {demoStatus}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[0.6rem] font-bold text-[#c9c7ba]/30">
                  <span className="font-mono">Tests: {testCasesPassed}/5</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((tc) => (
                      <span 
                        key={tc} 
                        className={`w-2 h-2 rounded-full border border-[#c9c7ba]/5 ${tc <= testCasesPassed ? 'bg-[#fbfb7a] border-[#fbfb7a]/20' : 'bg-[#1e1e20]'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
            <div className="absolute -top-4 -right-4 animate-float px-3.5 py-2.5 rounded-xl glass-card text-xs font-bold text-[#fbfb7a] shadow-xl shadow-[#9d1f15]/5 border-[#fbfb7a]/20 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#fbfb7a] animate-bounce" />
              <span>All Test Cases Passed!</span>
            </div>
            <div className="absolute -bottom-4 -left-4 animate-float px-3.5 py-2.5 rounded-xl glass-card text-xs font-bold text-[#c9c7ba] shadow-xl shadow-[#9d1f15]/5 border-[#c9c7ba]/20 flex items-center gap-2" style={{ animationDelay: '-2s' }}>
              <Award size={14} className="text-[#9d1f15] animate-pulse" />
              <span>+25 Rating (1640)</span>
            </div>
          </div>

        </div>
      </main>

      {/* ── STATS COUNTER GRID ── */}
      <section className="relative z-10 border-t border-b border-[#c9c7ba]/5 bg-[#29292B]/30 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(s => <StatItem key={s.label} {...s} color="text-[#c9c7ba]" />)}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FEATURE EXPLORER (ALL FEATURES ACCORDING TO SYSTEM DESIGN) ── */}
      <section id="features" className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#fbfb7a] bg-[#fbfb7a]/5 border border-[#fbfb7a]/15 px-3.5 py-1.5 rounded-full mb-4">
              Comprehensive Toolkit
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-[-1.5px] leading-tight mb-4 text-white">
              Every Tool Built For <span className="text-gradient-hero">Clash Arena</span>
            </h2>
            <p className="text-sm md:text-base text-[#c9c7ba]/50 max-w-lg leading-relaxed">
              Explore all premium features engineered directly into our competitive, multiplayer sandbox environment.
            </p>
          </div>

          {/* Interactive Feature Grid / Explorer */}
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            
            {/* Feature Tabs selection */}
            <div className="flex flex-col gap-4">
              {FEATURE_EXPLORER.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group ${
                    activeTab === item.id 
                    ? 'bg-[#29292B] border-[#9d1f15] shadow-lg shadow-[#9d1f15]/5' 
                    : 'bg-transparent border-[#c9c7ba]/5 hover:border-[#c9c7ba]/15 hover:bg-[#29292B]/35'
                  }`}
                >
                  <div className={`p-3 rounded-xl border transition-colors ${
                    activeTab === item.id 
                    ? 'bg-[#9d1f15]/10 border-[#9d1f15] text-[#9d1f15]' 
                    : 'bg-[#1e1e20] border-[#c9c7ba]/5 text-[#c9c7ba]/40 group-hover:text-[#c9c7ba]/70'
                  }`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black transition-colors ${
                        activeTab === item.id ? 'text-white' : 'text-[#c9c7ba]/70'
                      }`}>
                        {item.title}
                      </h4>
                      <span className="text-[0.55rem] font-bold uppercase tracking-wider bg-[#1e1e20] text-[#c9c7ba]/40 px-2 py-0.5 rounded border border-[#c9c7ba]/5">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#c9c7ba]/40 mt-1 leading-relaxed">{item.subtitle}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Interactive Preview Console */}
            <div className="rounded-2xl glass-card border border-[#c9c7ba]/5 overflow-hidden min-h-[360px] flex flex-col bg-[#1e1e20] shadow-2xl relative">
              
              {/* Explorer Window Header */}
              <div className="px-5 py-4 border-b border-[#c9c7ba]/5 bg-[#29292B] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-[#fbfb7a]" />
                  <span className="text-xs font-mono font-black text-white capitalize">{activeTab} Live Demo</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#c9c7ba]/10" />
                  <span className="w-2 h-2 rounded-full bg-[#c9c7ba]/25" />
                  <span className="w-2 h-2 rounded-full bg-[#9d1f15]" />
                </div>
              </div>

              {/* Explorer Content Window */}
              <div className="p-6 flex-1 flex flex-col justify-center">
                
                {/* TAB 1: BATTLE */}
                {activeTab === 'battle' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="p-4 rounded-xl border border-[#c9c7ba]/5 bg-[#29292B] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sword className="text-[#9d1f15]" size={16} />
                        <div>
                          <h5 className="text-xs font-extrabold text-white">1v1 Match Connected</h5>
                          <p className="text-[0.6rem] text-[#c9c7ba]/40">Room ID: rm_battle_4821</p>
                        </div>
                      </div>
                      <span className="text-[0.6rem] font-bold text-[#fbfb7a] font-mono bg-[#fbfb7a]/5 border border-[#fbfb7a]/15 px-2 py-0.5 rounded">
                        Active Duel
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[0.65rem] font-mono">
                      <div className="p-3.5 rounded-xl bg-[#29292B] border border-[#c9c7ba]/5">
                        <div className="flex justify-between items-center mb-1 text-[#c9c7ba]/40 font-bold">
                          <span>Your Input</span>
                          <span className="text-[#fbfb7a]">82%</span>
                        </div>
                        <code className="text-[#fbfb7a]">def check_anagram...</code>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#29292B] border border-[#c9c7ba]/5">
                        <div className="flex justify-between items-center mb-1 text-[#c9c7ba]/40 font-bold">
                          <span>Opponent</span>
                          <span className="text-white">65%</span>
                        </div>
                        <code className="text-white/40">function solveStr()...</code>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button className="btn-primary w-full text-xs py-2.5 shadow-none" onClick={handleStartDuel}>
                        Join Arena & Fight
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: PRACTICE */}
                {activeTab === 'practice' && (
                  <div className="flex flex-col gap-3.5 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Problems Registry</span>
                      <span className="text-[0.6rem] text-[#c9c7ba]/40 font-mono">1,240 Total Tasks</span>
                    </div>

                    <div className="divide-y divide-[#c9c7ba]/5">
                      {[
                        { name: 'Reverse Linked List', diff: 'Easy', rating: 900, score: '100 pts' },
                        { name: 'Binary Tree Inorder Traversal', diff: 'Medium', rating: 1200, score: '200 pts' },
                        { name: 'Edit Distance Subsequence', diff: 'Hard', rating: 1850, score: '400 pts' },
                      ].map((prob, i) => (
                        <div key={i} className="py-2.5 flex justify-between items-center text-[0.65rem]">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${prob.diff === 'Easy' ? 'bg-[#fbfb7a]' : prob.diff === 'Medium' ? 'bg-[#c9c7ba]' : 'bg-[#9d1f15]'}`} />
                            <span className="font-extrabold text-white hover:text-[#fbfb7a] cursor-pointer">{prob.name}</span>
                          </div>
                          <div className="flex gap-3 text-[#c9c7ba]/45 font-mono">
                            <span>★ {prob.rating}</span>
                            <span>{prob.score}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="btn-outline w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5" onClick={() => navigate('/duel')}>
                      <List size={13} /> View All Challenges
                    </button>
                  </div>
                )}

                {/* TAB 3: RANKED */}
                {activeTab === 'ranked' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="text-center">
                      <Trophy className="mx-auto text-[#fbfb7a] mb-2 animate-bounce" size={24} />
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider">Active Division Tiers</h5>
                      <p className="text-[0.6rem] text-[#c9c7ba]/45">Based on calibrated Glicko-2 ratings</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 text-center text-[0.6rem] font-bold">
                      <div className="p-3 rounded-xl bg-[#29292B] border border-[#c9c7ba]/5">
                        <span className="text-[#9d1f15] block mb-1">🔴 Crimson League</span>
                        <span className="text-white/40 block font-mono">&gt;2400 Rating</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#29292B] border border-[#9d1f15]/20 shadow-md shadow-[#9d1f15]/5">
                        <span className="text-[#fbfb7a] block mb-1">🟡 Pale League</span>
                        <span className="text-white/40 block font-mono">1600-2400 Rating</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#29292B] border border-[#c9c7ba]/5">
                        <span className="text-[#c9c7ba] block mb-1">⚪ Sand League</span>
                        <span className="text-white/40 block font-mono">0-1600 Rating</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#29292B] rounded-xl border border-[#c9c7ba]/5 flex justify-between items-center text-[0.65rem]">
                      <span className="text-[#c9c7ba]/50 flex items-center gap-1.5">
                        <TrendingUp size={12} className="text-[#9d1f15]" />
                        Current Match Pool Queue Time
                      </span>
                      <span className="font-mono text-white">~14 seconds</span>
                    </div>
                  </div>
                )}

                {/* TAB 4: REPLAY */}
                {activeTab === 'replay' && (
                  <div className="flex flex-col gap-3.5 animate-fade-in">
                    <div className="p-4 rounded-xl bg-[#29292B] border border-[#c9c7ba]/5">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <RotateCcw size={13} className="text-[#9d1f15] animate-spin" />
                          Replay Playback
                        </span>
                        <span className="text-[0.6rem] font-mono text-[#c9c7ba]/40">match_id_6942a</span>
                      </div>

                      {/* Timeline Scrub */}
                      <div className="h-1 bg-[#1e1e20] rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-[#9d1f15]" style={{ width: `${replayProgress}%` }} />
                      </div>
                      <div className="flex justify-between text-[0.55rem] font-mono text-[#c9c7ba]/30">
                        <span>01:14</span>
                        <span>04:12</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between text-[0.65rem]">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setReplayPlaying(!replayPlaying)}
                          className="px-3 py-1.5 rounded-lg bg-[#c9c7ba]/5 text-white hover:bg-[#c9c7ba]/10 border border-[#c9c7ba]/5 flex items-center gap-1 font-bold"
                        >
                          {replayPlaying ? <Pause size={10} /> : <Play size={10} />}
                          <span>{replayPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-[#c9c7ba]/5 text-white/50 border border-[#c9c7ba]/5 font-bold">2x Speed</button>
                      </div>
                      <span className="text-[#c9c7ba]/45 font-bold uppercase tracking-wider text-[0.55rem]">Keystroke recording active</span>
                    </div>
                  </div>
                )}

                {/* TAB 5: PROFILE */}
                {activeTab === 'profile' && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <div className="flex items-center gap-4 p-3.5 bg-[#29292B] rounded-xl border border-[#c9c7ba]/5">
                      <div className="w-10 h-10 rounded-lg bg-[#9d1f15]/10 border border-[#9d1f15]/25 flex items-center justify-center text-[#9d1f15]">
                        <User size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-extrabold text-white">dev_ace</h5>
                        <p className="text-[0.6rem] text-[#c9c7ba]/40">Member since June 2026</p>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-xs font-black font-mono-code text-[#fbfb7a]">2,150 Glicko-2</div>
                        <span className="text-[0.55rem] uppercase font-bold text-[#9d1f15] tracking-widest bg-[#9d1f15]/5 border border-[#9d1f15]/15 px-1.5 py-0.25 rounded">
                          Master
                        </span>
                      </div>
                    </div>

                    {/* Skill Breakdown Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[0.6rem]">
                      <div className="p-2.5 rounded-lg bg-[#29292B] border border-[#c9c7ba]/5 flex justify-between items-center">
                        <span className="text-[#c9c7ba]/50">Arrays / Matrices</span>
                        <span className="font-mono text-[#fbfb7a] font-bold">95%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#29292B] border border-[#c9c7ba]/5 flex justify-between items-center">
                        <span className="text-[#c9c7ba]/50">Dynamic Prog.</span>
                        <span className="font-mono text-[#fbfb7a] font-bold">72%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#29292B] border border-[#c9c7ba]/5 flex justify-between items-center">
                        <span className="text-[#c9c7ba]/50">Graph Structures</span>
                        <span className="font-mono text-[#fbfb7a] font-bold">58%</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#29292B] border border-[#c9c7ba]/5 flex justify-between items-center">
                        <span className="text-[#c9c7ba]/50">Strings / Sorting</span>
                        <span className="font-mono text-[#fbfb7a] font-bold">88%</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── INTERACTIVE LIVE BATTLES SECTION ── */}
      <section id="live-battles" className="relative z-10 py-20 bg-[#29292B]/30 border-t border-b border-[#c9c7ba]/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#fbfb7a] bg-[#fbfb7a]/5 border border-[#fbfb7a]/15 px-3.5 py-1.5 rounded-full mb-4 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fbfb7a] animate-ping" />
                Live Broadcast
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-[-1px] text-white mt-2">
                Spectate Active Duels
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#c9c7ba]/50 max-w-md">
              Watch real-time matches currently unfolding in the arena. Study the best programmers' live keyboard inputs, problem analysis, and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MOCK_LIVE_MATCHES.map((match) => (
              <div key={match.id} className="rounded-2xl glass-card p-6 border border-[#c9c7ba]/5 flex flex-col justify-between bg-[#29292B]/10">
                <div>
                  <div className="flex justify-between items-center text-[0.6rem] font-bold text-[#c9c7ba]/30 mb-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#1e1e20] text-[#c9c7ba] border border-[#c9c7ba]/5 uppercase tracking-wider">{match.lang}</span>
                    <span className="flex items-center gap-1 text-[#fbfb7a]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#fbfb7a] animate-ping" />
                      {match.time} Elapsed
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-white mb-1">{match.problem}</h4>
                  <div className="flex items-center gap-1.5 mb-6">
                    <span className={`text-[0.55rem] font-bold px-2 py-0.5 rounded-full border ${match.difficulty === 'Easy' ? 'bg-[#fbfb7a]/5 border-[#fbfb7a]/15 text-[#fbfb7a]' : match.difficulty === 'Medium' ? 'bg-[#c9c7ba]/5 border-[#c9c7ba]/15 text-[#c9c7ba]' : 'bg-[#9d1f15]/5 border-[#9d1f15]/15 text-white'}`}>
                      {match.difficulty}
                    </span>
                  </div>

                  {/* Progress bars */}
                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <div className="flex justify-between text-[0.65rem] text-[#c9c7ba]/50 mb-1.5 font-bold">
                        <span>{match.p1} ({match.p1Rating})</span>
                        <span className="text-[#9d1f15] font-mono font-black">{match.p1Progress}%</span>
                      </div>
                      <div className="h-1 bg-[#1e1e20] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#9d1f15] to-[#fbfb7a] rounded-full" style={{ width: `${match.p1Progress}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[0.65rem] text-[#c9c7ba]/50 mb-1.5 font-bold">
                        <span>{match.p2} ({match.p2Rating})</span>
                        <span className="text-[#fbfb7a] font-mono font-black">{match.p2Progress}%</span>
                      </div>
                      <div className="h-1 bg-[#1e1e20] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#fbfb7a] to-[#9d1f15] rounded-full" style={{ width: `${match.p2Progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/duel', { state: { username: 'Spectator' } })}
                  className="btn-outline w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 border-[#c9c7ba]/10 bg-white/[0.005]"
                >
                  <Eye size={13} /> Spectate Duel
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── LEADERBOARD PREVIEW ── */}
      <section id="leaderboard" className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
            
            <div>
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#fbfb7a] bg-[#fbfb7a]/5 border border-[#fbfb7a]/15 px-3.5 py-1.5 rounded-full mb-4 inline-block">
                Top Performers
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-[-1.5px] leading-tight mb-6 text-white">
                Ascend to the<br />Hall of <span className="text-gradient-hero">Grandmasters</span>.
              </h2>
              <p className="text-sm md:text-base text-[#c9c7ba]/50 leading-relaxed mb-8">
                Compete, win matches, and gain rating points to challenge the top-tier coders. Your wins, rate of execution, and rating levels are tracked globally.
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#9d1f15]/5 border border-[#9d1f15]/15 flex items-center justify-center text-[#9d1f15]">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">High Stakes Rankings</h4>
                    <p className="text-xs text-[#c9c7ba]/40">Only the best reach Grandmaster status (&gt;2400 rating points)</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-[#fbfb7a]/5 border border-[#fbfb7a]/15 flex items-center justify-center text-[#fbfb7a]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">Weekly Prizes & Badges</h4>
                    <p className="text-xs text-[#c9c7ba]/40">Show off custom badge borders and tags in global chatrooms</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl glass-card border border-[#c9c7ba]/5 overflow-hidden bg-[#29292B]/20">
              <div className="px-6 py-5 border-b border-[#c9c7ba]/5 bg-[#29292B]/50 flex justify-between items-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">Global Leaderboard</span>
                <span className="text-[0.6rem] font-mono-code bg-[#9d1f15]/10 text-[#fbfb7a] px-2.5 py-1 rounded-full border border-[#9d1f15]/20">Live Feed</span>
              </div>

              <div className="divide-y divide-[#c9c7ba]/5">
                {MOCK_LEADERBOARD.map((user) => (
                  <div key={user.rank} className="px-6 py-4 flex items-center justify-between hover:bg-[#c9c7ba]/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`w-6 text-xs font-black font-mono-code ${user.rank === 1 ? 'text-[#fbfb7a] text-sm' : user.rank === 2 ? 'text-[#c9c7ba]/80' : 'text-[#c9c7ba]/40'}`}>
                        #{user.rank}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{user.name}</span>
                        <span className={`text-[0.55rem] font-bold uppercase tracking-widest mt-0.5 border border-[#c9c7ba]/5 rounded px-1.5 py-0.25 w-max ${user.badgeColor}`}>
                          {user.title}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black font-mono-code text-[#fbfb7a]">{user.rating}</div>
                      <div className="text-[0.6rem] text-[#c9c7ba]/45 font-semibold mt-0.5">{user.winRate} Win Rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section id="faq" className="relative z-10 py-20 bg-[#29292B]/30 border-t border-b border-[#c9c7ba]/5">
        <div className="max-w-4xl mx-auto px-6">
          
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#9d1f15] bg-[#9d1f15]/5 border border-[#9d1f15]/15 px-3.5 py-1.5 rounded-full mb-4">
              Common Questions
            </span>
            <h2 className="text-2xl md:text-4xl font-black tracking-[-1px] text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-2xl glass-card border border-[#c9c7ba]/5 overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setCurrentFaq(currentFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.005] transition-colors"
                >
                  <span className="text-xs md:text-sm font-bold text-white">{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-[#c9c7ba]/45 transition-transform duration-300 ${currentFaq === index ? 'rotate-180 text-[#fbfb7a]' : ''}`} 
                  />
                </button>
                
                <div 
                  className={`transition-all duration-300 ease-in-out ${currentFaq === index ? 'max-h-[200px] border-t border-[#c9c7ba]/5' : 'max-h-0'}`}
                  style={{ overflow: 'hidden' }}
                >
                  <p className="px-6 py-5 text-xs md:text-sm text-[#c9c7ba]/50 leading-relaxed bg-[#29292B]/10">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="relative z-10 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#9d1f15]/10 blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-3xl px-6 flex flex-col items-center">
          <h2 className="text-3xl md:text-6xl font-black tracking-[-2px] mb-6 leading-[1.1] text-white">
            Ready to Prove Your<br />Speed in <span className="text-gradient-brand">Real-Time</span>?
          </h2>
          <p className="text-sm md:text-base text-[#c9c7ba]/50 leading-relaxed max-w-lg mb-10">
            Join thousands of developers climbing the global Glicko-2 rating ladder. Step into the matchmaking arena and challenge your first opponent today.
          </p>

          <button 
            id="cta-bottom-start-btn"
            onClick={() => navigate('/duel', { state: { username: 'Guest' } })} 
            className="btn-primary px-8 py-4 text-sm font-bold shadow-2xl shadow-[#9d1f15]/40 group hover:scale-[1.02]"
          >
            <Sword size={16} className="group-hover:rotate-12 transition-transform text-white" /> Enter the Arena Now
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-[#c9c7ba]/5 py-12 mt-auto bg-black/[0.15]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 text-sm font-black tracking-tight text-[#c9c7ba]/60 select-none">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sword size={13} className="text-white" />
            </div>
            <span className="font-extrabold text-white">CodeDuel</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-[0.7rem] font-bold uppercase tracking-wider text-[#c9c7ba]/40">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#live-battles" className="hover:text-white transition-colors">Live Battles</a>
            <a href="#leaderboard" className="hover:text-white transition-colors">Leaderboard</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
              Github <ExternalLink size={10} />
            </a>
          </div>

          <p className="text-[0.65rem] text-[#c9c7ba]/30 font-medium">
            © 2026 CodeDuel. Engineered for competitive excellence.
          </p>
        </div>
      </footer>

    </div>
  );
}
