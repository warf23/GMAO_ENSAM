
import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
} from 'recharts';

type ParetoData = {
  name: string;
  value: number;
  cumulative?: number;
};

type ParetoChartProps = {
  data: ParetoData[];
  title: string;
  height?: number;
};

export const ParetoChart = ({ data, title, height = 300 }: ParetoChartProps) => {
  const [chartData, setChartData] = useState<ParetoData[]>([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Sort data by value in descending order
      const sortedData = [...data].sort((a, b) => b.value - a.value);
      
      // Calculate total
      const total = sortedData.reduce((sum, item) => sum + item.value, 0);
      
      // Calculate cumulative percentages
      let cumulativeSum = 0;
      const processedData = sortedData.map(item => {
        cumulativeSum += item.value;
        return {
          ...item,
          cumulative: Math.round((cumulativeSum / total) * 100),
        };
      });
      
      setChartData(processedData);
    }
  }, [data]);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            label={{ 
              value: 'Causes', 
              position: 'insideBottomRight', 
              offset: -10 
            }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis 
            yAxisId="left"
            label={{ 
              value: 'Nombre d\'occurrences', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle' }
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 100]}
            label={{ 
              value: 'Pourcentage cumulé', 
              angle: -90, 
              position: 'insideRight',
              style: { textAnchor: 'middle' }
            }}
          />
          <Tooltip formatter={(value, name) => {
            if (name === 'cumulative') return [`${value}%`, 'Pourcentage cumulé'];
            return [value, 'Nombre d\'occurrences'];
          }} />
          <Legend />
          <Bar yAxisId="left" dataKey="value" fill="#007BFF" name="Occurrences" />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#FF4757" 
            name="Pourcentage cumulé"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
