'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BubbleTeam {
  team: string;
  conference: string;
  tournament_probability: number;
  efficiency: number;
  wins: number;
  record: string;
}

interface EfficiencyChartProps {
  data: BubbleTeam[];
}

export default function EfficiencyChart({ data }: EfficiencyChartProps) {
  const chartData = data.map(team => ({
    name: team.team,
    efficiency: team.efficiency,
    probability: team.tournament_probability * 100,
    conference: team.conference,
    record: team.record
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; efficiency: number; probability: number; conference: string; record: string } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg" style={{ backgroundColor: 'white', color: '#111827' }}>
          <p className="font-semibold" style={{ color: '#111827' }}>{data.name}</p>
          <p className="text-sm text-gray-600" style={{ color: '#4B5563' }}>{data.conference}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Efficiency: {data.efficiency}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Tournament Prob: {data.probability.toFixed(1)}%</p>
          <p className="text-sm" style={{ color: '#111827' }}>Record: {data.record}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Efficiency vs Tournament Probability
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        Teams positioned higher and to the right have better tournament chances
      </p>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="efficiency" 
              name="Net Efficiency"
              domain={['dataMin - 5', 'dataMax + 5']}
              label={{ value: 'Net Efficiency', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="probability" 
              name="Tournament Probability (%)"
              domain={[0, 100]}
              label={{ value: 'Tournament Probability (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              name="Teams" 
              data={chartData} 
              fill="#3B82F6"
              strokeWidth={2}
              stroke="#1E40AF"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>Data shows correlation between team efficiency and tournament selection probability</p>
      </div>
    </div>
  );
} 