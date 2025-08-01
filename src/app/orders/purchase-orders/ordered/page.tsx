"use client";

import React, { useState } from "react";
import { Search, ArrowUpDown, FileText } from "lucide-react";

export default function OrderedPage() {
  const [dateRange, setDateRange] = useState("03/12/2024 - 13/12/2024");
  const [orders, setOrders] = useState([
    {
      poNumber: "#675265",
      createdOn: "5 Jan 2025",
      supplierName: "Supplier Name",
      items: 1,
      totalCost: 300.00,
      orderedOn: "10 Jan 2025",
      status: "Ordered"
    },
    {
      poNumber: "#675265",
      createdOn: "5 Jan 2025",
      supplierName: "Supplier Name",
      items: 1,
      totalCost: 300.00,
      orderedOn: "10 Jan 2025",
      status: "Stock in Transit"
    },
    {
      poNumber: "#675265",
      createdOn: "5 Jan 2025",
      supplierName: "Supplier Name",
      items: 1,
      totalCost: 300.00,
      orderedOn: "10 Jan 2025",
      status: "Out for Delivery"
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Ordered":
        return "bg-green-100 text-green-800";
      case "Stock in Transit":
        return "bg-orange-100 text-orange-800";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
    
      
      <h2 className="text-xl font-bold mb-6">All orders 
        <span className="ml-2 inline-flex items-center justify-center bg-green-100 text-green-800 text-xs font-medium rounded-full h-5 w-5">
          2
        </span>
      </h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search P.O Number"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option>{dateRange}</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ArrowUpDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="relative">
            <button className="flex items-center gap-2 bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500">
              <span>Sort By</span>
              <ArrowUpDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#B2D9D8] text-left text-sm">
              <th className="px-6 py-3 font-medium">P.O Number</th>
              <th className="px-6 py-3 font-medium">Created On</th>
              <th className="px-6 py-3 font-medium">Supplier Name</th>
              <th className="px-6 py-3 font-medium">Total Cost($)</th>
              <th className="px-6 py-3 font-medium">Ordered On</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {orders.map((order, index) => (
              <tr key={index} className="bg-white">
                <td className="px-6 py-4">{order.poNumber}</td>
                <td className="px-6 py-4">{order.createdOn}</td>
                <td className="px-6 py-4">
                  <div>{order.supplierName}</div>
                  <div className="text-xs text-gray-500">No. of Items: {order.items}</div>
                </td>
                <td className="px-6 py-4">{order.totalCost.toFixed(2)}</td>
                <td className="px-6 py-4">{order.orderedOn}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="flex items-center px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                    <FileText className="h-3 w-3 mr-1 text-red-500" />
                    Invoice.pdf
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}