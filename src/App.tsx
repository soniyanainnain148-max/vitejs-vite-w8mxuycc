import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, Package, TrendingUp, Plus, Home, Search, X, Loader2, Store } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AccountCard from './components/AccountCard';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";

const chartData = [
  { day: 'Mon', sales: 500 }, { day: 'Tue', sales: 1200 },
  { day: 'Wed', sales: 800 }, { day: 'Thu', sales: 2400 },
  { day: 'Fri', sales: 1900 }, { day: 'Sat', sales: 3100 },
  { day: 'Sun', sales: 4500 },
];

function App() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form States
  const [accName, setAccName] = useState('');
  const [uid, setUid] = useState('');
  const [skins, setSkins] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "game_accounts"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAccounts(data);
      setIsLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  const handleAddAccount = async () => {
    if (!accName || !uid || !buyPrice || !sellPrice) return alert("Saari details bharein!");
    try {
      await addDoc(collection(db, "game_accounts"), {
        nickname: accName,
        uid: uid,
        skins: skins || 'Basic Account',
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        status: 'AVAILABLE',
        createdAt: new Date()
      });
      setAccName(''); setUid(''); setSkins(''); setBuyPrice(''); setSellPrice(''); setIsModalOpen(false);
    } catch (error) {
      alert("Error adding account!");
    }
  };

  const handleDeleteAccount = async (id: string) => {
    if (window.confirm("Delete this account?")) await deleteDoc(doc(db, "game_accounts", id));
  };

  const handleToggleStatus = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "game_accounts", id), { status: newStatus });
  };

  // Stats calculate
  const totalStock = accounts.length;
  const availableStock = accounts.filter(a => a.status === 'AVAILABLE').length;
  const soldStock = accounts.filter(a => a.status === 'SOLD').length;
  
  // Profit calculate (sirf sold accounts ka)
  const totalProfit = accounts.filter(a => a.status === 'SOLD').reduce((sum, a) => sum + ((a.sellPrice || 0) - (a.buyPrice || 0)), 0);
  const totalInventoryValue = accounts.filter(a => a.status === 'AVAILABLE').reduce((sum, a) => sum + (a.sellPrice || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 max-w-7xl mx-auto text-gray-800 font-sans relative">
      
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Home className="text-gray-400" size={20} />
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-purple-500 text-[10px] font-bold border border-purple-200 bg-purple-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Store size={10}/> STORE
            </span>
            <span className="font-bold text-xs tracking-wide text-gray-900">ARPIT | Account Reseller</span>
          </div>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md shadow-purple-200 transition">
          <Plus size={14} /> Add Account
        </button>
      </div>

      {/* Top Stats */}
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
        <StatsCard icon={<Package size={16} />} title="TOTAL STOCK" value={totalStock.toString()} subtext={`${availableStock} available`} color="text-purple-500" bgColor="bg-purple-50" />
        <StatsCard icon={<DollarSign size={16} />} title="INVENTORY VALUE" value={`₹${totalInventoryValue}`} subtext="Current stock" color="text-blue-500" bgColor="bg-blue-50" />
        <StatsCard icon={<TrendingUp size={16} />} title="TOTAL PROFIT" value={`₹${totalProfit}`} subtext={`${soldStock} sold`} color="text-green-500" bgColor="bg-green-50" />
        <StatsCard icon={<Users size={16} />} title="CUSTOMERS" value={soldStock.toString()} subtext="Happy buyers" color="text-orange-500" bgColor="bg-orange-50" />
      </div>

      {/* Sales Graph */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-wider">WEEKLY SALES</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">₹{totalProfit}</span>
              <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100 font-semibold">+25% from last week</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0f111a] rounded-xl p-4 h-56 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
              <Area type="monotone" dataKey="sales" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Accounts List */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-wider flex items-center gap-2"><Store size={14}/> ACCOUNT INVENTORY</h3>
        <div className="relative flex-1 md:flex-none">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search UID..." className="bg-white text-gray-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 w-full md:w-64 shadow-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-1 md:col-span-2 text-center py-10">
            <Loader2 className="animate-spin text-purple-600 mx-auto mb-2" size={24} />
            <p className="text-gray-400 text-xs font-bold">Loading inventory...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="col-span-1 md:col-span-2 text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
            <p className="text-gray-400 text-sm font-bold">No accounts in stock.</p>
            <p className="text-gray-400 text-xs mt-1">Click "Add Account" to list a new ID.</p>
          </div>
        ) : (
          accounts.map(acc => (
            <AccountCard key={acc.id} account={acc} onDelete={() => handleDeleteAccount(acc.id)} onToggle={handleToggleStatus} />
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Game Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Account Title</label>
                <input type="text" value={accName} onChange={(e) => setAccName(e.target.value)} placeholder="e.g. FF Level 70 ID" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Game UID</label>
                <input type="text" value={uid} onChange={(e) => setUid(e.target.value)} placeholder="e.g. 18742319399" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Rare Skins / Items</label>
                <input type="text" value={skins} onChange={(e) => setSkins(e.target.value)} placeholder="e.g. Evo AK, Mythic Dress" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Cost Price (₹)</label>
                  <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="500" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Selling Price (₹)</label>
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="800" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
              </div>
              <button onClick={handleAddAccount} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-md mt-2">
                ADD TO INVENTORY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
