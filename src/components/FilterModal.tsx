'use client'
// src/components/FilterModal.tsx
import React, { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApplyFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    productType: '',
    brands: [] as string[],
    sex: '',
    volume: '',
    type: '',
    subtype: '',
    priceRange: { min: 0, max: 10 },
    quantityRange: { min: 0, max: 10 },
    landedCost: { min: 0, max: 10 }
  });

  // Handler for brand checkboxes
  const handleBrandChange = (brand: string) => {
    setSelectedFilters(prev => {
      const brands = prev.brands.includes(brand) 
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands };
    });
  };

  // Handler for radio inputs
  const handleRadioChange = (field: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [field]: value }));
  };

  // Handler for select inputs
  const handleSelectChange = (field: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [field]: value }));
  };

  // Handler for range inputs
  const handleRangeChange = (field: string, min: number, max: number) => {
    setSelectedFilters(prev => ({ 
      ...prev, 
      [field]: { min, max } 
    }));
  };

  // Handler for range input fields
  const handleRangeInputChange = (field: string, type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    setSelectedFilters(prev => ({
      ...prev,
      [field]: {
        ...prev[field as keyof typeof prev] as { min: number, max: number },
        [type]: numValue
      }
    }));
  };

  // Handler for reset single filter
  const handleResetFilter = (field: string) => {
    if (field === 'priceRange') {
      setSelectedFilters(prev => ({ ...prev, priceRange: { min: 0, max: 10 } }));
    } else if (field === 'quantityRange') {
      setSelectedFilters(prev => ({ ...prev, quantityRange: { min: 0, max: 10 } }));
    } else if (field === 'landedCost') {
      setSelectedFilters(prev => ({ ...prev, landedCost: { min: 0, max: 10 } }));
    }
  };

  // Handler for reset all filters
  const handleResetAll = () => {
    setSelectedFilters({
      productType: '',
      brands: [],
      sex: '',
      volume: '',
      type: '',
      subtype: '',
      priceRange: { min: 0, max: 10 },
      quantityRange: { min: 0, max: 10 },
      landedCost: { min: 0, max: 10 }
    });
  };

  // Handler for apply filters button
  const handleApplyFilters = () => {
    onApplyFilters(selectedFilters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Type Filter */}
          <div className="mb-4">
            <p className="font-medium mb-2">Filter by:</p>
            <div className="flex gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="productType"
                  value="EHP"
                  checked={selectedFilters.productType === 'EHP'}
                  onChange={() => handleRadioChange('productType', 'EHP')}
                />
                <span className="ml-2">EHP</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="productType"
                  value="EDP"
                  checked={selectedFilters.productType === 'EDP'}
                  onChange={() => handleRadioChange('productType', 'EDP')}
                />
                <span className="ml-2">EDP</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="productType"
                  value="PH"
                  checked={selectedFilters.productType === 'PH'}
                  onChange={() => handleRadioChange('productType', 'PH')}
                />
                <span className="ml-2">PH</span>
              </label>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-4">
            <p className="font-medium mb-2">Brand</p>
            <div className="relative">
              <select 
                className="w-full p-2 border border-gray-300 rounded appearance-none"
                value=""
                onChange={(e) => handleSelectChange('brand', e.target.value)}
              >
                <option value="">Brand Name</option>
                <option value="Brand1">Brand 1</option>
                <option value="Brand2">Brand 2</option>
                <option value="Brand3">Brand 3</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Sex Filter */}
          <div className="mb-4">
            <p className="font-medium mb-2">SEX</p>
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="sex"
                  value="Male"
                  checked={selectedFilters.sex === 'Male'}
                  onChange={() => handleRadioChange('sex', 'Male')}
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="sex"
                  value="Female"
                  checked={selectedFilters.sex === 'Female'}
                  onChange={() => handleRadioChange('sex', 'Female')}
                />
                <span className="ml-2">Female</span>
              </label>
            </div>
          </div>

          {/* Volume Filter */}
          <div className="mb-4">
            <p className="font-medium mb-2">Volume (ml)</p>
            <div className="relative">
              <select 
                className="w-full p-2 border border-gray-300 rounded appearance-none"
                value={selectedFilters.volume}
                onChange={(e) => handleSelectChange('volume', e.target.value)}
              >
                <option value="">Select Volume</option>
                <option value="100">100 ml</option>
                <option value="150">150 ml</option>
                <option value="200">200 ml</option>
                <option value="250">250 ml</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-4">
            <p className="font-medium mb-2">Type</p>
            <div className="relative">
              <select 
                className="w-full p-2 border border-gray-300 rounded appearance-none"
                value={selectedFilters.type}
                onChange={(e) => handleSelectChange('type', e.target.value)}
              >
                <option value="">Select Type</option>
                <option value="Tester">Tester</option>
                <option value="Regular">Regular</option>
                <option value="Decoded">Decoded</option>
                <option value="Set">Set</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Subtype Filter */}
          <div className="mb-4">
            <p className="font-medium mb-2">Subtype</p>
            <div className="relative">
              <select 
                className="w-full p-2 border border-gray-300 rounded appearance-none"
                value={selectedFilters.subtype}
                onChange={(e) => handleSelectChange('subtype', e.target.value)}
              >
                <option value="">Select Subtype</option>
                <option value="Perfume">Perfume</option>
                <option value="Bodycare">Bodycare</option>
                <option value="Haircare">Haircare</option>
                <option value="Set">Set</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Price Range</p>
              <button 
                className="text-sm text-teal-600 hover:text-teal-800"
                onClick={() => handleResetFilter('priceRange')}
              >
                Reset
              </button>
            </div>
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="250"
                value={selectedFilters.priceRange.max}
                onChange={(e) => handleRangeChange('priceRange', selectedFilters.priceRange.min, Number(e.target.value))}
                className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>$0</span>
                <span>${selectedFilters.priceRange.max}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.priceRange.min}
                  onChange={(e) => handleRangeInputChange('priceRange', 'min', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To</p>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.priceRange.max}
                  onChange={(e) => handleRangeInputChange('priceRange', 'max', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Quantity Range Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Quantity Range</p>
              <button 
                className="text-sm text-teal-600 hover:text-teal-800"
                onClick={() => handleResetFilter('quantityRange')}
              >
                Reset
              </button>
            </div>
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="250"
                value={selectedFilters.quantityRange.max}
                onChange={(e) => handleRangeChange('quantityRange', selectedFilters.quantityRange.min, Number(e.target.value))}
                className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>250</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.quantityRange.min}
                  onChange={(e) => handleRangeInputChange('quantityRange', 'min', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To</p>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.quantityRange.max}
                  onChange={(e) => handleRangeInputChange('quantityRange', 'max', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Landed Cost Filter */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">Landed Cost</p>
              <button 
                className="text-sm text-teal-600 hover:text-teal-800"
                onClick={() => handleResetFilter('landedCost')}
              >
                Reset
              </button>
            </div>
            <div className="mb-2">
              <input
                type="range"
                min="0"
                max="250"
                value={selectedFilters.landedCost.max}
                onChange={(e) => handleRangeChange('landedCost', selectedFilters.landedCost.min, Number(e.target.value))}
                className="w-full h-2 bg-teal-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>250</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">From</p>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.landedCost.min}
                  onChange={(e) => handleRangeInputChange('landedCost', 'min', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">To</p>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.landedCost.max}
                  onChange={(e) => handleRangeInputChange('landedCost', 'max', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button 
            onClick={handleResetAll}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Reset All
          </button>
          <button 
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            Apply Filters(3)
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;