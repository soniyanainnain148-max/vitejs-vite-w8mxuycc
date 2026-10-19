import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Video, MessageCircle, Copy, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function PublicSite({ slug }: { slug: string }) {
  // 🚀 DEFAULT DATA: Yeh turant screen par dikhega (bina loading ke)
  const [siteData, setSiteData] = useState<any>({
    siteName: slug.split('-')[0] || 'My Portfolio',
    bio: "Welcome to my official gaming profile.",
    hasYoutube: true,
    hasDiscord: true,
    slug: slug
  });
  
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const q = query(collection(db, "ai_sites"), where("slug", "==", slug));
        const querySnapshot = await getDocs(q);
        // Agar database mein data mil gaya, toh design update ho jayega
        if (!querySnapshot.empty) {
          setSiteData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching site:", error);
      }
    };
    
    if (slug) {
      fetchSite();
    }
  }, [slug]);

  const copyUid = () => {
    navigator.clipboard.writeText("18742319399");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Koi Loading spinner nahi, seedha UI render hoga
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 relative font-sans">
      
      <div className="w-full max-w-sm p-8 rounded-[2rem] bg-white border border-gray-200 shadow-xl relative z-10 transition-all duration-500 hover:scale-[1.02]">
        
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug || 'default'}`} 
              alt="avatar" 
              className="w-28 h-28 rounded-full border-4 border-purple-50 relative z-10 bg-white p-1 shadow-sm" 
            />
            <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1 rounded-full z-20 shadow-md">
              <ShieldCheck size={16} />
            </div>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight capitalize">{siteData.siteName}</h1>
          
          <div className="flex items-center gap-2 mb-6">
            <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              <Zap size={12} /> PRO CREATOR
            </span>
          </div>

          <p className="text-sm text-gray-500 text-center mb-8 px-2 line-clamp-2">
            {siteData.bio}
          </p>

          <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 flex justify-between items-center mb-6 hover:bg-gray-100 transition cursor-pointer" onClick={copyUid}>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">Free Fire UID</p>
              <p className="text-gray-900 font-mono font-bold text-sm">18742319399</p>
            </div>
            <div className="p-2 rounded-lg bg-purple-600 text-white shadow-md">
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </div>
          </div>

          <div className="w-full space-y-3">
            {siteData.hasYoutube && (
              <a href="#" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-bold transition hover:bg-purple-700 bg-purple-600 shadow-md">
                <Video size={18} /> Watch my Videos
              </a>
            )}
            {siteData.hasDiscord && (
              <a href="#" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold border border-gray-200 transition">
                <MessageCircle size={18} /> Join Community
              </a>
            )}
          </div>

          <div className="mt-8 flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <Sparkles size={12} /> Powered by AI WebCraft
          </div>
        </div>
      </div>
    </div>
  );
}
