'use client'

import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { Customer, Address } from '@/utils/api';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // Import the auth context

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
  customer?: Customer | null;
  isEditing?: boolean;
}

type CustomerFormData = Omit<Customer, 'createdAt' | 'updatedAt' | '__v' | '_id'> & {
  _id?: string;
};

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSubmit, customer = null, isEditing = false }) => {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    mainAddress: '',
    addresses: [] as Address[]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth(); // Get user from auth context
  
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000';

  // Initialize form data when editing an existing customer
  useEffect(() => {
    if (customer && isEditing) {
      setFormData({
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
        country: customer.country,
        city: customer.city,
        mainAddress: customer.mainAddress,
        addresses: customer.addresses || []
      });
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        country: '',
        city: '',
        mainAddress: '',
        addresses: [] as Address[]
      });
    }
  }, [customer, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addAdditionalAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { street: '', city: '', country: '' } as Address]
    }));
  };

  const handleAdditionalAddressChange = (index: number, field: keyof Address, value: string) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };

  const removeAddress = (index: number) => {
    const updatedAddresses = [...formData.addresses];
    updatedAddresses.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Get token from auth context instead of directly from localStorage
      const token = user?.token;
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      
      let response;
      
      if (isEditing && formData._id) {
        // Make API call directly for better error handling
        response = await axios({
          method: 'patch',
          url: `${SERVER_URL}/api/customers/${formData._id}`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: formData
        });
      } else {
        // Handle creation here too instead of relying on parent
        response = await axios({
          method: 'post',
          url: `${SERVER_URL}/api/customers`,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: formData
        });
      }
      
      // Call the onSubmit prop with the server response data
      onSubmit(response.data);
      
      // Automatically close the modal after successful submission
      onClose();
      
      // Reset form only if not handled by parent component
      if (!isEditing) {
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          country: '',
          city: '',
          mainAddress: '',
          addresses: [] as Address[]
        });
      }
    } catch (err: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} customer:`, err);
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEditing ? 'update' : 'create'} customer`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {!user?.authenticated && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-md text-sm">
            You are not logged in. Please log in to manage customers.
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Customer name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Country <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium mb-1">Main Address <span className="text-red-500">*</span></label>
              </div>
              <input
                type="text"
                name="mainAddress"
                value={formData.mainAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium">Additional Addresses</span>
                <button
                  type="button"
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  onClick={addAdditionalAddress}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Address
                </button>
              </div>
              
              {formData.addresses.map((address, index) => (
                <div key={index} className="space-y-2 border p-3 rounded-md mb-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-bold">Address {index + 1}</label>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeAddress(index)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Street <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAdditionalAddressChange(index, 'street', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => handleAdditionalAddressChange(index, 'city', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Country <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={address.country}
                      onChange={(e) => handleAdditionalAddressChange(index, 'country', e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:bg-teal-300"
              disabled={isLoading || !user?.authenticated}
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update Customer' : 'Save Customer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;