'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UpsetAlert {
  team: string;
  seed?: number;
  upset_risk: number;
  risk_level: string;
  efficiency: number;
  reasons: string[];
}

interface UpsetRiskChartProps {
  data: UpsetAlert[];
}

export default function UpsetRiskChart({ data }: UpsetRiskChartProps) {
  // For demonstration, assign seeds based on efficiency if no seed data
  const dataWithSeeds = data.map((alert, index) => ({
    ...alert,
    seed: alert.seed || Math.min(12, Math.max(1, Math.floor((data.length - index) / 2) + 1))
  }));

  const chartData = dataWithSeeds
    .filter(alert => alert.seed && alert.seed <= 12) // Only show teams with seeds 1-12
    .map(alert => ({
      name: alert.team,
      seed: alert.seed,
      risk: alert.upset_risk * 100,
      efficiency: alert.efficiency,
      riskLevel: alert.risk_level,
      reasons: alert.reasons
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Upset Risk by Seed
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No seeded teams available for risk analysis</p>
          <p className="text-sm mt-1">Chart will appear when tournament data is available</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg" style={{ backgroundColor: 'white', color: '#111827' }}>
          <p className="font-semibold" style={{ color: '#111827' }}>{data.name}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Seed: #{data.seed}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Upset Risk: {data.risk.toFixed(1)}%</p>
          <p className="text-sm" style={{ color: '#111827' }}>Efficiency: {data.efficiency}</p>
          <p className="text-sm" style={{ color: '#111827' }}>Risk Level: {data.riskLevel}</p>
          <div className="text-xs text-gray-600 mt-1" style={{ color: '#4B5563' }}>
            <p style={{ color: '#4B5563' }}>Risk Factors:</p>
            <ul className="list-disc list-inside">
              {data.reasons.slice(0, 2).map((reason: string, idx: number) => (
                <li key={idx} style={{ color: '#4B5563' }}>{reason}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };



  const hasRealSeeds = data.some(alert => alert.seed);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Upset Risk Analysis
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        {hasRealSeeds 
          ? "Higher seeds with elevated upset risk (seeds 1-12 shown)"
          : "Team upset risk analysis (estimated seeds based on efficiency)"}
      </p>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="seed" 
              name="Seed"
              domain={[1, 12]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
              label={{ value: 'Seed', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="risk" 
              name="Upset Risk (%)"
              domain={[0, chartData.length > 0 ? Math.max(20, Math.max(...chartData.map(d => d.risk)) + 5) : 100]}
              label={{ value: 'Upset Risk (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              name="Teams" 
              data={chartData} 
              fill="#DC2626"
              strokeWidth={2}
              stroke="#991B1B"
              r={6}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded mr-2"></div>
          <span>High Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-600 rounded mr-2"></div>
          <span>Medium Risk</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded mr-2"></div>
          <span>Low Risk</span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>{hasRealSeeds 
          ? "Teams in upper-left (low seed, high risk) are most concerning for bracket predictions"
          : "Teams with high upset risk may be vulnerable in tournament play"}
        </p>
        <p className="mt-1">
          Data: {chartData.length} teams
          {chartData.length > 0 && ` • Risk range: ${Math.min(...chartData.map(d => d.risk)).toFixed(1)}% - ${Math.max(...chartData.map(d => d.risk)).toFixed(1)}%`}
        </p>
      </div>
    </div>
  );
} 