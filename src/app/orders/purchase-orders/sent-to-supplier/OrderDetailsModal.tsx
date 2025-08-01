"use client";

import React from "react";
import { X, FileText, Pencil } from "lucide-react";

const OrderDetailsModal = ({ order, onClose, onPlaceOrder }) => {
  if (!order) return null;

  // Extract data from API response structure
  const orderDetails = order.details || {};
  const poDetails = orderDetails.poDetails || order;
  const supplier = orderDetails.supplier || order.supplier || {};
  const materialCenter = orderDetails.materialCenter || {};
  const items = orderDetails.items || order.items || [];
  const terms = orderDetails.terms || {};
  const financials = orderDetails.financials || order;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get delivery address
  const getDeliveryAddress = () => {
    if (materialCenter.shippingAddress) {
      const addr = materialCenter.shippingAddress;
      return `${addr.address || ''}, ${addr.city || ''}, ${addr.country || ''}`.replace(/^,\s*|,\s*$/g, '');
    }
    if (order.materialCenterAddress) {
      const addr = order.materialCenterAddress;
      return `${addr.address || ''}, ${addr.city || ''}, ${addr.country || ''}`.replace(/^,\s*|,\s*$/g, '');
    }
    return 'N/A';
  };

  // Get payment terms display
  const getPaymentTermsDisplay = () => {
    const paymentTerms = terms.paymentTerms || order.paymentTerms;
    if (!paymentTerms) return 'N/A';
    
    if (paymentTerms.type === 'Credit' && paymentTerms.creditPercentage) {
      return `Credit: ${paymentTerms.creditPercentage}%`;
    }
    return paymentTerms.type || 'N/A';
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">P.O Number: #{poDetails.poNumber || order.poNumber}</h2>
            <p className="text-sm text-gray-500">Date: {formatDate(poDetails.createdAt || order.createdAt)}</p>
            <p className="text-sm text-gray-500">Incoterms: {terms.incoTerms || order.incoTerms || 'FOB'}</p>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              <FileText className="h-4 w-4 mr-1" />
              View Note
            </button>
            <button className="flex items-center px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button className="flex items-center px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
              Export
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Supplier Details</h3>
            <div className="space-y-1">
              <p><span className="text-sm font-medium">Name:</span> {supplier.name || 'N/A'}</p>
              <p><span className="text-sm font-medium">Contact:</span> {supplier.phoneNumber || supplier.contact || 'N/A'}</p>
              <p><span className="text-sm font-medium">E-mail:</span> {supplier.email || 'N/A'}</p>
              <p><span className="text-sm font-medium">Address:</span> {supplier.address || 'N/A'}</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Delivery Address</h3>
            <div className="space-y-1">
              <p>{getDeliveryAddress()}</p>
              <p>{materialCenter.details?.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Item Details</h3>
          <div className="bg-gray-50 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 font-medium text-left">Item Details</th>
                  <th className="px-4 py-2 font-medium text-left">Quantity</th>
                  <th className="px-4 py-2 font-medium text-left">Unit Cost({financials.currency || order.currency || 'USD'})</th>
                  <th className="px-4 py-2 font-medium text-left">Total Cost({financials.currency || order.currency || 'USD'})</th>
                </tr>
              </thead>
              <tbody>
                {items.length > 0 ? items.map((item, index) => (
                  <tr key={item._id || index}>
                    <td className="px-4 py-3">
                      {item.product?.name || item.product?.itemDetails?.name || `Product ${item.product?._id || 'N/A'}`}
                    </td>
                    <td className="px-4 py-3">{item.quantity || 0}</td>
                    <td className="px-4 py-3">{(item.unitPrice || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{(item.totalPrice || item.unitPrice * item.quantity || 0).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-center text-gray-500">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Payment</h3>
            <p>{getPaymentTermsDisplay()}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>{financials.currency || order.currency || '$'}{(financials.subtotal || order.subtotal || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-{financials.currency || order.currency || '$'}{(financials.totalDiscounts || order.totalDiscounts || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>+{financials.currency || order.currency || '$'}{(financials.totalTaxes || order.totalTaxes || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>{financials.currency || order.currency || '$'}{(financials.totalCost || order.totalCost || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-2">Note</h3>
          <textarea 
            className="w-full border rounded-md p-2 h-24" 
            placeholder="Type here"
            value={poDetails.note || order.note || ''}
            readOnly
          ></textarea>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onPlaceOrder}
            className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;