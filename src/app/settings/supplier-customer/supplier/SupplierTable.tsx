'use client'
// components/supplier/SupplierTable.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, ChevronDown, ChevronUp } from 'lucide-react';
import SupplierModal from './SupplierModal';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext'; // Adjust the import path as needed

interface Supplier {
  id: string;
  name: string;
  code: string;
  manager: string;
  phone: string;
  country: string;
  city: string;
  addresses?: string[];
  avatar?: string;
  supplierImage?: {
    url: string;
    publicId: string;
  };
}

const SupplierTable: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Set<string>>(new Set());
  const { user } = useAuth(); // Use the auth context
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000';

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setIsLoading(true);
        // Get the token from localStorage directly
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await axios({
          method: 'get',
          url: `${SERVER_URL}/api/suppliers`,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Transform API data to match our Supplier interface
        const fetchedSuppliers = response.data.map((supplier: any) => ({
          id: supplier._id || supplier.id,
          name: supplier.name,
          code: supplier.profile || '#N/A', // Using profile as code
          manager: supplier.managerName || 'N/A',
          phone: supplier.phoneNumber || 'N/A',
          country: supplier.country || 'N/A',
          city: supplier.city || 'N/A',
          addresses: supplier.address ? [supplier.address] : 
                    (supplier.addresses && Array.isArray(supplier.addresses)) ? supplier.addresses : ['N/A'],
          supplierImage: supplier.supplierImage || undefined
        }));
        
        setSuppliers(fetchedSuppliers);
        
        // Extract unique countries
        const uniqueCountries = new Set(fetchedSuppliers.map(s => s.country));
        setCountries(uniqueCountries);
        
      } catch (err: any) {
        console.error('Error fetching suppliers:', err);
        setError(err.message || 'Failed to load suppliers');
        // Load demo data as fallback
        loadDemoData();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSuppliers();
  }, []);
  
  const loadDemoData = () => {
    const demoSuppliers = [
      { id: '1', name: 'Perry Ellis', code: '#u76855', manager: 'Perry Ellis', phone: '555-1234', country: 'USA', city: 'New York', addresses: ['123 Broadway, New York, NY 10001'] },
      { id: '2', name: 'Hanae Mori', code: '#u76855', manager: 'Hanae Mori', phone: '555-5678', country: 'Japan', city: 'Tokyo', addresses: ['1-2-3 Shibuya, Tokyo 150-0002', '4-5-6 Roppongi, Tokyo 106-0032'] },
      { id: '3', name: 'Hanae Mori', code: '#u76855', manager: 'Hanae Mori', phone: '555-9012', country: 'Japan', city: 'Kyoto', addresses: ['1-2-3 Gion, Kyoto 605-0073'] },
      { id: '4', name: 'Perry Ellis', code: '#u76855', manager: 'Perry Ellis', phone: '555-3456', country: 'USA', city: 'Los Angeles', addresses: ['456 Hollywood Blvd, Los Angeles, CA 90028'] },
      { id: '5', name: 'Hanae Mori', code: '#u76855', manager: 'Hanae Mori', phone: '555-7890', country: 'Japan', city: 'Osaka', addresses: ['7-8-9 Namba, Osaka 542-0076'] },
    ];
    setSuppliers(demoSuppliers);
    setCountries(new Set(['USA', 'Japan']));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSupplier(null);
    setIsEditing(false);
  };

  const handleAddSupplier = (newSupplierData: any) => {
    // The API call is now handled in the SupplierModal component
    // Here we just update the UI by adding the new supplier to the list
    
    // Create a supplier object with the format our table expects
    const newSupplier: Supplier = {
      id: newSupplierData.id || Date.now().toString(),
      name: newSupplierData.name,
      code: newSupplierData.code,
      manager: newSupplierData.manager,
      phone: newSupplierData.phone,
      country: newSupplierData.country,
      city: newSupplierData.city,
      addresses: newSupplierData.address ? [newSupplierData.address] : (newSupplierData.addresses || []),
      supplierImage: newSupplierData.supplierImage || undefined
    };
    
    // Update suppliers state
    setSuppliers(prev => [...prev, newSupplier]);
    
    // Update countries set if this is a new country
    if (!countries.has(newSupplier.country)) {
      setCountries(prev => new Set([...prev, newSupplier.country]));
    }
    
    closeModal();
  };

  const handleEditSupplier = (updatedSupplierData: any) => {
    // Update the suppliers list with the edited supplier
    setSuppliers(prev => 
      prev.map(supplier => 
        supplier.id === updatedSupplierData.id 
          ? {
              ...supplier,
              name: updatedSupplierData.name,
              code: updatedSupplierData.code,
              manager: updatedSupplierData.manager,
              phone: updatedSupplierData.phone,
              country: updatedSupplierData.country,
              city: updatedSupplierData.city,
              addresses: updatedSupplierData.address ? [updatedSupplierData.address] : supplier.addresses,
              supplierImage: updatedSupplierData.supplierImage || supplier.supplierImage
            }
          : supplier
      )
    );
    
    // Update countries set if this is a new country
    if (!countries.has(updatedSupplierData.country)) {
      setCountries(prev => new Set([...prev, updatedSupplierData.country]));
    }
    
    closeModal();
  };

  const handleEdit = (supplier: Supplier) => {
    // Format the supplier data for the modal
    const supplierForModal = {
      ...supplier,
      address: supplier.addresses && supplier.addresses.length > 0 ? supplier.addresses[0] : ''
    };
    setCurrentSupplier(supplierForModal);
    setIsEditing(true);
    openModal();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      await axios({
        method: 'delete',
        url: `${SERVER_URL}/api/suppliers/${id}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the supplier from the list
      setSuppliers(prev => prev.filter(supplier => supplier.id !== id));
      
      // Recalculate countries
      const remainingSuppliers = suppliers.filter(supplier => supplier.id !== id);
      setCountries(new Set(remainingSuppliers.map(s => s.country)));
      
    } catch (err: any) {
      console.error('Error deleting supplier:', err);
      alert('Failed to delete supplier. Please try again.');
    }
  };

  const toggleRowExpand = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="container mx-auto ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="text-base md:text-lg mb-4 md:mb-0">
          <span className="font-bold">Total Number of Supplier- </span>
          <span>{suppliers.length}</span>
          <span className="ml-4 md:ml-8 font-bold">Country- </span>
          <span>{countries.size}</span>
        </div>
        <button 
          className="flex items-center px-4 py-2 border rounded-full hover:bg-gray-50"
          onClick={openModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add new Supplier
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow">
          <p>Loading suppliers...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg shadow text-red-700">
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          {/* Mobile view */}
          <div className="md:hidden">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="border-b p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {supplier.supplierImage?.url ? (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                        <img 
                          src={supplier.supplierImage.url} 
                          alt={supplier.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback to letter avatar if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {supplier.name.charAt(0).toUpperCase()}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {supplier.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3 font-medium">{supplier.name}</div>
                  </div>
                  <button 
                    onClick={() => toggleRowExpand(supplier.id)}
                    className="text-gray-500"
                  >
                    {expandedRows.has(supplier.id) ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {expandedRows.has(supplier.id) && (
                  <div className="mt-3 pl-11 space-y-2">
                    <div>
                      <span className="font-medium">Code:</span> {supplier.code}
                    </div>
                    <div>
                      <span className="font-medium">Manager:</span> {supplier.manager}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {supplier.phone}
                    </div>
                    <div>
                      <span className="font-medium">Country:</span> {supplier.country}
                    </div>
                    <div>
                      <span className="font-medium">City:</span> {supplier.city}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span>
                      <ul className="list-disc pl-5 mt-1">
                        {supplier.addresses && supplier.addresses.map((address, idx) => (
                          <li key={idx} className="text-sm">{address}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-4 pt-2">
                      <button 
                        onClick={() => handleEdit(supplier)}
                        className="flex items-center text-blue-600"
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="flex items-center text-red-600"
                      >
                        <Trash className="w-4 h-4 mr-1" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tablet and desktop view */}
          <table className="min-w-full divide-y divide-gray-200 hidden md:table">
            <thead className="bg-[#B2D9D84D]">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Supplier Name</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Supplier Code</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Manager</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Phone</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Country</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">City</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Address</th>
                <th className="px-4 lg:px-6 py-3 text-left text-sm lg:text-lg font-bold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {supplier.supplierImage?.url ? (
                        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={supplier.supplierImage.url} 
                            alt={supplier.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              // Fallback to letter avatar if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {supplier.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-8 w-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {supplier.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="ml-3 md:ml-4">{supplier.name}</div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{supplier.code}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{supplier.manager}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{supplier.phone}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{supplier.country}</td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">{supplier.city}</td>
                  <td className="px-4 lg:px-6 py-4">
                    <div className="max-w-xs">
                      {supplier.addresses && supplier.addresses.length > 0 ? (
                        <div>
                          <div>{supplier.addresses[0]}</div>
                          {supplier.addresses.length > 1 && (
                            <div className="text-sm text-blue-600 mt-1 cursor-pointer" onClick={() => toggleRowExpand(supplier.id)}>
                              {expandedRows.has(supplier.id) ? (
                                <>Show less {supplier.addresses.length - 1} addresses</>
                              ) : (
                                <>+{supplier.addresses.length - 1} more addresses</>
                              )}
                            </div>
                          )}
                          {expandedRows.has(supplier.id) && supplier.addresses.length > 1 && (
                            <div className="mt-2 space-y-1 text-sm">
                              {supplier.addresses.slice(1).map((address, idx) => (
                                <div key={idx}>{address}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => handleEdit(supplier)}
                        className="text-[#000] hover:text-blue-600 cursor-pointer"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="text-[#000] hover:text-red-600 cursor-pointer"
                      >
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SupplierModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={isEditing ? handleEditSupplier : handleAddSupplier}
        supplier={currentSupplier}
        isEditing={isEditing}
      />
    </div>
  );
};

export default SupplierTable;