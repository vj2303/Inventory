import React from 'react';

interface StatCardProps {
  title: string;
  value?: string;
  primaryValue?: string;
  primaryLabel?: string;
  secondaryValue?: string;
  secondaryLabel?: string;
  type: 'currency' | 'number' | 'split';
  isAlert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  primaryValue, 
  primaryLabel, 
  secondaryValue, 
  secondaryLabel, 
  type, 
  isAlert 
}) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-600 text-sm">{title}</h3>
        {isAlert && <span className="text-blue-600 text-xs cursor-pointer">See All</span>}
      </div>
      
      {type === 'split' ? (
        <div className="flex justify-between">
          <div>
            <p className="text-lg font-bold">{primaryValue}</p>
            <p className="text-xs text-gray-500">{primaryLabel}</p>
          </div>
          <div>
            <p className="text-lg font-bold">{secondaryValue}</p>
            <p className="text-xs text-gray-500">{secondaryLabel}</p>
          </div>
        </div>
      ) : (
        <p className="text-2xl font-bold">{value}</p>
      )}
    </div>
  );
};

export default StatCard;

