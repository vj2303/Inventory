import React, { useState } from 'react';

const FilterSortButton = ({ onApplyFilters }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    stockQuantity: 'maxToMin',
    priceRange: '',
    brandName: '',
    availability: {
      lowStock: false,
      inStock: false,
      outOfStock: false
    }
  });

  const handleStockQuantityChange = (value) => {
    setFilters({
      ...filters,
      stockQuantity: value
    });
  };

  const handlePriceRangeChange = (value) => {
    setFilters({
      ...filters,
      priceRange: value
    });
  };

  const handleBrandNameChange = (value) => {
    setFilters({
      ...filters,
      brandName: value
    });
  };

  const handleAvailabilityChange = (key) => {
    setFilters({
      ...filters,
      availability: {
        ...filters.availability,
        [key]: !filters.availability[key]
      }
    });
  };

  const handleApply = () => {
    // Map our filter UI state to the format expected by the parent component
    const mappedFilters = {
      productType: '',
      brands: [],
      sex: '',
      volume: '',
      type: '',
      subtype: '',
      priceRange: { min: 0, max: 250 },
      quantityRange: { min: 0, max: 250 },
      landedCost: { min: 0, max: 250 }
    };
    
    // Apply quantity sorting if selected
    if (filters.stockQuantity === 'maxToMin') {
      mappedFilters.quantityRange = { min: 0, max: 250 };
    } else if (filters.stockQuantity === 'minToMax') {
      mappedFilters.quantityRange = { min: 0, max: 250 };
    }
    
    // Apply price sorting if selected
    if (filters.priceRange === 'highToLow') {
      mappedFilters.priceRange = { min: 0, max: 250 };
    } else if (filters.priceRange === 'lowToHigh') {
      mappedFilters.priceRange = { min: 0, max: 250 };
    }
    
    // Apply availability filters
    if (filters.availability.lowStock || filters.availability.inStock || filters.availability.outOfStock) {
      // In a real implementation, we would set appropriate quantityRange values
      // based on the definition of "low stock", "in stock", etc.
    }
    
    onApplyFilters(mappedFilters);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Sort By</span>
        <span>↓</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 z-10 bg-white rounded shadow-lg border border-gray-200">
          <div className="p-4 w-64">
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Stock Quantity</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.stockQuantity === 'maxToMin'}
                    onChange={() => handleStockQuantityChange('maxToMin')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">Max to Min</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.stockQuantity === 'minToMax'}
                    onChange={() => handleStockQuantityChange('minToMax')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">Min to Max</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priceRange === 'highToLow'}
                    onChange={() => handlePriceRangeChange('highToLow')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">High to low</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.priceRange === 'lowToHigh'}
                    onChange={() => handlePriceRangeChange('lowToHigh')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">Low to high</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Brand Name</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brandName === 'aToZ'}
                    onChange={() => handleBrandNameChange('aToZ')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">A-Z</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-3">Availability</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.lowStock}
                    onChange={() => handleAvailabilityChange('lowStock')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">Low Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.inStock}
                    onChange={() => handleAvailabilityChange('inStock')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">In Stock</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.outOfStock}
                    onChange={() => handleAvailabilityChange('outOfStock')}
                    className="w-4 h-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-gray-600">Out Of Stock</span>
                </label>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-teal-700 text-white rounded font-medium hover:bg-teal-800 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSortButton;