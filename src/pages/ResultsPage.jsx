import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, Clock, Swords, Home, RotateCcw, CheckCircle, XCircle, Star, TrendingUp, TrendingDown, Zap } from 'lucide-react';

export default function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    results = [], 
    timeLeft = 0, 
    problem = 'Unknown Problem', 
    timeout = false 
  } = location.state || {};

  const totalTime = 30 * 60;
  const timeTaken = totalTime - timeLeft;
  const passedCount = results.filter(r => r.passed).length;
  const allPassed = results.length > 0 && passedCount === results.length;
  const isWin = allPassed && !timeout;

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec.toString().padStart(2, '0')}s`;
  };

  const ratingDelta = isWin ? Math.max(10, Math.floor(130 - timeTaken / 70)) : -15;

  return (
    <div className="relative min-h-screen bg-bg-space text-white flex items-center justify-center px-4 py-10 overflow-hidden">
      
      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className={`orb w-[600px] h-[600px] opacity-[0.08] -top-24 -left-12 ${isWin ? 'bg-brand-purple' : 'bg-brand-red'}`} />
        <div className={`orb w-[500px] h-[500px] opacity-[0.06] bottom-0 right-0 ${isWin ? 'bg-brand-green' : 'bg-brand-amber'}`} />
        <div className="grid-bg" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-6 animate-scale-up">
        
        {/* Holographic Outcome Card */}
        <div 
          className={`glass-card rounded-3xl p-8 md:p-12 text-center transition-all ${
            isWin ? 'shadow-[0_0_60px_rgba(0,184,148,0.12)]' : 'shadow-[0_0_40px_rgba(214,48,49,0.1)]'
          }`}
        >
          {/* Glowing Aura */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(108,92,231,0.1),transparent_70%)]" />

          {/* Icon Badge */}
          <div className="flex justify-center mb-6">
            {isWin ? (
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand-amber/10 border border-brand-amber/25 animate-float shadow-lg shadow-brand-amber/5">
                <Trophy size={42} className="text-brand-amber drop-shadow-[0_0_12px_rgba(241,196,15,0.4)]" />
              </div>
            ) : timeout ? (
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand-red/10 border border-brand-red/25 shadow-lg shadow-brand-red/5">
                <Clock size={42} className="text-brand-red" />
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand-purple/10 border border-brand-purple/25 shadow-lg shadow-brand-purple/5">
                <Swords size={42} className="text-brand-violet" />
              </div>
            )}
          </div>

          <h1 className={`text-3xl md:text-5xl font-black tracking-tight mb-3 ${
            isWin ? 'text-gradient-green' : 'text-white/80'
          }`}>
            {timeout ? "Time's Expired" : isWin ? 'Victory!' : 'Keep Practicing'}
          </h1>

          <p className="text-xs md:text-sm text-white/40 max-w-md mx-auto leading-relaxed mb-6">
            {timeout
              ? 'The battle duration lapsed before code submission could pass all required benchmarks.'
              : isWin
              ? `Congratulations! Your solution for "${problem}" successfully solved all visual and hidden tests.`
              : `Some test evaluations failed on "${problem}". Study the assertions below and enter the arena again.`}
          </p>

          {/* Victory Trophy Stars */}
          {isWin && (
            <div className="flex justify-center gap-1.5 mt-2">
              {[...Array(3)].map((_, i) => (
                <Star key={i} size={16} fill="#f1c40f" color="#f1c40f"
                  className="drop-shadow-[0_0_6px_rgba(241,196,15,0.5)]"
                  style={{ animationDelay: `${i * 0.1}s` }} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              val: isWin ? 'WIN' : 'LOSS',
              label: 'Outcome',
              color: isWin ? 'text-brand-green' : 'text-brand-red',
              bg: isWin ? 'bg-brand-green/5 border-brand-green/15' : 'bg-brand-red/5 border-brand-red/15',
            },
            { val: fmt(timeTaken), label: 'Duration', color: 'text-brand-violet', bg: 'bg-brand-purple/5 border-white/[0.04]' },
            {
              val: results.length > 0 ? `${passedCount}/${results.length}` : '—',
              label: 'Assertions',
              color: passedCount === results.length ? 'text-brand-green' : 'text-brand-amber',
              bg: 'bg-white/[0.01] border-white/[0.04]',
            },
            {
              val: `${ratingDelta > 0 ? '+' : ''}${ratingDelta}`,
              label: 'Glicko Δ',
              color: ratingDelta > 0 ? 'text-brand-green' : 'text-brand-red',
              bg: ratingDelta > 0 ? 'bg-brand-green/5 border-brand-green/10' : 'bg-brand-red/5 border-brand-red/10',
            },
          ].map(s => (
            <div 
              key={s.label}
              className={`rounded-2xl border p-4 text-center transition-all hover:-translate-y-0.5 ${s.bg}`}
            >
              <div className="flex justify-center mb-1">
                {s.label === 'Glicko Δ' && (ratingDelta > 0
                  ? <TrendingUp size={13} className="text-brand-green" />
                  : <TrendingDown size={13} className="text-brand-red" />)}
              </div>
              <div className={`font-mono-code text-lg font-black ${s.color}`}>{s.val}</div>
              <div className="text-[0.55rem] font-bold uppercase tracking-[0.2em] text-white/20 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Test Case Review Widget */}
        {results.length > 0 && (
          <div className="bg-bg-panel border border-white/[0.04] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.03] bg-white/[0.005]">
              <h3 className="text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-white/30">Test Verification</h3>
              <span className="text-[0.65rem] font-mono-code text-brand-violet">{passedCount} / {results.length} Assertions</span>
            </div>
            <div className="divide-y divide-white/[0.03]">
              {results.map((r, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3 text-[0.65rem] transition-colors hover:bg-white/[0.01]">
                  <span className={r.passed ? 'text-brand-green' : 'text-brand-red'}>
                    {r.passed ? <CheckCircle size={13} /> : <XCircle size={13} />}
                  </span>
                  <span className="font-mono-code font-bold text-white/40 w-16">Case {i + 1}</span>
                  <div className="flex-1 min-w-0 flex flex-wrap gap-x-4 gap-y-1 text-white/30">
                    <span>Input: <code className="font-mono-code text-white/60">{r.input}</code></span>
                    <span>Expected: <code className="font-mono-code text-white/60">{r.expected}</code></span>
                    {!r.passed && <span>Returned: <code className="font-mono-code text-brand-red">{r.got}</code></span>}
                  </div>
                  <span className="font-mono-code text-white/20 text-[0.6rem]">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating notice banner */}
        <div className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-xs leading-relaxed ${
          isWin
            ? 'bg-brand-green/5 border-brand-green/10 text-brand-green'
            : 'bg-white/[0.01] border-white/[0.04] text-white/30'
        }`}>
          <Zap size={13} className="flex-shrink-0" />
          <span>
            {isWin
              ? `Precision rating modified. Your account gained ${ratingDelta} Glicko points.`
              : 'Glicko rating computed. Defeats lower matchmaker variance settings; next victory counts higher.'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex gap-3 flex-wrap">
          <button 
            id="rematch-btn" 
            onClick={() => navigate('/duel')} 
            className="btn-primary py-2.5 px-6 font-bold text-xs flex-1"
          >
            <RotateCcw size={13} /> Rematch Arena
          </button>
          
          <button 
            id="lobby-btn" 
            onClick={() => navigate('/lobby')}
            className="btn-secondary py-2.5 px-6 font-bold text-xs flex-1"
          >
            Lobby Matchmaking
          </button>

          <button 
            id="home-btn" 
            onClick={() => navigate('/')}
            className="btn-outline py-2.5 px-6 font-bold text-xs flex-1"
          >
            <Home size={13} /> Landing
          </button>
        </div>

      </div>
    </div>
  );
}
