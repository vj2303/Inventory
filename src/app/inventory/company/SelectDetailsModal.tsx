'use client'

import React, { useState } from 'react';

interface SelectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (details: UploadDetails) => void;
  fileName: string;
}

export interface UploadDetails {
  supplier: string;
  materialCenter: string;
  currency: string;
}

const SelectDetailsModal: React.FC<SelectDetailsModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  fileName
}) => {
  const [details, setDetails] = useState<UploadDetails>({
    supplier: '',
    materialCenter: '',
    currency: 'Dollars'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = () => {
    onUploadComplete(details);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Select details</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supplier
              </label>
              <div className="relative">
                <select
                  name="supplier"
                  value={details.supplier}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="" disabled>Select</option>
                  <option value="supplier1">Supplier 1</option>
                  <option value="supplier2">Supplier 2</option>
                  <option value="supplier3">Supplier 3</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material Center
              </label>
              <div className="relative">
                <select
                  name="materialCenter"
                  value={details.materialCenter}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="" disabled>Select</option>
                  <option value="center1">Center A</option>
                  <option value="center2">Center B</option>
                  <option value="center3">Center C</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <div className="relative">
                <select
                  name="currency"
                  value={details.currency}
                  onChange={handleChange}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="Dollars">Dollars</option>
                  <option value="Euros">Euros</option>
                  <option value="Pounds">Pounds</option>
                  <option value="Yen">Yen</option>
                  <option value="Rupees">Rupees</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex justify-end gap-3 border-t">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-6 py-2 rounded-md text-white bg-teal-700 hover:bg-teal-800 ${
              !details.supplier || !details.materialCenter ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleUpload}
            disabled={!details.supplier || !details.materialCenter}
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDetailsModal;