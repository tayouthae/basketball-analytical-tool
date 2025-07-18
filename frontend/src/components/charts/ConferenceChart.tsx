'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConferenceStats {
  conference: string;
  avg_efficiency: number;
  tournament_rate: number;
  top_team: string;
  teams_count: number;
}

interface ConferenceChartProps {
  data: ConferenceStats[];
}

export default function ConferenceChart({ data }: ConferenceChartProps) {
  const chartData = data
    .slice(0, 12) // Show top 12 conferences
    .map(conf => ({
      conference: conf.conference,
      efficiency: conf.avg_efficiency,
      tournamentRate: conf.tournament_rate * 100,
      topTeam: conf.top_team,
      teams: conf.teams_count
    }))
    .sort((a, b) => b.efficiency - a.efficiency);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg" style={{ backgroundColor: 'white', color: '#111827' }}>
          <p className="font-semibold" style={{ color: '#111827' }}>{label}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Avg Efficiency: {data.efficiency.toFixed(1)}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Tournament Rate: {data.tournamentRate.toFixed(0)}%</p>
          <p className="text-sm" style={{ color: '#111827' }}>Top Team: {data.topTeam}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Teams: {data.teams}</p>
        </div>
      );
    }
    return null;
  };



  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Conference Strength Rankings
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        Average efficiency by conference (top 12 shown)
      </p>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="conference" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis 
              label={{ value: 'Average Efficiency', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="efficiency" 
              fill="#3B82F6"
              stroke="#1E40AF"
              strokeWidth={1}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-4 gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
          <span>Elite (15+)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>Strong (10-15)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
          <span>Solid (5-10)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
          <span>Developing (&lt;5)</span>
        </div>
      </div>
    </div>
  );
} 