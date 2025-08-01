'use client'
// src/components/FilterButton.tsx
import React, { useState } from 'react';
import FilterModal from './FilterModal';

interface FilterButtonProps {
  onApplyFilters: (filters: any) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onApplyFilters }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleApplyFilters = (filters: any) => {
    onApplyFilters(filters);
    handleCloseModal();
  };

  return (
    <>
      <button 
        className="px-4 py-2 border  border-gray-300 rounded flex items-center justify-between w-full"
        onClick={handleOpenModal}
      >
        <span>Filters</span>
        <span>≡</span>
      </button>

      <FilterModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApplyFilters={handleApplyFilters}
      />
    </>
  );
};

export default FilterButton;