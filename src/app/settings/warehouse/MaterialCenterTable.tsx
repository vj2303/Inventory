'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Trash } from 'lucide-react';
import MaterialCenterModal from './MaterialCenterModal';
import { useAuth } from '@/context/AuthContext';

// Define the MaterialCenter interface
interface MaterialCenter {
  _id: string;
  city: string;
  country: string;
  address: string;
  warehouseSize: string;
  currency: string;
  isActive: boolean;
}

export default function MaterialCenterTable() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialCenters, setMaterialCenters] = useState<MaterialCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueCountries, setUniqueCountries] = useState(0);
  const [currentCenter, setCurrentCenter] = useState<MaterialCenter | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.token) {
      fetchMaterialCenters();
    }
  }, [user]);

  const fetchMaterialCenters = async () => {
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000'}/api/material-center`,
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      const response = await axios.request(config);
      setMaterialCenters(response.data);
      
      // Calculate unique countries
      const countries = new Set(response.data.map(center => center.country));
      setUniqueCountries(countries.size);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching material centers:', err);
      setError('Failed to load material centers');
      setLoading(false);
    }
  };

  const handleOpenModal = (center?: MaterialCenter) => {
    if (center) {
      setCurrentCenter(center);
      setIsEditing(true);
    } else {
      setCurrentCenter(null);
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCenter(null);
    setIsEditing(false);
  };

  const handleAddMaterialCenter = async (newCenter: MaterialCenter) => {
    try {
      // Add the new material center to the list (server response already contains all required fields)
      setMaterialCenters(prevCenters => [...prevCenters, newCenter]);
      
      // Update unique countries count
      const countries = new Set([...materialCenters, newCenter].map(center => center.country));
      setUniqueCountries(countries.size);
      
      handleCloseModal();
    } catch (err) {
      console.error('Error adding material center:', err);
      setError('Failed to add material center');
    }
  };

  const handleUpdateMaterialCenter = async (updatedCenter: MaterialCenter) => {
    try {
      // Update the specific material center in the list (server response already contains all required fields)
      setMaterialCenters(prevCenters => 
        prevCenters.map(center => 
          center._id === updatedCenter._id ? updatedCenter : center
        )
      );
      
      handleCloseModal();
    } catch (err) {
      console.error('Error updating material center:', err);
      setError('Failed to update material center');
    }
  };

  const handleDeleteMaterialCenter = async (centerId: string) => {
    if (!user?.token) return;
    
    if (!window.confirm('Are you sure you want to delete this material center?')) {
      return;
    }
    
    try {
      const config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000'}/api/material-center/${centerId}`,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      await axios.request(config);
      
      // Update state directly without refetching
      setMaterialCenters(prevCenters => {
        const updatedCenters = prevCenters.filter(center => center._id !== centerId);
        
        // Update unique countries count
        const countries = new Set(updatedCenters.map(center => center.country));
        setUniqueCountries(countries.size);
        
        return updatedCenters;
      });
    } catch (err) {
      console.error('Error deleting material center:', err);
      setError('Failed to delete material center');
    }
  };

  const handleSubmit = (formData: MaterialCenter) => {
    if (isEditing) {
      handleUpdateMaterialCenter(formData);
    } else {
      handleAddMaterialCenter(formData);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-8">
          <h2 className="text-lg font-semibold">Total material Center- {materialCenters.length}</h2>
          <h2 className="text-lg font-semibold">Country- {uniqueCountries}</h2>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="border border-gray-300 rounded-full px-4 py-2 text-sm flex items-center"
        >
          + Add new material center
        </button>
      </div>

      {loading ? (
        <p className="text-center py-4">Loading material centers...</p>
      ) : error ? (
        <p className="text-center text-red-500 py-4">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">Address</th>
                <th className="py-3 px-4 text-left">City</th>
                <th className="py-3 px-4 text-left">Country</th>
                <th className="py-3 px-4 text-left">Currency</th>
                <th className="py-3 px-4 text-left">Warehouse type</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materialCenters.map((center) => (
                <tr key={center._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{center.address}</td>
                  <td className="py-3 px-4">{center.city}</td>
                  <td className="py-3 px-4">{center.country}</td>
                  <td className="py-3 px-4">{center.currency}</td>
                  <td className="py-3 px-4">
                    {center.warehouseSize === 'large' ? 'Large material center' : 'Small material center'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleOpenModal(center)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMaterialCenter(center._id)}
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
        </div>
      )}

      <MaterialCenterModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        materialCenter={currentCenter}
        isEditing={isEditing}
      />
    </div>
  );
}