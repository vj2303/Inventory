// utils/api.ts

const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2Y2YTJiOWU4NmEwNGE2N2YwY2MwOTQiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTc0NDgxNzU3NSwiZXhwIjoxNzQ0OTAzOTc1fQ.f1mYCTTJWczEE8ACXvYubvDa_q518_bBo01J5H653AE';

export interface Address {
  _id?: string;
  street: string;
  city: string;
  country: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  mainAddress: string;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN
  };
};

export const fetchCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data; // The API returns an array directly
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const createCustomer = async (customerData: Omit<Customer, '_id' | 'createdAt' | 'updatedAt' | '__v'>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customerId: string, customerData: Partial<Customer>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (customerId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};