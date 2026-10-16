import { Play, RotateCcw, RefreshCw, Trash2, Shield, CheckCircle2 } from 'lucide-react';
export default function AccountCard({ account, isSelected, onSelect }: any) {
  const progress = (account.currentExp / account.maxExp) * 100;
  return (
    <div className={`p-4 rounded-2xl border shadow-lg transition-all cursor-pointer ${isSelected ? 'border-purple-500 bg-purple-900/20' : 'bg-[#1a1d2d] border-gray-800'}`} onClick={onSelect}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-600' : 'bg-purple-900/50'}`}><Shield size={20} className="text-white" /></div>
          <div>
            <h4 className="font-bold text-sm">{account.nickname}</h4>
            <p className="text-xs text-gray-500">UID: {account.uid}</p>
          </div>
        </div>
        {isSelected && <CheckCircle2 size={18} className="text-purple-400" />}
      </div>
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1"><span className="text-teal-400 font-bold">LEVEL {account.level}</span><span className="text-gray-400">{progress.toFixed(0)}%</span></div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2"><div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
        <p className="text-xs text-center text-gray-500 bg-gray-900/50 py-1 rounded">Need {account.needExp} EXP for Level 10</p>
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-yellow-500/10 text-yellow-500 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"><Play size={14} /> STOP</button>
        <button className="flex-1 bg-gray-800 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"><RotateCcw size={14} /> RESTART</button>
        <button className="flex-1 bg-gray-800 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1"><RefreshCw size={14} /> REFRESH</button>
        <button className="bg-red-500/10 text-red-500 px-3 py-2 rounded-lg"><Trash2 size={14} /></button>
      </div>
    </div>
  );
}
