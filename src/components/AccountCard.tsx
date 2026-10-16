import { Play, RotateCcw, RefreshCw, Trash2, Shield, CheckCircle2 } from 'lucide-react';

export default function AccountCard({ account }: any) {
  const progress = (account.currentExp / account.maxExp) * 100;
  
  return (
    <div className="bg-[#1a1d2d] p-4 rounded-2xl border border-gray-800 shadow-lg w-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-900/50 p-2 rounded-lg relative">
            <Shield size={18} className="text-purple-400" />
            <span className="absolute -bottom-1 -right-1 bg-purple-500 text-[8px] font-bold px-1 rounded">59</span>
          </div>
          <div>
            <h4 className="font-bold text-xs text-white flex items-center gap-1">
              {account.nickname} <span className="text-[8px] text-gray-500 font-normal">IND</span>
            </h4>
            <p className="text-[9px] text-gray-500 mt-0.5">UID: {account.uid}</p>
          </div>
        </div>
        <span className={`text-[9px] px-2 py-1 rounded-full border font-bold ${
          account.status === 'ONLINE' ? 'text-green-400 border-green-400/30 bg-green-400/10' : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
        }`}>
          ● {account.status}
        </span>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-3 gap-2 text-[9px] mb-4 text-gray-500">
        <div>
          <p className="font-bold text-gray-600">CREATED</p>
          <p className="text-white mt-0.5">{account.created}</p>
        </div>
        <div>
          <p className="font-bold text-gray-600">PLAYED</p>
          <p className="text-white mt-0.5">{account.played}</p>
        </div>
        <div>
          <p className="font-bold text-gray-600">REGION</p>
          <p className="text-white mt-0.5">{account.region}</p>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-teal-400 font-bold">LEVEL {account.level}</span>
          <span className="text-gray-500 font-bold">MATCHES: {account.matches}</span>
        </div>
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-gray-400">{account.currentExp} / {account.maxExp} EXP</span>
          <span className="text-gray-400">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
          <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-[9px] text-center text-gray-500 bg-black/30 py-1 rounded">Need {account.needExp} EXP for Level 10</p>
      </div>

      {/* EXP Stats */}
      <div className="grid grid-cols-3 gap-2 text-[9px] mb-4">
        <div className="bg-black/30 p-2 rounded">
          <p className="text-gray-500 font-bold">INITIAL EXP</p>
          <p className="text-white mt-1">{account.initialExp}</p>
        </div>
        <div className="bg-black/30 p-2 rounded">
          <p className="text-gray-500 font-bold">CURRENT EXP</p>
          <p className="text-white mt-1">{account.currentExp}</p>
        </div>
        <div className="bg-black/30 p-2 rounded">
          <p className="text-gray-500 font-bold">EXP GAINED</p>
          <p className="text-green-400 mt-1">+{account.expGained}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button className="flex-1 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-yellow-500/20 transition">
          <Play size={12} /> STOP
        </button>
        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-gray-700 transition">
          <RotateCcw size={12} /> RESTART
        </button>
        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1 border border-gray-700 transition">
          <RefreshCw size={12} /> REFRESH
        </button>
        <button className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 py-2 rounded-lg border border-red-500/20 transition">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
