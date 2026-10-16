import { useState } from 'react';
import { Plus, Play, Square, Users } from 'lucide-react';
import AccountCard from './components/AccountCard';

const dummyAccounts = [
  { id: 1, nickname: 'Power4m2c8g', uid: '18742319399', status: 'ONLINE' },
  { id: 2, nickname: 'BD-Flex55796', uid: '18743820173', status: 'IN MATCH' },
  { id: 3, nickname: 'BD-Flex16768', uid: '18743929462', status: 'IN MATCH' },
  { id: 4, nickname: '@Apx-Flex!!', uid: '18737676129', status: 'ONLINE' },
];

function App() {
  const [isRunning, setIsRunning] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <h1 className="font-bold text-gray-800 text-sm">ARPIT | Glory Push Bot</h1>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition">
            <Plus size={14} /> Add Account
          </button>
        </div>

        {/* Control Panel */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={16} /> Glory Push Control
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsRunning(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${isRunning ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Play size={16} /> START PUSH
            </button>
            <button 
              onClick={() => setIsRunning(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition ${!isRunning ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Square size={16} /> STOP PUSH
            </button>
          </div>
          {isRunning && (
            <p className="text-xs text-green-600 mt-3 text-center bg-green-50 py-2 rounded-lg border border-green-100 font-bold">
              Status: Bot is pushing glory in background...
            </p>
          )}
        </div>

        {/* Accounts List */}
        <h3 className="text-xs font-bold text-gray-400 mb-3 tracking-wider">ACCOUNTS LIST</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyAccounts.map(acc => (
            <AccountCard key={acc.id} account={acc} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
