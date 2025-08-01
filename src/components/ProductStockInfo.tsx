// src/components/AddProductModal/ProductStockInfo.tsx
import React, { useState } from 'react';
import InputField from '@/components/UI/InputField';
import CurrencyDropdown from '@/components/CurrencyDropdown';
import Button from '@/components/UI/Button';

interface ProductStockInfoProps {
  onPrevious: () => void;
  onSubmit: (stockData: ProductStockData) => void;
  onCancel: () => void;
  initialData?: ProductStockData;
  isSubmitting?: boolean; // Added this prop
}

export interface ProductStockData {
  costCurrency: string;
  cost: string;
  quantity: string;
  freight: string;
  duty: string;
  landed: string;
  minimumPrice: string;
  thresholdValue: string;
  locationA: string;
  locationB: string;
  locationC: string;
  locationD: string;
}

const ProductStockInfo: React.FC<ProductStockInfoProps> = ({
  onPrevious,
  onSubmit,
  onCancel,
  initialData,
  isSubmitting = false // Default value
}) => {
  const [stockData, setStockData] = useState<ProductStockData>(
    initialData || {
      costCurrency: 'USD',
      cost: '',
      quantity: '',
      freight: '',
      duty: '',
      landed: '',
      minimumPrice: '',
      thresholdValue: '',
      locationA: '',
      locationB: '',
      locationC: '',
      locationD: ''
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStockData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCurrencyChange = (currency: string) => {
    setStockData(prevData => ({
      ...prevData,
      costCurrency: currency
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(stockData);
  };

  return (
    <div className="bg-white rounded-md w-full max-w-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Stock Info</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="text-sm text-gray-700 w-32">Cost</label>
              <div className="flex flex-1">
                <CurrencyDropdown 
                  selectedCurrency={stockData.costCurrency}
                  onCurrencyChange={handleCurrencyChange}
                />
                <input
                  type="text"
                  name="cost"
                  value={stockData.cost}
                  onChange={handleInputChange}
                  placeholder="40.00"
                  className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>

            <InputField
              label="Quantity"
              name="quantity"
              value={stockData.quantity}
              onChange={handleInputChange}
              placeholder="2500"
            />

            <InputField
              label="Freight"
              name="freight"
              value={stockData.freight}
              onChange={handleInputChange}
              placeholder="10%"
            />

            <InputField
              label="Duty"
              name="duty"
              value={stockData.duty}
              onChange={handleInputChange}
              placeholder="30.00"
            />

            <InputField
              label="Landed"
              name="landed"
              value={stockData.landed}
              onChange={handleInputChange}
              placeholder="$50.00"
            />

            <InputField
              label="Minimum Price"
              name="minimumPrice"
              value={stockData.minimumPrice}
              onChange={handleInputChange}
              placeholder="$60"
            />

            <InputField
              label="Threshold Value" 
              name="thresholdValue"
              value={stockData.thresholdValue}
              onChange={handleInputChange}
              placeholder="50 units"
            />

            <InputField
              label="A"
              name="locationA"
              value={stockData.locationA}
              onChange={handleInputChange}
              placeholder="100"
            />

            <InputField
              label="B"
              name="locationB"
              value={stockData.locationB}
              onChange={handleInputChange}
              placeholder="100"
            />

            <InputField
              label="C"
              name="locationC"
              value={stockData.locationC}
              onChange={handleInputChange}
              placeholder="100"
            />

            <InputField
              label="D"
              name="locationD"
              value={stockData.locationD}
              onChange={handleInputChange}
              placeholder="100"
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="secondary"
            onClick={onPrevious}
          >
            Back
          </Button>
          
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductStockInfo;