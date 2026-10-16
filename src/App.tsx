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
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 bg-[#1a1d2d] px-4 py-2 rounded-xl border border-gray-800">
          <span className="text-green-400 text-xs font-bold border border-green-400/30 bg-green-400/10 px-2 py-0.5 rounded-full">● LIVE</span>
          <span className="font-bold text-sm">Guild Glory Bot</span>
        </div>
        <button className="bg-purple-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1"><Plus size={16} /> Add</button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatsCard icon={<Users size={18} />} title="SQUAD" value="4/4" subtext="Ready" color="bg-pink-500 text-pink-500" />
        <StatsCard icon={<Gamepad2 size={18} />} title="MATCHES" value="42" subtext="Today" color="bg-blue-500 text-blue-500" />
        <StatsCard icon={<Zap size={18} />} title="GLORY" value="+12,450" subtext="Earned" color="bg-red-500 text-red-500" />
        <StatsCard icon={<Clock size={18} />} title="UPTIME" value="04:12:30" subtext="Running" color="bg-purple-500 text-purple-500" />
      </div>

      <div className="bg-[#1a1d2d] p-5 rounded-2xl border border-purple-500/30 mb-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-purple-400 text-sm font-bold flex items-center gap-2"><Swords size={16} /> SQUAD SYNC</h3>
          {!isSquadRunning ? (
            <button onClick={startSquad} disabled={selected.length !== 4} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${selected.length === 4 ? 'bg-purple-600' : 'bg-gray-800 text-gray-500'}`}><Play size={14} /> START ({selected.length}/4)</button>
          ) : (
            <button onClick={() => { setIsSquadRunning(false); setSelected([]); }} className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600">STOP</button>
          )}
        </div>
        {isSquadRunning && (
          <div className="bg-gray-900/50 p-4 rounded-xl">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-400">STATUS: IN LOBBY</span>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {selected.map((id, i) => (
                <div key={i} className="bg-black/40 p-3 rounded-xl border border-gray-700 text-center">
                  <Crosshair size={18} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-[10px] text-white font-bold truncate">{dummyAccounts.find(a => a.id === id)?.nickname}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <h3 className="text-gray-400 text-sm font-medium mb-4">SELECT 4 ACCOUNTS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyAccounts.map(acc => <AccountCard key={acc.id} account={acc} isSelected={selected.includes(acc.id)} onSelect={() => toggleSelect(acc.id)} />)}
      </div>
    </div>
  );
}

export default App;
