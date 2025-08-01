"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown, MoreVertical, ChevronDown } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Update this path to match your file structure

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
  const { user, isAuthenticated } = useAuth(); // Get auth data from context
  const [dateRange, setDateRange] = useState("03/12/2024 - 13/12/2024");
  const [showDropdown, setShowDropdown] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get auth token from context
  const authToken = user?.token;

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Function to get status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      'TO_BE_PROCESSED': 'To Be Processed',
      'APPROVED': 'Approved',
      'PENDING': 'Pending',
      'REJECTED': 'Rejected'
    };
    return statusMap[status] || status;
  };

  // Function to get status styling
  const getStatusStyling = (status) => {
    const statusStyles = {
      'APPROVED': 'bg-green-100 text-green-800',
      'TO_BE_PROCESSED': 'bg-yellow-100 text-yellow-800',
      'PENDING': 'bg-blue-100 text-blue-800',
      'REJECTED': 'bg-red-100 text-red-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  // API call to fetch purchase orders
  const fetchPurchaseOrders = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    setLoading(true);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/purchase-orders?status=APPROVED',
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      };

      const response = await axios.request(config);
      console.log('API Response:', response.data);
      
      if (response.data && response.data.purchaseOrders) {
        setOrders(response.data.purchaseOrders);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        console.error('Authentication failed - invalid or expired token');
        // You might want to trigger a logout or token refresh here
      }
      
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated and has a token
    if (isAuthenticated && authToken) {
      fetchPurchaseOrders();
    }
  }, [isAuthenticated, authToken]);

  const toggleDropdown = (index) => {
    if (showDropdown === index) {
      setShowDropdown(null);
    } else {
      setShowDropdown(index);
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show authentication message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-500">Please log in to view purchase orders.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading purchase orders...</div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-6">Approved P.O</h2>
      
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search P.O Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <th className="px-6 py-3 font-medium">P.O Number</th>
              <th className="px-6 py-3 font-medium">Created On</th>
              <th className="px-6 py-3 font-medium">Created By</th>
              <th className="px-6 py-3 font-medium">Supplier Name</th>
              <th className="px-6 py-3 font-medium">Total Cost ({orders[0]?.currency || 'USD'})</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {filteredOrders.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr key={order._id} className="bg-white">
                  <td className="px-6 py-4">{order.poNumber}</td>
                  <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">{order.createdBy?.name || 'Unknown'}</td>
                  <td className="px-6 py-4">
                    <div>{order.supplier?.name || 'Unknown Supplier'}</div>
                    <div className="text-xs text-gray-500">No. of Items: {order.items?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4">{order.totalCost?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyling(order.status)}`}>
                      {getStatusDisplay(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
                      Send to Supplier
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
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          View Details
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}