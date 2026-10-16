import { Play, RotateCcw, RefreshCw, Trash2, Shield, CheckCircle2 } from 'lucide-react';

export default function AccountCard({ account }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm w-full">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
            <Shield size={18} className="text-purple-600" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1">
              {account.nickname} <span className="text-[8px] text-gray-400 font-bold ml-1">IND</span>
            </h4>
            <p className="text-[9px] text-gray-400 mt-0.5">UID: {account.uid}</p>
          </div>
        </div>
        <span className={`text-[9px] px-2 py-1 rounded-full border font-bold flex items-center gap-1 ${
          account.status === 'ONLINE' ? 'text-green-600 border-green-200 bg-green-50' : 'text-yellow-600 border-yellow-200 bg-yellow-50'
        }`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {account.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[9px] mb-4 text-gray-400">
        <div>
          <p className="font-bold">CREATED</p>
          <p className="text-gray-900 font-semibold mt-0.5">{account.created}</p>
        </div>
        <div>
          <p className="font-bold">PLAYED</p>
          <p className="text-gray-900 font-semibold mt-0.5">{account.played}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-yellow-200 transition">
          <Play size={12} /> START
        </button>
        <button className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-red-200 transition">
          <Trash2 size={12} /> STOP
        </button>
        <button className="bg-gray-50 text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg border border-gray-200 transition">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
