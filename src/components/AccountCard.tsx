import { Play, RotateCcw, RefreshCw, Trash2, Shield, CheckCircle2 } from 'lucide-react';

export default function AccountCard({ account, isSelected, onSelect }: any) {
  const progress = (account.currentExp / account.maxExp) * 100;
  return (
    <div 
      onClick={onSelect}
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isSelected 
          ? 'border-pink-500 bg-pink-900/20 shadow-[0_0_20px_rgba(236,72,153,0.4)]' 
          : 'bg-[#1a1d2d] border-gray-800 hover:border-purple-500/50'
      }`}
    >
      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/30 rounded-full blur-2xl"></div>
      )}
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-pink-600 shadow-[0_0_10px_#ec4899]' : 'bg-purple-900/50'}`}>
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{account.nickname}</h4>
            <p className="text-[10px] text-gray-400">UID: {account.uid}</p>
          </div>
        </div>
        {isSelected && <CheckCircle2 size={18} className="text-pink-400" />}
      </div>

      <div className="mb-4 relative z-10">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-teal-400 font-bold drop-shadow-[0_0_5px_rgba(20,184,166,0.8)]">LEVEL {account.level}</span>
          <span className="text-gray-400">{progress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-800/80 rounded-full h-1.5 mb-2 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-400 to-emerald-500 h-1.5 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.8)]" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-[10px] text-center text-gray-500 bg-black/40 py-1 rounded-md border border-white/5">Need {account.needExp} EXP for Level 10</p>
      </div>

      <div className="flex gap-2 relative z-10">
        <button className="flex-1 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border border-yellow-500/20 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"><Play size={12} /> STOP</button>
        <button className="flex-1 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"><RotateCcw size={12} /> RESTART</button>
        <button className="flex-1 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"><RefreshCw size={12} /> REFRESH</button>
        <button className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 px-3 py-2 rounded-lg transition-colors"><Trash2 size={12} /></button>
      </div>
    </div>
  );
}
