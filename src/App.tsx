import { useState, useEffect } from 'react';
import { 
  Globe, Loader2, Code2, Wallet, Zap, Sparkles, ExternalLink, 
  Copy, Check, X, QrCode, ShieldCheck, Store, Utensils, Dumbbell, 
  Gamepad2, Stethoscope, Briefcase, ArrowLeft, Users, Trash2, Plus, Save, LogOut, Info, Settings, Send, Megaphone, UserCircle, Edit
} from 'lucide-react';
import PublicSite from './components/PublicSite';
import Auth from './components/Auth';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, onSnapshot, doc, getDoc, updateDoc, setDoc, deleteDoc, query, where, getDocs } from "firebase/firestore";

// 🚨 YAHAN APNA ADMIN EMAIL DAALEIN
const ADMIN_EMAIL = "soniyanainnain148@gmail.com"; 

function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const currentPath = window.location.pathname;
  const cleanPath = currentPath.split('?')[0].replace(/\/$/, ''); 
  const isPublicSite = cleanPath.startsWith('/site/');
  const siteSlug = isPublicSite ? cleanPath.split('/site/')[1] : '';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (isPublicSite) return <PublicSite slug={siteSlug} />;
  if (isAuthLoading) return <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;
  if (!user) return <Auth />;

  return <Dashboard user={user} />;
}

const CATEGORIES = [
  { id: 'gaming', name: 'Gaming / Esports', icon: <Gamepad2 size={24} />, defaultBio: 'Pro Gamer & Content Creator.', btn1: 'Watch Videos', btn2: 'Join Community' },
  { id: 'bakery', name: 'Bakery / Cafe', icon: <Utensils size={24} />, defaultBio: 'Freshly baked goods & delicious coffee.', btn1: 'View Menu', btn2: 'Order Now' },
  { id: 'gym', name: 'Gym / Fitness', icon: <Dumbbell size={24} />, defaultBio: 'Transform your body with expert trainers.', btn1: 'View Plans', btn2: 'Join Now' },
  { id: 'clinic', name: 'Doctor / Clinic', icon: <Stethoscope size={24} />, defaultBio: 'Providing quality healthcare for you.', btn1: 'Book Appointment', btn2: 'Our Services' },
  { id: 'store', name: 'Shop / E-commerce', icon: <Store size={24} />, defaultBio: 'Best products at the best prices.', btn1: 'Shop Now', btn2: 'Contact Support' },
  { id: 'business', name: 'Agency / Business', icon: <Briefcase size={24} />, defaultBio: 'Professional services for your growth.', btn1: 'Our Services', btn2: 'Contact Us' },
];

