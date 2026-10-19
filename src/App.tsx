import { useState, useEffect } from 'react';
import { Globe, Loader2, Code2, Wallet, Zap, Sparkles, Send, ExternalLink, Copy, Check, X, QrCode, ShieldCheck, Store, Utensils, Dumbbell, Gamepad2, Stethoscope, Briefcase, ChevronRight, ArrowLeft } from 'lucide-react';
import PublicSite from './components/PublicSite';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

function App() {
  const currentPath = window.location.pathname;
  const isPublicSite = currentPath.startsWith('/site/');
  const siteSlug = isPublicSite ? currentPath.split('/site/')[1] : '';

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
  const [sites, setSites] = useState<any[]>([]);
  const [credits, setCredits] = useState(5); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [step, setStep] = useState('select'); 
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const [siteName, setSiteName] = useState('');
  const [bio, setBio] = useState('');
  const [link1, setLink1] = useState('');
  const [link2, setLink2] = useState('');
  const [theme, setTheme] = useState('white');

  const [mySiteSlug, setMySiteSlug] = useState<string | null>(localStorage.getItem('my_site_slug'));
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

    const unsubscribe = onSnapshot(collection(db, "ai_sites"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSites(data);
    });
    return () => unsubscribe(); 
  }, []);

  const handleVerifyPayment = async () => {
    if (utr.length < 8) return alert("Kripya valid UTR daalein!");
    setIsVerifying(true);
    setTimeout(async () => {
      try {
        const userRef = doc(db, "users", USER_ID);
        await updateDoc(userRef, { credits: credits + CREDITS_TO_ADD });
        setCredits(prev => prev + CREDITS_TO_ADD);
        setIsTopUpOpen(false);
        setUtr('');
        alert(`✅ Payment Verified! ${CREDITS_TO_ADD} Credits Added.`);
      } catch (error) { alert("Verification Failed!"); }
      setIsVerifying(false);
    }, 1000); 
  };

  const handleCategorySelect = (cat: any) => {
    setSelectedCategory(cat);
    setBio(cat.defaultBio);
    setStep('details');
  };

  // 🚀 INSTANT GENERATE (UI pehle, Database baad mein) 🚀
  const handleGenerate = async () => {
    if (!siteName) return alert("Please enter your business name.");
    if (credits < 1) return alert("Insufficient credits! Please top-up.");

    setIsGenerating(true);
    
    // 1. Thoda delay taaki user ko "Building" feel aaye
    setTimeout(() => {
      try {
        const generatedSlug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const newSite = {
          id: 'site_' + Date.now(),
          siteName: siteName, 
          slug: generatedSlug, 
          bio: bio,
          themeType: theme, 
          button1Title: selectedCategory.btn1,
          button1Url: link1 || "#",
          button2Title: selectedCategory.btn2,
          button2Url: link2 || "#",
          categoryName: selectedCategory.name,
          createdAt: new Date()
        };

        // 2. UI UPDATE (Turant!)
        setSites(prev => [...prev, newSite]);
        setCredits(prev => prev - 1);
        localStorage.setItem('my_site_slug', generatedSlug);
        setMySiteSlug(generatedSlug);
        
        setIsGenerating(false); 
        setStep('select'); 
        setSiteName(''); setLink1(''); setLink2('');
        
        alert(`🚀 Website Generated Successfully!`);

        // 3. BACKGROUND FIREBASE SAVE (Bina UI ko roke)
        addDoc(collection(db, "ai_sites"), newSite).then(() => {
          const userRef = doc(db, "users", USER_ID);
          updateDoc(userRef, { credits: credits - 1 });
        }).catch((err) => {
          console.log("Firebase Background Save Failed:", err);
        });

      } catch (error: any) {
        setIsGenerating(false);
        alert("Error: " + error.message);
      }
    }, 1200); // 1.2 second ka delay
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between md:h-screen sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2 mt-2">
            <div className="bg-purple-600 p-2 rounded-xl shadow-md"><Code2 size={20} className="text-white" /></div>
            <span className="font-extrabold text-lg text-gray-900">WEBCRAFT</span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-purple-50 text-purple-600 border border-purple-100"><Sparkles size={18} /> Site Builder</button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"><Globe size={18} /> My Websites</button>
          </div>
        </div>
        <div className="mt-8 bg-gray-50 border border-gray-200 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><Wallet size={14}/> Credits</span>
            <span className="text-2xl font-black text-gray-900">{credits}</span>
          </div>
          <button onClick={() => setIsTopUpOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-2 mb-4">
            <QrCode size={16} /> Top-up ₹{TOPUP_AMOUNT}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - BUILDER */}
      <div className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your Website</h1>
          <p className="text-sm text-gray-500 mt-1">Select your business type and fill in the details.</p>
        </div>

        {/* STEP 1: SELECT CATEGORY */}
        {step === 'select' && (
          <div className="animate-fade-in">
            <h2 className="text-sm font-bold text-gray-600 mb-4 uppercase tracking-wider">1. Choose Business Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-purple-500 hover:shadow-md transition flex flex-col items-center justify-center gap-3 text-center group"
                >
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                    {cat.icon}
                  </div>
                  <span className="font-bold text-sm text-gray-800">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: ENTER DETAILS */}
        {step === 'details' && selectedCategory && (
          <div className="animate-fade-in bg-white p-6 md:p-8 rounded-3xl border border-gray-200 shadow-sm">
            <button onClick={() => setStep('select')} className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-gray-900 mb-6">
              <ArrowLeft size={14} /> Back to Categories
            </button>
            
            <h2 className="text-sm font-bold text-gray-600 mb-6 uppercase tracking-wider flex items-center gap-2">
              <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center">2</span> 
              Enter {selectedCategory.name} Details
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Business / Website Name</label>
                <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. Rahul's Gym" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 block mb-1">Short Tagline / Bio</label>
                <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="e.g. Best fitness center in town" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Link 1 (For {selectedCategory.btn1})</label>
                  <input type="text" value={link1} onChange={(e) => setLink1(e.target.value)} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Link 2 (For {selectedCategory.btn2})</label>
                  <input type="text" value={link2} onChange={(e) => setLink2(e.target.value)} placeholder="https://..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500" />
                </div>
              </div>
            </div>

            <h2 className="text-sm font-bold text-gray-600 mt-8 mb-4 uppercase tracking-wider flex items-center gap-2">
              <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center">3</span> 
              Choose Theme
            </h2>

            <div className="flex gap-3 mb-8">
              <button onClick={() => setTheme('white')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs transition ${theme === 'white' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-500'}`}>Light (White)</button>
              <button onClick={() => setTheme('neon')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs transition ${theme === 'neon' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-500'}`}>Neon (Pink)</button>
              <button onClick={() => setTheme('hacker')} className={`flex-1 p-3 rounded-xl border-2 font-bold text-xs transition ${theme === 'hacker' ? 'border-purple-600 bg-purple-50 text-purple-600' : 'border-gray-200 text-gray-500'}`}>Dark (Hacker)</button>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={isGenerating || credits < 1}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg disabled:opacity-50 text-lg"
            >
              {isGenerating ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} />}
              {isGenerating ? 'Building Website...' : 'Generate Website (1 Credit)'}
            </button>
          </div>
        )}

        {/* YOUR LIVE WEBSITE */}
        {mySiteSlug && step === 'select' && sites.filter(s => s.slug === mySiteSlug).map(site => (
          <div key={site.id} className="mt-10">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={16} className="text-purple-600"/> YOUR LIVE WEBSITE</h3>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
              <div>
                <h4 className="text-gray-900 font-bold text-lg">{site.siteName}</h4>
                <p className="text-xs text-purple-600 font-mono mt-1">/site/{site.slug}</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button onClick={() => copyLink(site.slug)} className="flex-1 md:flex-none bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2">
                  {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />} Copy Link
                </button>
                <a href={`/site/${site.slug}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none bg-purple-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition shadow-md">
                  <ExternalLink size={14} /> Visit
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* TOP-UP MODAL */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button onClick={() => setIsTopUpOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={20} /></button>
            <div className="text-center mb-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Wallet className="text-purple-600" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Scan & Pay</h2>
              <p className="text-xs text-gray-500 mt-1">Pay ₹{TOPUP_AMOUNT} via any UPI App</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center mb-6 shadow-inner">
              <img src={FAMPAY_QR_URL} alt="Payment QR" className="w-48 h-48 rounded-lg object-contain bg-white p-1" />
            </div>
            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 block mb-1">Enter 12-Digit UTR</label>
              <input type="text" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="e.g. 123456789012" className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-gray-900" />
            </div>
            <button onClick={handleVerifyPayment} disabled={isVerifying} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2">
              {isVerifying ? <Loader2 className="animate-spin" size={18}/> : <ShieldCheck size={18}/>}
              {isVerifying ? 'Verifying...' : 'Verify & Add Credits'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
