"use client";

import React, { useState } from "react";
import { Search, ArrowUpDown, MoreVertical, ChevronDown } from "lucide-react";

// Custom Dropdown Component
const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      {React.cloneElement(React.Children.only(children[0]), {
        onClick: () => setOpen(!open),
      })}
      {open && children[1]}
    </div>
  );
};

const DropdownMenuTrigger = ({ asChild, children }) => {
  return asChild ? children : <button>{children}</button>;
};

const DropdownMenuContent = ({ align = "center", children }) => {
  const alignmentClasses = {
    center: "left-1/2 transform -translate-x-1/2",
    start: "left-0",
    end: "right-0",
  };

  return (
    <div className={`absolute z-10 mt-1 ${alignmentClasses[align]}`}>
      <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 min-w-32">
        {children}
      </div>
    </div>
  );
};

const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <button
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function ApprovedPage() {
  const [dateRange, setDateRange] = useState("03/12/2024 - 13/12/2024");
  const [showDropdown, setShowDropdown] = useState(null);
  const [orders, setOrders] = useState([
    {
      poNumber: "SHM-P24-02047",
      createdOn: "5 Jan 2025",
      createdBy: "John Doe",
      customerName: "Customer Name",
      items: 1,
      totalCost: 300.00,
      status: "Approved"
    },
    {
      poNumber: "SHM-P24-02047",
      createdOn: "5 Jan 2025",
      createdBy: "John Doe",
      customerName: "Customer Name",
      items: 1,
      totalCost: 300.00,
      status: "Approved"
    }
  ]);

  const toggleDropdown = (index) => {
    if (showDropdown === index) {
      setShowDropdown(null);
    } else {
      setShowDropdown(index);
    }
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Approved P.I</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search Proforma No."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none">
              <span>{dateRange}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative">
            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none">
              <span>Sort By</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden">
        <table className="min-w-full bg-green-50">
          <thead>
            <tr className="bg-[#B2D9D8] text-left text-sm">
              <th className="px-6 py-3 font-medium">Proforma No.</th>
              <th className="px-6 py-3 font-medium">Created On</th>
              <th className="px-6 py-3 font-medium">Created By</th>
              <th className="px-6 py-3 font-medium">Customer Name</th>
              <th className="px-6 py-3 font-medium">Total Cost($)</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {orders.map((order, index) => (
              <tr key={index} className="bg-white">
                <td className="px-6 py-4">{order.poNumber}</td>
                <td className="px-6 py-4">{order.createdOn}</td>
                <td className="px-6 py-4">{order.createdBy}</td>
                <td className="px-6 py-4">
                  <div>{order.customerName}</div>
                  <div className="text-xs text-gray-500">No. of Items: {order.items}</div>
                </td>
                <td className="px-6 py-4">{order.totalCost.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                    Send to Customer
                  </button>
                </td>
                <td className="px-6 py-4 relative">
                  <button 
                    className="p-1"
                    onClick={() => toggleDropdown(index)}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {showDropdown === index && (
                    <div className="absolute right-0 mt-1 z-10 bg-white rounded shadow-lg border border-gray-200 py-1 min-w-32">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Print
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Export
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}