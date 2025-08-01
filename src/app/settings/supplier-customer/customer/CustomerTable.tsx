'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import CustomerModal from './CustomerModal';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { Customer } from '@/utils/api';

const CustomerTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uniqueCountries, setUniqueCountries] = useState<number>(0);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000';
  const API_URL = `${SERVER_URL}/api/customers`;

  useEffect(() => {
    if (user && user.token) {
      loadCustomers();
    }
  }, [user]);

  useEffect(() => {
    const countries = new Set(customers.map(customer => customer.country));
    setUniqueCountries(countries.size);
  }, [customers]);

  const loadCustomers = async () => {
    if (!user || !user.token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: API_URL,
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      const response = await axios.request(config);
      setCustomers(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching customers: ' + (err instanceof Error ? err.message : String(err)));
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // These functions are no longer needed as the modal handles API calls directly
  // Keeping them for potential future use but they're not used in the current flow
  const createCustomer = async (customerData: Omit<Customer, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
    if (!user || !user.token) {
      throw new Error('Authentication required');
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      data: JSON.stringify(customerData)
    };
    
    const response = await axios.request(config);
    return response.data;
  };

  const updateCustomer = async (customerId: string, customerData: Partial<Customer>) => {
    if (!user || !user.token) {
      throw new Error('Authentication required');
    }

    // Extract relevant data for PATCH request based on the example
    const updateData = {
      phoneNumber: customerData.phoneNumber,
      // Add addresses if available
      ...(customerData.addresses ? { addresses: customerData.addresses } : {})
    };
    
    const config = {
      method: 'patch',
      maxBodyLength: Infinity,
      url: `${API_URL}/${customerId}`,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      data: JSON.stringify(updateData)
    };
    
    const response = await axios.request(config);
    return response.data;
  };

  const deleteCustomer = async (customerId: string) => {
    if (!user || !user.token) {
      throw new Error('Authentication required');
    }

    const config = {
      method: 'delete',
      maxBodyLength: Infinity,
      url: `${API_URL}/${customerId}`,
      headers: { 
        'Authorization': `Bearer ${user.token}`
      }
    };
    
    await axios.request(config);
    // Immediately update the customers list without refetching
    setCustomers(customers.filter(customer => customer._id !== customerId));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
    setIsEditing(false);
  };

  const handleAddCustomer = async (newCustomer: Customer) => {
    try {
      // Add the new customer to the list (server response already contains all required fields)
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      closeModal();
    } catch (err) {
      setError('Error adding customer: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEditCustomer = async (updatedCustomer: Customer) => {
    try {
      // Update the specific customer in the list (server response already contains all required fields)
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        )
      );
      closeModal();
    } catch (err) {
      setError('Error updating customer: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    
    try {
      await deleteCustomer(customerId);
      // State is already updated in the deleteCustomer function
    } catch (err) {
      setError('Error deleting customer: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
    openModal();
  };

  // Format date for better display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // If not authenticated, show login message
  if (!user || !user.token) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg">You need to be logged in to view customers</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg">
          <span className="font-bold">Total Number of customer- </span>
          <span>{customers.length}</span>
          <span className="ml-8 font-bold">Country- </span>
          <span>{uniqueCountries}</span>
        </div>
        <button 
          className="flex items-center px-4 py-2 border rounded-full hover:bg-gray-50"
          onClick={openModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new Customer
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading customers...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {customers.length === 0 ? (
            <div className="text-center py-8">No customers found. Add a new customer to get started.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Customer Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Country</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">City</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.country}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.city}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{customer.mainAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(customer.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCustomer(customer._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <CustomerModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={isEditing ? handleEditCustomer : handleAddCustomer}
        customer={currentCustomer}
        isEditing={isEditing}
      />
    </div>
  );
};

export default CustomerTable;