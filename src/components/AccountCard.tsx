import { Play, Square, Bot, Trash2, ShoppingCart, DollarSign } from 'lucide-react';

export default function AccountCard({ account, onDelete, onToggle }: any) {
  const isRunning = account.status === 'RUNNING';
  const isStopped = account.status === 'STOPPED' || account.status === 'ONLINE';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${
            isRunning ? 'bg-blue-50 border-blue-100' : 'bg-purple-50 border-purple-100'
          }`}>
            <Bot size={18} className={isRunning ? 'text-blue-600' : 'text-purple-600'} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1">
              {account.nickname} <span className="text-[8px] text-gray-400 font-bold ml-1">STORE</span>
            </h4>
            <p className="text-[9px] text-gray-400 mt-0.5">Bot Token: {account.uid.substring(0, 15)}...</p>
          </div>
        </div>
        <span className={`text-[9px] px-2 py-1 rounded-full border font-bold flex items-center gap-1 ${
          isRunning 
            ? 'text-green-600 border-green-200 bg-green-50' 
            : 'text-gray-500 border-gray-200 bg-gray-50'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${isRunning ? 'animate-pulse' : ''}`}></span>
          {isRunning ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-2 text-[9px] mb-4 text-gray-400">
        <div className="flex items-center gap-1">
          <ShoppingCart size={12} className="text-gray-400"/>
          <div>
            <p className="font-bold">ORDERS</p>
            <p className="text-gray-900 font-semibold mt-0.5">{account.played || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <DollarSign size={12} className="text-gray-400"/>
          <div>
            <p className="font-bold">REVENUE</p>
            <p className="text-green-600 font-semibold mt-0.5">₹{account.xpEarned || 0}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isStopped ? (
          <button 
            onClick={() => onToggle(account.id, 'RUNNING')}
            className="flex-1 bg-green-50 text-green-600 hover:bg-green-100 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-green-200 transition"
          >
            <Play size={12} /> START BOT
          </button>
        ) : (
          <button 
            onClick={() => onToggle(account.id, 'STOPPED')}
            className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-red-200 transition"
          >
            <Square size={12} /> STOP BOT
          </button>
        )}
        
        <button onClick={onDelete} className="bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 px-3 py-2 rounded-lg border border-gray-200 transition">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
