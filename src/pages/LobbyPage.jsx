import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Plus, Lock, Globe, ChevronRight, Zap, Hash, Search, X, Loader2 } from 'lucide-react';

const ROOMS = [
  { id: 'room-1', name: 'Algorithm Arena', host: 'devknight', players: 1, max: 2, time: '30 min', difficulty: 'Medium', topic: 'Graphs', status: 'waiting', public: true, hostRating: 2418 },
  { id: 'room-2', name: 'Speed Coders Den', host: 'flash_dev', players: 1, max: 2, time: '15 min', difficulty: 'Easy', topic: 'Arrays', status: 'waiting', public: true, hostRating: 2301 },
  { id: 'room-3', name: 'Hard Mode Only', host: 'leetmaster', players: 2, max: 2, time: '60 min', difficulty: 'Hard', topic: 'DP', status: 'active', public: true, hostRating: 2195 },
  { id: 'room-4', name: 'Binary Blitz', host: 'nullptr', players: 1, max: 2, time: '20 min', difficulty: 'Medium', topic: 'Trees', status: 'waiting', public: false, hostRating: 2088 },
  { id: 'room-5', name: 'Graph Gang', host: 'algo_pro', players: 1, max: 2, time: '45 min', difficulty: 'Hard', topic: 'Graphs', status: 'waiting', public: true, hostRating: 1994 },
];

