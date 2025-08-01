'use client'
// src/components/MultiSelectFilterPopup.tsx
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterPopupProps {
  title: string;
  options: Option[];
  selectedOptions: string[];
  onOptionToggle: (value: string) => void;
  onApply: () => void;
}

const MultiSelectFilterPopup: React.FC<MultiSelectFilterPopupProps> = ({
  title,
  options,
  selectedOptions,
  onOptionToggle,
  onApply
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-48">
      {options.map((option) => (
        <div key={option.value} className="mb-2 flex items-center">
          <input
            type="checkbox"
            id={`${title}-${option.value}`}
            className="form-checkbox h-5 w-5 text-teal-600 rounded border-gray-300"
            checked={selectedOptions.includes(option.value)}
            onChange={() => onOptionToggle(option.value)}
          />
          <label 
            htmlFor={`${title}-${option.value}`} 
            className="ml-2 text-gray-700"
          >
            {option.label}
          </label>
        </div>
      ))}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onApply}
          className="text-teal-600 font-medium hover:text-teal-800"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default MultiSelectFilterPopup;