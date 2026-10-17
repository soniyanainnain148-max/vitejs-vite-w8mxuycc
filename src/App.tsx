import { useState, useEffect } from 'react';
import { Globe, Loader2, Code2, Wallet, Zap, Sparkles, Send, Bot, ExternalLink, Copy, Check, Activity, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-gray-800">
      
      {/* SIDEBAR (White Theme) */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between md:h-screen sticky top-0 z-40">
        <div>
          <div className="flex items-center gap-2 mb-10 px-2 mt-2">
            <div className="bg-purple-600 p-2 rounded-xl shadow-md">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-wide text-gray-900">AI WEBCRAFT</span>
          </div>
          
          <div className="flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-purple-50 text-purple-600 border border-purple-100">
              <Sparkles size={18} /> AI Generator
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">
              <Globe size={18} /> My Websites
            </button>
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition">
              <Activity size={18} /> Analytics
            </button>
          </div>
        </div>

        {/* Wallet (White Theme) */}
        <div className="mt-8 bg-gray-50 border border-gray-200 p-5 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1"><Wallet size={14}/> Credits</span>
            <span className="text-2xl font-black text-gray-900">{credits}</span>
          </div>
          <button onClick={handleTopUp} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl text-xs font-bold transition shadow-md">
            + Top-up Now
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Build with AI</h1>
            <p className="text-sm text-gray-500 mt-1">Turn your prompt into a premium website instantly.</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <Users size={18} className="text-gray-600" />
          </div>
        </div>

        {/* Stats Cards (White Theme) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-xs text-gray-400 font-bold mb-1">SITES CREATED</span>
            <span className="text-xl font-black text-gray-900">{sites.length + 1240}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-xs text-gray-400 font-bold mb-1">ACTIVE USERS</span>
            <span className="text-xl font-black text-gray-900">8,432</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-xs text-gray-400 font-bold mb-1">AI SPEED</span>
            <span className="text-xl font-black text-green-500">45ms</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-center shadow-sm">
            <span className="text-xs text-gray-400 font-bold mb-1">SERVER</span>
            <span className="text-xl font-black text-gray-900 flex items-center gap-2">Online <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span></span>
          </div>
        </div>

        {/* Prompt Box (White Theme) */}
        <div className="bg-white border border-gray-200 rounded-[2rem] p-2 mb-10 shadow-sm">
          <div className="bg-white rounded-[1.5rem] p-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="text-purple-600" size={20} />
              <span className="text-sm font-bold text-gray-900">AI Web Architect</span>
            </div>
            
            <form onSubmit={handleGenerate}>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your dream website... (e.g., Create a neon cyberpunk profile for my Free Fire clan. Include YouTube and Discord links)."
                rows={3}
                className="w-full bg-transparent text-gray-900 placeholder-gray-400 text-lg focus:outline-none resize-none"
              ></textarea>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  <Zap size={14} className="text-yellow-500"/> 1 Credit required
                </span>
                <button 
                  type="submit" 
                  disabled={isGenerating || credits < 1}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition shadow-md disabled:opacity-50"
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
    </div>
  );
}

export default App;