const DURATIONS = ['10 min', '15 min', '20 min', '30 min', '45 min', '60 min'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Random'];

const DIFF_CONFIG = {
  Easy: { color: 'text-brand-green border-brand-green/20 bg-brand-green/5', rawColor: '#00b894' },
  Medium: { color: 'text-brand-amber border-brand-amber/20 bg-brand-amber/5', rawColor: '#f1c40f' },
  Hard: { color: 'text-brand-red border-brand-red/20 bg-brand-red/5', rawColor: '#d63031' },
  Random: { color: 'text-brand-violet border-brand-violet/20 bg-brand-violet/5', rawColor: '#a29bfe' },
};

export default function LobbyPage() {
  const navigate = useNavigate();
  
  // App States
  const [username, setUsername] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form States for creation
  const [roomName, setRoomName] = useState('');
  const [duration, setDuration] = useState('30 min');
  const [difficulty, setDifficulty] = useState('Medium');
  const [isPrivate, setIsPrivate] = useState(false);

  // Quick matchmaking simulation
  useEffect(() => {
    let timeout = null;
    if (isSearching) {
      timeout = setTimeout(() => {
        setIsSearching(false);
        navigate('/duel', { 
          state: { 
            username: username || 'Anonymous',
            opponent: { name: 'devknight' },
            problemId: 'two-sum'
          } 
        });
      }, 3000);
    }
    return () => { if (timeout) clearTimeout(timeout); };
  }, [isSearching, username, navigate]);

  const filtered = ROOMS.filter(r => {
    if (filter === 'waiting' && r.status !== 'waiting') return false;
    if (filter === 'public' && !r.public) return false;
    if (filter === 'private' && r.public) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.host.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleJoin = (room) => {
    if (room.status === 'active') return;
    navigate('/duel', { state: { room, username: username || 'Anonymous', problemId: 'two-sum' } });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    setIsDrawerOpen(false);
    navigate('/duel', { 
      state: { 
        room: { name: roomName || 'My Room', time: duration, difficulty }, 
        username: username || 'Anonymous', 
        isHost: true,
        problemId: 'two-sum'
      } 
    });
  };

  return (
    <div className="min-h-screen bg-bg-space text-white flex flex-col relative">
      
      {/* ── BACKGROUND ── */}
      <div className="fixed inset-0 z-0 pointer-events-none animate-fade-in" aria-hidden="true">
        <div className="orb w-[500px] h-[500px] bg-brand-purple opacity-[0.05] -top-20 -left-10" />
        <div className="orb w-[400px] h-[400px] bg-brand-pink opacity-[0.03] bottom-0 right-0" />
        <div className="grid-bg" />
      </div>

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-40 glass-nav">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-base font-black tracking-tight bg-transparent border-0 cursor-pointer text-white">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sword size={14} className="text-white" />
            </div>
            Code<span className="text-gradient-brand">Duel</span>
          </button>

          <div className="flex items-center gap-3">
            {/* Username Input */}
            <div className="flex items-center gap-2 bg-bg-panel border border-white/[0.05] rounded-xl px-3 py-1.5 focus-within:border-brand-purple/40 transition-colors">
              <Hash size={12} className="text-white/20" />
              <input
                id="username-input"
                type="text"
                placeholder="Coder handle…"
                value={username}
                onChange={e => setUsername(e.target.value)}
                maxLength={20}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-white/20 font-mono-code w-32 caret-brand-purple"
              />
            </div>

            {/* Quick Match Button */}
            <button
              id="quick-match-btn"
              onClick={() => setIsSearching(true)}
              className="btn-primary py-2 px-4 text-xs font-bold"
            >
              <Zap size={13} /> Quick Match
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex flex-col gap-8">
        
        {/* Live Stats Row (Decluttered) */}
        <section className="grid grid-cols-3 gap-4 bg-white/[0.01] border border-white/[0.03] rounded-2xl p-5 animate-fade-up">
          <div className="text-center border-r border-white/[0.04]">
            <div className="text-2xl font-black font-mono-code text-brand-purple">847</div>
            <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">Online</div>
          </div>
          <div className="text-center border-r border-white/[0.04]">
            <div className="text-2xl font-black font-mono-code text-brand-green">23</div>
            <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">Active Duels</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black font-mono-code text-brand-amber">12</div>
            <div className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30 mt-1">Waiting Rooms</div>
          </div>
        </section>

        {/* Browser Area */}
        <div className="flex flex-col gap-5 flex-1 min-h-0 animate-fade-up" style={{ animationDelay: '0.08s' }}>
          
          {/* Filters, Search & Creation Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Search & Filters */}
            <div className="flex items-center gap-3 flex-wrap flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 bg-bg-panel border border-white/[0.05] rounded-xl px-3 py-2 flex-1 max-w-xs focus-within:border-brand-purple/40 transition-colors">
                <Search size={13} className="text-white/20 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search active rooms…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-white/20 w-full caret-brand-purple"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center gap-1">
                {['all', 'waiting', 'public', 'private'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-[0.65rem] font-bold border capitalize transition-all ${
                      filter === f
                        ? 'bg-brand-purple/10 border-brand-purple/40 text-brand-violet'
                        : 'border-white/[0.04] text-white/30 hover:border-white/10 hover:text-white/60'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Room Button */}
            <button 
              id="create-room-trigger"
              onClick={() => setIsDrawerOpen(true)}
              className="btn-secondary py-2 px-4 text-xs font-bold"
            >
              <Plus size={14} /> Create Custom Room
            </button>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-20 text-white/20 bg-bg-panel/40 border border-white/[0.03] rounded-2xl">
                <Globe size={32} className="mx-auto mb-3 opacity-20" />
                <p className="text-xs font-semibold">No active matchmaking rooms found.</p>
              </div>
            ) : (
              filtered.map(room => {
                const diff = DIFF_CONFIG[room.difficulty] || DIFF_CONFIG.Medium;
                const isFull = room.players >= room.max;
                return (
                  <div 
                    key={room.id}
                    onClick={() => handleJoin(room)}
                    className={`glass-card rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 relative ${
                      room.status === 'active' || isFull 
                        ? 'opacity-40 cursor-not-allowed border-white/[0.02]' 
                        : 'cursor-pointer hover:-translate-y-1'
                    }`}
                  >
                    <div>
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 truncate">
                          {room.public ? (
                            <Globe size={11} className="text-white/20 flex-shrink-0" />
                          ) : (
                            <Lock size={11} className="text-white/20 flex-shrink-0" />
                          )}
                          <h3 className="font-bold text-sm text-white/90 truncate">{room.name}</h3>
                        </div>
                        <span className={`text-[0.55rem] font-bold px-2 py-0.5 rounded-full ${
                          room.status === 'active' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-amber/10 text-brand-amber'
                        }`}>
                          {room.status === 'active' ? 'Live' : 'Waiting'}
                        </span>
                      </div>

                      {/* Room Details */}
                      <div className="text-[0.65rem] text-white/30 mb-4 flex items-center justify-between">
                        <span>Host: <strong className="text-white/60 font-semibold">@{room.host}</strong></span>
                        <span className="text-brand-purple/75 font-mono-code font-bold">★ {room.hostRating}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex items-center gap-1.5 flex-wrap mb-4">
                        <span className={`text-[0.55rem] font-bold px-2 py-0.5 border rounded-full ${diff.color}`}>{room.difficulty}</span>
                        <span className="text-[0.55rem] font-bold px-2 py-0.5 bg-white/[0.03] border border-white/[0.04] text-white/50 rounded-full">{room.topic}</span>
                        <span className="text-[0.55rem] font-bold px-2 py-0.5 bg-white/[0.03] border border-white/[0.04] text-white/50 rounded-full">{room.time}</span>
                      </div>
                    </div>

                    {/* Bottom Status / Actions */}
                    <div>
                      <div className="flex justify-between items-center text-[0.65rem] text-white/30 mb-3">
                        <span>Slots Filled</span>
                        <span>{room.players} / {room.max}</span>
                      </div>
                      
                      {/* Tiny visual progress bar */}
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-gradient-brand rounded-full transition-all duration-300" style={{ width: `${(room.players / room.max) * 100}%` }} />
                      </div>

                      <div className="flex justify-end">
                        {room.status !== 'active' && !isFull && (
                          <button 
                            id={`join-${room.id}`}
                            onClick={e => { e.stopPropagation(); handleJoin(room); }}
                            className="btn-primary py-1.5 px-3.5 text-[0.65rem] font-bold"
                          >
                            Join Arena <ChevronRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* ── CREATE ROOM DRAWER ── */}
      {isDrawerOpen && (
        <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}>
          <div className="drawer-content" onClick={e => e.stopPropagation()}>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/[0.04] mb-6">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Plus size={18} className="text-brand-purple" />
                <span>Create Room</span>
              </h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg border border-white/[0.04] text-white/30 hover:text-white transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="flex flex-col gap-6 flex-1">
              
              {/* Room Name Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Room Title</label>
                <input
                  id="room-name-input"
                  type="text"
                  placeholder="e.g. Algorithm Arena"
                  value={roomName}
                  onChange={e => setRoomName(e.target.value)}
                  required
                  className="bg-bg-panel border border-white/[0.06] rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 outline-none focus:border-brand-purple/40 transition-colors font-mono-code caret-brand-purple"
                />
              </div>

              {/* Duration Choice */}
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Duel Duration</label>
                <div className="flex flex-wrap gap-1.5">
                  {DURATIONS.map(d => (
                    <button 
                      key={d} 
                      type="button" 
                      onClick={() => setDuration(d)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        duration === d
                          ? 'bg-brand-purple/10 border-brand-purple/40 text-brand-violet'
                          : 'border-white/[0.04] text-white/30 hover:border-white/10 hover:text-white/60'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Choice */}
              <div className="flex flex-col gap-3">
                <label className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white/30">Difficulty Level</label>
                <div className="flex flex-wrap gap-1.5">
                  {DIFFICULTIES.map(d => {
                    const active = difficulty === d;
                    return (
                      <button 
                        key={d} 
                        type="button" 
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          active
                            ? 'bg-brand-purple/10 border-brand-purple/40 text-brand-violet'
                            : 'border-white/[0.04] text-white/30 hover:border-white/10 hover:text-white/60'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Private Toggle */}
              <div className="flex items-center justify-between p-4 bg-bg-panel border border-white/[0.04] rounded-xl mt-2">
                <div>
                  <p className="text-xs font-bold text-white/70 mb-0.5">Private Match</p>
                  <p className="text-[0.65rem] text-white/25">Invite-only room access</p>
                </div>
                <button
                  type="button"
                  id="private-toggle"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`relative w-10 h-5.5 rounded-full transition-all duration-200 ${
                    isPrivate ? 'bg-brand-purple' : 'bg-white/10'
                  }`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${isPrivate ? 'translate-x-4.5' : ''}`} />
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="create-room-btn"
                className="btn-primary py-3.5 text-xs font-bold w-full mt-auto"
              >
                <Sword size={14} /> Create Room &amp; Start Duel
              </button>

            </form>
          </div>
        </div>
      )}

      {/* ── MATCHMAKING RADAR OVERLAY ── */}
      {isSearching && (
        <div className="fixed inset-0 z-50 bg-[#030307]/90 backdrop-blur-md flex items-center justify-center animate-fade-in">
          <div className="text-center flex flex-col items-center gap-6">
            
            {/* Radar Pulse Effect */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-brand-purple/30 bg-brand-purple/5 animate-radar-pulse" />
              <div className="absolute inset-0 rounded-full border border-brand-purple/20 bg-brand-purple/5 animate-radar-pulse" style={{ animationDelay: '0.7s' }} />
              <div className="absolute inset-0 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 animate-radar-pulse" style={{ animationDelay: '1.4s' }} />
              <div className="w-16 h-16 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-brand-purple/30 z-10 animate-bounce">
                <Sword size={26} className="text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight mb-2">Finding Opponent</h2>
              <p className="text-xs text-white/30 font-mono-code flex items-center justify-center gap-1.5">
                <Loader2 size={12} className="animate-spin text-brand-purple" /> Searching Glicko-2 range ±120...
              </p>
            </div>

            <button 
              onClick={() => setIsSearching(false)} 
              className="btn-outline px-6 py-2 text-xs"
            >
              Cancel Match
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
