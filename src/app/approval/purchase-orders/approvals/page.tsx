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
  const [items, setItems] = useState<TransferItem[]>([
    {
      id: '1',
      itemName: 'Fred Hayman',
      inStock: 100,
      transferQuantity: 40,
      unitCost: 50.00,
      totalValue: 2000.00
    }
  ]);
  
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Calculate total value
  const subTotal = items.reduce((sum, item) => sum + item.totalValue, 0);
  const discount = subTotal * 0.20; // 20% discount
  const tax = subTotal * 0.04; // 4% tax
  const total = subTotal - discount + tax;

  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Handle individual item reject button click
  const handleItemRejectClick = (id: string) => {
    setSelectedItemId(id);
    setIsRejectModalOpen(true);
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

        <div className='border p-2 rounded-lg border-gray-200'>
            <h1 className='font-bold text-[25px] text-[#1E1E1E]'>Transfer reference ID- 9809</h1>
            <p className='text-[#979797] text-[16px] mt-2'>Date- 5 Jan 2025</p>
            <p className='text-[#667085] text-[16px]'>Incoterms:<span className='font-medium text-[16px] text-[#1D2939]'>FOB (New York, USA)</span></p>

            <div className='border p-4 flex justify-between rounded-lg border-gray-200 mb-6 mt-4'>
                <div className='bg-[#ffff] p-2 rounded-lg'>
                    <h1 className='text-[#19213D] text-[20px] font-bold'>Supplier Details</h1>
                    <p className='text-[#1E1E1E] text-[14px] font-medium'>Name:<span className='text-[#868DA6]'>(612) 856 - 0989</span></p>
                    <p className='text-[#1E1E1E] text-[14px] font-medium'>Contact:<span className='text-[#868DA6]'>name67@gmail.com</span></p>
                    <p className='text-[#1E1E1E] text-[14px] font-medium'>Email:<span className='text-[#868DA6]'>John Doe</span></p>
                    <p className='text-[#1E1E1E] text-[14px] font-medium'>Address:<span className='text-[#868DA6]'>Pablo Alto, San Francisco, CA 92102, United States of America</span></p>
                </div>
        
                <div className='p-2 rounded-lg'>
                    <h1 className='text-[#19213D] text-[20px] font-bold'>Delivery Address</h1>
                    <p className='text-[#868DA6] text-[14px] font-medium'>Pablo Alto, San Francisco, CA 92102, United States of America</p>
                    <p className='text-[#868DA6] text-[14px] font-medium mt-2'>(684) 879 - 0102</p>
                </div>
            </div>
        </div>
        
        {/* Item Details Table */}
        <div className="mt-6 border rounded-lg border-gray-200 p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-4 font-semibold text-gray-700">Item Details</th>
                  <th className="text-center pb-4 font-semibold text-gray-700">Quantity</th>
                  <th className="text-center pb-4 font-semibold text-gray-700">Unit Cost($)</th>
                  <th className="text-right pb-4 font-semibold text-gray-700">Total Cost($)</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4 font-medium">{item.itemName}</td>
                    <td className="py-4">
                      <input
                        type="text"
                        value={item.transferQuantity}
                        className="w-full text-center border rounded-md p-2"
                        readOnly
                      />
                    </td>
                    <td className="py-4">
                      <input
                        type="text"
                        value={item.unitCost.toFixed(2)}
                        className="w-full text-center border rounded-md p-2"
                        readOnly
                      />
                    </td>
                    <td className="py-4 text-right">{item.totalValue.toFixed(2)}</td>
                    <td className="py-4">
                      <button onClick={() => handleItemRejectClick(item.id)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Terms of Payment and Order Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Terms of Payment */}
          <div>
            <h2 className="text-xl font-bold mb-4">Terms Of Payment</h2>
            <p className="text-gray-600">Credit -20%</p>
          </div>

          {/* Order Summary */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <button className="text-green-600 flex items-center">
                <span className="mr-1">+</span> Add field
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium">${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">(20%) - ${discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vat</span>
                <span className="font-medium">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">+${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-bold">Total</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Note</h2>
          <textarea 
            className="w-full border rounded-lg p-4" 
            rows={4}
            placeholder="Note Content Will be displayed here"
          />
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