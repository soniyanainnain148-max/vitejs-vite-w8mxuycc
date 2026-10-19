import { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { Code2, Loader2, Mail, Lock } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
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
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 w-full max-w-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-600 p-3 rounded-2xl shadow-lg mb-4">
            <Code2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">WEBCRAFT PRO</h1>
          <p className="text-sm text-gray-500 mt-1">{isLogin ? 'Login to your account' : 'Create a new account'}</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 text-xs p-3 rounded-lg mb-4 text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 block mb-1">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
              <input 
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-sm focus:outline-none focus:border-purple-500" 
              />
            </div>
          </div>

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
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
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
