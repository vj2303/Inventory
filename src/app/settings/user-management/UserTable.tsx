import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import axios from 'axios';
import { User } from './types';
import { useAuth } from '../../../context/AuthContext';

interface UserTableProps {
  onAddUser: () => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

interface Permission {
  resource: string;
  actions: string[];
}

// User Management Table Component
const UserTable: React.FC<UserTableProps> = ({ onAddUser, onEditUser, onDeleteUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingPermissions, setUpdatingPermissions] = useState<string | null>(null);
  
  const { user: authUser } = useAuth();

  useEffect(() => {
    if (authUser?.token) {
      fetchUsers();
    }
  }, [authUser?.token]);

  const fetchUsers = async () => {
    if (!authUser?.token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/user-permissions',
        headers: { 
          'Authorization': `Bearer ${authUser.token}`
        }
      };

      const response = await axios.request(config);
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, permissions: Permission[]) => {
    if (!authUser?.token) {
      alert('No authentication token available');
      return;
    }

    try {
      setUpdatingPermissions(userId);
      const data = JSON.stringify({
        role: "MANAGER",
        access: "GENERAL_USER",
        permissions: permissions
      });

      const config = {
        method: 'patch',
        maxBodyLength: Infinity,
        url: `http://localhost:3000/api/api/user-permissions/${userId}/permissions`,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${authUser.token}`
        },
        data: data
      };

      const response = await axios.request(config);
      console.log('Permissions updated successfully:', response.data);
      
      // Refresh the users list to get updated data
      await fetchUsers();
      
      // Show success message (you can add a toast notification here)
      alert('User permissions updated successfully!');
    } catch (error) {
      console.error('Error updating permissions:', error);
      alert('Failed to update user permissions. Please try again.');
    } finally {
      setUpdatingPermissions(null);
    }
  };

  const handleUpdatePermissions = (user: User) => {
    // You can customize these default permissions or make them configurable
    const defaultPermissions: Permission[] = [
      {
        resource: "DASHBOARD",
        actions: ["VIEW"]
      },
      {
        resource: "PRODUCT",
        actions: ["VIEW", "CREATE", "EDIT", "DELETE"]
      },
      {
        resource: "CUSTOMER",
        actions: ["VIEW", "CREATE"]
      }
    ];
    
    updateUserPermissions(user._id, defaultPermissions);
  };

  // Don't render if no auth token
  if (!authUser?.token) {
    return (
      <div className="p-6 bg-white">
        <div className="flex justify-center items-center h-32">
          <div className="text-red-500">Authentication required</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 bg-white">
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Loading users...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white">
        <div className="flex justify-center items-center h-32">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">No. of Users- {users.length}</h2>
        <div className="flex gap-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option>Country</option>
            <option>India</option>
            <option>United States</option>
            <option>All</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg bg-white">
            <option>Access</option>
            <option>Admin</option>
            <option>Super Admin</option>
            <option>General User</option>
            <option>Warehouse User</option>
          </select>
          <button 
            onClick={onAddUser}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            + Add new user
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-3 font-medium text-gray-600">User Name</th>
              <th className="text-left p-3 font-medium text-gray-600">Role</th>
              <th className="text-left p-3 font-medium text-gray-600">Email</th>
              <th className="text-left p-3 font-medium text-gray-600">Country</th>
              <th className="text-left p-3 font-medium text-gray-600">Default Currency</th>
              <th className="text-left p-3 font-medium text-gray-600">Access</th>
              <th className="text-left p-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    {user.name}
                  </div>
                </td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.country}</td>
                <td className="p-3">{user.currency}</td>
                <td className="p-3">
                  <div>
                    <div className="font-medium">{user.access.join(', ')}</div>
                    <div className="text-sm text-gray-500">
                      Verified: {user.isVerified ? 'Yes' : 'No'}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditUser(user)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Edit User"
                    >
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button 
                      onClick={() => handleUpdatePermissions(user)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Update Permissions"
                      disabled={updatingPermissions === user._id}
                    >
                      <Settings size={16} className={`${updatingPermissions === user._id ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                    <button 
                      onClick={() => onDeleteUser(user)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Delete User"
                    >
                      <Trash2 size={16} className="text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;