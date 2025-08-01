import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash, X } from 'lucide-react';
import axios from 'axios';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (supplier: SupplierData) => void;
  supplier?: Supplier | null;
  isEditing?: boolean;
}

interface Supplier {
  id: string;
  name: string;
  code: string;
  manager: string;
  phone: string;
  country: string;
  city: string;
  address?: string;
  avatar?: string;
  supplierImage?: {
    url: string;
    publicId: string;
  };
}

interface SupplierData {
  id?: string;
  name: string;
  code: string;
  manager: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  avatar?: string;
  supplierImage?: {
    url: string;
    publicId: string;
  };
}

const SupplierModal: React.FC<SupplierModalProps> = ({ isOpen, onClose, onSubmit, supplier = null, isEditing = false }) => {
  const [formData, setFormData] = useState<SupplierData>({
    name: '',
    code: '',
    manager: '',
    phone: '',
    country: '',
    city: '',
    address: '',
    avatar: ''
  });

  const [hasAvatar, setHasAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000';

  // Initialize form data when editing an existing supplier
  useEffect(() => {
    if (supplier && isEditing) {
      setFormData({
        id: supplier.id,
        name: supplier.name,
        code: supplier.code,
        manager: supplier.manager,
        phone: supplier.phone,
        country: supplier.country,
        city: supplier.city,
        address: supplier.address || '',
        avatar: supplier.supplierImage?.url || supplier.avatar || '',
        supplierImage: supplier.supplierImage || undefined
      });
      setHasAvatar(!!(supplier.supplierImage?.url || supplier.avatar));
    } else {
      // Reset form when not editing
      setFormData({
        name: '',
        code: '',
        manager: '',
        phone: '',
        country: '',
        city: '',
        address: '',
        avatar: '',
        supplierImage: undefined
      });
      setHasAvatar(false);
      setSelectedFile(null);
    }
  }, [supplier, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPhoto = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    setHasAvatar(false);
    setSelectedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    // Store the file to be used during form submission
    setSelectedFile(file);
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({ ...prev, avatar: e.target?.result as string }));
      setHasAvatar(true);
    };
    reader.readAsDataURL(file);
    
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Create form data for submission
      const apiFormData = new FormData();
      apiFormData.append('name', formData.name);
      apiFormData.append('profile', formData.code); // Using code as profile
      apiFormData.append('managerName', formData.manager);
      apiFormData.append('phoneNumber', formData.phone);
      apiFormData.append('country', formData.country);
      apiFormData.append('city', formData.city);
      apiFormData.append('address', formData.address);
      
      // Add the image file if selected
      if (selectedFile) {
        apiFormData.append('supplierImage', selectedFile);
      }

      let response;
      
      if (isEditing && formData.id) {
        // Update existing supplier
        response = await axios({
          method: 'patch',
          url: `${SERVER_URL}/api/suppliers/${formData.id}`,
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set content-type manually, axios will set it with the boundary
          },
          data: apiFormData
        });
      } else {
        // Create new supplier
        response = await axios({
          method: 'post',
          url: `${SERVER_URL}/api/suppliers`,
          headers: {
            'Authorization': `Bearer ${token}`,
            // Don't set content-type manually, axios will set it with the boundary
          },
          data: apiFormData
        });
      }

      // Handle successful response
      const resultSupplier = {
        ...formData,
        id: formData.id || response.data.id || response.data._id || Date.now().toString(),
        avatar: response.data.avatar || response.data.imageUrl || formData.avatar, // Use the avatar URL from the response if available
        supplierImage: response.data.supplierImage || formData.supplierImage // Use the supplierImage from the response if available
      };
      
      // Call parent component's onSubmit function
      onSubmit(resultSupplier);
      
      // Close modal
      onClose();
    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} supplier:`, err);
      setError(`Failed to ${isEditing ? 'update' : 'create'} supplier. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Supplier' : 'Supplier Details'}</h2>
        
        <div className="flex justify-center mb-6">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {hasAvatar ? (
            <div className="relative cursor-pointer" onClick={handleAddPhoto}>
              {formData.avatar ? (
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img 
                    src={formData.avatar} 
                    alt={formData.name || 'Supplier'} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
              <button 
                className="absolute -right-2 -top-2 bg-white p-1 rounded-full border shadow"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening file selector
                  handleRemovePhoto();
                }}
                type="button"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div 
                className="w-16 h-16 rounded-full bg-blue-900 flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
                onClick={handleAddPhoto}
              >
                {formData.name ? formData.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <button 
                className="mt-2 text-sm border rounded-full px-3 py-1 flex items-center"
                onClick={handleAddPhoto}
                type="button"
              >
                <Camera className="w-4 h-4 mr-1" /> Add Photo
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Supplier Name</label>
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
              <label className="block text-sm font-medium mb-1">Supplier Code</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Manager</label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
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
              <label className="block text-sm font-medium mb-1">City</label>
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
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-teal-600 text-white px-6 py-2 rounded-full hover:bg-teal-700 disabled:bg-teal-300"
              disabled={isLoading}
            >
              {isLoading ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierModal;