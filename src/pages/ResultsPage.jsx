import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { Trophy, Award, ArrowLeft, Loader2, Users, Flame, Star } from 'lucide-react';

export default function ResultsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hostProfile, setHostProfile] = useState(null);
  const [guestProfile, setGuestProfile] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Subscribe to room updates
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    const roomRef = doc(db, 'rooms', roomId);

    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError('Room data not found.');
          setLoading(false);
          return;
        }
        setRoom(snapshot.data());
        setLoading(false);
      },
      (err) => {
        console.error('Failed to get room results:', err);
        setError('Failed to fetch match results.');
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [roomId]);

  // Fetch Host profile details
  useEffect(() => {
    if (!room?.hostId) return;

    async function fetchHostProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/users/${room.hostId}`);
        if (res.ok) {
          const data = await res.json();
          setHostProfile(data);
        }
      } catch (err) {
        console.warn('Failed to resolve host profile:', err);
      }
    }

    fetchHostProfile();
  }, [room?.hostId, API_BASE]);

  // Fetch Guest profile details
  useEffect(() => {
    if (!room?.guestId) return;

    async function fetchGuestProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/users/${room.guestId}`);
        if (res.ok) {
          const data = await res.json();
          setGuestProfile(data);
        }
      } catch (err) {
        console.warn('Failed to resolve guest profile:', err);
      }
    }

    fetchGuestProfile();
  }, [room?.guestId, API_BASE]);

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

  if (error || !room) {
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

  const isHost = user && user.uid === room.hostId;
  const isGuest = user && user.uid === room.guestId;

  // Determine game outcome
  let resultType = 'defeat'; // victory | defeat | tie
  if (room.winnerId === 'tie') {
    resultType = 'tie';
  } else if (user && room.winnerId === user.uid) {
    resultType = 'victory';
  }

  // Display texts & styling details
  const config = {
    victory: {
      title: 'Victory',
      subtitle: 'Outstanding clash! You conquered the arena.',
      textColor: 'text-brand-green',
      glowColor: 'shadow-[#00E676]/10 border-[#00E676]/30 bg-[#00E676]/5',
      icon: <Trophy size={42} className="text-[#00E676]" />
    },
    tie: {
      title: 'Tie / Dual Victory',
      subtitle: 'An equal match! You both fought to a standstill.',
      textColor: 'text-[#fbfb7a]',
      glowColor: 'shadow-[#fbfb7a]/10 border-[#fbfb7a]/30 bg-[#fbfb7a]/5',
      icon: <Users size={42} className="text-[#fbfb7a]" />
    },
    defeat: {
      title: 'Defeat',
      subtitle: 'Gg! Study your opponent\'s code and fight again.',
      textColor: 'text-brand-red',
      glowColor: 'shadow-[#FF2E2E]/10 border-[#FF2E2E]/30 bg-[#FF2E2E]/5',
      icon: <Flame size={42} className="text-danger animate-pulse" />
    }
  }[resultType];

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
          <p className="text-xs md:text-sm text-[#c9c7ba]/65 leading-relaxed max-w-sm mb-8">
            {config.subtitle}
          </p>

          {/* Scores details */}
          <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-white/[0.05] py-6 mb-8">
            {/* Host Stats */}
            <div className="flex flex-col items-center">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#c9c7ba]/35 mb-2">Host</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-white text-sm font-black border border-white/10 mb-2 uppercase">
                {hostProfile?.photoURL ? (
                  <img src={hostProfile.photoURL} alt={hostProfile?.displayName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  hostProfile?.displayName?.slice(0, 2) || 'H'
                )}
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wide">
                {hostProfile?.displayName || 'Host'}
              </span>
              <span className="text-lg font-mono-code font-black text-white/90 mt-1">
                {room.hostScore ?? 0} <span className="text-xs text-[#c9c7ba]/30 font-sans">passed</span>
              </span>
            </div>

            {/* Guest Stats */}
            <div className="flex flex-col items-center">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#c9c7ba]/35 mb-2">Guest</span>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fbfb7a]/20 to-[#c9c7ba]/20 flex items-center justify-center text-[#fbfb7a] text-sm font-black border border-[#fbfb7a]/20 mb-2 uppercase">
                {guestProfile?.photoURL ? (
                  <img src={guestProfile.photoURL} alt={guestProfile?.displayName} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  guestProfile?.displayName?.slice(0, 2) || 'G'
                )}
              </div>
              <span className="text-xs font-black text-white uppercase tracking-wide">
                {guestProfile?.displayName || 'Guest'}
              </span>
              <span className="text-lg font-mono-code font-black text-white/90 mt-1">
                {room.guestScore ?? 0} <span className="text-xs text-[#c9c7ba]/30 font-sans">passed</span>
              </span>
            </div>
          </div>

          {/* Problem Info */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs text-[#c9c7ba]/50 font-bold uppercase">
            <Star size={13} className="text-[#fbfb7a]" />
            <span>Problem ID: {room.problemId}</span>
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
