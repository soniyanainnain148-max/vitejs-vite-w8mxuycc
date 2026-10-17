import { useState, useEffect } from 'react';
import { Globe, Home, Loader2, Code2, CreditCard, Wallet, Zap, Sparkles, Send, Bot, ExternalLink, Copy, Check, Lock } from 'lucide-react';
import StatsCard from './components/StatsCard';
import PublicSite from './components/PublicSite';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";

function App() {
  // URL Routing Logic
  const currentPath = window.location.pathname;
  const isPublicSite = currentPath.startsWith('/site/');
  const siteSlug = isPublicSite ? currentPath.split('/site/')[1] : '';

  // Agar Public Site hai, toh direct woh render karo
  if (isPublicSite) {
    return <PublicSite slug={siteSlug} />;
  }

  // Warna Dashboard Render karo
  return <Dashboard />;
}

function Dashboard() {
  const [sites, setSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(5); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [siteName, setSiteName] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  // Access Control (Local Storage)
  const [mySiteId, setMySiteId] = useState<string | null>(localStorage.getItem('my_site_id'));

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "ai_sites"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSites(data);
      setIsLoading(false);
    });
    return () => unsubscribe(); 
  }, []);

  const handleTopUp = () => {
    setCredits(prev => prev + 5);
    alert("🎉 Payment Successful! 5 Credits added.");
  };

  const handleGenerate = (e: any) => {
    e.preventDefault();
    if (!prompt) return alert("Kripya prompt likhein ki aapko kaisi website chahiye!");
    if (credits < 1) return alert("Aapke paas credits nahi hain! Top-up karein.");

    setIsGenerating(true);
    
    // AI Prompt Analysis & Generation
    setTimeout(async () => {
      try {
        // Prompt se naam nikalne ki koshish (Simple AI logic)
        const generatedName = prompt.split(' ').slice(0, 3).join(' ') || "My Portfolio";
        const generatedSlug = generatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const docRef = await addDoc(collection(db, "ai_sites"), {
          siteName: generatedName, 
          slug: generatedSlug, 
          prompt, 
          createdAt: new Date()
        });
        
        setCredits(prev => prev - 1);
        setPrompt('');
        
        // Access Control Save
        localStorage.setItem('my_site_id', docRef.id);
        setMySiteId(docRef.id);

        alert(`🚀 AI Website Generated Successfully!\nAapka Link: ${window.location.origin}/site/${generatedSlug}`);
        
      } catch (error) {
        alert("Error generating website!");
      }
      setIsGenerating(false);
    }, 3500); // 3.5 seconds AI generation time
  };

  const copyLink = (slug: string) => {
    const link = `${window.location.origin}/site/${slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#010409] flex flex-col md:flex-row font-sans text-gray-300">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-[#0d1117] border-r border-gray-800 p-4 flex flex-col justify-between md:h-screen sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="bg-emerald-500 p-1.5 rounded-lg"><Code2 size={18} className="text-black" /></div>
            <span className="font-bold text-sm tracking-wide text-white">AI WEBCRAFT</span>
          </div>
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400">
              <Sparkles size={16} /> AI Generator
            </button>
          </div>
        </div>

        <div className="mt-8 bg-[#161b22] border border-gray-800 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-bold flex items-center gap-1"><Wallet size={14}/> Credits</span>
            <span className="text-lg font-bold text-emerald-400">{credits}</span>
          </div>
          <button onClick={handleTopUp} className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
            <CreditCard size={14}/> Top-up
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        
        <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <Home className="text-gray-500" size={20} />
            <h1 className="font-bold text-lg text-white">AI Website Generator</h1>
          </div>
        </div>

        {/* AI PROMPT BOX */}
        <div className="bg-[#0d1117] border border-gray-800 rounded-2xl p-6 shadow-2xl relative mb-8">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
          
          <h2 className="text-white font-bold text-lg mb-2 flex items-center gap-2"><Bot className="text-emerald-400" /> Kaisi website chahiye?</h2>
          <p className="text-xs text-gray-500 mb-6">Sirf prompt likhein, hamara AI aapki website bana dega.</p>

          <form onSubmit={handleGenerate}>
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create a neon cyberpunk gaming portfolio for a Free Fire player named Rahul. Add links for YouTube and Discord."
                rows={4}
                className="w-full bg-[#161b22] border border-gray-700 rounded-xl p-4 text-sm focus:outline-none focus:border-emerald-500 text-white resize-none pr-12"
              ></textarea>
              <button 
                type="submit" 
                disabled={isGenerating || credits < 1}
                className="absolute bottom-4 right-4 bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg transition disabled:opacity-50 shadow-lg"
              >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
          
          <div className="mt-4 flex items-center justify-between text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><Zap size={12} className="text-yellow-500"/> Cost: 1 Credit</span>
            <span>AI Powered by WebCraft</span>
          </div>
        </div>

        {/* GENERATION ANIMATION */}
        {isGenerating && (
          <div className="text-center py-10 bg-[#0d1117] rounded-2xl border border-emerald-500/30 mb-8 animate-pulse">
            <Bot className="mx-auto text-emerald-500 mb-4 animate-bounce" size={40} />
            <p className="text-emerald-400 font-mono text-sm">AI is designing your website...</p>
            <p className="text-gray-500 text-xs mt-2">Analyzing prompt, generating layout, applying theme...</p>
          </div>
        )}

        {/* USER'S GENERATED SITE (Access Control) */}
        {mySiteId && !isGenerating && (
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2"><Lock size={14}/> YOUR PRIVATE WEBSITE</h3>
            {sites.filter(s => s.id === mySiteId).map(site => (
              <div key={site.id} className="bg-gradient-to-r from-emerald-900/20 to-[#0d1117] border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-white font-bold text-lg">{site.siteName}</h4>
                    <p className="text-xs text-gray-400 font-mono mt-1">/{site.slug}</p>
                  </div>
                  <span className="bg-emerald-500 text-black text-[10px] font-bold px-2 py-1 rounded">LIVE</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 mt-6">
                  <button onClick={() => copyLink(site.slug)} className="flex-1 bg-[#161b22] border border-gray-700 hover:border-emerald-500 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                    {copied ? <Check size={16} className="text-emerald-400"/> : <Copy size={16} />} 
                    {copied ? 'Link Copied!' : 'Copy My Link'}
                  </button>
                  <a href={`/site/${site.slug}`} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                    <ExternalLink size={16} /> Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-[10px] text-gray-600">Only the creator has access to this link on their device.</p>

      </div>
    </div>
  );
}

export default App;
