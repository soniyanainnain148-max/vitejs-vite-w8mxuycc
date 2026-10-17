import { Package, Trash2, CheckCircle, ExternalLink } from 'lucide-react';

export default function AccountCard({ account, onDelete, onToggle }: any) {
  const isActive = account.status === 'ACTIVE';

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border ${isActive ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
            <Package size={18} className={isActive ? 'text-indigo-600' : 'text-gray-500'} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-gray-900">{account.nickname}</h4>
            <p className="text-[10px] text-gray-500 mt-0.5">{account.category || 'Digital Product'}</p>
          </div>
        </div>
        <span className={`text-[9px] px-2 py-1 rounded-full border font-bold flex items-center gap-1 ${
          isActive ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-500 border-gray-200 bg-gray-50'
        }`}>
          {isActive ? <CheckCircle size={10} /> : <ExternalLink size={10} />}
          {isActive ? 'LIVE' : 'DRAFT'}
        </span>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
        <span className="text-xs font-bold text-gray-500">Price</span>
        <span className="text-lg font-bold text-indigo-600">₹{account.price || 0}</span>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onToggle(account.id, isActive ? 'DRAFT' : 'ACTIVE')}
          className={`flex-1 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition ${
            isActive 
              ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200' 
              : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100'
          }`}
        >
          {isActive ? 'MOVE TO DRAFT' : 'PUBLISH LIVE'}
        </button>
        <button onClick={onDelete} className="bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 px-3 py-2 rounded-lg border border-gray-200 transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
