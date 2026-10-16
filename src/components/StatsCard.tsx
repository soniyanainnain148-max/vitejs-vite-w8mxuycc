export default function StatsCard({ icon, title, value, subtext, color }: any) {
  return (
    <div className="bg-[#1a1d2d] p-4 rounded-2xl border border-gray-800 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg bg-opacity-20 ${color}`}>{icon}</div>
        <span className="text-gray-400 text-sm font-medium">{title}</span>
      </div>
      <h3 className="text-2xl font-bold">{value}</h3>
      <p className="text-xs text-gray-500 mt-1">{subtext}</p>
    </div>
  );
}
