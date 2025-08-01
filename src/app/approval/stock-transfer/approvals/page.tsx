'use client'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import RejectModal from '@/components/RejectModal';

interface TransferItem {
  id: string;
  itemName: string;
  inStock: number;
  transferQuantity: number;
  unitCost: number;
  totalValue: number;
}

const ApproveOfferList: React.FC = () => {
  const [transferItems, setTransferItems] = useState<TransferItem[]>([
    {
      id: '1',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    },
    {
      id: '2',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    },
    {
      id: '3',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    },
    {
      id: '4',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    },
    {
      id: '5',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    },
    {
      id: '6',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    },
    {
      id: '7',
      itemName: 'A&F AUTHENTIC NIGHT M TESTER 100ML',
      inStock: 2400,
      transferQuantity: 40,
      unitCost: 200.00,
      totalValue: 2000.00
    }
  ]);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Calculate total value
  const totalValue = transferItems.reduce((sum, item) => sum + item.totalValue, 0);

  // Handle individual item deletion
  const handleDeleteItem = (id: string) => {
    setTransferItems(transferItems.filter(item => item.id !== id));
  };

  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setTransferItems(transferItems.map(item => {
      if (item.id === id) {
        const updatedQuantity = Math.max(0, newQuantity); // Ensure quantity doesn't go below 0
        const newTotalValue = updatedQuantity * item.unitCost;
        return { ...item, transferQuantity: updatedQuantity, totalValue: newTotalValue };
      }
      return item;
    }));
  };

  // Handle main Reject button click
  const handleMainRejectClick = () => {
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
      handleDeleteItem(selectedItemId as string);
    }
    
    // Close modal and reset state
    setIsRejectModalOpen(false);
    setSelectedItemId(null);
  };

  return (
    <>
     
      
      <div className="min-h-screen">
        <header className="py-4 flex items-center">
          <Link href="/approval/offer-list" className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Approve Stock List</h1>
          
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

        <h1 className='font-bold text-[25px] text-[#1E1E1E]'>Transfer reference ID- 9809</h1>
        <p className='text-[#979797] text-[16px] mt-2'>Date- 5 Jan 2025</p>

        <div className='border p-4 flex justify-between rounded-lg border-gray-200 mb-6 mt-4'>
            <div className='bg-[#ffff] p-2 rounded-lg'>
                <h1 className='text-[#19213D] text-[20px] font-bold'>Source Warehouse</h1>
                <p className='text-[#868DA6] text-[14px] font-medium'>Pablo Alto, San Francisco, CA 92102, United States of America</p>
            </div>
       
            <div className='p-2 rounded-lg'>
                <h1 className='text-[#19213D] text-[20px] font-bold'>Destination Warehouse</h1>
                <p className='text-[#868DA6] text-[14px] font-medium'>Pablo Alto, San Francisco, CA 92102, United States of America</p>
            </div>
        </div>

        {/* Transfer Items Table */}
        <div className='border rounded-lg overflow-hidden'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='py-4 px-4 text-left'>Item Details</th>
                <th className='py-4 px-4 text-left'>In Stock</th>
                <th className='py-4 px-4 text-left'>Transfer Quantity</th>
                <th className='py-4 px-4 text-left'>Unit Cost($)</th>
                <th className='py-4 px-4 text-left'>Total Value</th>
                <th className='py-4 px-4'></th>
              </tr>
            </thead>
            <tbody>
              {transferItems.map((item) => (
                <tr key={item.id} className='border-b'>
                  <td className='py-4 px-4 text-left font-medium'>{item.itemName}</td>
                  <td className='py-4 px-4 text-left'>{item.inStock}</td>
                  <td className='py-4 px-4 text-left'>
                    <input
                      type="number"
                      value={item.transferQuantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 0)}
                      className='border rounded-md w-24 py-2 px-3 text-center'
                      min="0"
                      max={item.inStock}
                    />
                  </td>
                  <td className='py-4 px-4 text-left'>{item.unitCost.toFixed(2)}</td>
                  <td className='py-4 px-4 text-left'>{item.totalValue.toFixed(2)}</td>
                  <td className='py-4 px-4 text-center'>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className='text-red-500'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className='flex justify-end mt-4'>
          <div className='flex w-full max-w-xl'>
            <div className='w-1/2 border rounded-lg p-4 mr-4 flex justify-center items-center'>
              <div className='text-center'>
                <p className='text-lg font-medium'>Number of Items: {transferItems.length}</p>
              </div>
            </div>
            <div className='w-1/2 border rounded-lg p-4 flex justify-center items-center'>
              <div className='text-center'>
                <p className='text-lg font-medium'>Total Value - ${totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
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