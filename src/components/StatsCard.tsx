export default function StatsCard({ icon, title, value, subtext, color, bgColor }: any) {
  return (
    <div className={`p-4 rounded-2xl border border-gray-800 bg-[#1a1d2d] flex flex-col justify-between min-w-[140px] shadow-lg`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl ${bgColor} ${color}`}>
          {icon}
        </div>
        <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">{title}</span>
      </div>
      <div className="flex items-end justify-between mt-2">
        <div>
          <h3 className="text-xl font-bold text-white">{value}</h3>
          <p className="text-[10px] text-gray-500 mt-1">{subtext}</p>
        </div>
        {/* Mini Sparkline Placeholder (Screenshot jaisa) */}
        <div className="w-12 h-6 flex items-end justify-end gap-0.5 opacity-50">
          <div className="w-1 h-2 bg-current rounded-t-sm"></div>
          <div className="w-1 h-3 bg-current rounded-t-sm"></div>
          <div className="w-1 h-1 bg-current rounded-t-sm"></div>
          <div className="w-1 h-4 bg-current rounded-t-sm"></div>
          <div className="w-1 h-3 bg-current rounded-t-sm"></div>
        </div>
      </div>
    </div>
  );
}
