import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Video, MessageCircle, Copy, Check, Loader2, Sparkles, ShieldCheck, Zap } from 'lucide-react';

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
      } catch (error) { console.error(error); }
      setLoading(false);
    };
    fetchSite();
  }, [slug]);

  const copyUid = () => {
    navigator.clipboard.writeText("18742319399");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-pink-500"><Loader2 className="animate-spin" size={40} /></div>;
  if (!siteData) return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-white font-bold text-xl">404 - Site Not Found</div>;

  // Dynamic Theme Logic based on prompt
  const promptLower = siteData.prompt.toLowerCase();
  const isNeon = promptLower.includes('neon') || promptLower.includes('cyberpunk') || promptLower.includes('pink');
  const isEmrald = promptLower.includes('green') || promptLower.includes('hacker');

  const mainGradient = isNeon ? 'from-pink-500 to-purple-600' : isEmrald ? 'from-emerald-400 to-teal-600' : 'from-blue-500 to-indigo-600';
  const shadowGlow = isNeon ? 'shadow-[0_0_40px_rgba(236,72,153,0.3)]' : isEmrald ? 'shadow-[0_0_40px_rgba(16,185,129,0.3)]' : 'shadow-[0_0_40px_rgba(59,130,246,0.3)]';

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glowing Orbs */}
      <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-gradient-to-r ${mainGradient}`}></div>
      <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20 bg-gradient-to-r ${mainGradient}`}></div>

      {/* Main Glass Card */}
      <div className={`w-full max-w-sm p-8 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 relative z-10 ${shadowGlow} transition-all duration-500 hover:scale-[1.02]`}>
        
        <div className="flex flex-col items-center">
          {/* Avatar with glow ring */}
          <div className="relative mb-6">
            <div className={`absolute inset-0 rounded-full blur-md opacity-50 bg-gradient-to-r ${mainGradient}`}></div>
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug}`} 
              alt="avatar" 
              className="w-28 h-28 rounded-full border-2 border-white/20 relative z-10 bg-[#09090b] p-1" 
            />
            <div className="absolute -bottom-2 -right-2 bg-white text-black p-1 rounded-full z-20 shadow-lg">
              <ShieldCheck size={16} />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">{siteData.siteName}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1 text-[10px] font-bold text-white/80 bg-white/10 px-3 py-1 rounded-full border border-white/5">
              <Zap size={12} className={isNeon ? 'text-pink-400' : 'text-emerald-400'} /> PRO CREATOR
            </span>
          </div>

          {/* Bio from prompt */}
          <p className="text-sm text-gray-300 text-center mb-8 px-2 line-clamp-2">
            {siteData.prompt}
          </p>

          {/* Copy UID Feature */}
          <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 flex justify-between items-center mb-6 hover:bg-black/60 transition cursor-pointer" onClick={copyUid}>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-0.5">Free Fire UID</p>
              <p className="text-white font-mono font-bold text-sm">18742319399</p>
            </div>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${mainGradient} text-white shadow-lg`}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </div>
          </div>

          {/* Links */}
          <div className="w-full space-y-3">
            <a href="#" className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold transition hover:scale-105 bg-gradient-to-r ${mainGradient} ${shadowGlow}`}>
              <Video size={18} /> Watch my Videos
            </a>
            <a href="#" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 transition hover:scale-105">
              <MessageCircle size={18} /> Join Community
            </a>
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
            <Sparkles size={12} /> Powered by AI WebCraft
          </div>
        </div>
      </div>
    </div>
  );
}
