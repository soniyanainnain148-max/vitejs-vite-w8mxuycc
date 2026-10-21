import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  ShieldCheck, Zap, Star, Sparkles, ShoppingBag, Settings, X, Plus, 
  Trash2, Save, Loader2, MessageCircle, Image as ImageIcon, UploadCloud, 
  Check, Camera, UserCircle, Mail, Phone, MapPin, Quote, Video, Send
} from 'lucide-react';

export default function PublicSite({ slug }: { slug: string }) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [siteDocId, setSiteDocId] = useState<string>('');
  const [isOwner, setIsOwner] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdLink, setNewProdLink] = useState('');
  
  // 🚀 MULTI-IMAGE STATE
  const [newProdImages, setNewProdImages] = useState<string[]>([]); 
  const [isUploading, setIsUploading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  useEffect(() => {
    const cleanSlug = decodeURIComponent(slug).trim();
    if (!cleanSlug) { setLoading(false); return; }

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      const q = query(collection(db, "ai_sites"), where("slug", "==", cleanSlug));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setSiteData(data);
          setSiteDocId(snap.docs[0].id);
          
          if (currentUser && data.userId === currentUser.uid) {
            setIsOwner(true); 
          } else {
            setIsOwner(false); 
          }
          setLoading(false);
        } else {
          setTimeout(() => setLoading(false), 2000);
        }
      });
      return () => unsub();
    });

    return () => unsubscribeAuth();
  }, [slug]);

  // 🚀 SMART IMAGE COMPRESSION FUNCTION (Reduces size to fit in Database)
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600; // Resize width to max 600px
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Compress to JPEG with 60% quality
          resolve(canvas.toDataURL('image/jpeg', 0.6)); 
        } else {
          resolve(base64Str);
        }
      };
    });
  };

  // 🚀 Multi-Photo Upload Handler
  const handleMultiImageUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;

    if (newProdImages.length + files.length > 4) {
      return alert("Aap maximum 4 photos upload kar sakte hain!");
    }

    setIsUploading(true);
    const base64Array: string[] = [];

    for (const file of files) {
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      
      // Compress image before saving to DB
      const compressed = await compressImage(dataUrl);
      base64Array.push(compressed);
    }

    setNewProdImages(prev => [...prev, ...base64Array]);
    setIsUploading(false);
    alert("✅ Photos Ready!");
  };

  const removeNewImage = (index: number) => {
    setNewProdImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAvatarUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAvatarUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      try {
        const compressed = await compressImage(reader.result as string);
        await updateDoc(doc(db, "ai_sites", siteDocId), { avatarUrl: compressed });
        setSiteData({ ...siteData, avatarUrl: compressed });
        alert("✅ Profile Avatar Updated!");
      } catch (error) { alert("❌ Avatar upload failed!"); }
      setIsAvatarUploading(false);
    };
  };

  const handleAddProduct = async () => {
    if (!newProdName || !newProdPrice) return alert("Name aur Price zaroori hai!");
    if (newProdImages.length === 0) return alert("Kam se kam 1 photo upload karein!");
    
    // Save array of images
    const newProduct = { 
      name: newProdName, 
      price: newProdPrice, 
      link: newProdLink || "#", 
      images: newProdImages 
    };
    
    const updatedProducts = [...(siteData.products || []), newProduct];
    setSiteData({ ...siteData, products: updatedProducts });
    
    if (siteDocId) await updateDoc(doc(db, "ai_sites", siteDocId), { products: updatedProducts });
    
    setNewProdName(''); setNewProdPrice(''); setNewProdLink(''); setNewProdImages([]);
    alert("Product Added!");
  };

  const handleDeleteProduct = async (index: number) => {
    if(!window.confirm("Kya aap is product ko delete karna chahte hain?")) return;
    const updatedProducts = siteData.products.filter((_: any, i: number) => i !== index);
    setSiteData({ ...siteData, products: updatedProducts });
    if (siteDocId) await updateDoc(doc(db, "ai_sites", siteDocId), { products: updatedProducts });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0f111a]"><Loader2 className="animate-spin text-purple-500" size={50} /></div>;
  if (!siteData) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><h1 className="text-3xl font-bold text-gray-800">404 - Site Not Found</h1></div>;

  const theme = siteData.themeType || 'white';
  const isDark = theme === 'neon' || theme === 'hacker';

  const bgClass = theme === 'neon' ? 'bg-[#0b0914]' : theme === 'hacker' ? 'bg-[#050505]' : 'bg-[#f8f9fa]';
  const textMain = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'neon' ? 'bg-[#150f24]/80 border-pink-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(236,72,153,0.15)]' : theme === 'hacker' ? 'bg-[#111111]/90 border-emerald-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-white border-gray-200 shadow-xl';
  const accentColor = theme === 'neon' ? 'bg-pink-600' : theme === 'hacker' ? 'bg-emerald-600' : 'bg-purple-600';
  const accentText = theme === 'neon' ? 'text-pink-500' : theme === 'hacker' ? 'text-emerald-500' : 'text-purple-600';
  const accentGradient = theme === 'neon' ? 'bg-gradient-to-r from-pink-500 to-purple-600' : theme === 'hacker' ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-purple-600 to-blue-600';

  return (
    <div className={`min-h-screen ${bgClass} font-sans pb-0 relative overflow-hidden transition-colors duration-500`}>
      
      {isDark && (
        <>
          <div className={`fixed top-0 left-1/4 w-96 h-96 ${theme === 'neon' ? 'bg-pink-600' : 'bg-emerald-600'} rounded-full blur-[150px] opacity-20 pointer-events-none`}></div>
          <div className={`fixed bottom-0 right-1/4 w-96 h-96 ${theme === 'neon' ? 'bg-purple-600' : 'bg-teal-600'} rounded-full blur-[150px] opacity-20 pointer-events-none`}></div>
        </>
      )}

      {isOwner && (
        <button onClick={() => setIsEditOpen(true)} className={`fixed top-6 right-6 z-50 p-3 rounded-full text-white shadow-2xl animate-bounce ${accentColor}`} title="Manage Website">
          <Settings size={26} />
        </button>
      )}

      <nav className={`w-full border-b ${isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white/80'} backdrop-blur-md sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className={`flex items-center gap-2 font-extrabold text-xl ${textMain}`}>
            <div className={`p-1.5 rounded-lg ${accentColor}`}><Sparkles size={18} className="text-white" /></div>
            {siteData.siteName}
          </div>
          <div className="flex items-center gap-4">
            <a href="#products" className={`text-sm font-bold ${textSub} hover:${textMain}`}>Products</a>
            <a href="#about" className={`text-sm font-bold ${textSub} hover:${textMain}`}>About</a>
            <a href={`https://wa.me/`} target="_blank" className={`px-4 py-2 rounded-lg text-xs font-bold text-white shadow-lg ${accentGradient}`}>Contact Us</a>
          </div>
        </div>
      </nav>

      <header className="max-w-6xl mx-auto px-4 pt-16 pb-24 text-center relative z-10" id="about">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className={`w-36 h-36 md:w-48 md:h-48 rounded-full border-4 ${isDark ? 'border-white/20' : 'border-purple-100'} p-2 relative shadow-2xl overflow-hidden`}>
            {siteData.avatarUrl ? (
              <img src={siteData.avatarUrl} alt="avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
            )}
            <div className={`absolute bottom-2 right-2 p-2 rounded-full border-2 ${isDark ? 'border-[#050505]' : 'border-white'} text-white shadow-lg ${accentColor}`}>
              <ShieldCheck size={28} />
            </div>
          </div>
        </div>
        
        <span className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold text-white mb-6 shadow-md ${accentGradient}`}>
          <Zap size={14} /> OFFICIAL {siteData.categoryName} STORE
        </span>
        
        <h1 className={`text-5xl md:text-7xl font-extrabold tracking-tight mb-6 ${textMain}`}>
          Welcome to <br className="md:hidden"/> <span className={`text-transparent bg-clip-text ${accentGradient}`}>{siteData.siteName}</span>
        </h1>
        
        <p className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${textSub}`}>
          {siteData.bio}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#products" className={`px-8 py-4 rounded-xl font-bold text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2 ${accentGradient}`}>
            <ShoppingBag size={20} /> Explore Products
          </a>
          <a href={`https://wa.me/`} target="_blank" className={`px-8 py-4 rounded-xl font-bold border-2 flex items-center justify-center gap-2 transition ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}>
            <MessageCircle size={20} /> Chat With Owner
          </a>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-16 relative z-10" id="products">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className={`text-3xl md:text-4xl font-extrabold flex items-center gap-3 ${textMain}`}>
              <ShoppingBag size={32} className={accentText} /> Featured Products
            </h2>
            <p className={`mt-2 ${textSub}`}>Check out our latest collections.</p>
          </div>
        </div>

        {siteData.products && siteData.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteData.products.map((prod: any, idx: number) => (
              <div key={idx} className={`rounded-2xl border transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden group ${cardBg}`}>
                
                {/* 🚀 MULTI IMAGE SLIDER IN CARD */}
                <div className={`w-full aspect-square relative p-6 ${isDark ? 'bg-black/50' : 'bg-gray-50'} overflow-hidden`}>
                  <div className="flex overflow-x-auto snap-x snap-mandatory h-full w-full scrollbar-hide">
                    {prod.images && prod.images.length > 0 ? (
                      prod.images.map((img: string, i: number) => (
                        <img key={i} src={img} alt={`${prod.name}-${i}`} className="w-full h-full object-contain flex-shrink-0 snap-center group-hover:scale-110 transition-transform duration-500" />
                      ))
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-30 flex-shrink-0"><ImageIcon size={60} className={textMain}/></div>
                    )}
                  </div>
                  
                  {/* Photo Count Badge */}
                  {prod.images && prod.images.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm z-10">
                      {prod.images.length} Photos
                    </div>
                  )}

                  <div className={`absolute top-4 left-4 px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider text-white shadow-md ${accentColor}`}>
                    New
                  </div>
                  {isOwner && (
                    <button onClick={() => handleDeleteProduct(idx)} className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg z-20" title="Delete Product">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className={`font-bold text-lg mb-2 line-clamp-1 ${textMain}`}>{prod.name}</h3>
                  <p className={`text-3xl font-extrabold mb-6 ${accentText}`}>₹{prod.price}</p>
                  <a href={prod.link || "#"} target="_blank" rel="noreferrer" className={`mt-auto w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 ${accentGradient}`}>
                    <MessageCircle size={18}/> Buy Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 rounded-2xl border-2 border-dashed ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
            <ShoppingBag size={48} className={`mx-auto mb-4 opacity-50 ${textSub}`} />
            <h3 className={`text-xl font-bold ${textMain}`}>No Products Added Yet</h3>
            <p className={`mt-2 ${textSub}`}>Products added by the owner will appear here.</p>
          </div>
        )}
      </section>

      <section className={`py-20 ${isDark ? 'bg-black/30' : 'bg-purple-50/50'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${textMain}`}>What Our Customers Say</h2>
            <p className={textSub}>Real reviews from real buyers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className={`p-6 rounded-2xl border relative ${cardBg}`}>
                <Quote size={40} className={`absolute top-4 right-4 opacity-10 ${accentText}`} />
                <div className="flex gap-1 mb-4 text-yellow-500">
                  <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" /> <Star size={16} fill="currentColor" />
                </div>
                <p className={`text-sm leading-relaxed mb-6 ${textSub}`}>
                  "Bhai bahut hi badhiya service hai. Product bilkul waisa hi mila jaisa dikhaya gaya tha. Delivery bhi super fast thi. Highly recommended!"
                </p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${accentColor}`}>
                    U{item}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${textMain}`}>Verified Buyer {item}</h4>
                    <p className={`text-[10px] ${textSub}`}>2 days ago</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className={`pt-16 pb-8 border-t ${isDark ? 'border-white/10 bg-[#050505]' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className={`flex items-center gap-2 font-extrabold text-2xl mb-4 ${textMain}`}>
                <div className={`p-2 rounded-xl ${accentColor}`}><Sparkles size={20} className="text-white" /></div>
                {siteData.siteName}
              </div>
              <p className={`text-sm max-w-sm mb-6 ${textSub}`}>
                Your one-stop destination for premium quality {siteData.categoryName.toLowerCase()} products. We ensure 100% satisfaction and fast delivery.
              </p>
              <div className="flex gap-4">
                <a href="#" className={`p-2 rounded-full border ${isDark ? 'border-white/20 text-gray-400 hover:text-white hover:border-white' : 'border-gray-300 text-gray-500 hover:text-purple-600 hover:border-purple-600'} transition`}><Camera size={18}/></a>
                <a href="#" className={`p-2 rounded-full border ${isDark ? 'border-white/20 text-gray-400 hover:text-white hover:border-white' : 'border-gray-300 text-gray-500 hover:text-red-600 hover:border-red-600'} transition`}><Video size={18}/></a>
                <a href="#" className={`p-2 rounded-full border ${isDark ? 'border-white/20 text-gray-400 hover:text-white hover:border-white' : 'border-gray-300 text-gray-500 hover:text-blue-500 hover:border-blue-500'} transition`}><Send size={18}/></a>
              </div>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${textMain}`}>Quick Links</h4>
              <ul className={`space-y-2 text-sm ${textSub}`}>
                <li><a href="#" className="hover:underline">Home</a></li>
                <li><a href="#products" className="hover:underline">Products</a></li>
                <li><a href="#about" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className={`font-bold mb-4 ${textMain}`}>Get in Touch</h4>
              <ul className={`space-y-3 text-sm ${textSub}`}>
                <li className="flex items-center gap-2"><Mail size={16} className={accentText}/> support@webcraft.com</li>
                <li className="flex items-center gap-2"><Phone size={16} className={accentText}/> +91 98765 43210</li>
                <li className="flex items-center gap-2"><MapPin size={16} className={accentText}/> India</li>
              </ul>
            </div>
          </div>

          <div className={`pt-8 border-t text-center flex flex-col md:flex-row justify-between items-center gap-4 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
            <p className={`text-xs ${textSub}`}>© {new Date().getFullYear()} {siteData.siteName}. All rights reserved.</p>
            <p className={`text-xs flex items-center gap-1 ${textSub}`}>Powered by <span className={`font-bold ${accentText}`}>WebCraft SaaS</span></p>
          </div>
        </div>
      </footer>

      {isOwner && isEditOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2"><Settings size={24} className="text-purple-600"/> Owner Panel</h2>
            <p className="text-xs text-gray-500 mb-6">Manage your website content and products.</p>
            
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-8">
              <h3 className="text-sm font-bold text-purple-800 mb-4 flex items-center gap-2"><UserCircle size={18}/> Update Profile Avatar</h3>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-white border-4 border-purple-200 overflow-hidden shadow-md">
                  {siteData.avatarUrl ? <img src={siteData.avatarUrl} className="w-full h-full object-cover" /> : <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug}`} className="w-full h-full object-cover" />}
                </div>
                <div className="relative flex-1">
                  <button className="w-full bg-white border-2 border-purple-300 text-purple-700 font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm transition hover:bg-purple-100">
                    {isAvatarUploading ? <Loader2 className="animate-spin" size={16}/> : <Camera size={16}/>} 
                    {isAvatarUploading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isAvatarUploading} />
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-purple-600"/> Add New Product</h3>
              <div className="space-y-4 bg-gray-50 p-5 rounded-2xl border border-gray-200">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Product Name</label>
                  <input type="text" placeholder="e.g. Premium T-Shirt" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Price (₹)</label>
                  <input type="number" placeholder="e.g. 499" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                </div>
                
                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">Product Photos (Max 4)</label>
                  <div className="relative border-2 border-dashed border-purple-300 rounded-xl p-4 text-center hover:bg-purple-50 cursor-pointer transition">
                    <input type="file" multiple accept="image/*" onChange={handleMultiImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} />
                    {isUploading ? <span className="text-purple-600 text-sm font-bold flex justify-center items-center gap-2"><Loader2 className="animate-spin"/> Processing & Compressing...</span> : <span className="text-purple-600 text-sm font-bold flex flex-col items-center gap-1"><UploadCloud size={24}/> Tap to Select Photos</span>}
                  </div>
                  
                  {/* Preview Uploaded Photos */}
                  {newProdImages.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                      {newProdImages.map((img, i) => (
                        <div key={i} className="relative w-16 h-16 flex-shrink-0 border border-gray-300 rounded-lg overflow-hidden group">
                          <img src={img} className="w-full h-full object-cover" />
                          <button onClick={() => removeNewImage(i)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 opacity-0 group-hover:opacity-100 transition"><X size={12}/></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block uppercase">WhatsApp Link (Buy)</label>
                  <input type="text" placeholder="https://wa.me/91..." value={newProdLink} onChange={e => setNewProdLink(e.target.value)} className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
                </div>
                
                <button onClick={handleAddProduct} disabled={isUploading || newProdImages.length === 0} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-lg transition mt-2 disabled:opacity-50">
                  <Plus size={20}/> Add Product to Store
                </button>
              </div>
            </div>

            <button onClick={() => setIsEditOpen(false)} className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition">
              <Save size={20}/> Save & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
            }
