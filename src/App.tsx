import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Gamepad2, Zap, Clock, Plus, RefreshCw, Home, Search, X, Loader2 } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AccountCard from './components/AccountCard';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";

const chartData = [
  { time: '0m', xp: 0 }, { time: '5m', xp: 0 },
  { time: '10m', xp: 0 }, { time: '15m', xp: 0 },
];

function App() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  const [uid, setUid] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "accounts"), (snapshot) => {
      const accountsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      setAccounts(accountsData);
      setIsLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  const handleAddAccount = async () => {
    if (!nickname || !uid) {
      alert("Kripya Nickname aur UID dono bharein!");
      return;
    }
    try {
      await addDoc(collection(db, "accounts"), {
        nickname: nickname,
        uid: uid,
        status: 'ONLINE',
        created: 'Just now',
        played: 0,
        createdAt: new Date()
      });
      setNickname('');
      setUid('');
      setIsModalOpen(false);
    } catch (error) {
      alert("Account add nahi ho paya. Internet check karein!");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Kya aap is account ko delete karna chahte hain?")) {
      try {
        await deleteDoc(doc(db, "accounts", id));
      } catch (error) {
        alert("Delete nahi ho paya!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 max-w-7xl mx-auto text-gray-800 font-sans relative">
      
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Home className="text-gray-400" size={20} />
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-green-500 text-[10px] font-bold border border-green-200 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> LIVE
            </span>
            <span className="font-bold text-xs tracking-wide text-gray-900">ARPIT | Mini Militia XP Bot</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm hover:bg-gray-50 transition"><RefreshCw size={12} /> Refresh</button>
          <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md shadow-purple-200 transition"><Plus size={12} /> Add Account</button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-400 font-bold tracking-wider">● LIVE UPDATES</span>
      </div>

      {/* Top Stats */}
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
        <StatsCard icon={<Users size={16} />} title="TOTAL ACCOUNTS" value={accounts.length.toString()} subtext={`${accounts.filter(a => a.status === 'ONLINE').length} online`} color="text-pink-500" bgColor="bg-pink-50" />
        <StatsCard icon={<Gamepad2 size={16} />} title="MATCHES PLAYED" value="0" subtext="~0 / hour" color="text-blue-500" bgColor="bg-blue-50" />
        <StatsCard icon={<Zap size={16} />} title="XP EARNED" value="+0" subtext="~0 XP / hr" color="text-red-500" bgColor="bg-red-50" />
        <StatsCard icon={<Clock size={16} />} title="SYSTEM UPTIME" value="00:00:00" subtext="0 accounts running" color="text-purple-500" bgColor="bg-purple-50" />
      </div>

      {/* Live Graph */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.03)] mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-wider">TOTAL XP GAINED</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">+0</span>
              <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100 font-semibold">+0 in the last 0s</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0f111a] rounded-xl p-4 h-56 w-full relative">
          <div className="absolute top-4 left-4 bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
              <Area type="monotone" dataKey="xp" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-wider flex items-center gap-2"><Users size={14}/> ACCOUNTS</h3>
        <div className="relative flex-1 md:flex-none">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search UID or nickname..." className="bg-white text-gray-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 w-full md:w-64 shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-200">
            <Loader2 className="animate-spin text-purple-600 mx-auto mb-2" size={24} />
            <p className="text-gray-400 text-xs font-bold">Loading accounts from database...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-400 text-sm font-bold">No accounts added yet.</p>
            <p className="text-gray-400 text-xs mt-1">Click "Add Account" to start farming XP.</p>
          </div>
        ) : (
          accounts.map(acc => (
            <AccountCard key={acc.id} account={acc} onDelete={() => handleDeleteAccount(acc.id)} />
          ))
        )}
      </div>

      {/* ADD ACCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Mini Militia Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Nickname</label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. ArpitPro" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-purple-500 text-gray-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Player ID / UID</label>
                <input 
                  type="text" 
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. 12345678" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-purple-500 text-gray-900"
                />
              </div>
              <button 
                onClick={handleAddAccount}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-purple-200 mt-2"
              >
                SAVE ACCOUNT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
