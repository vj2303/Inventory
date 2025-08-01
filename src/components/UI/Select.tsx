// src/components/UI/Select.tsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  placeholder,
  options,
  disabled = false,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Find the label for the currently selected value
  const selectedOption = options.find(option => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div ref={selectRef} className={`relative w-full ${className}`}>
      <div
        className={`flex items-center justify-between w-full px-3 py-2 border rounded cursor-pointer ${
          isOpen ? 'border-teal-500 ring-1 ring-teal-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        role="combobox"
      >
        <div className={`text-sm ${!selectedOption ? 'text-gray-500' : 'text-gray-800'}`}>
          {displayValue}
        </div>
        <ChevronDown 
          size={18} 
          className={`text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
          <ul role="listbox" className="py-1">
            {options.length > 0 ? (
              options.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                    value === option.value ? 'bg-teal-50 text-teal-700' : 'text-gray-800'
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-sm text-gray-500">No options available</li>
            )}
          </ul>
        </div>
      )}
      
      {/* Hidden input to maintain form compatibility */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

export default Select;