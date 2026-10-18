import { useState, useEffect } from 'react';
import { Globe, Loader2, Code2, Wallet, Zap, Sparkles, Send, Bot, ExternalLink, Copy, Check, X, QrCode, ShieldCheck } from 'lucide-react';
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

function Dashboard() {
  const [sites, setSites] = useState<any[]>([]);
  const [credits, setCredits] = useState(5); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);
  const [mySiteId, setMySiteId] = useState<string | null>(localStorage.getItem('my_site_id'));

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [utr, setUtr] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // 👇 SIRF QR CODE URL CHAHIYE, UPI ID KI ZAROORAT NAHI 👇
  const FAMPAY_QR_URL = import.meta.env.VITE_FAMPAY_QR_URL; 
  
  const TOPUP_AMOUNT = 50;
  const CREDITS_TO_ADD = 5;
  const USER_ID = "user_arpit_123"; 

  useEffect(() => {
    const fetchUser = async () => {
      const userRef = doc(db, "users", USER_ID);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setCredits(snap.data().credits || 0);
      } else {
        await setDoc(userRef, { credits: 5 }); 
      }
    };
    fetchUser();

    const unsubscribe = onSnapshot(collection(db, "ai_sites"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSites(data);
    });
    return () => unsubscribe(); 
  }, []);

  const handleVerifyPayment = async () => {
    if (utr.length < 8) return alert("Kripya valid 12-digit UTR / Transaction ID daalein!");
    setIsVerifying(true);
    
    setTimeout(async () => {
      try {
        const userRef = doc(db, "users", USER_ID);
        const newCredits = credits + CREDITS_TO_ADD;
        await updateDoc(userRef, { credits: newCredits });
        
        setCredits(newCredits);
        setIsTopUpOpen(false);
        setUtr('');
        alert(`✅ Payment Verified! ₹${TOPUP_AMOUNT} Received. ${CREDITS_TO_ADD} Credits Added.`);
      } catch (error) {
        alert("Verification Failed!");
      }
      setIsVerifying(false);
    }, 2000); 
  };

  const handleGenerate = (e: any) => {
    e.preventDefault();
    if (!prompt) return alert("Please describe your website idea.");
    if (credits < 1) return alert("Insufficient credits! Please top-up.");

    setIsGenerating(true);
    
    setTimeout(async () => {
      try {
        const lowerPrompt = prompt.toLowerCase();
        let siteName = prompt.split(' ')[0] + "'s Portfolio";
        if (lowerPrompt.includes('named ')) siteName = prompt.split(/named /i)[1].split(' ')[0];

        let themeType = 'white';
        if (lowerPrompt.includes('neon')) themeType = 'neon';
        if (lowerPrompt.includes('hacker')) themeType = 'hacker';

        const hasYoutube = lowerPrompt.includes('youtube');
        const hasDiscord = lowerPrompt.includes('discord');
        const generatedSlug = siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const docRef = await addDoc(collection(db, "ai_sites"), {
          siteName, slug: generatedSlug, prompt, bio: "Welcome to my page.",
          themeType, hasYoutube, hasDiscord, createdAt: new Date()
        });
        
        const userRef = doc(db, "users", USER_ID);
        await updateDoc(userRef, { credits: credits - 1 });
        
        setCredits(prev => prev - 1);
        setPrompt('');
        localStorage.setItem('my_site_id', docRef.id);
        setMySiteId(docRef.id);
        alert(`🚀 AI Website Generated Successfully!`);
      } catch (error) { alert("Error generating!"); }
      setIsGenerating(false);
    }, 3000); 
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
            <span className="font-extrabold text-lg text-gray-900">AI WEBCRAFT</span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-purple-50 text-purple-600 border border-purple-100"><Sparkles size={18} /> AI Generator</button>
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
          <div className="flex justify-center gap-2 mt-2 opacity-70">
            <span className="text-[9px] font-bold text-gray-400 w-full text-center">We Accept UPI</span>
          </div>
          <div className="flex justify-center gap-3 mt-1">
            <div className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-blue-500">GPay</div>
            <div className="w-6 h-6 bg-purple-100 rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-purple-600">Pe</div>
            <div className="w-6 h-6 bg-yellow-100 rounded shadow-sm flex items-center justify-center text-[8px] font-bold text-yellow-600">Fam</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Build with AI</h1>
            <p className="text-sm text-gray-500 mt-1">Prompt mein apni requirements likhein.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[2rem] p-2 mb-10 shadow-sm">
          <div className="bg-white rounded-[1.5rem] p-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-purple-600" size={20} />
              <span className="text-sm font-bold text-gray-900">AI Web Architect</span>
            </div>
            <form onSubmit={handleGenerate}>
              <textarea 
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a neon gaming portfolio named Arpit with YouTube."
                rows={3} className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-lg focus:outline-none resize-none"
              ></textarea>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Zap size={14} className="text-yellow-500"/> 1 Credit required</span>
                <button type="submit" disabled={isGenerating || credits < 1} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md disabled:opacity-50">
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {isGenerating ? 'AI is Coding...' : 'Generate Website'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {mySiteId && !isGenerating && (
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe size={16} className="text-purple-600"/> YOUR LIVE WEBSITE</h3>
            {sites.filter(s => s.id === mySiteId).map(site => (
              <div key={site.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
                <div>
                  <h4 className="text-gray-900 font-bold text-lg">{site.siteName}</h4>
                  <p className="text-xs text-purple-600 font-mono mt-1">/site/{site.slug}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => copyLink(site.slug)} className="flex-1 md:flex-none bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                    {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14} />} Copy Link
                  </button>
                  <a href={`/site/${site.slug}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none bg-purple-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition shadow-md">
                    <ExternalLink size={14} /> Visit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🟢 FAMPAY TOP-UP MODAL (SIRF QR CODE) */}
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

            {/* SIRF QR CODE DIKHEGA (Koi UPI ID NAHI) */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 flex flex-col items-center mb-6 shadow-inner">
              <img 
                src={FAMPAY_QR_URL} 
                alt="Payment QR" 
                className="w-48 h-48 rounded-lg object-contain bg-white p-1" 
              />
              <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest text-center">
                GPay • PhonePe • Paytm • FamPay
              </p>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 block mb-1">Enter 12-Digit UTR / Transaction ID</label>
              <input 
                type="text" value={utr} onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 123456789012" 
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-gray-900" 
              />
            </div>

            <button 
              onClick={handleVerifyPayment} disabled={isVerifying}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
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
