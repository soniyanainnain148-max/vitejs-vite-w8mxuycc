import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Shield, Video, MessageCircle, Copy, Check, Loader2, Sparkles } from 'lucide-react';

export default function PublicSite({ slug }: { slug: string }) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const q = query(collection(db, "ai_sites"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setSiteData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching site:", error);
      }
      setLoading(false);
    };
    fetchSite();
  }, [slug]);

  const copyUid = () => {
    navigator.clipboard.writeText("18742319399"); // Demo UID
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin" size={40} /></div>;
  if (!siteData) return <div className="min-h-screen bg-black flex items-center justify-center text-white">404 - Website Not Found</div>;

  // AI Theme Logic
  const isNeon = siteData.prompt.toLowerCase().includes('neon') || siteData.prompt.toLowerCase().includes('cyberpunk');
  const isWhite = siteData.prompt.toLowerCase().includes('white') || siteData.prompt.toLowerCase().includes('minimal');

  const bgClass = isNeon ? 'bg-[#0f111a] text-pink-400' : isWhite ? 'bg-gray-50 text-gray-900' : 'bg-[#0d1117] text-emerald-400';
  const cardClass = isNeon ? 'bg-[#1a1d2d] border-pink-500/30' : isWhite ? 'bg-white border-gray-200 shadow-xl' : 'bg-[#161b22] border-emerald-500/30';
  const textClass = isNeon ? 'text-white' : isWhite ? 'text-gray-900' : 'text-white';

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${bgClass}`}>
      
      {/* Profile Card */}
      <div className={`w-full max-w-md p-8 rounded-3xl border relative overflow-hidden ${cardClass}`}>
        
        {isNeon && <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-3xl rounded-full"></div>}
        {!isNeon && !isWhite && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>}

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-black/20 border-2 border-current flex items-center justify-center mb-4 overflow-hidden shadow-lg">
            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug}`} alt="avatar" className="w-full h-full object-cover" />
          </div>
          
          <h1 className={`text-3xl font-bold mb-1 ${textClass}`}>{siteData.siteName}</h1>
          <p className="text-sm opacity-70 text-center mb-6 px-4">Gaming Creator | Pro Player</p>

          {/* Unique Feature: UID Copy */}
          <div className="w-full bg-black/30 border border-current/20 rounded-xl p-3 flex justify-between items-center mb-6">
            <div>
              <p className="text-[10px] uppercase font-bold opacity-60">My Free Fire UID</p>
            </div>
            <button onClick={copyUid} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-current/10 font-bold text-xs hover:bg-current/20 transition">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>

          {/* Links (Yahan Youtube ki jagah Video icon use kiya hai) */}
          <div className="w-full space-y-3">
            <a href="#" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg">
              <Video size={18} /> Subscribe on YouTube
            </a>
            <a href="#" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition shadow-lg">
              <MessageCircle size={18} /> Join Discord Server
            </a>
          </div>

          <div className="mt-8 text-[10px] opacity-50 flex items-center gap-1">
            <Sparkles size={10} /> Built with AI WebCraft
          </div>
        </div>
      </div>
    </div>
  );
}
