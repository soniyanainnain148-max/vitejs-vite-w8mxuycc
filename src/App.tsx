import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Package, Link as LinkIcon, Settings, Plus, Home, X, Loader2, Wand2, TrendingUp, Copy, Check } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AccountCard from './components/AccountCard';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, writeBatch } from "firebase/firestore";

const chartData = [
  { day: 'Mon', sales: 500 }, { day: 'Tue', sales: 1200 },
  { day: 'Wed', sales: 900 }, { day: 'Thu', sales: 2400 },
  { day: 'Fri', sales: 1900 }, { day: 'Sat', sales: 3500 },
  { day: 'Sun', sales: 5000 },
];

const demoProducts = [
  { nickname: 'FF Pro Wallpapers Pack', category: 'Wallpapers', price: 49, status: 'ACTIVE' },
  { nickname: 'BGMI Sensitivity Guide', category: 'E-Book', price: 99, status: 'ACTIVE' },
  { nickname: 'CapCut Viral Templates', category: 'Templates', price: 149, status: 'DRAFT' },
];

const savedLinks = [
  { title: 'Firebase Console', url: 'https://console.firebase.google.com' },
  { title: 'Vercel Dashboard', url: 'https://vercel.com/dashboard' },
  { title: 'My Telegram Channel', url: 'https://t.me/yourchannel' },
  { title: 'GitHub Repository', url: 'https://github.com/yourrepo' },
];

function App() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, links
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
      setIsLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  const loadDemoData = async () => {
    setIsDemoLoading(true);
    try {
      const batch = writeBatch(db);
      demoProducts.forEach((p) => {
        const newDocRef = doc(collection(db, "products"));
        batch.set(newDocRef, { ...p, createdAt: new Date() });
      });
      await batch.commit();
      alert("Demo Products Loaded!");
    } catch (error) { alert("Error!"); }
    setIsDemoLoading(false);
  };

  const handleAddProduct = async () => {
    if (!title || !price) return alert("Title aur Price bharein!");
    try {
      await addDoc(collection(db, "products"), {
        nickname: title, category: category || 'Digital Product',
        price: Number(price), status: 'ACTIVE', createdAt: new Date()
      });
      setTitle(''); setCategory(''); setPrice(''); setIsModalOpen(false);
    } catch (error) { alert("Error adding product!"); }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product?")) await deleteDoc(doc(db, "products", id));
  };

  const handleToggle = async (id: string, newStatus: string) => {
    await updateDoc(doc(db, "products", id), { status: newStatus });
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'ACTIVE').length;
  const totalRevenue = products.filter(p => p.status === 'ACTIVE').reduce((sum, p) => sum + (p.price || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR (Navigation) */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-row md:flex-col justify-between md:justify-start sticky top-0 md:h-screen z-40 overflow-x-auto md:overflow-hidden shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2 hidden md:flex">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="font-bold text-sm tracking-wide text-gray-900">ARPIT | HUB</span>
          </div>
          
          <div className="flex md:flex-col gap-2">
            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <LayoutDashboard size={16} /> Overview
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'products' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <Package size={16} /> Products
            </button>
            <button onClick={() => setActiveTab('links')} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'links' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}>
              <LinkIcon size={16} /> Quick Links
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* TOP HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Home className="text-gray-400" size={20} />
            <h1 className="font-bold text-lg text-gray-900 capitalize">{activeTab}</h1>
          </div>
          {activeTab === 'products' && (
            <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md transition">
              <Plus size={14} /> Add Product
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
              <StatsCard icon={<Package size={16} />} title="TOTAL PRODUCTS" value={totalProducts.toString()} subtext={`${activeProducts} active`} color="text-indigo-500" bgColor="bg-indigo-50" />
              <StatsCard icon={<TrendingUp size={16} />} title="POTENTIAL REVENUE" value={`₹${totalRevenue}`} subtext="If all sold" color="text-green-500" bgColor="bg-green-50" />
              <StatsCard icon={<LinkIcon size={16} />} title="QUICK LINKS" value={savedLinks.length.toString()} subtext="Saved shortcuts" color="text-blue-500" bgColor="bg-blue-50" />
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
              <h3 className="text-gray-400 text-[10px] font-bold tracking-wider mb-4">WEEKLY SALES OVERVIEW</h3>
              <div className="bg-[#0f111a] rounded-xl p-4 h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                    <Area type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {products.length === 0 && (
              <button onClick={loadDemoData} disabled={isDemoLoading} className="w-full bg-blue-50 text-blue-600 border border-blue-200 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                {isDemoLoading ? <Loader2 size={14} className="animate-spin"/> : <Wand2 size={14} />} Load Demo Data
              </button>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full text-center py-10"><Loader2 className="animate-spin mx-auto text-indigo-600 mb-2" /> Loading...</div>
              ) : products.length === 0 ? (
                <div className="col-span-full text-center py-10 bg-white rounded-2xl border border-gray-200 border-dashed">
                  <p className="text-gray-400 text-sm font-bold">No products added.</p>
                </div>
              ) : (
                products.map(p => (
                  <AccountCard key={p.id} account={p} onDelete={() => handleDelete(p.id)} onToggle={handleToggle} />
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUICK LINKS */}
        {activeTab === 'links' && (
          <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedLinks.map((link, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-50 p-2 rounded-lg"><LinkIcon size={16} className="text-gray-500"/></div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{link.title}</h4>
                    <p className="text-[10px] text-gray-500 truncate w-40 md:w-64">{link.url}</p>
                  </div>
                </div>
                <button onClick={() => copyToClipboard(link.url, idx)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition">
                  {copiedIndex === idx ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ADD PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add New Product</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Product Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Pro Wallpaper Pack" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Category</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="E-book / Config" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Price (₹)</label>
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none text-gray-900" />
                </div>
              </div>
              <button onClick={handleAddProduct} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-md mt-2">
                SAVE PRODUCT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
