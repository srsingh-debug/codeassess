import React from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { 
  LineChart, 
  BarChart3, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsChartProps {
  title: string;
  data: DataPoint[];
  type: 'line' | 'bar';
  color: string;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ 
  title, 
  data, 
  type,
  color
}) => {
  // Calculate min and max values for scaling
  const values = data.map(d => d.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1; // Avoid division by zero

  // For bar chart, we need the maximum value to scale bars
  const maxBarValue = Math.max(...values, 1);

  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </CardHeader>
      <CardContent>
        {type === 'line' ? (
          <div className="h-64 flex items-end space-x-2">
            {data.map((point, index) => {
              const height = ((point.value - minValue) / range) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full ${color} rounded-t`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex items-end space-x-2">
            {data.map((point, index) => {
              const height = (point.value / maxBarValue) * 100;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-full ${color} rounded-t`}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {point.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};