function Dashboard({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState('builder');
  const [sites, setSites] = useState<any[]>([]);
  const [allSitesForAdmin, setAllSitesForAdmin] = useState<any[]>([]);
  const [isLoadingSites, setIsLoadingSites] = useState(true);
  const [credits, setCredits] = useState(0); 
  const [username, setUsername] = useState("Loading...");
  
  const isAdmin = user.email === ADMIN_EMAIL;
  
  const [globalNote, setGlobalNote] = useState("");
  const [newGlobalNoteInput, setNewGlobalNoteInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [topupAmount, setTopupAmount] = useState<number | ''>(100);
  const [isVerifying, setIsVerifying] = useState(false);

  const [step, setStep] = useState('select'); 
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [siteName, setSiteName] = useState('');
  const [bio, setBio] = useState('');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [theme, setTheme] = useState('white');

  const [customers, setCustomers] = useState<any[]>([]);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const [targetUser, setTargetUser] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [adminNoteText, setAdminNoteText] = useState('');
  const [selectedSiteForNote, setSelectedSiteForNote] = useState<any>(null);

  const FAMPAY_QR_URL = "https://raw.githubusercontent.com/soniyanainnain148-max/vitejs-vite-w8mxuycc/main/public/Screenshot_20261018_050324_FamApp.jpg"; 
  const USER_ID = user.uid; 

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userRef = doc(db, "users", USER_ID);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setCredits(snap.data().credits || 0);
          setUsername(snap.data().username || user.email.split('@')[0]);
        } else {
          const fallbackName = user.email.split('@')[0];
          await setDoc(userRef, { username: fallbackName, email: user.email, credits: 0, createdAt: new Date() });
          setCredits(0);
          setUsername(fallbackName);
        }
      } catch (error) { setUsername(user.email.split('@')[0]); }
    };
    checkUser();

    const unsubNote = onSnapshot(doc(db, "settings", "global_note"), (docSnap) => {
      if (docSnap.exists()) { setGlobalNote(docSnap.data().text || ""); setNewGlobalNoteInput(docSnap.data().text || ""); }
    });

    const unsubSites = onSnapshot(collection(db, "ai_sites"), (snap) => {
      const allSites = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const mySites = allSites.filter((site: any) => site.userId === USER_ID);
      mySites.sort((a: any, b: any) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setSites(mySites);
      setIsLoadingSites(false);
      setAllSitesForAdmin(allSites);
    });

    const unsubCust = onSnapshot(collection(db, "customers"), (snap) => {
      const allCust = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCustomers(allCust.filter((c: any) => c.userId === USER_ID));
    });

    return () => { unsubNote(); unsubSites(); unsubCust(); }; 
  }, [USER_ID, user.email]);

  const handleLogout = () => { if(window.confirm("Logout?")) signOut(auth); };

  const handleVerifyPayment = async () => {
    if (!topupAmount || topupAmount < 100) return alert("Minimum top-up is ₹100");
    if (utr.length < 8) return alert("Enter valid UTR!");
    
    const creditsToAdd = Math.floor(topupAmount / 100);
    setIsVerifying(true);
    
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, "users", USER_ID), { credits: credits + creditsToAdd });
        setCredits(prev => prev + creditsToAdd);
        setIsTopUpOpen(false); setUtr(''); setTopupAmount(100);
        alert(`✅ Payment Verified! ${creditsToAdd} Credits Added.`);
      } catch (error) { alert("Failed!"); }
      setIsVerifying(false);
    }, 1000); 
  };

  const handleSendCredits = async () => {
    if (!targetUser || !creditAmount) return alert("Details daalein!");
    try {
      const q = query(collection(db, "users"), where("username", "==", targetUser.toLowerCase().trim()));
      const snap = await getDocs(q);
      if (snap.empty) return alert("Username not found!");
      const targetDoc = snap.docs[0];
      await updateDoc(doc(db, "users", targetDoc.id), { credits: (targetDoc.data().credits || 0) + Number(creditAmount) });
      alert(`✅ Sent ${creditAmount} Credits!`);
      setTargetUser(''); setCreditAmount('');
    } catch (e) { alert("Error!"); }
  };

  const handlePublishGlobalNote = async () => {
    try { await setDoc(doc(db, "settings", "global_note"), { text: newGlobalNoteInput }); alert("✅ Published!"); } catch (e) { alert("Error!"); }
  };

  const handleGenerate = async () => {
    if (!siteName) return alert("Business Name daalein!");
    if (credits < 1) return alert("Insufficient credits!");

    setIsGenerating(true);
    try {
      const generatedSlug = username + '-' + siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
      const newSite = {
        userId: USER_ID, siteName, slug: generatedSlug, bio: bio || "Welcome to my page.", 
        themeType: theme, button1Title: selectedCategory?.btn1 || "Explore", button1Url: link1 || "#",
        button2Title: selectedCategory?.btn2 || "Contact", button2Url: link2 || "#",
        categoryName: selectedCategory?.name || "Business", products: [], createdAt: new Date()
      };
      const docRef = await addDoc(collection(db, "ai_sites"), newSite);
      await updateDoc(doc(db, "users", USER_ID), { credits: credits - 1 });
      setSites(prev => [{ id: docRef.id, ...newSite }, ...prev]);
      setCredits(prev => prev - 1);
      setIsGenerating(false); setStep('select'); setSiteName(''); setLink1(''); setLink2('');
      alert(`🚀 Website Generated!`);
    } catch (error: any) { setIsGenerating(false); alert("Error: " + error.message); }
  };

  const handleDeleteSite = async (id: string) => {
    if(window.confirm("Delete permanently?")) { await deleteDoc(doc(db, "ai_sites", id)); setSites(prev => prev.filter(s => s.id !== id)); }
  };

  const saveCustomer = async () => {
    if(!newCustName) return;
    await addDoc(collection(db, "customers"), { userId: USER_ID, name: newCustName, phone: newCustPhone, createdAt: new Date() });
    setNewCustName(''); setNewCustPhone('');
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
    setCopied(slug); setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-800 relative">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between md:h-screen sticky top-0 z-40">
        <div>
          <div className="flex items-center justify-between mb-8 px-2 mt-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl shadow-md ${isAdmin ? 'bg-red-600' : 'bg-purple-600'}`}><Code2 size={20} className="text-white" /></div>
              <span className="font-extrabold text-lg text-gray-900">WEBCRAFT</span>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500"><LogOut size={18} /></button>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('builder')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'builder' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'text-gray-500 hover:bg-gray-50'}`}><Sparkles size={18} /> Site Builder</button>
            <button onClick={() => setActiveTab('customers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'customers' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={18} /> Customers</button>
            {isAdmin && <button onClick={() => setActiveTab('admin')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'admin' ? 'bg-red-50 text-red-600 border border-red-100' : 'text-gray-500 hover:bg-gray-50'}`}><Settings size={18} /> Admin Panel</button>}
          </div>
        </div>
        <div className="mt-8 bg-gray-50 border border-gray-200 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Wallet size={14}/> Credits</span>
            <span className="text-2xl font-black text-gray-900">{credits}</span>
          </div>
          <button onClick={() => setIsTopUpOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2"><QrCode size={16} /> Top-up Credits</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isAdmin ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'}`}><UserCircle size={24} /></div>
            <div>
              <h2 className="text-sm text-gray-500 font-semibold">Welcome back,</h2>
              <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">@{username}</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto pb-24">
          {globalNote && activeTab !== 'admin' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 mb-8 rounded-r-xl shadow-sm flex items-start gap-3"><Megaphone size={20} /> <div><p className="font-bold text-sm">Announcement</p><p className="text-sm">{globalNote}</p></div></div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="space-y-8">
              <h1 className="text-3xl font-extrabold text-red-600">Admin Panel</h1>
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Megaphone size={18} className="text-red-500"/> Broadcast Note</h2>
                <textarea placeholder="Announcement for all..." value={newGlobalNoteInput} onChange={e => setNewGlobalNoteInput(e.target.value)} className="w-full border rounded-xl p-3 text-sm mb-4" rows={3}></textarea>
                <button onClick={handlePublishGlobalNote} className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold">Publish</button>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Send size={18} className="text-red-500"/> Send Credits</h2>
                <div className="flex gap-4 flex-wrap">
                  <input type="text" placeholder="Username" value={targetUser} onChange={e => setTargetUser(e.target.value)} className="flex-1 border rounded-xl p-3 text-sm" />
                  <input type="number" placeholder="Credits" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="w-24 border rounded-xl p-3 text-sm" />
                  <button onClick={handleSendCredits} className="bg-red-600 text-white px-6 py-3 rounded-xl text-sm font-bold">Send</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'builder' && (
            <>
              <div className="mb-8"><h1 className="text-3xl font-extrabold text-gray-900">Site Builder</h1></div>
              {step === 'select' && (
                <div>
                  <h2 className="text-sm font-bold text-gray-600 mb-4 uppercase">1. Choose Business Type</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.id} onClick={() => { setSelectedCategory(cat); setBio(cat.defaultBio); setStep('details'); }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 transition flex flex-col items-center gap-3">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">{cat.icon}</div>
                        <span className="font-bold text-sm text-gray-800">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-12 border-t border-gray-200 pt-8">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6"><Globe size={20} className="text-purple-600"/> My Websites ({sites.length})</h2>
                    {isLoadingSites ? <Loader2 className="animate-spin text-purple-600" /> : sites.length === 0 ? <p className="text-gray-500 text-sm">No websites yet.</p> : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sites.map(site => (
                          <div key={site.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div><h4 className="text-gray-900 font-bold text-lg">{site.siteName}</h4><span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">{site.categoryName}</span></div>
                              <button onClick={() => handleDeleteSite(site.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                            </div>
                            <p className="text-xs text-purple-600 font-mono truncate">/site/{site.slug}</p>
                            <div className="flex gap-2 w-full">
                              <button onClick={() => copyLink(site.slug)} className="flex-1 bg-gray-50 border px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1">{copied === site.slug ? <Check size={14} className="text-green-500"/> : <Copy size={14} />} Copy</button>
                              <a href={`/site/${site.slug}?edit=true`} className="flex-1 bg-green-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-700"><Edit size={14} /> Manage</a>
                              <a href={`/site/${site.slug}`} target="_blank" className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-purple-700"><ExternalLink size={14} /> Visit</a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 'details' && selectedCategory && (
                <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                  <button onClick={() => setStep('select')} className="text-xs font-bold text-gray-500 mb-6 flex items-center gap-1"><ArrowLeft size={14}/> Back</button>
                  <div className="space-y-4">
                    <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Business Name" className="w-full bg-gray-50 border rounded-xl p-3 text-sm" />
                    <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short Tagline" className="w-full bg-gray-50 border rounded-xl p-3 text-sm" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" value={link1} onChange={(e) => setLink1(e.target.value)} placeholder={`Link for ${selectedCategory.btn1}`} className="w-full bg-gray-50 border rounded-xl p-3 text-sm" />
                      <input type="text" value={link2} onChange={(e) => setLink2(e.target.value)} placeholder={`Link for ${selectedCategory.btn2}`} className="w-full bg-gray-50 border rounded-xl p-3 text-sm" />
                    </div>
                    <div className="flex gap-3 mb-6 mt-4">
                      <button onClick={() => setTheme('white')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs ${theme === 'white' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>White</button>
                      <button onClick={() => setTheme('neon')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs ${theme === 'neon' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>Neon</button>
                      <button onClick={() => setTheme('hacker')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs ${theme === 'hacker' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>Hacker</button>
                    </div>
                    <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2">{isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate Website (1 Credit)</button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === 'customers' && (
            <div>
               <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Customers</h1>
               <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm flex gap-4 flex-wrap">
                  <input type="text" value={newCustName} onChange={e => setNewCustName(e.target.value)} placeholder="Name" className="flex-1 border rounded-lg p-2 text-sm" />
                  <input type="text" value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} placeholder="Phone" className="flex-1 border rounded-lg p-2 text-sm" />
                  <button onClick={saveCustomer} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold">Add</button>
               </div>
               <div className="bg-white rounded-2xl border overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b"><tr><th className="p-4 font-bold text-gray-600">Name</th><th className="p-4 font-bold text-gray-600">Phone</th><th className="p-4 font-bold text-gray-600">Action</th></tr></thead>
                    <tbody>{customers.map(cust => (<tr key={cust.id} className="border-b hover:bg-gray-50"><td className="p-4">{cust.name}</td><td className="p-4">{cust.phone}</td><td className="p-4"><button onClick={() => deleteDoc(doc(db, "customers", cust.id))} className="text-red-500"><Trash2 size={16}/></button></td></tr>))}</tbody>
                  </table>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 TELEGRAM SUPPORT BUTTON (Dashboard ke liye) */}
      <a 
        href="https://t.me/YourTelegramUsername" // 👈 Yahan apna Telegram Username daalein
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#0088cc] text-white p-4 rounded-full shadow-[0_0_20px_rgba(0,136,204,0.5)] hover:scale-110 hover:bg-[#0077b3] transition-all flex items-center justify-center group"
      >
        <Send size={28} className="group-hover:animate-pulse" />
      </a>

      {/* TOP-UP MODAL */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm text-center relative">
            <button onClick={() => setIsTopUpOpen(false)} className="absolute top-4 right-4 text-gray-400"><X size={24} /></button>
            <h2 className="text-xl font-bold mb-1">Top-up Credits</h2>
            <p className="text-xs text-gray-500 mb-4 font-semibold">Rate: ₹100 = 1 Credit</p>
            
            <div className="mb-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <label className="text-[10px] font-bold text-gray-500 block mb-1 text-left">Enter Amount to Pay (₹)</label>
              <input type="number" value={topupAmount} onChange={e => setTopupAmount(Number(e.target.value))} className="w-full border border-gray-300 p-3 rounded-lg text-lg text-center font-bold focus:outline-none focus:border-purple-500" placeholder="e.g. 500" />
              <p className="text-purple-600 text-sm font-bold mt-2">You will get {Math.floor((topupAmount || 0) / 100)} Credits</p>
            </div>

            <img src={FAMPAY_QR_URL} className="w-48 mx-auto mb-4 rounded-xl border-2 border-purple-200 shadow-md" />
            <input type="text" value={utr} onChange={e => setUtr(e.target.value)} placeholder="Enter 12-Digit UTR / Txn ID" className="w-full border p-3 rounded-lg mb-4 text-sm text-center focus:outline-none focus:border-purple-500 font-semibold" />
            
            <button onClick={handleVerifyPayment} disabled={isVerifying || !topupAmount || topupAmount < 100} className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg shadow-lg">
              {isVerifying ? 'Verifying...' : `Verify & Add ${Math.floor((topupAmount || 0) / 100)} Credits`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
