import { Play, RotateCcw, RefreshCw, Trash2, Shield, CheckCircle2 } from 'lucide-react';

export default function AccountCard({ account }: any) {
  const progress = (account.currentExp / account.maxExp) * 100;
  
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.03)] w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-lg relative border border-purple-100">
            <Shield size={18} className="text-purple-600" />
            <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-[8px] font-bold px-1 rounded">59</span>
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

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-2 text-[9px] mb-4 text-gray-400">
        <div>
          <p className="font-bold">CREATED</p>
          <p className="text-gray-900 font-semibold mt-0.5">{account.created}</p>
        </div>
        <div>
          <p className="font-bold">PLAYED</p>
          <p className="text-gray-900 font-semibold mt-0.5">{account.played}</p>
        </div>
        <div>
          <p className="font-bold">REGION</p>
          <p className="text-gray-900 font-semibold mt-0.5">{account.region}</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-teal-600 font-bold">LEVEL {account.level}</span>
          <span className="text-gray-400 font-bold">MATCHES: {account.matches}</span>
        </div>
        <div className="flex justify-between text-[9px] mb-1.5">
          <span className="text-gray-500 font-semibold">{account.currentExp} / {account.maxExp} EXP</span>
          <span className="text-gray-500 font-semibold">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2 overflow-hidden">
          <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-[9px] text-center text-gray-400 font-semibold bg-gray-50 py-1.5 rounded-md border border-gray-100">Need {account.needExp} EXP for Level 10</p>
      </div>

      {/* EXP Stats */}
      <div className="grid grid-cols-3 gap-2 text-[9px] mb-4">
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-400 font-bold">INITIAL EXP</p>
          <p className="text-gray-900 font-bold mt-1">{account.initialExp}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-400 font-bold">CURRENT EXP</p>
          <p className="text-gray-900 font-bold mt-1">{account.currentExp}</p>
        </div>
        <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
          <p className="text-gray-400 font-bold">EXP GAINED</p>
          <p className="text-green-600 font-bold mt-1">+{account.expGained}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-yellow-200 transition">
          <Play size={12} /> STOP
        </button>
        <button className="flex-1 bg-white hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-gray-200 transition">
          <RotateCcw size={12} /> RESTART
        </button>
        <button className="flex-1 bg-white hover:bg-gray-50 text-gray-600 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-gray-200 transition">
          <RefreshCw size={12} /> REFRESH
        </button>
        <button className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg border border-red-100 transition">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
