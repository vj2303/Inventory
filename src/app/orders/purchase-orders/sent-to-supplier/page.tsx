"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowUpDown, Pencil, FileText } from "lucide-react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; // Update this path

import OrderDetailsModal from './OrderDetailsModal';
import PlaceOrderModal from './PlaceOrderModal';

export default function SentToSupplierPage() {
  const { user, isAuthenticated } = useAuth();
  const [dateRange, setDateRange] = useState("03/12/2024 - 13/12/2024");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPlaceOrderModal, setShowPlaceOrderModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

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
      'REJECTED': 'Rejected',
      'REQUESTED': 'Requested'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const statusStyles = {
      'REQUESTED': 'bg-orange-100 text-orange-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-blue-100 text-blue-800',
      'TO_BE_PROCESSED': 'bg-yellow-100 text-yellow-800'
    };
    return statusStyles[status] || 'bg-gray-100 text-gray-800';
  };

  // Fetch purchase orders from API
  const fetchPurchaseOrders = async (page = 1, limit = 10) => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    setLoading(true);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3000/api/purchase-orders?page=${page}&limit=${limit}`,
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      };

      const response = await axios.request(config);
      console.log('Purchase Orders API Response:', response.data);
      
      if (response.data && response.data.purchaseOrders) {
        setOrders(response.data.purchaseOrders);
        setTotalOrders(response.data.total || response.data.purchaseOrders.length);
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
        setTotalOrders(response.data.length);
      } else {
        setOrders([]);
        setTotalOrders(0);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      
      if (error.response?.status === 401) {
        console.error('Authentication failed - invalid or expired token');
      }
      
      setOrders([]);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details by ID
  const fetchOrderDetails = async (orderId) => {
    if (!authToken) {
      console.error('No auth token available');
      return null;
    }

    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3000/api/purchase-orders/${orderId}`,
        headers: { 
          'Authorization': `Bearer ${authToken}`
        }
      };

      const response = await axios.request(config);
      console.log('Order Details API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchPurchaseOrders(currentPage);
    }
  }, [isAuthenticated, authToken, currentPage]);

  const handleRowClick = async (order) => {
    const orderDetails = await fetchOrderDetails(order._id);
    if (orderDetails) {
      setSelectedOrder({
        ...order,
        details: orderDetails
      });
    }
  };

  const handlePlaceOrderFromModal = (order) => {
    // Close the order details modal first
    setSelectedOrder(null);
    // Then open the place order modal with the current order
    setTimeout(() => {
      setSelectedOrder(order);
      setShowPlaceOrderModal(true);
    }, 100);
  };

  const handlePlaceOrderFromButton = async (order) => {
    // Fetch order details first for the place order modal
    const orderDetails = await fetchOrderDetails(order._id);
    const orderWithDetails = orderDetails ? {
      ...order,
      details: orderDetails
    } : order;
    
    setSelectedOrder(orderWithDetails);
    setShowPlaceOrderModal(true);
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
  };

  const closePlaceOrderModal = () => {
    setShowPlaceOrderModal(false);
    setSelectedOrder(null);
    // Refresh orders after placing order
    fetchPurchaseOrders(currentPage);
  };

  const getActionButton = (order) => {
    if (order.status === "REJECTED") {
      return (
        <div className="flex gap-2">
          <button className="flex items-center px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </button>
          <button className="flex items-center px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50">
            <FileText className="h-3 w-3 mr-1" />
            View Note
          </button>
        </div>
      );
    } else {
      return (
        <button 
          className="px-4 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            handlePlaceOrderFromButton(order);
          }}
        >
          Place Order
        </button>
      );
    }
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <>
      <h2 className="text-xl font-bold mb-6">Sent to Supplier</h2>
      
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
            <tr className="bg-[#B2D9D8] text-left text-[16px]">
              <th className="px-6 py-3 font-medium">P.O Number</th>
              <th className="px-6 py-3 font-medium">Created On</th>
              <th className="px-6 py-3 font-medium">Supplier Name</th>
              <th className="px-6 py-3 font-medium">Total Cost ({orders[0]?.currency || 'USD'})</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-green-100">
            {filteredOrders.length === 0 ? (
              <tr className="bg-white">
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No purchase orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order, index) => (
                <tr 
                  key={order._id || index} 
                  className="bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order)}
                >
                  <td className="px-6 py-4">#{order.poNumber}</td>
                  <td className="px-6 py-4">{formatDate(order.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div>{order.supplier?.name || 'Unknown Supplier'}</div>
                    <div className="text-xs text-gray-500">No. of Items: {order.items?.length || 0}</div>
                  </td>
                  <td className="px-6 py-4">{order.totalCost?.toFixed(2) || '0.00'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusDisplay(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    {getActionButton(order)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {selectedOrder && !showPlaceOrderModal && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={closeOrderModal}
          onPlaceOrder={() => handlePlaceOrderFromModal(selectedOrder)}
        />
      )}
      
      {showPlaceOrderModal && selectedOrder && (
        <PlaceOrderModal 
          order={selectedOrder}
          orderNumber={selectedOrder.poNumber}
          onClose={closePlaceOrderModal}
        />
      )}
    </>
  );
}