import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { ShieldCheck, Zap, Star, Phone, Sparkles, MapPin, ShoppingBag, ExternalLink } from 'lucide-react';

export default function PublicSite({ slug }: { slug: string }) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const q = query(collection(db, "ai_sites"), where("slug", "==", slug));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) setSiteData(snap.docs[0].data());
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0d1117]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>;
  if (!siteData) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><h1 className="text-2xl font-bold">404 - Site Not Found</h1></div>;

  const theme = siteData.themeType || 'white';
  const isNeon = theme === 'neon';
  const isHacker = theme === 'hacker';

  const bgClass = isNeon ? 'bg-[#0b0914]' : isHacker ? 'bg-[#09090b]' : 'bg-[#f8f9fa]';
  const cardBg = isNeon ? 'bg-[#150f24]/80 border-pink-500/30 backdrop-blur-xl' : isHacker ? 'bg-[#161b22]/80 border-emerald-500/30 backdrop-blur-xl' : 'bg-white border-gray-200 shadow-xl';
  const textMain = isNeon || isHacker ? 'text-white' : 'text-gray-900';
  const textSub = isNeon ? 'text-pink-200' : isHacker ? 'text-emerald-200' : 'text-gray-500';
  const accentColor = isNeon ? 'bg-pink-600' : isHacker ? 'bg-emerald-600' : 'bg-purple-600';
  const accentText = isNeon ? 'text-pink-400' : isHacker ? 'text-emerald-400' : 'text-purple-600';
  const accentGlow = isNeon ? 'shadow-[0_0_30px_rgba(236,72,153,0.3)]' : isHacker ? 'shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'shadow-xl';

  return (
    <div className={`min-h-screen ${bgClass} font-sans pb-20`}>
      
      {/* Background Glows */}
      {(isNeon || isHacker) && (
        <>
          <div className={`fixed top-0 left-1/4 w-96 h-96 ${isNeon ? 'bg-pink-600' : 'bg-emerald-600'} rounded-full blur-[120px] opacity-20 pointer-events-none`}></div>
          <div className={`fixed bottom-0 right-1/4 w-96 h-96 ${isNeon ? 'bg-purple-600' : 'bg-teal-600'} rounded-full blur-[120px] opacity-20 pointer-events-none`}></div>
        </>
      )}

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className={`flex items-center gap-2 font-extrabold text-xl tracking-tight ${textMain}`}>
            <div className={`p-1.5 rounded-lg ${accentColor}`}><Sparkles size={16} className="text-white" /></div>
            {siteData.siteName}
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="relative">
            <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-4 ${isNeon ? 'border-pink-500' : isHacker ? 'border-emerald-500' : 'border-purple-100'} p-2 relative z-10`}>
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug || 'default'}`} alt="avatar" className={`w-full h-full rounded-full object-cover ${isNeon || isHacker ? 'bg-black' : 'bg-white'}`} />
            </div>
            <div className={`absolute bottom-2 right-2 ${accentColor} text-white p-2 rounded-full z-20 shadow-lg border-2 ${isNeon || isHacker ? 'border-[#0b0914]' : 'border-white'}`}><ShieldCheck size={24} /></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${accentColor} text-white shadow-md mb-4`}><Zap size={12} className="inline mr-1"/> PRO {siteData.categoryName}</span>
            <h1 className={`text-4xl md:text-6xl font-extrabold tracking-tight mb-4 capitalize ${textMain}`}>{siteData.siteName}</h1>
            <p className={`text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0 ${textSub}`}>{siteData.bio}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href={siteData.button1Url || "#"} target="_blank" rel="noreferrer" className={`px-8 py-4 rounded-xl font-bold text-white transition-transform hover:scale-105 flex items-center justify-center gap-2 ${accentColor} ${accentGlow}`}>{siteData.button1Title || "Explore Now"}</a>
              <a href={siteData.button2Url || "#"} target="_blank" rel="noreferrer" className={`px-8 py-4 rounded-xl font-bold text-center border-2 transition-transform hover:scale-105 flex items-center justify-center gap-2 ${isNeon || isHacker ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}>{siteData.button2Title || "Contact Us"}</a>
            </div>
          </div>
        </div>

        {/* 🛒 PRODUCTS SECTION (Store) */}
        {siteData.products && siteData.products.length > 0 && (
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${textMain}`}><ShoppingBag className={accentText}/> Our Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteData.products.map((prod: any, idx: number) => (
                <div key={idx} className={`p-6 rounded-2xl border transition hover:-translate-y-1 ${cardBg} flex flex-col`}>
                  <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center opacity-50"><ShoppingBag size={32}/></div>
                  <h3 className={`font-bold text-lg mb-1 ${textMain}`}>{prod.name}</h3>
                  <p className={`text-2xl font-extrabold mb-4 ${accentText}`}>₹{prod.price}</p>
                  
                  {/* WhatsApp Order Button */}
                  <a href={prod.link || "#"} target="_blank" rel="noreferrer" className={`mt-auto w-full py-3 rounded-xl font-bold text-white text-center flex items-center justify-center gap-2 ${accentColor} ${accentGlow}`}>
                    <Phone size={16}/> Buy Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${textMain}`}><Star className={accentText}/> Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border ${cardBg}`}><div className={`w-12 h-12 rounded-xl ${accentColor} bg-opacity-20 flex items-center justify-center mb-4 ${accentText}`}><Star size={24} /></div><h3 className={`font-bold text-lg mb-2 ${textMain}`}>Premium Quality</h3><p className={`text-sm ${textSub}`}>100% genuine service.</p></div>
            <div className={`p-6 rounded-2xl border ${cardBg}`}><div className={`w-12 h-12 rounded-xl ${accentColor} bg-opacity-20 flex items-center justify-center mb-4 ${accentText}`}><Phone size={24} /></div><h3 className={`font-bold text-lg mb-2 ${textMain}`}>24/7 Support</h3><p className={`text-sm ${textSub}`}>Always available for you.</p></div>
            <div className={`p-6 rounded-2xl border ${cardBg}`}><div className={`w-12 h-12 rounded-xl ${accentColor} bg-opacity-20 flex items-center justify-center mb-4 ${accentText}`}><ShieldCheck size={24} /></div><h3 className={`font-bold text-lg mb-2 ${textMain}`}>Trusted Service</h3><p className={`text-sm ${textSub}`}>Join happy customers.</p></div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-20 pt-8 border-t text-center ${isNeon || isHacker ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-xs font-bold ${textSub} flex items-center justify-center gap-1`}><Sparkles size={14} className={accentText} /> Powered by WebCraft SaaS</p>
        </div>

      </div>
    </div>
  );
}
