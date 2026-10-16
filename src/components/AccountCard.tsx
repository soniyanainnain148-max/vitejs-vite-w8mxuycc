import { Play, Square, Shield, Trash2 } from 'lucide-react';

export default function AccountCard({ account }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
          <Shield size={20} className="text-purple-600" />
        </div>
        <div>
          <h4 className="font-bold text-sm text-gray-900">{account.nickname}</h4>
          <p className="text-xs text-gray-500">UID: {account.uid}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button className="flex-1 bg-green-50 text-green-600 border border-green-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-green-100 transition">
          <Play size={14} /> START
        </button>
        <button className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-red-100 transition">
          <Square size={14} /> STOP
        </button>
        <button className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 transition">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
