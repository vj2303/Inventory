'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import OfferCard from '@/components/OfferCard';
import RejectModal from '@/components/RejectModal';

interface OfferItem {
  id: string;
  materialCenterAddress: string;
  productName: string;
  quantity: string;
  lowestPrice: string;
  supplierInfo: string;
}

const ApproveOfferList: React.FC = () => {

  const [offerItems, setOfferItems] = useState<OfferItem[]>([
    {
      id: '1',
      materialCenterAddress: 'Material Center Address',
      productName: 'Gucci Perfume',
      quantity: 'Quantity 240+',
      lowestPrice: 'Lowest Price $10',
      supplierInfo: 'Supplier Name, Sex-M'
    },
    {
      id: '2',
      materialCenterAddress: 'Material Center Address',
      productName: 'Gucci Perfume',
      quantity: 'Quantity 240+',
      lowestPrice: 'Lowest Price $10',
      supplierInfo: 'Supplier Name, Sex-M'
    },
    {
      id: '3',
      materialCenterAddress: 'Material Center Address',
      productName: 'Gucci Perfume',
      quantity: 'Quantity 240+',
      lowestPrice: 'Lowest Price $10',
      supplierInfo: 'Supplier Name, Sex-M'
    },
    {
      id: '4',
      materialCenterAddress: 'Material Center Address',
      productName: 'Gucci Perfume',
      quantity: 'Quantity 240+',
      lowestPrice: 'Lowest Price $10',
      supplierInfo: 'Company Inventory, Sex-F'
    },
    {
      id: '5',
      materialCenterAddress: 'Material Center Address',
      productName: 'Gucci Perfume',
      quantity: 'Quantity 240+',
      lowestPrice: 'Lowest Price $10',
      supplierInfo: 'Company Inventory, Sex-F'
    },
    {
      id: '6',
      materialCenterAddress: 'Material Center Address',
      productName: 'Gucci Perfume',
      quantity: 'Quantity 240+',
      lowestPrice: 'Lowest Price $10',
      supplierInfo: 'Company Inventory, Sex-F'
    }
  ]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Handle individual card reject button click
  const handleRejectClick = (id: string) => {
    setSelectedItemId(id);
    setIsRejectModalOpen(true);
  };

  // Handle main Reject button click
  const handleMainRejectClick = () => {
    // If no specific item is selected, use a special identifier
    setSelectedItemId('all');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (reason: string) => {
    if (selectedItemId === 'all') {
      // Handle rejecting all selected items or a batch rejection
      console.log(`Batch rejection. Reason: ${reason}`);
      // Here you would handle the batch rejection logic
    } else {
      // Handle single item rejection
      console.log(`Item ${selectedItemId} rejected. Reason: ${reason}`);
      // Remove the rejected item from the list
      setOfferItems(offerItems.filter(item => item.id !== selectedItemId));
    }
    
    // Close modal and reset state
    setIsRejectModalOpen(false);
    setSelectedItemId(null);
  };

  return (
    <>
      <Head>
        <title>Approve Offer List</title>
      </Head>
      
      <div className="min-h-screen">
        <header className="p-4 flex items-center">
          <Link href="/approval/offer-list" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Approve Offer List</h1>
          
          <div className="ml-auto flex space-x-2">
            <button className="flex items-center border px-4 py-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Save Changes
            </button>
            <button 
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
              onClick={handleMainRejectClick}
            >
              Reject
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
              Approve
            </button>
          </div>
        </header>
        
        <main className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerItems.map(item => (
              <OfferCard
                key={item.id}
                materialCenterAddress={item.materialCenterAddress}
                productName={item.productName}
                quantity={item.quantity}
                lowestPrice={item.lowestPrice}
                supplierInfo={item.supplierInfo}
                onReject={() => handleRejectClick(item.id)}
              />
            ))}
          </div>
        </main>
      </div>
      
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
};

export default ApproveOfferList;