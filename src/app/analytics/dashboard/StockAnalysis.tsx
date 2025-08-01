import { useState } from 'react';

const StockAnalysis = () => {
  
  const stockData = [
    { 
      label: 'Stock In Hand', 
      percentage: 30, 
      color: '#F47D4F',
      countries: [
        { name: 'Dubai', value: 25000 },
        { name: 'Algeria', value: 15000 },
        { name: 'Croatia', value: 7000 },
        { name: 'Egypt', value: 3000 },
        { name: 'Egypt', value: 3000 },
        { name: 'Egypt', value: 3000 },
        { name: 'Egypt', value: 3000 },
        { name: 'Egypt', value: 3000 },
        { name: 'Egypt', value: 3000 }
      ]
    },
    { 
      label: 'Cash In Hand', 
      percentage: 25, 
      color: '#8CA5B8',
      countries: [
        { name: 'Dubai', value: 20000 },
        { name: 'Algeria', value: 12000 },
        { name: 'Croatia', value: 6000 },
        { name: 'Egypt', value: 2500 }
      ]
    },
    { 
      label: 'Unpaid Stock In Transit', 
      percentage: 20, 
      color: '#9747FF',
      countries: [
        { name: 'Dubai', value: 18000 },
        { name: 'Algeria', value: 10000 },
        { name: 'Croatia', value: 5000 }
      ]
    },
    { 
      label: 'O/S in Market', 
      percentage: 15, 
      color: '#57BED3',
      countries: [
        { name: 'Dubai', value: 15000 },
        { name: 'Algeria', value: 8000 },
        { name: 'Croatia', value: 3000 }
      ]
    },
    { 
      label: 'Paid Stock in Transit', 
      percentage: 10, 
      color: '#A2D36E',
      countries: [
        { name: 'Dubai', value: 10000 },
        { name: 'Algeria', value: 6000 },
        { name: 'Croatia', value: 2000 }
      ]
    },
  ];

  const totalExpenses = 20210230.32;
  const [selectedStock, setSelectedStock] = useState(stockData[0]);

  // Handle donut segment click
  const handleSegmentClick = (stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Stock Analysis</h2>
        <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2">
          <span>Export</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Donut chart on the left */}
        <div className="relative w-full md:w-3/5 flex items-center justify-center">
          <DonutChartWithLabels 
            data={stockData} 
            totalExpenses={totalExpenses} 
            onSegmentClick={handleSegmentClick}
            selectedStock={selectedStock}
          />
        </div>

        {/* Country wise bifurcation on the right */}
        <div className="w-full md:w-2/5 mt-6 md:mt-0">
          <div className="mb-4">
            <h3 className="text-gray-500 font-medium">Country Vise Bifercation</h3>
            <div className="flex items-baseline">
              <span className="text-5xl font-bold text-orange-400">{selectedStock.percentage}%</span>
              <span className="ml-2 text-xl font-semibold">{selectedStock.label}</span>
            </div>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {selectedStock.countries.map((country, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-500">{country.name}</span>
                <div className="flex items-baseline">
                  <span className="font-bold text-lg">${country.value.toLocaleString()}</span>
                  <span className="text-gray-300 text-sm">.00</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// DonutChart component with connected labels
const DonutChartWithLabels = ({ data, totalExpenses, onSegmentClick, selectedStock }) => {
  const radius = 35;
  const innerRadius = 20;
  const center = 50;
  
  // Calculate paths for donut segments
  const getSegmentPath = (startAngle, endAngle) => {
    const x1 = center + radius * Math.cos((startAngle - 90) * (Math.PI / 180));
    const y1 = center + radius * Math.sin((startAngle - 90) * (Math.PI / 180));
    const x2 = center + radius * Math.cos((endAngle - 90) * (Math.PI / 180));
    const y2 = center + radius * Math.sin((endAngle - 90) * (Math.PI / 180));
    
    const innerX1 = center + innerRadius * Math.cos((startAngle - 90) * (Math.PI / 180));
    const innerY1 = center + innerRadius * Math.sin((startAngle - 90) * (Math.PI / 180));
    const innerX2 = center + innerRadius * Math.cos((endAngle - 90) * (Math.PI / 180));
    const innerY2 = center + innerRadius * Math.sin((endAngle - 90) * (Math.PI / 180));
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1} 
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} 
      L ${innerX2} ${innerY2} 
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerX1} ${innerY1} 
      Z
    `;
  };
  
  // Calculate coordinates for labels and connector lines
  const getLabelPosition = (percentage, index, total) => {
    const previousPercentages = data
      .slice(0, index)
      .reduce((sum, segment) => sum + segment.percentage, 0);
    
    const middleAngle = ((previousPercentages + percentage / 2) / 100) * 360 - 90;
    const midAngleRad = (middleAngle * Math.PI) / 180;
    
    // Position for label
    const labelRadius = radius + 20;
    const x = center + labelRadius * Math.cos(midAngleRad);
    const y = center + labelRadius * Math.sin(midAngleRad);
    
    // Position for end of connector line
    const connectorEndRadius = radius + 10;
    const connectorX = center + connectorEndRadius * Math.cos(midAngleRad);
    const connectorY = center + connectorEndRadius * Math.sin(midAngleRad);
    
    // Position for dot
    const dotRadius = radius + 5;
    const dotX = center + dotRadius * Math.cos(midAngleRad);
    const dotY = center + dotRadius * Math.sin(midAngleRad);
    
    return { x, y, connectorX, connectorY, dotX, dotY, angle: middleAngle };
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 100 100" className="w-full">
        {/* Donut segments */}
        {data.map((segment, index) => {
          const startAngle = data
            .slice(0, index)
            .reduce((sum, curr) => sum + curr.percentage, 0) * 3.6;
          const endAngle = startAngle + segment.percentage * 3.6;
          
          return (
            <path
              key={index}
              d={getSegmentPath(startAngle, endAngle)}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="0.5"
              cursor="pointer"
              onClick={() => onSegmentClick(segment)}
              opacity={selectedStock.label === segment.label ? 1 : 0.7}
            />
          );
        })}
        
        {/* Center circle with total */}
        <circle cx={center} cy={center} r={innerRadius} fill="#fff" />
        
        {/* Label connectors and dots */}
        {data.map((segment, index) => {
          const { connectorX, connectorY, dotX, dotY, x, y } = getLabelPosition(
            segment.percentage,
            index,
            data.length
          );
          
          return (
            <g key={`connector-${index}`}>
              <line
                x1={dotX}
                y1={dotY}
                x2={connectorX}
                y2={connectorY}
                stroke="#000"
                strokeWidth="0.25"
                strokeDasharray="1,1"
              />
            </g>
          );
        })}
        
        {/* Segment percentages and labels */}
        {data.map((segment, index) => {
          const { x, y, angle } = getLabelPosition(
            segment.percentage,
            index,
            data.length
          );
          
          // Adjust text alignment based on position around the donut
          const textAnchor = angle > 90 && angle < 270 ? "end" : "start";
          
          return (
            <g key={`label-${index}`}>
              <text
                x={x}
                y={y - 4}
                textAnchor={textAnchor}
                fontSize="5"
                fontWeight="bold"
                fill={segment.color}
              >
                {segment.percentage}%
              </text>
              <text
                x={x}
                y={y + 4}
                textAnchor={textAnchor}
                fontSize="3"
                fill="#666"
              >
                {segment.label}
              </text>
            </g>
          );
        })}
        
        {/* Total expenses text in center */}
        <text
          x={center}
          y={center - 3}
          textAnchor="middle"
          fontSize="2.5"
          fill="#999"
        >
          TOTAL EXPENSES
        </text>
        <text
          x={center}
          y={center + 3}
          textAnchor="middle"
          fontSize="3"
          fontWeight="medium"
        >
          ${totalExpenses.toLocaleString()}
        </text>
      </svg>
    </div>
  );
};

export default StockAnalysis;