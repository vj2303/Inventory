'use client' // pages/personal-info.tsx 
import React, { useState } from 'react';
import Layout from '../layout';
import InputField from '@/components/UI/InputField';
import Dropdown from '@/components/UI/Dropdown';
import Button from '@/components/UI/Button'; // Import the Button component

const PersonalInfo: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Morty Smith',
    email: 'Morty Smith',
    password: 'Morty Smith',
    position: 'Manager',
    access: 'Admin',
    defaultCurrency: 'Dollar',
    country: 'United States'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', formData);
    // Here you would typically make an API call to save the data
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
      // Implement account deletion logic here
    }
  };

  const handleCancel = () => {
    console.log('Changes canceled');
    // Implement cancel logic (e.g., reset form or navigate back)
  };

  const handleUpdateProfilePic = () => {
    console.log('Update profile picture requested');
    // Implement file selection logic
  };

  const handleRemoveProfilePic = () => {
    console.log('Remove profile picture requested');
    // Implement profile picture removal logic
  };

  return (
    <Layout title="Personal Info">
      <div className="rounded-lg p-6">
        {/* Top buttons section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Personal Details</h1>
          <div className="flex gap-3">
            {/* Using custom Button components instead of HTML buttons */}
            <Button 
              type="button"
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </Button>
            <Button 
              type="button" 
              variant="primary" 
              onClick={handleSubmit}
            >
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </div>

        {/* Profile picture section with update/remove buttons */}
        <div className="flex items-center mb-6">
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 flex items-center justify-center text-white text-2xl font-bold">
              D
            </div>
          </div>
          <div className="ml-4 flex gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleUpdateProfilePic}
            >
              Update
            </Button>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleRemoveProfilePic}
            >
              Remove
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <InputField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
            />
            
            <InputField
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
            />
            
            <InputField
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
            />
            
            <Dropdown
              label="Access"
              name="access"
              value={formData.access}
              onChange={handleChange}
              options={[
                { value: 'Admin', label: 'Admin' },
                { value: 'User', label: 'User' },
                { value: 'Viewer', label: 'Viewer' }
              ]}
            />
            
            <Dropdown
              label="Default Currency"
              name="defaultCurrency"
              value={formData.defaultCurrency}
              onChange={handleChange}
              options={[
                { value: 'Dollar', label: 'Dollar' },
                { value: 'Euro', label: 'Euro' },
                { value: 'Pound', label: 'Pound' }
              ]}
            />
            
            <Dropdown
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              options={[
                { value: 'United States', label: 'United States' },
                { value: 'Canada', label: 'Canada' },
                { value: 'United Kingdom', label: 'United Kingdom' },
                { value: 'Australia', label: 'Australia' }
              ]}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PersonalInfo;