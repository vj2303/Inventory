'use client';

import { useState } from 'react';
import { List, LayoutGrid, ArrowUpDown, ArrowDownUp } from 'lucide-react';

interface propsType {
  sort: string | null,
  handleSortChange: (sortType: "price-low" | "price-high" | "supplier-az") => void,
  isCompanyInventory: boolean,
  setIsCompanyInventory: React.Dispatch<React.SetStateAction<boolean>>,
  view: "list" | "grid",
  setView: React.Dispatch<React.SetStateAction<"list" | "grid">>
}

export default function TopBarControls({ sort, handleSortChange, isCompanyInventory, setIsCompanyInventory, view, setView }: propsType) {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  return (
    <div className="flex items-center gap-4">
      {/* Toggle Switch */}
      <label className="flex items-center gap-2">
        <span className="font-medium">Company Inventory</span>
        <button
          onClick={() => setIsCompanyInventory(prev => !prev)}
          className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isCompanyInventory ? 'bg-teal-500' : 'bg-gray-300'
            }`}
        >
          <span
            className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${isCompanyInventory ? 'translate-x-6' : 'translate-x-0'
              }`}
          />
        </button>
      </label>

      {/* Sort Button */}
      <button onClick={() => setShowDropdown(prev => !prev)} className="flex items-center gap-1 border border-gray-300 px-4 py-2 rounded-full hover:shadow-sm transition cursor-pointer relative">
        <span className="font-medium">Sort By</span>
        {sort === null || sort === "price-low" ? <ArrowUpDown className="w-4 h-4" /> : <ArrowDownUp className='w-4 h-4' />}
        {showDropdown && <Dropdown handleSortChange={handleSortChange} />}
      </button>

      {/* View Switcher */}
      <div className="flex bg-white border border-gray-300 rounded-lg shadow-sm overflow-hidden">
        <button
          onClick={() => setView('list')}
          className={`p-2 transition-colors ${view === 'list' ? 'bg-teal-500 rounded-md text-white' : 'text-gray-500'
            }`}
        >
          <List className="w-5 h-5" />
        </button>
        <button
          onClick={() => setView('grid')}
          className={`p-2 transition-colors ${view === 'grid' ? 'bg-teal-500 text-white rounded-md' : 'text-gray-500'
            }`}
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

const Dropdown = ({ handleSortChange }: { handleSortChange: (sortType: "price-low" | "price-high" | "supplier-az") => void }) => {
  return (
    <div className='absolute bottom-[-150px] left-0 bg-white p-2 flex flex-col gap-2 z-100 shadow-md rounded'>
      <p onClick={() => handleSortChange("price-high")} className='cursor-pointer w-full px-4 py-2 hover:bg-teal-400 rounded whitespace-nowrap'>
        Price Highest to Lowest
      </p>
      <p onClick={() => handleSortChange("price-low")} className='cursor-pointer w-full px-4 py-2 hover:bg-teal-300 rounded whitespace-nowrap'>
        Price Lowest to Highest
      </p>
      <p onClick={() => handleSortChange("supplier-az")} className='cursor-pointer w-full px-4 py-2 hover:bg-teal-400 rounded whitespace-nowrap'>
        Supplier Name (A-Z)
      </p>
    </div>
  );
};

