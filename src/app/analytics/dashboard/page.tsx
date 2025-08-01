'use client'
import React, { useState } from 'react';
import StockAnalysis from './StockAnalysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';
import Dropdown from '@/components/UI/Dropdown';
import DateRangePicker from './DateRangePicker';

// Line chart data
const priceData = [
  { month: 'Jan', price: 20 },
  { month: 'Feb', price: 15 },
  { month: 'Mar', price: 18 },
  { month: 'Apr', price: 22 },
  { month: 'May', price: 21.6 },
  { month: 'Jun', price: 19 },
  { month: 'Jul', price: 16 },
  { month: 'Aug', price: 9 },
  { month: 'Sep', price: 20 },
  { month: 'Oct', price: 35 },
  { month: 'Nov', price: 45 },
  { month: 'Dec', price: 47 },
];

// Top selling products data
const topSellingProducts = [
  { name: 'Product Name', value: 204 },
  { name: 'Product Name', value: 195 },
  { name: 'Product Name', value: 134 },
  { name: 'Product Name', value: 123 },
];

// Top buyers data
const topBuyers = [
  { name: 'Jenny Wilson', email: 'w.lawson@example.com', value: 11234 },
  { name: 'Jenny Wilson', email: 'w.lawson@example.com', value: 11234 },
];

// Custom tooltip component for the line chart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-lg">
        <p className="text-center font-medium">${payload[0].value.toFixed(1)}</p>
        <p className="text-center text-xs text-gray-300">29 Nov 2024</p>
      </div>
    );
  }
  return null;
};

// Time period buttons component
const TimePeriodButtons = ({ activePeriod, setActivePeriod, onCustomRangeClick }) => {
  const periods = ['3 Months', '6 Months', '1 Year', 'Custom Range'];
  
  const handlePeriodClick = (period) => {
    setActivePeriod(period);
    if (period === 'Custom Range') {
      onCustomRangeClick();
    }
  };
  
  return (
    <div className="flex space-x-2">
      {periods.map((period) => (
        <button
          key={period}
          className={`px-3 py-1 rounded-md text-sm ${
            activePeriod === period
              ? 'bg-teal-600 text-white'
              : 'text-gray-600'
          }`}
          onClick={() => handlePeriodClick(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

// Currency toggle component
const CurrencyToggle = ({ activeCurrency, setActiveCurrency }) => {
  const currencies = ['Dirhams', 'USD'];
  
  return (
    <div className="flex rounded-full bg-gray-100 p-1 w-fit">
      {currencies.map((currency) => (
        <button
          key={currency}
          className={`px-4 py-1 rounded-full text-sm ${
            activeCurrency === currency
              ? 'bg-teal-700 text-white'
              : 'text-gray-600'
          }`}
          onClick={() => setActiveCurrency(currency)}
        >
          {currency}
        </button>
      ))}
    </div>
  );
};

// Export button component
const ExportButton = () => {
  return (
    <button className="px-3 py-1 border border-gray-300 rounded-md flex items-center">
      <span className="text-sm">Export</span>
      <ChevronDown size={16} className="ml-1" />
    </button>
  );
};

// Main Dashboard component
export default function Dashboard() {
  const [activePeriod, setActivePeriod] = useState('1 Year');
  const [activeCurrency, setActiveCurrency] = useState('USD');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    start: new Date(2024, 9, 25), // Oct 25, 2024
    end: new Date(2025, 0, 31)    // Jan 31, 2025
  });
  
  const formatDisplayDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const handleDateRangeApply = (startDate, endDate) => {
    setDateRange({
      start: startDate,
      end: endDate
    });
  };
  
  const getDisplayedDateRange = () => {
    if (activePeriod === 'Custom Range') {
      return `${formatDisplayDate(dateRange.start)} - ${formatDisplayDate(dateRange.end)}`;
    }
    return activePeriod;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="border-t border-gray-200 my-4"></div>
      
      {/* Total Profit Card */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8">
        <p className="text-sm text-gray-600 mb-2">Total Profit</p>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-teal-600">$81,000</p>
          <span className="ml-2 text-xs text-green-500 flex items-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
              <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            10.4%
          </span>
        </div>
      </div>
      
      {/* Market Trends Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Market Trends</h2>
          <ExportButton />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Dropdown 
            label="Product" 
            value="Perfume" 
            options={[{ value: 'perfume', label: 'Perfume' }]} 
          />
          <Dropdown 
            label="Price trends" 
            value="Lowest price" 
            options={[{ value: 'lowest', label: 'Lowest price' }]} 
          />
          <Dropdown 
            label="Country" 
            value="India" 
            options={[{ value: 'india', label: 'India' }]} 
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col">
            <div className="mb-4">
              <p className="text-sm text-green-500 mb-1">Lowest Price</p>
              <h3 className="text-2xl font-bold">$24.00</h3>
              {activePeriod === 'Custom Range' && (
                <p className="text-sm text-gray-500 mt-1">
                  {formatDisplayDate(dateRange.start)} - {formatDisplayDate(dateRange.end)}
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <TimePeriodButtons 
                activePeriod={activePeriod} 
                setActivePeriod={setActivePeriod} 
                onCustomRangeClick={() => setIsDatePickerOpen(true)}
              />
              <CurrencyToggle activeCurrency={activeCurrency} setActiveCurrency={setActiveCurrency} />
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke="#f5f5f5" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis 
                    domain={[0, 50]} 
                    ticks={[0, 10, 20, 30, 40, 50]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#3EB19B" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 8, fill: "#3EB19B" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stock Analysis Section */}
      <div className="mb-8">
        <StockAnalysis />
      </div>
      
      {/* Top Selling Products and Top Buyers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div>
          <h2 className="text-xl font-bold mb-4">Top Selling Products</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            {topSellingProducts.map((product, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-600">Product Name</p>
                  <p className="text-sm font-medium">${product.value}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full" 
                    style={{ width: `${(product.value / 204) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Top Buyers */}
        <div>
          <h2 className="text-xl font-bold mb-4">Top Buyers</h2>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            {topBuyers.map((buyer, index) => (
              <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium">{buyer.name}</p>
                  <p className="text-sm text-gray-500">{buyer.email}</p>
                </div>
                <p className="font-medium">${buyer.value.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Date Range Picker Modal */}
      <DateRangePicker 
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleDateRangeApply}
        initialStartDate={dateRange.start}
        initialEndDate={dateRange.end}
      />
    </div>
  );
}