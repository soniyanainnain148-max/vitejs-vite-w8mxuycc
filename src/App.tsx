import { useState, useEffect } from 'react';
import { Globe, Loader2, Code2, Wallet, Zap, Sparkles, Send, Bot, ExternalLink, Copy, Check, Activity, Users, Cpu } from 'lucide-react';
import StatsCard from './components/StatsCard';
import PublicSite from './components/PublicSite';
import { db } from './firebase';
import { collection, addDoc, onSnapshot } from "firebase/firestore";

function App() {
  const currentPath = window.location.pathname;
  const isPublicSite = currentPath.startsWith('/site/');
  const siteSlug = isPublicSite ? currentPath.split('/site/')[1] : '';

  if (isPublicSite) return <PublicSite slug={siteSlug} />;
  return <Dashboard />;
}

function Dashboard() {
  const [sites, setSites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(5); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [copied, setCopied] = useState(false);

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
    alert("💳 Payment Successful! 5 Credits added to your AI Wallet.");
  };

  const handleGenerate = (e: any) => {
    e.preventDefault();
    if (!prompt) return alert("Please describe your website idea.");
    if (credits < 1) return alert("Insufficient credits! Please top-up.");

    setIsGenerating(true);
    setTimeout(async () => {
      try {
        const generatedName = prompt.split(' ').slice(0, 3).join(' ') || "My Portfolio";
        const generatedSlug = generatedName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const docRef = await addDoc(collection(db, "ai_sites"), {
          siteName: generatedName, slug: generatedSlug, prompt, createdAt: new Date()
        });
        
        setCredits(prev => prev - 1);
        setPrompt('');
        localStorage.setItem('my_site_id', docRef.id);
        setMySiteId(docRef.id);
        alert(`🚀 AI Website Generated Successfully!`);
      } catch (error) { alert("Error!"); }
      setIsGenerating(false);
    }, 3000); 
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/site/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col md:flex-row font-sans text-gray-300 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* SIDEBAR */}
      <div className="w-full md:w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 p-4 flex flex-col justify-between md:h-screen sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2 mt-2">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-2 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)]">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-wide text-white">AI WEBCRAFT</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-white/5 text-white border border-white/10 shadow-lg">
              <Sparkles size={18} className="text-pink-400" /> AI Generator
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition">
              <Globe size={18} /> My Websites
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-white hover:bg-white/5 transition">
              <Activity size={18} /> Analytics
            </button>
          </div>
        </div>

        {/* Wallet */}
        <div className="mt-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-5 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-pink-500/30 blur-2xl"></div>
          <div className="flex justify-between items-center mb-4 relative z-10">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1"><Wallet size={14}/> Credits</span>
            <span className="text-2xl font-black text-white">{credits}</span>
          </div>
          <button onClick={handleTopUp} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-[0_0_15px_rgba(236,72,153,0.4)] relative z-10">
            + Top-up Now
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Build with AI</h1>
            <p className="text-sm text-gray-500 mt-1">Turn your prompt into a premium website instantly.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <Users size={18} className="text-white" />
          </div>
        </div>

        {/* Fake Stats (Attractive look) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center backdrop-blur-sm">
            <span className="text-xs text-gray-500 font-bold mb-1">SITES CREATED</span>
            <span className="text-xl font-black text-white">{sites.length + 1240}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center backdrop-blur-sm">
            <span className="text-xs text-gray-500 font-bold mb-1">ACTIVE USERS</span>
            <span className="text-xl font-black text-white">8,432</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center backdrop-blur-sm">
            <span className="text-xs text-gray-500 font-bold mb-1">AI SPEED</span>
            <span className="text-xl font-black text-emerald-400">45ms</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-center backdrop-blur-sm">
            <span className="text-xs text-gray-500 font-bold mb-1">SERVER</span>
            <span className="text-xl font-black text-white flex items-center gap-2">Online <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span></span>
          </div>
        </div>

        {/* Premium Prompt Box */}
        <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-[2rem] p-2 mb-10 shadow-[0_0_50px_rgba(255,255,255,0.05)] backdrop-blur-xl">
          <div className="bg-[#09090b] rounded-[1.5rem] p-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-pink-500" size={20} />
              <span className="text-sm font-bold text-white">AI Web Architect</span>
            </div>
            
            <form onSubmit={handleGenerate}>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website... (e.g., Create a neon cyberpunk profile for my Free Fire clan. Include YouTube and Discord links)."
                rows={3}
                className="w-full bg-transparent text-white placeholder-gray-600 text-lg focus:outline-none resize-none"
              ></textarea>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Zap size={14} className="text-yellow-500"/> 1 Credit required
                </span>
                <button 
                  type="submit" 
                  disabled={isGenerating || credits < 1}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-[0_0_20px_rgba(236,72,153,0.4)] disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {isGenerating ? 'Building...' : 'Generate Website'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* User's Generated Site */}
        {mySiteId && !isGenerating && (
          <div className="animate-fade-in">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Globe size={16} className="text-emerald-400"/> YOUR LIVE WEBSITE</h3>
            {sites.filter(s => s.id === mySiteId).map(site => (
              <div key={site.id} className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-md">
                <div>
                  <h4 className="text-white font-bold text-lg">{site.siteName}</h4>
                  <p className="text-xs text-emerald-400 font-mono mt-1">/site/{site.slug}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => copyLink(site.slug)} className="flex-1 md:flex-none bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition border border-white/10">
                    {copied ? <Check size={14} className="text-emerald-400"/> : <Copy size={14} />} Copy Link
                  </button>
                  <a href={`/site/${site.slug}`} target="_blank" rel="noreferrer" className="flex-1 md:flex-none bg-white text-black px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition">
                    <ExternalLink size={14} /> Visit
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
