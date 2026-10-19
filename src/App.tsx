import { useState, useEffect } from 'react';
import { 
  Globe, Loader2, Code2, Wallet, Zap, Sparkles, Send, ExternalLink, 
  Copy, Check, X, QrCode, ShieldCheck, Store, Utensils, Dumbbell, 
  Gamepad2, Stethoscope, Briefcase, ArrowLeft, FileText, Users, Trash2, Plus, Save
} from 'lucide-react';
import PublicSite from './components/PublicSite';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

function App() {
  const currentPath = window.location.pathname;
  // 🚀 FIX: URL se ?v= jaisa kuch bhi hata kar sirf slug nikaalna
  const cleanPath = currentPath.split('?')[0]; 
  const isPublicSite = cleanPath.startsWith('/site/');
  const siteSlug = isPublicSite ? cleanPath.split('/site/')[1].replace(/\/$/, '') : '';

  if (isPublicSite) return <PublicSite slug={siteSlug} />;
  return <Dashboard />;
}

const CATEGORIES = [
  { id: 'gaming', name: 'Gaming / Esports', icon: <Gamepad2 size={24} />, defaultBio: 'Pro Gamer & Content Creator.', btn1: 'Watch Videos', btn2: 'Join Community' },
  { id: 'bakery', name: 'Bakery / Cafe', icon: <Utensils size={24} />, defaultBio: 'Freshly baked goods & delicious coffee.', btn1: 'View Menu', btn2: 'Order Now' },
  { id: 'gym', name: 'Gym / Fitness', icon: <Dumbbell size={24} />, defaultBio: 'Transform your body with expert trainers.', btn1: 'View Plans', btn2: 'Join Now' },
  { id: 'clinic', name: 'Doctor / Clinic', icon: <Stethoscope size={24} />, defaultBio: 'Providing quality healthcare for you.', btn1: 'Book Appointment', btn2: 'Our Services' },
  { id: 'store', name: 'Shop / E-commerce', icon: <Store size={24} />, defaultBio: 'Best products at the best prices.', btn1: 'Shop Now', btn2: 'Contact Support' },
  { id: 'business', name: 'Agency / Business', icon: <Briefcase size={24} />, defaultBio: 'Professional services for your growth.', btn1: 'Our Services', btn2: 'Contact Us' },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('builder');
  
  const [sites, setSites] = useState<any[]>([]);
  const [credits, setCredits] = useState(5); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mySiteSlug, setMySiteSlug] = useState<string | null>(localStorage.getItem('my_site_slug'));
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [step, setStep] = useState('select'); 
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [siteName, setSiteName] = useState('');
  const [bio, setBio] = useState('');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [theme, setTheme] = useState('white');

  const [notes, setNotes] = useState<any[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const [customers, setCustomers] = useState<any[]>([]);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  const FAMPAY_QR_URL = "https://raw.githubusercontent.com/soniyanainnain148-max/vitejs-vite-w8mxuycc/main/public/Screenshot_20261018_050324_FamApp.jpg"; 
  const TOPUP_AMOUNT = 50;
  const CREDITS_TO_ADD = 5;
  const USER_ID = "user_arpit_123"; 

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "users", USER_ID);
      const snap = await getDoc(userRef);
      if (snap.exists()) setCredits(snap.data().credits || 0);
      else await setDoc(userRef, { credits: 5 }); 
    };
    fetchUser();

    const unsubSites = onSnapshot(collection(db, "ai_sites"), (snap) => setSites(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubNotes = onSnapshot(collection(db, "notes"), (snap) => setNotes(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubCust = onSnapshot(collection(db, "customers"), (snap) => setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => { unsubSites(); unsubNotes(); unsubCust(); }; 
  }, []);

  const handleVerifyPayment = async () => {
    if (utr.length < 8) return alert("Kripya valid UTR daalein!");
    setIsVerifying(true);
    setTimeout(async () => {
      try {
        const userRef = doc(db, "users", USER_ID);
        await updateDoc(userRef, { credits: credits + CREDITS_TO_ADD });
        setCredits(prev => prev + CREDITS_TO_ADD);
        setIsTopUpOpen(false); setUtr('');
        alert(`✅ Payment Verified! ${CREDITS_TO_ADD} Credits Added.`);
      } catch (error) { alert("Verification Failed!"); }
      setIsVerifying(false);
    }, 1000); 
  };

  const handleGenerate = () => {
    if (!siteName) return alert("Please enter your business name.");
    if (credits < 1) return alert("Insufficient credits! Please top-up.");

    setIsGenerating(true);
    
    setTimeout(async () => {
      try {
        const generatedSlug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        // Default values taaki undefined error na aaye
        const newSite = {
          siteName: siteName || "My Website", 
          slug: generatedSlug, 
          bio: bio || "Welcome to my page.", 
          themeType: theme || "white", 
          button1Title: selectedCategory?.btn1 || "Explore", 
          button1Url: link1 || "#",
          button2Title: selectedCategory?.btn2 || "Contact", 
          button2Url: link2 || "#",
          categoryName: selectedCategory?.name || "Business",
          products: [], 
          createdAt: new Date()
        };

        // UI Turant Update Karo
        setSites(prev => [...prev, { id: 'local_' + Date.now(), ...newSite }]);
        setCredits(prev => prev - 1);
        localStorage.setItem('my_site_slug', generatedSlug); 
        setMySiteSlug(generatedSlug);
        
        setIsGenerating(false); 
        setStep('select'); 
        setSiteName(''); setLink1(''); setLink2('');
        alert(`🚀 Website Generated Successfully!`);

        // Background mein Firebase Save karo
        try {
          await addDoc(collection(db, "ai_sites"), newSite);
          await updateDoc(doc(db, "users", USER_ID), { credits: credits - 1 });
        } catch (dbErr) {
          console.log("Firebase Save Failed:", dbErr);
        }

      } catch (error: any) {
        setIsGenerating(false); 
        alert("Error: " + error.message);
      }
    }, 1200); 
  };

  const saveNote = async () => {
    if(!newNoteTitle) return;
    await addDoc(collection(db, "notes"), { title: newNoteTitle, content: newNoteContent, createdAt: new Date() });
    setNewNoteTitle(''); setNewNoteContent('');
  };

  const saveCustomer = async () => {
    if(!newCustName) return;
    await addDoc(collection(db, "customers"), { name: newCustName, phone: newCustPhone, createdAt: new Date() });
    setNewCustName(''); setNewCustPhone('');
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between md:h-screen sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2 mt-2">
            <div className="bg-purple-600 p-2 rounded-xl shadow-md"><Code2 size={20} className="text-white" /></div>
            <span className="font-extrabold text-lg text-gray-900">WEBCRAFT PRO</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <button onClick={() => setActiveTab('builder')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'builder' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'text-gray-500 hover:bg-gray-50'}`}><Sparkles size={18} /> Site Builder</button>
            <button onClick={() => setActiveTab('notes')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'notes' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'text-gray-500 hover:bg-gray-50'}`}><FileText size={18} /> My Notes</button>
            <button onClick={() => setActiveTab('customers')} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition ${activeTab === 'customers' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'text-gray-500 hover:bg-gray-50'}`}><Users size={18} /> Customers</button>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-500 font-bold uppercase flex items-center gap-1"><Wallet size={14}/> Credits</span>
            <span className="text-2xl font-black text-gray-900">{credits}</span>
          </div>
          <button onClick={() => setIsTopUpOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2">
            <QrCode size={16} /> Top-up ₹{TOPUP_AMOUNT}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full h-screen overflow-y-auto">
        
        {activeTab === 'builder' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900">Site Builder</h1>
              <p className="text-sm text-gray-500 mt-1">Create your business website.</p>
            </div>

            {step === 'select' && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {CATEGORIES.map((cat) => (
                    <button key={cat.id} onClick={() => { setSelectedCategory(cat); setBio(cat.defaultBio); setStep('details'); }} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 transition flex flex-col items-center gap-3">
                      <div className="p-3 bg-purple-50 rounded-xl text-purple-600">{cat.icon}</div>
                      <span className="font-bold text-sm text-gray-800">{cat.name}</span>
                    </button>
                  ))}
                </div>

                {mySiteSlug && sites.filter(s => s.slug === mySiteSlug).map(site => (
                  <div key={site.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                    <div>
                      <h4 className="text-gray-900 font-bold text-lg">{site.siteName}</h4>
                      <p className="text-xs text-purple-600 font-mono mt-1">/site/{site.slug}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => copyLink(site.slug)} className="bg-gray-50 border px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">{copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />} Copy</button>
                      <a href={`/site/${site.slug}`} target="_blank" rel="noreferrer" className="bg-purple-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">Visit</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {step === 'details' && selectedCategory && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm animate-fade-in">
                <button onClick={() => setStep('select')} className="text-xs font-bold text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-1"><ArrowLeft size={14}/> Back</button>
                <div className="space-y-4">
                  <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Business Name" className="w-full bg-gray-50 border rounded-xl p-3 text-sm focus:border-purple-500" />
                  <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short Tagline" className="w-full bg-gray-50 border rounded-xl p-3 text-sm focus:border-purple-500" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value={link1} onChange={(e) => setLink1(e.target.value)} placeholder={`Link for ${selectedCategory.btn1}`} className="w-full bg-gray-50 border rounded-xl p-3 text-sm focus:border-purple-500" />
                    <input type="text" value={link2} onChange={(e) => setLink2(e.target.value)} placeholder={`Link for ${selectedCategory.btn2}`} className="w-full bg-gray-50 border rounded-xl p-3 text-sm focus:border-purple-500" />
                  </div>

                  <div className="flex gap-3 mb-6 mt-4">
                    <button onClick={() => setTheme('white')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs ${theme === 'white' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>White Theme</button>
                    <button onClick={() => setTheme('neon')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs ${theme === 'neon' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>Neon Theme</button>
                    <button onClick={() => setTheme('hacker')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs ${theme === 'hacker' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200'}`}>Hacker Theme</button>
                  </div>

                  <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg">
                    {isGenerating ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate Website
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* NOTES & CUSTOMERS */}
        {activeTab === 'notes' && (
          <div className="animate-fade-in">
             <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Notes</h1>
             <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm">
                <input type="text" value={newNoteTitle} onChange={e => setNewNoteTitle(e.target.value)} placeholder="Note Title" className="w-full border-b mb-3 p-2 font-bold focus:outline-none" />
                <textarea value={newNoteContent} onChange={e => setNewNoteContent(e.target.value)} placeholder="Write something..." className="w-full p-2 text-sm focus:outline-none" rows={3}></textarea>
                <button onClick={saveNote} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold mt-3 flex items-center gap-1"><Save size={16}/> Save Note</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notes.map(note => (
                  <div key={note.id} className="bg-white p-4 rounded-xl border shadow-sm relative group">
                    <h3 className="font-bold text-gray-900">{note.title}</h3>
                    <p className="text-sm text-gray-600 mt-2">{note.content}</p>
                    <button onClick={() => deleteDoc(doc(db, "notes", note.id))} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="animate-fade-in">
             <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Customer CRM</h1>
             <div className="bg-white p-6 rounded-2xl border mb-6 shadow-sm flex gap-4 flex-wrap">
                <input type="text" value={newCustName} onChange={e => setNewCustName(e.target.value)} placeholder="Customer Name" className="flex-1 border rounded-lg p-2 text-sm focus:outline-none" />
                <input type="text" value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} placeholder="Phone Number" className="flex-1 border rounded-lg p-2 text-sm focus:outline-none" />
                <button onClick={saveCustomer} className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-1"><Plus size={16}/> Add</button>
             </div>
             <div className="bg-white rounded-2xl border overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b"><tr><th className="p-4 font-bold text-gray-600">Name</th><th className="p-4 font-bold text-gray-600">Phone</th><th className="p-4 font-bold text-gray-600">Action</th></tr></thead>
                  <tbody>
                    {customers.map(cust => (
                      <tr key={cust.id} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="p-4">{cust.name}</td>
                        <td className="p-4">{cust.phone}</td>
                        <td className="p-4"><button onClick={() => deleteDoc(doc(db, "customers", cust.id))} className="text-red-500"><Trash2 size={16}/></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>

      {/* TOP-UP MODAL */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm">
             <h2 className="text-xl font-bold text-center mb-4">Scan & Pay</h2>
             <img src={FAMPAY_QR_URL} className="w-48 mx-auto mb-4 rounded-xl" />
             <input type="text" value={utr} onChange={e => setUtr(e.target.value)} placeholder="Enter UTR" className="w-full border p-2 rounded-lg mb-4 text-sm" />
             <button onClick={handleVerifyPayment} className="w-full bg-green-500 text-white font-bold py-2 rounded-lg">Verify</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
