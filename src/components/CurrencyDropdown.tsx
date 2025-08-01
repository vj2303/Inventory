// src/components/CurrencyDropdown/CurrencyDropdown.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CurrencyDropdownProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencyDropdown: React.FC<CurrencyDropdownProps> = ({
  selectedCurrency,
  onCurrencyChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const currencies = [
    'Dollars($)',
    'Euros(€)',
    'Pounds(£)',
    'Yen(¥)',
    'Rupees(₹)'
  ];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (currency: string) => {
    onCurrencyChange(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative w-32">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
        onClick={toggleDropdown}
      >
        <span className="text-sm">{selectedCurrency}</span>
        <ChevronDown size={16} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          <ul className="py-1">
            {currencies.map((currency) => (
              <li 
                key={currency}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(currency)}
              >
                {currency}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;