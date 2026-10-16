import { useState } from 'react';
import { Users, Gamepad2, Zap, Clock, Plus, Swords, Crosshair, Play } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AccountCard from './components/AccountCard';

const dummyAccounts = [
  { id: 1, nickname: 'Power4m2c8g', uid: '18742319399', level: 9, currentExp: 1075, maxExp: 1134, needExp: 59 },
  { id: 2, nickname: 'BD-Flex55796', uid: '18743820173', level: 9, currentExp: 997, maxExp: 1134, needExp: 227 },
  { id: 3, nickname: 'BD-Flex16768', uid: '18743929462', level: 9, currentExp: 1110, maxExp: 1134, needExp: 24 },
  { id: 4, nickname: '@Apx-Flex!!', uid: '18737676129', level: 9, currentExp: 850, maxExp: 1134, needExp: 284 },
];

function App() {
  const [selected, setSelected] = useState<any[]>([]);
  const [isSquadRunning, setIsSquadRunning] = useState(false);

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) setSelected(prev => prev.filter(i => i !== id));
    else if (selected.length < 4) setSelected(prev => [...prev, id]);
    else alert("Squad mein sirf 4 accounts hi aa sakte hain!");
  };

  const startSquad = () => {
    if (selected.length !== 4) return alert("Exactly 4 accounts select karein!");
    setIsSquadRunning(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] relative overflow-x-hidden p-4 max-w-7xl mx-auto text-white">
      
      {/* Background Neon Glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span className="text-green-400 text-[10px] font-bold border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
            </span>
            <span className="font-bold text-sm tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
              GUILD GLORY BOT
            </span>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-[0_0_15px_rgba(236,72,153,0.5)]">
            <Plus size={14} /> ADD
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatsCard icon={<Users size={18} />} title="SQUAD" value="4/4" subtext="Ready" color="bg-pink-500 text-pink-500 shadow-[0_0_10px_#ec4899]" />
          <StatsCard icon={<Gamepad2 size={18} />} title="MATCHES" value="42" subtext="Today" color="bg-blue-500 text-blue-500 shadow-[0_0_10px_#3b82f6]" />
          <StatsCard icon={<Zap size={18} />} title="GLORY" value="+12,450" subtext="Earned" color="bg-red-500 text-red-500 shadow-[0_0_10px_#ef4444]" />
          <StatsCard icon={<Clock size={18} />} title="UPTIME" value="04:12:30" subtext="Running" color="bg-purple-500 text-purple-500 shadow-[0_0_10px_#a855f7]" />
        </div>

        {/* Squad Sync Panel */}
        <div className="bg-white/5 backdrop-blur-lg p-5 rounded-2xl border border-purple-500/50 mb-6 shadow-[0_0_30px_rgba(168,85,247,0.2)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
          
          <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-purple-400 text-sm font-bold flex items-center gap-2 tracking-wider drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]">
              <Swords size={16} /> SQUAD SYNC
            </h3>
            {!isSquadRunning ? (
              <button onClick={startSquad} disabled={selected.length !== 4} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${selected.length === 4 ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.6)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}>
                <Play size={14} /> START ({selected.length}/4)
              </button>
            ) : (
              <button onClick={() => { setIsSquadRunning(false); setSelected([]); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.6)] transition-all">STOP</button>
            )}
          </div>

          {isSquadRunning && (
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 relative z-10">
              <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                STATUS: IN LOBBY
              </span>
              <div className="grid grid-cols-4 gap-2 mt-4">
                {selected.map((id, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-xl border border-purple-500/30 text-center shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    <Crosshair size={18} className="text-pink-400 mx-auto mb-2 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]" />
                    <p className="text-[9px] text-white font-bold truncate">{dummyAccounts.find(a => a.id === id)?.nickname}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Accounts List */}
        <h3 className="text-gray-400 text-xs font-bold mb-4 tracking-widest uppercase">Select 4 Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyAccounts.map(acc => (
            <AccountCard key={acc.id} account={acc} isSelected={selected.includes(acc.id)} onSelect={() => toggleSelect(acc.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
