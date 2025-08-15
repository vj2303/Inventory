'use client'
import { useState } from "react";
import UserTable from './UserTable';
import AddUserModal from './AddUserModal';
import { User } from './types';

const UserManagementApp = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const handleAddUser = () => {
      setEditingUser(null);
      setIsModalOpen(true);
    };
  
    const handleEditUser = (user: User) => {
      setEditingUser(user);
      setIsModalOpen(true);
    };
  
    const handleModalClose = () => {
      setIsModalOpen(false);
      setEditingUser(null);
    };
  
    const handleModalNext = (userData: any) => {
      // This will be handled by the API call in UserTable
      setIsModalOpen(false);
      setEditingUser(null);
    };
  
    const handleSaveUser = (userData: any) => {
      if (editingUser) {
        // This will be handled by the API call in UserTable
      }
      setIsModalOpen(false);
      setEditingUser(null);
    };
  
    const handleDeleteUser = (user: User) => {
      // This will be handled by the API call in UserTable
    };
  
    return (
      <div className="min-h-screen bg-gray-50">
        <UserTable
          onAddUser={handleAddUser}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
        />
  
        <AddUserModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onNext={handleModalNext}
          editUser={editingUser}
          onSave={handleSaveUser}
        />
      </div>
    );
  };
  
  export default UserManagementApp;