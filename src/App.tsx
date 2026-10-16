import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Gamepad2, Zap, Clock, Plus, RefreshCw, Home, Bell, Menu, Search } from 'lucide-react';
import StatsCard from './components/StatsCard';
import AccountCard from './components/AccountCard';

const chartData = [
  { time: '49s', exp: 100731 }, { time: '37s', exp: 100743 },
  { time: '25s', exp: 100796 }, { time: '12s', exp: 100829 },
  { time: '0s', exp: 100844 },
];

const dummyAccounts = [
  { id: 1, nickname: 'Power4m2c8g', uid: '18742319399', status: 'ONLINE', created: '8h 32m ago', played: 169, region: 'IND', level: 9, currentExp: 1075, maxExp: 1134, needExp: 59, initialExp: 48, expGained: 5897, matches: 169 },
  { id: 2, nickname: 'BD-Flex55796', uid: '18743820173', status: 'IN MATCH', created: '8h 26m ago', played: 183, region: 'IND', level: 9, currentExp: 997, maxExp: 1134, needExp: 227, initialExp: 48, expGained: 5729, matches: 183 },
  { id: 3, nickname: 'BD-Flex16768', uid: '18743929462', status: 'IN MATCH', created: '8h 26m ago', played: 171, region: 'IND', level: 9, currentExp: 1110, maxExp: 1134, needExp: 24, initialExp: 48, expGained: 6100, matches: 171 },
  { id: 4, nickname: '@Apx-Flex!!', uid: '18737676129', status: 'ONLINE', created: '12h 19m ago', played: 147, region: 'IND', level: 9, currentExp: 850, maxExp: 1134, needExp: 284, initialExp: 48, expGained: 4500, matches: 147 },
];

function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 max-w-7xl mx-auto text-gray-800 font-sans">
      
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Home className="text-gray-400" size={20} />
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-green-500 text-[10px] font-bold border border-green-200 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> LIVE
            </span>
            <span className="font-bold text-xs tracking-wide text-gray-900">ARPIT | Level Up Bot</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm hover:bg-gray-50 transition"><RefreshCw size={12} /> Refresh</button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-md shadow-purple-200 transition"><Plus size={12} /> Add Account</button>
          <Bell size={16} className="text-gray-400 hidden sm:block" />
          <Menu size={16} className="text-gray-400 hidden sm:block" />
        </div>
      </div>

      {/* Live Updates Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] text-gray-400 font-bold tracking-wider">● LIVE UPDATES</span>
      </div>

      {/* Top Stats (Horizontal Scroll on Mobile) */}
      <div className="flex overflow-x-auto gap-3 mb-6 pb-2 scrollbar-hide">
        <StatsCard icon={<Users size={16} />} title="TOTAL ACCOUNTS" value="22" subtext="16 in match" color="text-pink-500" bgColor="bg-pink-50" />
        <StatsCard icon={<Gamepad2 size={16} />} title="MATCHES PLAYED" value="3,096" subtext="~247 / hour" color="text-blue-500" bgColor="bg-blue-50" />
        <StatsCard icon={<Zap size={16} />} title="EXP EARNED" value="+100,844" subtext="~8,052 EXP / hr" color="text-red-500" bgColor="bg-red-50" />
        <StatsCard icon={<Clock size={16} />} title="SYSTEM UPTIME" value="12:31:29" subtext="22 accounts running" color="text-purple-500" bgColor="bg-purple-50" />
      </div>

      {/* Live Graph Section */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_15px_rgba(0,0,0,0.03)] mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-gray-400 text-[10px] font-bold tracking-wider">TOTAL EXP GAINED</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">+100,844</span>
              <span className="text-green-600 text-[10px] bg-green-50 px-2 py-0.5 rounded border border-green-100 font-semibold">+96 in the last 49s</span>
            </div>
          </div>
          <div className="flex gap-1 text-[9px] bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button className="bg-purple-600 text-white px-3 py-1 rounded font-bold shadow-sm">EXP</button>
            <button className="text-gray-500 px-3 py-1 hover:text-gray-900 transition font-semibold">Matches</button>
            <button className="text-gray-500 px-3 py-1 hover:text-gray-900 transition font-semibold">Playing</button>
          </div>
        </div>
        
        {/* Dark Chart Area as per screenshot */}
        <div className="bg-[#0f111a] rounded-xl p-4 h-56 w-full relative">
          <div className="absolute top-4 left-4 bg-gray-800 text-white text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> LIVE
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
              <Area type="monotone" dataKey="exp" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-[10px]">
          <div><span className="text-gray-400 font-bold block mb-1">NOW</span><span className="text-gray-900 font-bold">+100,844</span></div>
          <div><span className="text-gray-400 font-bold block mb-1">PEAK</span><span className="text-gray-900 font-bold">+100,844</span></div>
          <div><span className="text-gray-400 font-bold block mb-1">AVERAGE</span><span className="text-gray-900 font-bold">+100,783</span></div>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h3 className="text-gray-400 text-[10px] font-bold tracking-wider flex items-center gap-2"><Users size={14}/> ACCOUNTS</h3>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search UID or nickname..." className="bg-white text-gray-800 text-xs pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-purple-500 w-full md:w-64 shadow-sm" />
          </div>
          <div className="flex gap-1 text-[9px]">
            <button className="bg-purple-600 text-white px-3 py-1.5 rounded-lg font-bold shadow-sm">ALL 22</button>
            <button className="bg-white text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:text-gray-900 transition font-bold shadow-sm">IN MATCH 16</button>
            <button className="bg-white text-gray-500 px-3 py-1.5 rounded-lg border border-gray-200 hover:text-gray-900 transition font-bold shadow-sm">ONLINE 6</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyAccounts.map(acc => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>

    </div>
  );
}

export default App;
