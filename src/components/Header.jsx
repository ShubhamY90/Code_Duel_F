import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Sword } from 'lucide-react';
import BattlePreview from './BattlePreview';

export default function Header({ onStartDuel }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [matchType, setMatchType] = useState('private'); // 'private' | 'public'
  const [privateAction, setPrivateAction] = useState('create'); // 'create' | 'join'
  const [joinCode, setJoinCode] = useState('');

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

  return (
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
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${matchType === 'private'
                ? 'bg-[#29292B] text-white border border-white/[0.05] shadow'
                : 'text-[#c9c7ba]/40 hover:text-[#c9c7ba]/70'
                }`}
            >
              Private Duel
            </button>
            <button
              onClick={() => user ? navigate('/matchmaking') : navigate('/auth')}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${matchType === 'public'
                ? 'bg-[#29292B] text-white border border-white/[0.05] shadow'
                : 'text-[#c9c7ba]/40 hover:text-[#c9c7ba]/70'
                }`}
            >
              Public Arena
            </button>
          </div>

          {/* Private Sub-options (Create vs Join) */}
          {matchType === 'private' && (
            <div className="w-full max-w-sm glass-card rounded-2xl p-5 border border-[#c9c7ba]/15 mb-8 animate-scale-up">
              {/* Create vs Join Sub-toggle */}
              <div className="flex bg-[#1e1e20] p-0.5 rounded-lg mb-5 border border-white/[0.02]">
                <button
                  onClick={() => setPrivateAction('create')}
                  className={`flex-1 text-center py-1.5 text-[0.65rem] font-extrabold uppercase tracking-widest rounded-md transition-all ${privateAction === 'create'
                    ? 'bg-[#29292B] text-[#fbfb7a] shadow border border-white/[0.02]'
                    : 'text-[#c9c7ba]/40 hover:text-[#c9c7ba]/70'
                    }`}
                >
                  Create Room
                </button>
                <button
                  onClick={() => setPrivateAction('join')}
                  className={`flex-1 text-center py-1.5 text-[0.65rem] font-extrabold uppercase tracking-widest rounded-md transition-all ${privateAction === 'join'
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
                    onClick={onStartDuel}
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
        <BattlePreview />

      </div>
    </main>
  );
}
