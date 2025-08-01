"use client";

import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useOfferList } from '@/context/OfferListContext'; // Import the context
import Link from 'next/link';

// Offer Item Card Component
const OfferItemCard = ({ item, onRemove }) => {
  return (
    <div className="border rounded-md mb-4 relative">
      <div className="border-b p-3">
        <div className="flex justify-between">
          <h3 className="font-medium">Material Center Address</h3>
          <button 
            className="text-red-500" 
            onClick={() => onRemove(item.id)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <h4 className="font-medium">{item.name}</h4>
        <div className="flex justify-between mt-2">
          <span className="text-green-500">Quantity {item.quantity}</span>
          <span className="text-yellow-500">Lowest Price ${item.price}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {item.source}, Sex-{item.sex}
        </div>
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-1 mt-6">
      <button 
        onClick={() => onPageChange(1)} 
        className="px-2 py-1 border rounded"
      >
        <ChevronsLeft className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        className="px-2 py-1 border rounded"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      {[...Array(totalPages)].map((_, i) => (
        <button 
          key={i}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-teal-700 text-white' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        className="px-2 py-1 border rounded"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
      <button 
        onClick={() => onPageChange(totalPages)} 
        className="px-2 py-1 border rounded"
      >
        <ChevronsRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function OfferListDetailsPage() {
  const { offerList, removeOfferItem } = useOfferList(); // Use the context
  const [offerListNumber] = useState('33566687');
  const [date] = useState('21/12/1436');
  const [incoTerms] = useState('FOB');
  const [note] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate total pages based on actual offer list items (assuming 10 items per page)
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(offerList.length / itemsPerPage));
  
  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = offerList.slice(indexOfFirstItem, indexOfLastItem);

 

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">Offer List Number-{offerListNumber}</h1>
            <p className="text-gray-600">Date- {date}</p>
          </div>
         <Link href={'/inventory/offer-list/export'}>
         <button 
            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-2 rounded"
          >
            Next
          </button>
         </Link>
         

        </div>
        
        <div className="bg-white p-4 border rounded mb-6">
          <div className="mb-4">
            <h2 className="font-medium">Inco Terms- {incoTerms}</h2>
          </div>
          <div>
            <h2 className="font-medium">Note-</h2>
            <p className="text-gray-700">{note}</p>
          </div>
        </div>
      </div>
      
      {/* Display a message if no items are selected */}
      {offerList.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-gray-500">No items have been added to the offer list.</p>
        </div>
      ) : (
        <>
          {/* Grid of offer items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentItems.map(item => (
              <OfferItemCard 
                key={item.id} 
                item={item} 
                onRemove={removeOfferItem} 
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}