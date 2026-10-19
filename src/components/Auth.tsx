import { useState } from 'react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { Code2, Loader2, User, Lock, Mail } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // LOGIN (Email & Password se)
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // SIGNUP (Username + Email + Password)
        const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, '');
        
        if (cleanUsername.length < 3) {
          setError("Username must be at least 3 characters long.");
          setLoading(false);
          return;
        }

        // 1. Check karo ki Username pehle se exist toh nahi karta
        const q = query(collection(db, "users"), where("username", "==", cleanUsername));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          setError("This username is already taken. Try another one.");
          setLoading(false);
          return;
        }

        // 2. Naya Account Banao (Email aur Password se)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 3. Database mein Username, Email aur 0 Credits save karo
        await setDoc(doc(db, "users", userCredential.user.uid), {
          username: cleanUsername,
          email: email,
          credits: 0,
          createdAt: new Date()
        });
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') setError("This email is already registered. Try logging in.");
      else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setError("Invalid email or password.");
      else if (err.code === 'auth/weak-password') setError("Password should be at least 6 characters.");
      else setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 w-full max-w-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-600 p-3 rounded-2xl shadow-lg mb-4 text-white font-extrabold text-2xl w-14 h-14 flex items-center justify-center">
            W
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">WEBCRAFT PRO</h1>
          <p className="text-sm text-gray-500 mt-1">{isLogin ? 'Login to your account' : 'Create a new account'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg mb-4 text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Field (Sirf Signup ke waqt dikhega) */}
          {!isLogin && (
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1">Unique Username</label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. arpit_gamer" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-purple-500" 
                />
              </div>
            </div>
          )}

          {/* Email Field (Dono ke liye) */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-purple-500" 
              />
            </div>
          </div>

          {/* Password Field (Dono ke liye) */}
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-purple-500" 
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-md flex justify-center items-center gap-2 mt-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-xs font-bold text-purple-600 hover:underline">
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>

      </div>
    </div>
  );
  }
