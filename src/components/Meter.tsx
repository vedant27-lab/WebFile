// src/components/Meter.tsx
"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

type MeterProps = {
  title: string;
  value: number | undefined;
  unit: string;
  min: number;
  max: number;
  color: string;
};

const Meter = ({ title, value = 0, unit, min, max, color }: MeterProps) => {
  const data = [{ name: title, value }];
  const domain = [min, max];
  const endAngle = -270; // Make it a full circle starting from the top
  const percentage = max > 0 ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div className="relative flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-400">{title}</h3>
      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="70%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={endAngle}
            barSize={20}
            cy="60%"
          >
            <PolarAngleAxis type="number" domain={domain} angleAxisId={0} tick={false} />
            <RadialBar
              background={{ fill: '#374151' }} // Gray background track
              dataKey="value"
              angleAxisId={0}
              fill={color}
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Digital Readout */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[20%] text-center">
          <p className="text-4xl font-bold text-white">{value.toFixed(1)}</p>
          <p className="text-lg text-gray-300">{unit}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-400">{percentage.toFixed(0)}% of Max</p>
    </div>
  );
};

export default Meter;