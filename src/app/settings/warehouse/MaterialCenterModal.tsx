'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface MaterialCenter {
  _id: string;
  city: string;
  country: string;
  address: string;
  warehouseSize: string;
  currency: string;
  isActive: boolean;
}

interface MaterialCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (materialCenter: MaterialCenter) => void;
  materialCenter?: MaterialCenter | null;
  isEditing?: boolean;
}

export default function MaterialCenterModal({ isOpen, onClose, onSubmit, materialCenter, isEditing }: MaterialCenterModalProps) {
  const [formData, setFormData] = useState({
    _id: '',
    city: '',
    country: '',
    address: '',
    warehouseType: 'Large material center',
    currency: ''
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000';

  // Initialize form data when editing
  useEffect(() => {
    if (isEditing && materialCenter) {
      setFormData({
        _id: materialCenter._id,
        city: materialCenter.city,
        country: materialCenter.country,
        address: materialCenter.address,
        warehouseType: materialCenter.warehouseSize === 'large' ? 'Large material center' : 'Small material center',
        currency: materialCenter.currency
      });
    } else {
      // Reset form for new entry
      setFormData({
        _id: '',
        city: '',
        country: '',
        address: '',
        warehouseType: 'Large material center',
        currency: ''
      });
    }
  }, [isEditing, materialCenter, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectWarehouseType = (type) => {
    setFormData({ ...formData, warehouseType: type });
    setDropdownOpen(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.currency.trim()) newErrors.currency = 'Currency is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = user?.token;
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      let response;
      
      if (isEditing) {
        // Update operation
        const updateData = {
          city: formData.city,
          country: formData.country,
          address: formData.address,
          warehouseSize: formData.warehouseType === 'Large material center' ? 'large' : 'small',
          currency: formData.currency
        };
        
        response = await axios({
          method: 'patch',
          url: `${SERVER_URL}/api/material-center/${formData._id}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: updateData
        });
      } else {
        // Create operation
        const createData = {
          city: formData.city,
          country: formData.country,
          address: formData.address,
          warehouseSize: formData.warehouseType === 'Large material center' ? 'large' : 'small',
          isActive: true,
          currency: formData.currency
        };
        
        response = await axios({
          method: 'post',
          url: `${SERVER_URL}/api/material-center`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: createData
        });
      }
      
      // Call the onSubmit prop with the server response data
      onSubmit(response.data);
      
      // Close modal
      onClose();
      
      // Reset form
      setFormData({
        _id: '',
        city: '',
        country: '',
        address: '',
        warehouseType: 'Large material center',
        currency: ''
      });
    } catch (err: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} material center:`, err);
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'create'} material center`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{isEditing ? 'Update Material Center' : 'Add New Material Center'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded`}
              placeholder="Enter city name"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded`}
              placeholder="Enter country name"
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded`}
              placeholder="Enter full address"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input
              type="text"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={`w-full p-2 border ${errors.currency ? 'border-red-500' : 'border-gray-300'} rounded`}
              placeholder="Enter currency code (e.g., USD)"
            />
            {errors.currency && <p className="text-red-500 text-xs mt-1">{errors.currency}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Warehouse type</label>
            <div className="relative">
              <button
                type="button"
                className="w-full p-2 border border-gray-300 rounded flex justify-between items-center"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {formData.warehouseType}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer bg-gray-50"
                    onClick={() => handleSelectWarehouseType('Large material center')}
                  >
                    Large material center
                  </div>
                  <div 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectWarehouseType('Small material center')}
                  >
                    Small material center
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-full hover:bg-teal-700 disabled:bg-teal-300"
              disabled={isLoading}
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}