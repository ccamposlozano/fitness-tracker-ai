import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface MacroData {
  name: string;
  actual: number;
  target: number;
  color: string;
  unit: string;
}

interface MacroProgressChartProps {
  data: MacroData[];
}

export const MacroProgressChart: React.FC<MacroProgressChartProps> = ({ data }) => {
  const formatValue = (value: number, unit: string) => {
    return unit === 'kcal' ? `${Math.round(value)} kcal` : `${Math.round(value)}g`;
  };

  const calculateProgress = (actual: number, target: number) => {
    if (!target) return 0;
    return Math.min((actual / target) * 100, 100);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const progress = calculateProgress(data.actual, data.target);

      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded shadow-lg">
          <p className="text-white font-medium">{data.name}</p>
          <div className="mt-2 space-y-1">
            <p className="text-gray-300">
              <span className="text-gray-400">Actual:</span> {formatValue(data.actual, data.unit)}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Target:</span> {formatValue(data.target, data.unit)}
            </p>
            <p className="text-gray-300">
              <span className="text-gray-400">Progress:</span> {progress.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Process the data to include percentage progress
  const processedData = data.map(item => ({
    ...item,
    progress: calculateProgress(item.actual, item.target),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="progress"
            radius={[0, 4, 4, 0]}
            label={{
              position: 'right',
              fill: '#9CA3AF',
              formatter: (value: number) => `${value.toFixed(1)}%`,
            }}
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
