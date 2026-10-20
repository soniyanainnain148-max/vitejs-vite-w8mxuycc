import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db, storage, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ShieldCheck, Zap, Star, Sparkles, ShoppingBag, Settings, X, Plus, Trash2, Save, Loader2, MessageCircle, Image as ImageIcon, UploadCloud, Check } from 'lucide-react';

export default function PublicSite({ slug }: { slug: string }) {
  const [siteData, setSiteData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [siteDocId, setSiteDocId] = useState<string>('');
  
  // 🚀 OWNER STATE (Strict Security Check)
  const [isOwner, setIsOwner] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdLink, setNewProdLink] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const cleanSlug = decodeURIComponent(slug).trim();
    if (!cleanSlug) { setLoading(false); return; }

    // Check logged-in user
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      const q = query(collection(db, "ai_sites"), where("slug", "==", cleanSlug));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setSiteData(data);
          setSiteDocId(snap.docs[0].id);
          
          // 🚀 MAGIC: Agar logged-in user ki UID, website ke userId se match kare, toh hi Owner banega
          if (currentUser && data.userId === currentUser.uid) {
            setIsOwner(true); // Yeh banda website ka creator hai
          } else {
            setIsOwner(false); // Yeh customer/visitor hai
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

  // Photo Gallery se upload karne ka function
  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setNewProdImage(downloadURL);
      alert("✅ Photo Uploaded!");
    } catch (error) { alert("❌ Photo upload failed!"); }
    setIsUploading(false);
  };

  // Product Add karne ka function
  const handleAddProduct = async () => {
    if (!newProdName || !newProdPrice) return alert("Name aur Price zaroori hai!");
    if (isUploading) return alert("Photo upload ho rahi hai...");
    
    const newProduct = { 
      name: newProdName, 
      price: newProdPrice, 
      link: newProdLink || "#", 
      image: newProdImage || "" 
    };
    
    const updatedProducts = [...(siteData.products || []), newProduct];
    setSiteData({ ...siteData, products: updatedProducts });
    
    if (siteDocId) await updateDoc(doc(db, "ai_sites", siteDocId), { products: updatedProducts });
    
    setNewProdName(''); setNewProdPrice(''); setNewProdLink(''); setNewProdImage('');
    alert("Product Added!");
  };

  // Product Delete karne ka function (Sell hone ke baad)
  const handleDeleteProduct = async (index: number) => {
    if(!window.confirm("Kya aap is product ko delete karna chahte hain? (Sell ho gaya?)")) return;
    const updatedProducts = siteData.products.filter((_: any, i: number) => i !== index);
    setSiteData({ ...siteData, products: updatedProducts });
    if (siteDocId) await updateDoc(doc(db, "ai_sites", siteDocId), { products: updatedProducts });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><Loader2 className="animate-spin text-purple-600" size={40} /></div>;
  if (!siteData) return <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]"><h1 className="text-2xl font-bold text-gray-800">404 - Site Not Found</h1></div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-20 relative">
      
      {/* 🚀 SETTINGS BUTTON (Gear Icon): Sirf tab dikhega jab logged-in user hi is website ka owner ho */}
      {isOwner && (
        <button onClick={() => setIsEditOpen(true)} className="fixed top-6 right-6 z-50 p-3 bg-purple-600 text-white rounded-full shadow-2xl animate-pulse" title="Manage Products">
          <Settings size={24} />
        </button>
      )}

      <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2 font-extrabold text-xl text-gray-900"><Sparkles size={16} className="text-purple-600" /> {siteData.siteName}</div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-purple-100 p-2 relative z-10 bg-white shadow-xl">
            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${siteData.slug}`} alt="avatar" className="w-full h-full rounded-full object-cover" />
            <div className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full border-2 border-white"><ShieldCheck size={24} /></div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white mb-4"><Zap size={12} className="inline mr-1"/> PRO {siteData.categoryName}</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-4 capitalize">{siteData.siteName}</h1>
            <p className="text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0 text-gray-500">{siteData.bio}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a href={siteData.button1Url || "#"} className="px-8 py-4 rounded-xl font-bold text-white bg-purple-600 shadow-xl">{siteData.button1Title || "Explore Now"}</a>
              <a href={siteData.button2Url || "#"} className="px-8 py-4 rounded-xl font-bold border-2 border-gray-300 text-gray-800">{siteData.button2Title || "Contact Us"}</a>
            </div>
          </div>
        </div>

        {/* 🚀 FLIPKART STYLE PRODUCTS GRID */}
        {siteData.products && siteData.products.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900"><ShoppingBag className="text-purple-600"/> Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {siteData.products.map((prod: any, idx: number) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group">
                  <div className="w-full aspect-square bg-gray-50 relative p-4">
                    {prod.image ? <img src={prod.image} alt={prod.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><ImageIcon size={50}/></div>}
                    
                    {/* Delete Button for Owner */}
                    {isOwner && <button onClick={() => handleDeleteProduct(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg z-20" title="Delete/Remove"><Trash2 size={16} /></button>}
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-semibold text-base mb-1 line-clamp-1 text-gray-800">{prod.name}</h3>
                    <p className="text-2xl font-bold mb-4 text-gray-900">₹{prod.price}</p>
                    <a href={prod.link || "#"} target="_blank" rel="noreferrer" className="mt-auto w-full py-3 rounded-lg font-bold text-white bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2 shadow-sm"><MessageCircle size={18}/> Chat to Buy</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 🚀 OWNER EDIT PANEL (Sirf Owner ke liye) */}
      {isOwner && isEditOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsEditOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2"><Settings size={20} className="text-purple-600"/> Product Manager</h2>
            <p className="text-xs text-gray-500 mb-6">Yahan se apni website par naye products add karein.</p>
            
            <div className="space-y-4 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-200">
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Product Name</label>
                <input type="text" placeholder="e.g. T-Shirt" value={newProdName} onChange={e => setNewProdName(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:border-purple-500" />
              </div>
              
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Price (₹)</label>
                <input type="number" placeholder="e.g. 499" value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:border-purple-500" />
              </div>
              
              {/* Gallery Upload */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">Upload Photo</label>
                <div className="relative border-2 border-dashed border-purple-300 rounded-xl p-4 text-center hover:bg-purple-50 cursor-pointer transition">
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isUploading} />
                  {isUploading ? <span className="text-purple-600 text-sm font-bold flex justify-center items-center gap-2"><Loader2 className="animate-spin"/> Uploading...</span> : newProdImage ? <span className="text-green-600 text-sm font-bold flex justify-center items-center gap-2"><Check/> Photo Selected</span> : <span className="text-purple-600 text-sm font-bold flex flex-col items-center gap-1"><UploadCloud size={24}/> Tap to Upload</span>}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">WhatsApp Link (For Buyers)</label>
                <input type="text" placeholder="https://wa.me/919876543210" value={newProdLink} onChange={e => setNewProdLink(e.target.value)} className="w-full border rounded-lg p-3 text-sm focus:border-purple-500" />
              </div>
              
              <button onClick={handleAddProduct} disabled={isUploading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 shadow-md disabled:opacity-50">
                <Plus size={18}/> Add Product
              </button>
            </div>
            <button onClick={() => setIsEditOpen(false)} className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"><Save size={18}/> Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
