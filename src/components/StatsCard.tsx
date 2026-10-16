export default function StatsCard({ icon, title, value, subtext, color, bgColor }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between min-w-[150px]">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-xl ${bgColor} ${color}`}>
          {icon}
        </div>
        <span className="text-gray-400 text-[10px] font-bold tracking-wider uppercase">{title}</span>
      </div>
      <div className="flex items-end justify-between mt-1">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-[10px] text-gray-400 mt-1">{subtext}</p>
        </div>
        {/* Mini Sparkline exactly screenshot jaisa */}
        <div className={`w-12 h-6 flex items-end justify-end gap-0.5 opacity-60 ${color}`}>
          <div className="w-1 h-2 bg-current rounded-t-sm"></div>
          <div className="w-1 h-4 bg-current rounded-t-sm"></div>
          <div className="w-1 h-1 bg-current rounded-t-sm"></div>
          <div className="w-1 h-5 bg-current rounded-t-sm"></div>
          <div className="w-1 h-3 bg-current rounded-t-sm"></div>
        </div>
      </div>
    </div>
  );
}
