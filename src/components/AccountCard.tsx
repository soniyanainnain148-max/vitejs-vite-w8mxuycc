import { Shield, Trash2, CheckCircle, Tag, TrendingUp, Gem } from 'lucide-react';

export default function AccountCard({ account, onDelete, onToggle }: any) {
  const isAvailable = account.status === 'AVAILABLE';
  const profit = (account.sellPrice || 0) - (account.buyPrice || 0);

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${isAvailable ? 'bg-purple-50 border-purple-100' : 'bg-red-50 border-red-100'}`}>
            <Shield size={18} className={isAvailable ? 'text-purple-600' : 'text-red-600'} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">{account.nickname}</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">UID: {account.uid}</p>
          </div>
        </div>
        <span className={`text-[9px] px-2 py-1 rounded-full border font-bold flex items-center gap-1 ${
          isAvailable ? 'text-green-600 border-green-200 bg-green-50' : 'text-red-600 border-red-200 bg-red-50'
        }`}>
          {isAvailable ? <Tag size={10} /> : <CheckCircle size={10} />}
          {isAvailable ? 'FOR SALE' : 'SOLD'}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 text-[10px] mb-4">
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="font-bold text-gray-400">BUY PRICE</p>
          <p className="text-gray-900 font-semibold mt-0.5">₹{account.buyPrice || 0}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="font-bold text-gray-400">SELL PRICE</p>
          <p className="text-blue-600 font-semibold mt-0.5">₹{account.sellPrice || 0}</p>
        </div>
        <div className="bg-green-50 p-2 rounded-lg border border-green-100">
          <p className="font-bold text-green-600 flex items-center gap-1"><TrendingUp size={10}/> PROFIT</p>
          <p className="text-green-700 font-bold mt-0.5">₹{profit}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg border border-gray-100">
        <Gem size={12} className="text-purple-500" />
        <span className="font-bold">Skins:</span> {account.skins || 'No rare skins'}
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onToggle(account.id, isAvailable ? 'SOLD' : 'AVAILABLE')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
            isAvailable 
              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
              : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
          }`}
        >
          {isAvailable ? 'MARK AS SOLD' : 'MARK AVAILABLE'}
        </button>
        <button onClick={onDelete} className="bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 px-3 py-2 rounded-lg border border-gray-200 transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
