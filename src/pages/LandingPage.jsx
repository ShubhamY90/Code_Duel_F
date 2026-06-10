import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sword, Users, Code2, Trophy, Activity, ChevronDown,
  User, TrendingUp, BarChart2, Eye, BookOpen,
  RotateCcw, Terminal, Sparkles
} from 'lucide-react';
import ReplayDemo from '../components/ReplayDemo';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import Footer from '../components/Footer';


const STATS = [
  { value: '25K+', label: 'Duels Fought', color: 'text-brand-purple', icon: Sword },
  { value: '8.4K', label: 'Active Coders', color: 'text-brand-pink', icon: Users },
  { value: '1.2K+', label: 'Challenges', color: 'text-brand-green', icon: Code2 },
  { value: '99.9%', label: 'Match Success', color: 'text-brand-pink', icon: Activity },
];

// MOCK_CODES moved to BattlePreview;

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
  return (
    <div className="flex items-center gap-4 px-6 py-5 rounded-2xl bg-[#29292B] border border-[#c9c7ba]/10 hover:border-[#c9c7ba]/25 transition-all">
      <div className={`p-3 rounded-xl bg-[#c9c7ba]/5 ${color}`}>
        <Icon size={20} />
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-black font-mono-code leading-none ${color}`}>{value}</span>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.1em] text-[#c9c7ba]/40 mt-1.5">{label}</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  console.count("LandingPage Render");

  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [currentFaq, setCurrentFaq] = useState(null);

  // Interactive Explorer state
  const [activeTab, setActiveTab] = useState('battle');

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
      <Navbar onStartDuel={handleStartDuel} />

      {/* ── HERO SECTION ── */}
      <Header onStartDuel={handleStartDuel} />

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
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 group ${activeTab === item.id
                    ? 'bg-[#29292B] border-[#9d1f15] shadow-lg shadow-[#9d1f15]/5'
                    : 'bg-transparent border-[#c9c7ba]/5 hover:border-[#c9c7ba]/15 hover:bg-[#29292B]/35'
                    }`}
                >
                  <div className={`p-3 rounded-xl border transition-colors ${activeTab === item.id
                    ? 'bg-[#9d1f15]/10 border-[#9d1f15] text-[#9d1f15]'
                    : 'bg-[#1e1e20] border-[#c9c7ba]/5 text-[#c9c7ba]/40 group-hover:text-[#c9c7ba]/70'
                    }`}>
                    <item.icon size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-black transition-colors ${activeTab === item.id ? 'text-white' : 'text-[#c9c7ba]/70'
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

                    <button className="btn-primary w-full text-xs py-2.5 mt-2 flex items-center justify-center gap-1.5" onClick={() => navigate('/practice')}>
                      <BookOpen size={13} /> Start Practicing Now
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
                {activeTab === 'replay' && <ReplayDemo />}

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
      <Footer />

    </div>
  );
}
