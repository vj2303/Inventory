'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function TransferOrderDetails() {
  const [showExportOptions, setShowExportOptions] = useState(false);

  const toggleExportOptions = () => {
    setShowExportOptions(!showExportOptions);
  };

  return (
    <div className="container mx-auto p-4 ">
   
      <div className="flex justify-between items-center mb-6">
        <Link href="/inventory/stock" className="flex items-center text-gray-700">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span className="text-lg">Back To Order List</span>
        </Link>
        
        <div className="relative">
          <button 
            onClick={toggleExportOptions}
            className="px-6 py-2 border border-gray-300 rounded-md flex items-center"
          >
            Export
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <div className="py-1">
                <button
                  onClick={() => {
                    console.log('Export to PDF');
                    setShowExportOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => {
                    console.log('Export to CSV');
                    setShowExportOptions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export as CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Transfer reference ID- 9809</h1>
        <p className="text-gray-500">Date- 5 Jan 2025</p>
      </div>

      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <div className="flex flex-row justify-between">
          
          <div className='bg-[#fff] p-2 rounded-md'>
            <h2 className="text-xl font-semibold mb-3">Source Warehouse</h2>
            <p className="text-gray-600">Pablo Alto, San Francisco, CA 92102, United States of America</p>
          </div>
          
         
          <div>
            <h2 className="text-xl font-semibold mb-3">Destination Warehouse</h2>
            <p className="text-gray-600">San Francisco, CA 94109, United States of America</p>
          </div>
        </div>

        <div className="mt-10">
          <div className="relative">
            
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
            
            <div className="flex justify-between relative">
              
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-green-500 rounded-full z-10"></div>
                <p className="mt-3 text-green-500 font-medium">In Warehouse</p>
                <p className="text-sm text-gray-500 mt-1">Wed, 2 Jan 2025</p>
              </div>
              
              {/* Stock in Transit - Inactive */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full z-10"></div>
                <p className="mt-3 text-gray-400">Stock in Transit</p>
              </div>
              
              {/* Out For Delivery - Inactive */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full z-10"></div>
                <p className="mt-3 text-gray-400">Out For Delivery</p>
              </div>
              
              {/* Received - Inactive */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 bg-gray-300 rounded-full z-10"></div>
                <p className="mt-3 text-gray-400">Received</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Product Details</h2>
        
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                  Item Details
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Transfer Quantity
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Unit Cost($)
                </th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">
                  Total Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4].map((item) => (
                <tr key={item}>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      A&F AUTHENTIC NIGHT M TESTER 100ML
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    40
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    200.00
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    2,000.00
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}