'use client';

import React, { useRef } from 'react';

export type SortOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

interface SortDropdownProps {
  options: SortOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
  buttonClassName?: string;
  dropdownClassName?: string;
}

const SortDropdown = ({
  options,
  selectedValue,
  onSelect,
  isOpen,
  toggleOpen,
  buttonClassName = '',
  dropdownClassName = '',
}: SortDropdownProps) => {
  // Get the selected option for display
  const selectedOption = options.find(option => option.value === selectedValue);

  return (
    <div className="relative">
      <button
        className={`px-4 py-2 rounded-full border flex items-center gap-2 cursor-pointer transition-all duration-300 hover:bg-gray-50 ${buttonClassName}`}
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption?.label || 'Sort By'} 
        <svg
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-1 bg-white shadow-lg rounded-md border border-gray-200 z-10 w-64 transition-all duration-300 animate-fadeIn ${dropdownClassName}`}
          role="listbox"
        >
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between transition-colors duration-200 ${
                  selectedValue === option.value ? 'text-teal-600 font-medium' : 'text-gray-800'
                }`}
                onClick={() => {
                  onSelect(option.value);
                }}
                role="option"
                aria-selected={selectedValue === option.value}
              >
                <span>{option.label}</span>
                {option.icon || (selectedValue === option.value && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;