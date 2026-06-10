import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Trophy, Award, ArrowLeft, Loader2, Users, Flame, Star, Clock, Zap, Flag } from 'lucide-react';

export default function ResultsPage() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile states keyed by userId
  const [profiles, setProfiles] = useState({});

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Subscribe to match document from matches collection
  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    const matchRef = doc(db, 'matches', matchId);

    const unsubscribe = onSnapshot(
      matchRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError('Match data not found.');
          setLoading(false);
          return;
        }
        setMatch({ id: snapshot.id, ...snapshot.data() });
        setLoading(false);
      },
      (err) => {
        console.error('Failed to get match results:', err);
        setError('Failed to fetch match results.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [matchId]);

  // Fetch profiles for all participants by userId
  useEffect(() => {
    if (!match?.participantIds?.length) return;

    async function fetchProfiles() {
      const fetched = {};
      await Promise.all(
        match.participantIds.map(async (uid) => {
          try {
            const res = await fetch(`${API_BASE}/api/users/${uid}`);
            if (res.ok) {
              const data = await res.json();
              fetched[uid] = data;
            } else {
              fetched[uid] = { displayName: `Player (${uid.slice(0, 6)})` };
            }
          } catch {
            fetched[uid] = { displayName: 'Player' };
          }
        })
      );
      setProfiles(fetched);
    }

    fetchProfiles();
  }, [match?.participantIds, API_BASE]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="orb w-[500px] h-[500px] bg-[#9d1f15] opacity-[0.05] -top-32 -left-32 animate-float" />
          <div className="grid-bg" />
        </div>
        <Loader2 size={36} className="animate-spin text-[#9d1f15]" />
        <p className="text-xs font-bold font-mono tracking-widest text-[#c9c7ba]/40 uppercase">
          Calculating Results…
        </p>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex flex-col items-center justify-center gap-6 relative overflow-hidden px-6 text-center">
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="orb w-[500px] h-[500px] bg-[#9d1f15] opacity-[0.05] -top-32 -left-32 animate-float" />
          <div className="grid-bg" />
        </div>
        <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-danger/20 relative z-10 flex flex-col items-center">
          <h2 className="text-lg font-black tracking-wider text-white mb-2 uppercase">Results Error</h2>
          <p className="text-sm text-[#c9c7ba]/65 mb-6">{error || 'Unable to display results.'}</p>
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            <ArrowLeft size={14} /> Return to Arena
          </button>
        </div>
      </div>
    );
  }

  // Determine outcome for the current user
  let resultType = 'defeat';
  if (match.winnerId === 'tie') {
    resultType = 'tie';
  } else if (user && match.winnerId === user.uid) {
    resultType = 'victory';
  }

  // Format duration as MM:SS
  const formatDuration = (secs) => {
    if (!secs && secs !== 0) return '—';
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Completion reason display config
  const reasonConfig = {
    solved: { label: 'Solved', icon: <Zap size={11} />, color: 'text-brand-green bg-brand-green/10 border-brand-green/25' },
    timeout: { label: 'Timeout', icon: <Clock size={11} />, color: 'text-brand-amber bg-brand-amber/10 border-brand-amber/25' },
    surrender: { label: 'Surrender', icon: <Flag size={11} />, color: 'text-brand-red bg-brand-red/10 border-brand-red/25' },
  };
  const reason = reasonConfig[match.completionReason] ?? { label: match.completionReason ?? '—', icon: null, color: 'text-white/40 bg-white/5 border-white/10' };

  // Display texts & styling details
  const config = {
    victory: {
      title: 'Victory',
      subtitle: 'Outstanding clash! You conquered the arena.',
      textColor: 'text-brand-green',
      glowColor: 'shadow-[#00E676]/10 border-[#00E676]/30 bg-[#00E676]/5',
      icon: <Trophy size={42} className="text-[#00E676]" />,
    },
    tie: {
      title: 'Tie / Dual Victory',
      subtitle: 'An equal match! You both fought to a standstill.',
      textColor: 'text-[#fbfb7a]',
      glowColor: 'shadow-[#fbfb7a]/10 border-[#fbfb7a]/30 bg-[#fbfb7a]/5',
      icon: <Users size={42} className="text-[#fbfb7a]" />,
    },
    defeat: {
      title: 'Defeat',
      subtitle: "Gg! Study your opponent's code and fight again.",
      textColor: 'text-brand-red',
      glowColor: 'shadow-[#FF2E2E]/10 border-[#FF2E2E]/30 bg-[#FF2E2E]/5',
      icon: <Flame size={42} className="text-danger animate-pulse" />,
    },
  }[resultType];

  // Build participant display list — never rely on array index, always find by userId
  const participantDisplayList = (match.participantIds ?? []).map((uid) => {
    const participant = (match.participants ?? []).find((p) => p.userId === uid) ?? {};
    const profile = profiles[uid] ?? {};
    const isWinner = match.winnerId === uid;
    return { uid, participant, profile, isWinner };
  });

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#c9c7ba] flex flex-col relative overflow-hidden select-none">
      {/* ── BACKGROUND ORBS & GRID ── */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="orb w-[600px] h-[600px] bg-[#9d1f15] opacity-[0.06] -top-32 -left-32 animate-float" />
        <div className="orb w-[500px] h-[500px] bg-[#fbfb7a] opacity-[0.02] bottom-0 right-0" style={{ animationDelay: '-2s' }} />
        <div className="grid-bg" />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 max-w-2xl mx-auto w-full px-6 py-16 flex flex-col justify-center items-center">

        {/* Outcome Card */}
        <div className={`w-full glass-card rounded-3xl p-8 border ${config.glowColor} flex flex-col items-center text-center shadow-2xl mb-8 animate-scale-up`}>
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] mb-6">
            {config.icon}
          </div>

          <h1 className={`text-4xl md:text-5xl font-black tracking-widest uppercase ${config.textColor} mb-2`}>
            {config.title}
          </h1>
          <p className="text-xs md:text-sm text-[#c9c7ba]/65 leading-relaxed max-w-sm mb-4">
            {config.subtitle}
          </p>

          {/* Completion reason + duration badges */}
          <div className="flex items-center gap-2 mb-8">
            <span className={`inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${reason.color}`}>
              {reason.icon} {reason.label}
            </span>
            {match.durationSeconds != null && (
              <span className="inline-flex items-center gap-1 text-[0.6rem] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border text-white/50 bg-white/[0.03] border-white/10">
                <Clock size={11} /> {formatDuration(match.durationSeconds)}
              </span>
            )}
          </div>

          {/* Participant score cards */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-white/[0.05] py-6 mb-8">
            {participantDisplayList.map(({ uid, participant, profile, isWinner }) => (
              <div key={uid} className="flex flex-col items-center">
                {isWinner && match.winnerId !== 'tie' && (
                  <span className="inline-flex items-center gap-1 text-[0.55rem] font-black uppercase text-[#fbfb7a] mb-1">
                    <Trophy size={10} /> Winner
                  </span>
                )}
                {match.winnerId === 'tie' && (
                  <span className="text-[0.55rem] font-black uppercase text-[#fbfb7a] mb-1">Tie</span>
                )}
                {!isWinner && match.winnerId !== 'tie' && (
                  <span className="text-[0.55rem] font-black uppercase text-white/20 mb-1">—</span>
                )}
                <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-sm font-black border border-white/10 mb-2 uppercase overflow-hidden">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt={profile?.displayName} className="w-full h-full object-cover" />
                  ) : (
                    profile?.displayName?.slice(0, 2) || uid.slice(0, 2)
                  )}
                </div>
                <span className="text-xs font-black text-white uppercase tracking-wide">
                  {profile?.displayName || uid.slice(0, 8)}
                </span>
                <span className="text-lg font-mono-code font-black text-white/90 mt-1">
                  {participant.testCasesPassed ?? participant.score ?? 0}{' '}
                  <span className="text-xs text-[#c9c7ba]/30 font-sans">passed</span>
                </span>
                {participant.solved && (
                  <span className="text-[0.55rem] font-black uppercase text-brand-green mt-0.5">✓ Solved</span>
                )}
              </div>
            ))}
          </div>

          {/* Problem Info */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs text-[#c9c7ba]/50 font-bold uppercase">
            <Star size={13} className="text-[#fbfb7a]" />
            <span>Problem ID: {match.problemId}</span>
          </div>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="btn-outline px-8 py-3 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <ArrowLeft size={13} /> Back to Arena Home
        </button>

      </main>
    </div>
  );
}
