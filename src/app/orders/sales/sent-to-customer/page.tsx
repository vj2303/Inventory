'use client'
import React, { useState } from "react";
import { Search, ChevronDown, ArrowUpDown, Edit, FileText } from "lucide-react";

export default function SentToCustomerScreen() {
  // Sample data for proforma invoices
  const [proformas, setProformas] = useState([
    {
      id: "SHM-P24-02047",
      createdOn: "5 Jan 2025",
      requestedBy: "John Doe",
      customerName: "Customer Name",
      itemCount: 1,
      totalCost: 300.00,
      status: "Requested"
    },
    {
      id: "SHM-P24-02047",
      createdOn: "5 Jan 2025",
      requestedBy: "John Doe",
      customerName: "Customer Name",
      itemCount: 1,
      totalCost: 300.00,
      status: "Approved"
    },
    {
      id: "SHM-P24-02047",
      createdOn: "5 Jan 2025",
      requestedBy: "John Doe",
      customerName: "Customer Name",
      itemCount: 1,
      totalCost: 300.00,
      status: "Approved"
    },
    {
      id: "SHM-P24-02047",
      createdOn: "5 Jan 2025",
      requestedBy: "John Doe",
      customerName: "Customer Name",
      itemCount: 1,
      totalCost: 300.00,
      status: "Rejected"
    }
  ]);

  // Date range state
  const [dateRange, setDateRange] = useState("01/12/2024 - 12/12/2024");
  
  // Function to handle placing an order
  const handlePlaceOrder = (id) => {
    console.log(`Placing order for proforma ${id}`);
  };
  
  // Function to handle viewing notes
  const handleViewNote = (id) => {
    console.log(`Viewing notes for proforma ${id}`);
  };
  
  // Function to handle edit
  const handleEdit = (id) => {
    console.log(`Editing proforma ${id}`);
  };

  // Function to render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "Requested":
        return <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded">Requested</span>;
      case "Approved":
        return <span className="bg-green-100 text-green-600 px-2 py-1 rounded">Approved</span>;
      case "Rejected":
        return <span className="bg-red-100 text-red-600 px-2 py-1 rounded">Rejected</span>;
      default:
        return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{status}</span>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">Sent To Customer</h1>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search Proforma No."
              className="border rounded-md pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="border rounded-md px-4 py-2 flex items-center gap-2">
                <span>{dateRange}</span>
                <ChevronDown size={16} />
              </button>
            </div>
            
            <div className="relative">
              <button className="border rounded-md px-4 py-2 flex items-center gap-2">
                <span>Sort By</span>
                <ArrowUpDown size={16} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Proforma No.</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created On</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Requested By</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Cost($)</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {proformas.map((proforma, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{proforma.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{proforma.createdOn}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{proforma.requestedBy}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{proforma.customerName}</p>
                      <p className="text-xs text-gray-500">No. of Items: {proforma.itemCount}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-700">{proforma.totalCost.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStatusBadge(proforma.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {proforma.status === "Approved" ? (
                      <button 
                        onClick={() => handlePlaceOrder(proforma.id)}
                        className="text-sm bg-white border border-gray-300 rounded-md px-4 py-1 hover:bg-gray-50"
                      >
                        Place Order
                      </button>
                    ) : proforma.status === "Rejected" ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(proforma.id)}
                          className="text-sm text-gray-700 hover:text-gray-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleViewNote(proforma.id)}
                          className="text-sm text-gray-700 hover:text-gray-900"
                        >
                          <FileText size={18} />
                        </button>
                      </div>
                    ) : null}
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