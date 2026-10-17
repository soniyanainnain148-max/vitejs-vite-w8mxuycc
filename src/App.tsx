import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, DollarSign, Activity, Plus, RefreshCw, Home, Search, X, Loader2, Bot } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AccountCard from './components/AccountCard';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

const chartData = [
  { time: '0m', sales: 0 }, { time: '5m', sales: 0 },
  { time: '10m', sales: 0 }, { time: '15m', sales: 0 },
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
      alert("Kripya Store Name aur Bot Token dono bharein!");
      return;
    }
    try {
      await addDoc(collection(db, "accounts"), {
        nickname: nickname,
        uid: uid, // Yahan Bot Token save hoga
        status: 'STOPPED',
        created: 'Just now',
        played: 0, // Orders
        xpEarned: 0, // Revenue
        createdAt: new Date()
      });
      setNickname('');
      setUid('');
      setIsModalOpen(false);
    } catch (error) {
      alert("Store add nahi ho paya. Internet check karein!");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Kya aap is store ko delete karna chahte hain?")) {
      try {
        await deleteDoc(doc(db, "accounts", id));
      } catch (error) {
        alert("Delete nahi ho paya!");
      }
    }
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "accounts", id), {
        status: newStatus
      });
    } catch (error) {
      alert("Status update nahi ho paya!");
    }
  };

  // Business Stats Calculate Karein
  const totalStores = accounts.length;
  const onlineBots = accounts.filter(a => a.status === 'RUNNING').length;
  const totalOrders = accounts.reduce((sum, a) => sum + (a.played || 0), 0);
  const totalRevenue = accounts.reduce((sum, a) => sum + (a.xpEarned || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 max-w-7xl mx-auto text-gray-800 font-sans relative">
      
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Home className="text-gray-400" size={20} />
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-blue-500 text-[10px] font-bold border border-blue-200 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span> LIVE
            </span>
            <span className="font-bold text-xs tracking-wide text-gray-900">ARPIT | Telegram Store Manager</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm hover:bg-gray-50 transition"><RefreshCw size={12} /> Refresh</button>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md shadow-blue-200 transition"><Plus size={12} /> Add Store</button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-400 font-bold tracking-wider">● DASHBOARD UPDATES</span>
      </div>

      {/* Top Stats */}
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
        <StatsCard icon={<Bot size={16} />} title="TOTAL STORES" value={totalStores.toString()} subtext={`${onlineBots} bots online`} color="text-pink-500" bgColor="bg-pink-50" />
        <StatsCard icon={<ShoppingBag size={16} />} title="TOTAL ORDERS" value={totalOrders.toString()} subtext="~0 / hour" color="text-orange-500" bgColor="bg-orange-50" />
        <StatsCard icon={<DollarSign size={16} />} title="TOTAL REVENUE" value={`₹${totalRevenue}`} subtext="~₹0 / hr" color="text-green-500" bgColor="bg-green-50" />
        <StatsCard icon={<Activity size={16} />} title="SERVER UPTIME" value="99.9%" subtext="All systems normal" color="text-blue-500" bgColor="bg-blue-50" />
      </div>

      {/* Live Graph (Revenue) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.03)] mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-wider">REVENUE OVERVIEW</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">₹{totalRevenue}</span>
              <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100 font-semibold">+₹0 today</span>
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
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
              <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stores Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-wider flex items-center gap-2"><Users size={14}/> YOUR STORES</h3>
        <div className="relative flex-1 md:flex-none">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search store name..." className="bg-white text-gray-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 w-full md:w-64 shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-200">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-gray-400 text-xs font-bold">Loading stores...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-400 text-sm font-bold">No stores added yet.</p>
            <p className="text-gray-400 text-xs mt-1">Click "Add Store" to connect a Telegram Bot.</p>
          </div>
        ) : (
          accounts.map(acc => (
            <AccountCard 
              key={acc.id} 
              account={acc} 
              onDelete={() => handleDeleteAccount(acc.id)}
              onToggle={handleToggleStatus}
            />
          ))
        )}
      </div>

      {/* ADD STORE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Connect Telegram Bot</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Store Name</label>
                <input 
                  type="text" 
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. Arpit Fashion Store" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Telegram Bot Token</label>
                <input 
                  type="text" 
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  placeholder="e.g. 123456:ABC-DEF..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-900"
                />
              </div>
              <button 
                onClick={handleAddAccount}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-blue-200 mt-2"
              >
                CONNECT BOT
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
