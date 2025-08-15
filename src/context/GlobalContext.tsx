"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Define types
interface Supplier {
  _id: string;
  id?: string;
  name: string;
}

interface MaterialCenter {
  _id?: string;
  id: string;
  address: string;
  city: string;
  country: string;
  warehouseSize?: string;
  currency?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _count?: {
    products: number;
    sales: number;
    purchaseOrders: number;
    sourceTransfers: number;
    destinationTransfers: number;
  };
}

interface GlobalContextType {
  suppliers: Supplier[];
  materialCenters: MaterialCenter[];
  loading: boolean;
  error: any;
  getSupplierById: (id: string) => Supplier | undefined;
  getMaterialCenterById: (id: string) => MaterialCenter | undefined;
  getSupplierName: (id: string) => string;
  getMaterialCenterAddress: (id: string) => string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

export function GlobalProvider({ children }: GlobalProviderProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [materialCenters, setMaterialCenters] = useState<MaterialCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  
  // Use the auth context to get the token
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Only fetch data if user is authenticated
    if (!isAuthenticated || !user?.token) {
      setLoading(false);
      return;
    }
    
    // Fetch suppliers and material centers in parallel
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Configure axios with the auth token from context
        const axiosConfig = {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        };
        
        const [suppliersResponse, materialCentersResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/suppliers', axiosConfig),
          axios.get('http://localhost:3000/api/material-center', axiosConfig)
        ]);
        
        setSuppliers(suppliersResponse.data);
        setMaterialCenters(materialCentersResponse.data.materialCenters || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAuthenticated, user]);
  
  // Helper functions
  const getSupplierById = (id: string): Supplier | undefined => 
    suppliers.find(supplier => supplier._id === id || supplier.id === id);
  
  const getMaterialCenterById = (id: string): MaterialCenter | undefined => 
    materialCenters.find(center => center.id === id || center._id === id);
  
  // Get supplier name by ID
  const getSupplierName = (id: string): string => {
    const supplier = getSupplierById(id);
    return supplier ? supplier.name : 'Unknown Supplier';
  };
  
  // Get material center address by ID
  const getMaterialCenterAddress = (id: string): string => {
    const center = getMaterialCenterById(id);
    return center ? `${center.address}, ${center.city}, ${center.country}` : 'Unknown Address';
  };
  
  return (
    <GlobalContext.Provider value={{
      suppliers,
      materialCenters,
      loading,
      error,
      getSupplierById,
      getMaterialCenterById,
      getSupplierName,
      getMaterialCenterAddress
    }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobal(): GlobalContextType {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
}