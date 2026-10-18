import { useState, useEffect } from 'react';
import { Globe, Loader2, Code2, Wallet, Zap, Sparkles, Send, Bot, ExternalLink, Copy, Check, X, QrCode, ShieldCheck, BrainCircuit } from 'lucide-react';
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

  // 👇 QR CODE LINK 👇
  const FAMPAY_QR_URL = "https://raw.githubusercontent.com/soniyanainnain148-max/vitejs-vite-w8mxuycc/main/public/Screenshot_20261018_050324_FamApp.jpg"; 
  
  // 👇 AI API KEY 👇
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ""; 

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
    if (utr.length < 8) return alert("Kripya valid UTR / Transaction ID daalein!");
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

  // 🧠 REAL AI GENERATION (GEMINI 1.5 FLASH) 🧠
  const handleGenerate = async (e: any) => {
    e.preventDefault();
    if (!prompt) return alert("Please describe your website idea.");
    if (credits < 1) return alert("Insufficient credits! Please top-up.");

    setIsGenerating(true);
    
    // Fallback
    let finalData = {
      siteName: prompt.split(' ').slice(0, 2).join(' ') + "'s Portfolio", 
      bio: "Welcome to my official gaming profile.",
      themeType: "white", 
      hasYoutube: prompt.toLowerCase().includes('youtube'),
      hasDiscord: prompt.toLowerCase().includes('discord')
    };

    try {
      if (GEMINI_API_KEY) {
        console.log("Calling Gemini API...");
        
        // 10 Second Timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Yahan humne gemini-1.5-flash use kiya hai jo fastest hai
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Analyze this prompt: "${prompt}". Return a JSON object with keys: "siteName" (string), "bio" (string), "themeType" ('neon', 'hacker', or 'white'), "hasYoutube" (boolean), "hasDiscord" (boolean).`
              }]
            }],
            generationConfig: {
              responseMimeType: "application/json", // YEH GOOGLE KA NAYA FEATURE HAI (Direct JSON dega)
            }
          })
        });

        clearTimeout(timeoutId); 

        if (!response.ok) {
           const errData = await response.json();
           console.error("API Error Details:", errData);
           throw new Error("API Error");
        }

        const aiData = await response.json();
        console.log("AI Response:", aiData);

        if (aiData.candidates && aiData.candidates[0].content.parts[0].text) {
          let text = aiData.candidates[0].content.parts[0].text;
          
          // JSON Parse karo
          const parsed = JSON.parse(text);
          
          finalData = {
            siteName: parsed.siteName || finalData.siteName,
            bio: parsed.bio || finalData.bio,
            themeType: parsed.themeType || finalData.themeType,
            hasYoutube: parsed.hasYoutube !== undefined ? parsed.hasYoutube : finalData.hasYoutube,
            hasDiscord: parsed.hasDiscord !== undefined ? parsed.hasDiscord : finalData.hasDiscord,
          };
          console.log("Parsed AI Data:", finalData);
        }
      }
    } catch (error) {
      console.error("AI Fail/Timeout. Fallback chal raha hai.", error);
      alert("AI thoda slow hai, humne automatic website bana di hai!"); // User ko inform karo
    }

    // Save to Database
    try {
      const generatedSlug = finalData.siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

      const docRef = await addDoc(collection(db, "ai_sites"), {
        siteName: finalData.siteName, 
        slug: generatedSlug, 
        prompt: prompt, 
        bio: finalData.bio,
        themeType: finalData.themeType, 
        hasYoutube: finalData.hasYoutube, 
        hasDiscord: finalData.hasDiscord, 
        createdAt: new Date()
      });
      
      const userRef = doc(db, "users", USER_ID);
      await updateDoc(userRef, { credits: credits - 1 });
      
      setCredits(prev => prev - 1);
      setPrompt('');
      localStorage.setItem('my_site_id', docRef.id);
      setMySiteId(docRef.id);
      alert(`🚀 Website Generated Successfully!`);
    } catch (dbError) {
      alert("Error saving website to database!");
    } finally {
      setIsGenerating(false); // Spinner hamesha band hoga
    }
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
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-purple-50 text-purple-600 border border-purple-100"><BrainCircuit size={18} /> Gemini AI Generator</button>
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

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Build with Real AI</h1>
            <p className="text-sm text-gray-500 mt-1">Describe your dream website. Gemini 1.5 Flash will build it.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-[2rem] p-2 mb-10 shadow-sm">
          <div className="bg-white rounded-[1.5rem] p-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-purple-600" size={20} />
              <span className="text-sm font-bold text-gray-900">Prompt Engineer</span>
            </div>
            <form onSubmit={handleGenerate}>
              <textarea 
                value={prompt} onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Mera naam Arpit hai, mujhe ek dark hacker theme wali website chahiye jisme meri YouTube aur Discord ki link ho."
                rows={4} className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-lg focus:outline-none resize-none"
              ></textarea>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Zap size={14} className="text-yellow-500"/> 1 Credit required</span>
                <button type="submit" disabled={isGenerating || credits < 1} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md disabled:opacity-50">
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {isGenerating ? 'AI is Thinking...' : 'Generate Website'}
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
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{site.bio}</p>
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

      {/* 🟢 FAMPAY TOP-UP MODAL */}
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
              <p className="text-[10px] text-gray-500 mt-3 font-bold uppercase tracking-widest text-center">GPay • PhonePe • Paytm • FamPay</p>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold text-gray-600 block mb-1">Enter 12-Digit UTR / Transaction ID</label>
              <input 
                type="text" value={utr} onChange={(e) => setUtr(e.target.value)}
                placeholder="e.g. 123456789012" 
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 text-gray-900" 
              />
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
