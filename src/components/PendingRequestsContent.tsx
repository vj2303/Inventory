// app/components/PendingRequestsContent.tsx
"use client";

import { useState } from 'react';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PendingRequestsContentProps {
  type: string;
}

export default function PendingRequestsContent({ type }: PendingRequestsContentProps) {
  const router = useRouter();
  // Mock data for the table
  const requests = [
    {
      requestId: 'SHM-P24-02047',
      createdOn: '5 Jan 2025',
      requestedBy: 'John Doe',
      noOfItems: '300.00',
      status: 'Requested'
    }
  ];

  const [filterStatus, setFilterStatus] = useState('requested');

  // Handle take action button click based on current tab type
  const handleTakeAction = (requestId: string) => {
    switch(type) {
      case 'offer-list':
        router.push(`/approval/offer-list/approvals`);
        break;
      case 'stock-transfer':
        router.push(`/approval/stock-transfer/approvals`);
        break;
      case 'purchase-orders':
        router.push(`/approval/purchase-orders/approvals`);
        break;
      case 'proforma-invoice':
        router.push(`/approval/proforma-invoice/action/${requestId}`);
        break;
      default:
        router.push(`/approval/${type}/action/${requestId}`);
    }
  };

  return (
    <div className='border p-4 rounded-xl border-gray-400'>
      <div className="flex justify-between items-center my-4">
        <div className="text-xl font-semibold">Requests</div>
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Request Id"
              className="pl-10 pr-4 py-2 border rounded-md w-64"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          {/* Date filter button */}
          <button className="border rounded-md px-4 py-2 flex items-center gap-2 text-sm">
            03/12/2024 - 13/12/2024
            <ChevronDown size={16} />
          </button>
          
          {/* Sort button */}
          <button className="border rounded-md px-4 py-2 flex items-center gap-2 text-sm">
            Sort By
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex rounded-md overflow-hidden border border-gray-200 w-fit">
        <button
            className={`py-3 px-6 flex rounded-md font-bold items-center ${
            filterStatus === 'requested' 
                ? 'bg-[#004C4C] text-white' 
                : 'bg-white text-black'
            }`}
            onClick={() => setFilterStatus('requested')}
        >
            Requested 
            <span className="bg-white text-green-800 rounded-full w-8 h-8 flex items-center justify-center ml-3 text-sm font-medium">
            0
            </span>
        </button>
        <button
            className={`py-3 rounded-md font-bold px-6 ${
            filterStatus === 'rejected' 
                ? 'bg-[#004C4C] text-white' 
                : 'bg-white text-black'
            }`}
            onClick={() => setFilterStatus('rejected')}
        >
            Rejected
        </button>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="py-3 px-4 font-bold text-[16px]">Request ID</th>
              <th className="py-3 px-4 font-bold text-[16px]">Created On</th>
              <th className="py-3 px-4 font-bold text-[16px]">Requested By</th>
              <th className="py-3 px-4 font-bold text-[16px]">No. OF Items</th>
              <th className="py-3 px-4 font-bold text-[16px]">Status</th>
              <th className="py-3 px-4 font-bold text-[16px]">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={index} className="border-t">
                <td className="py-4 px-4">{request.requestId}</td>
                <td className="py-4 px-4">{request.createdOn}</td>
                <td className="py-4 px-4">{request.requestedBy}</td>
                <td className="py-4 px-4">{request.noOfItems}</td>
                <td className="py-4 px-4">
                  <span className="bg-orange-100 text-orange-500 px-3 py-1 rounded-full text-sm">
                    {request.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <button 
                    className="border border-gray-300 rounded-full px-4 py-1 text-sm hover:bg-gray-50"
                    onClick={() => handleTakeAction(request.requestId)}
                  >
                    Take Action
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}