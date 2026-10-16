export default function StatsCard({ icon, title, value, subtext, color }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"></div>
      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <span className="text-gray-400 text-xs font-medium tracking-wider">{title}</span>
      </div>
      <h3 className="text-2xl font-bold text-white relative z-10 drop-shadow-md">{value}</h3>
      <p className="text-[10px] text-gray-400 mt-1 relative z-10">{subtext}</p>
    </div>
  );
}
