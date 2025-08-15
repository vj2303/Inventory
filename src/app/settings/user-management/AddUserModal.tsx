'use client'
import React, { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import UserPermissions from './UserPermissions';
import { createUser, Permission } from '../../../utils/api';
import { User, CreateUserData } from './types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (userData: CreateUserData) => void;
  editUser?: User | null;
  onSave?: (userData: CreateUserData) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ 
  isOpen, 
  onClose, 
  onNext, 
  editUser, 
  onSave 
}) => {
    const [currentStep, setCurrentStep] = useState<'form' | 'permissions'>('form');
    const [formData, setFormData] = useState<CreateUserData>({
      name: 'Morty Smith',
      position: 'Manager',
      email: 'morty@example.com',
      password: '',
      access: 'GENERAL_USER',
      country: 'USA',
      currency: 'USD',
      role: 'MANAGER'
    });
  
    const [showAccessDropdown, setShowAccessDropdown] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  
    const accessOptions = ['GENERAL_USER', 'ADMIN', 'SUPER_ADMIN', 'WAREHOUSE_USER'];
    const countryOptions = ['USA', 'India', 'All'];
    const currencyOptions = ['USD', 'INR', 'All'];
    const roleOptions = ['MANAGER', 'ADMIN', 'USER', 'SUPER_ADMIN'];
  
    // Initialize form data when editing
    React.useEffect(() => {
      if (editUser) {
        setFormData({
          name: editUser.name,
          position: editUser.role, // Map role to position for editing
          email: editUser.email,
          password: '', // Don't show password when editing
          access: editUser.access[0] || 'GENERAL_USER', // Take first access level
          country: editUser.country,
          currency: editUser.currency,
          role: editUser.role
        });
        setCurrentStep('form');
      }
    }, [editUser]);
  
    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      // Clear error for this field when user starts typing
      if (formErrors[field]) {
        setFormErrors(prev => ({ ...prev, [field]: '' }));
      }
    };
  
    const validateForm = () => {
      const errors: {[key: string]: string} = {};
      
      if (!formData.name.trim()) {
        errors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      
      if (!formData.role) {
        errors.role = 'Role is required';
      }
      
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
      if (validateForm()) {
        setCurrentStep('permissions');
      }
    };
  
    const handleBack = () => {
      setCurrentStep('form');
    };

    const createUserHandler = async (permissions: Permission[]) => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      try {
        const userData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          access: formData.access,
          currency: formData.currency,
          country: formData.country,
          permissions: permissions
        };

        const response = await createUser(userData);
        console.log('User created successfully:', response);
        
        setSuccess('User created successfully!');
        
        // Call the onNext callback with the created user data
        if (onNext) {
          onNext(formData);
        }
        
        // Close modal after a short delay to show success message
        setTimeout(() => {
          handleClose();
        }, 1500);
      } catch (error: any) {
        console.error('Error creating user:', error);
        setError(error.message || 'Failed to create user. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  
    const handleSave = () => {
      if (editUser && onSave) {
        onSave(formData);
      } else {
        // For new users, we'll handle this in the permissions step
        onNext(formData);
      }
      handleClose();
    };
  
    const handleClose = () => {
      setCurrentStep('form');
      setFormData({
        name: 'Morty Smith',
        position: 'Manager',
        email: 'morty@example.com',
        password: '',
        access: 'GENERAL_USER',
        country: 'USA',
        currency: 'USD',
        role: 'MANAGER'
      });
      setError(null);
      setSuccess(null);
      setFormErrors({});
      onClose();
    };
  
    if (!isOpen) return null;
  
    if (currentStep === 'permissions') {
      return (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">
                {editUser ? 'Edit User Permissions' : 'Set User Permissions'}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}
            
            <UserPermissions onBack={handleBack} onCreateUser={createUserHandler} isLoading={isLoading} />
            
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <button
                onClick={handleBack}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isLoading}
              >
                Back
              </button>
              {editUser && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  disabled={isLoading}
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }
  
    return (
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {editUser ? 'Edit User' : 'Add New User'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
  
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm">Update</button>
              <button className="px-3 py-1 border border-gray-300 rounded text-sm flex items-center gap-1">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
  
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter password"
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`w-full px-3 py-2 border rounded-lg text-left flex justify-between items-center ${
                  formErrors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {formData.role}
                <ChevronDown size={16} />
              </button>
              {formErrors.role && (
                <p className="mt-1 text-sm text-red-600">{formErrors.role}</p>
              )}
              {showRoleDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                  {roleOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleInputChange('role', option);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        formData.role === option ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
  
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Access</label>
              <button
                onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center"
              >
                {formData.access}
                <ChevronDown size={16} />
              </button>
              {showAccessDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                  {accessOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleInputChange('access', option);
                        setShowAccessDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 ${
                        formData.access === option ? 'bg-blue-50 text-blue-600' : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
  
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <button
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center"
              >
                {formData.country}
                <ChevronDown size={16} />
              </button>
              {showCountryDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                  {countryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleInputChange('country', option);
                        setShowCountryDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
  
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex justify-between items-center"
              >
                {formData.currency}
                <ChevronDown size={16} />
              </button>
              {showCurrencyDropdown && (
                <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg mt-1 z-10">
                  {currencyOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        handleInputChange('currency', option);
                        setShowCurrencyDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
  
          <div className="flex gap-3 mt-8">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

export default AddUserModal;