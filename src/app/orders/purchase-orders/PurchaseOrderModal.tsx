"use client";

import React, { useState, useEffect } from "react";
import { X, Search, ChevronDown, ShoppingCart, Upload, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Update this path to match your file structure

const PurchaseOrderModal = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth(); // Get auth data from context
  const [modalStep, setModalStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [materialCenters, setMaterialCenters] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const [orderDetails, setOrderDetails] = useState({
    supplier: "",
    materialCenterId: "",
    incoTerms: "FOB",
    paymentTerms: {
      type: "Credit",
      creditPercentage: 20
    },
    currency: "USD",
    currencyConversionRate: 1,
    items: [],
    discounts: [],
    taxes: [],
    note: "",
  });

  // Get auth token from context instead of hardcoded value
  const authToken = user?.token;

  // Helper function to get headers with auth token
  const getAuthHeaders = () => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    return {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/suppliers', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Suppliers API response:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else if (data.suppliers && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
      } else if (data.data && Array.isArray(data.data)) {
        setSuppliers(data.data);
      } else {
        console.warn('Unexpected suppliers API response structure:', data);
        setSuppliers([]);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
    }
  };

  // Fetch material centers
  const fetchMaterialCenters = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/material-center', {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Material centers API response:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setMaterialCenters(data);
      } else if (data.materialCenters && Array.isArray(data.materialCenters)) {
        setMaterialCenters(data.materialCenters);
      } else if (data.data && Array.isArray(data.data)) {
        setMaterialCenters(data.data);
      } else {
        console.warn('Unexpected material centers API response structure:', data);
        setMaterialCenters([]);
      }
    } catch (error) {
      console.error('Error fetching material centers:', error);
      setMaterialCenters([]);
    }
  };

  // Fetch products based on selected supplier and material center
  const fetchProducts = async () => {
    if (!orderDetails.supplier || !orderDetails.materialCenterId || !authToken) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/products?materialCenterId=${orderDetails.materialCenterId}&supplierId=${orderDetails.supplier}`,
        {
          headers: getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Products API response:', data);
      
      // Handle different response structures
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data);
      } else {
        console.warn('Unexpected products API response structure:', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Submit purchase order
  const submitPurchaseOrder = async () => {
    if (!authToken) {
      console.error('No auth token available');
      return;
    }

    setLoading(true);
    try {
      const purchaseOrderData = {
        supplier: orderDetails.supplier,
        materialCenterId: orderDetails.materialCenterId,
        incoTerms: orderDetails.incoTerms,
        paymentTerms: orderDetails.paymentTerms,
        currency: orderDetails.currency,
        currencyConversionRate: orderDetails.currencyConversionRate,
        items: selectedProducts.map(product => ({
          product: product._id,
          quantity: product.quantity || 1,
          unitPrice: getProductPrice(product)
        })),
        discounts: orderDetails.discounts,
        taxes: orderDetails.taxes,
        note: orderDetails.note
      };

      const response = await fetch('http://localhost:3000/api/purchase-orders', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(purchaseOrderData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Purchase order created:', result);
        handleClose();
        // You might want to show a success message or refresh the parent component
      } else {
        const errorData = await response.json();
        console.error('Error creating purchase order:', errorData);
      }
    } catch (error) {
      console.error('Error submitting purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load suppliers and material centers when modal opens and user is authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated && authToken) {
      fetchSuppliers();
      fetchMaterialCenters();
    }
  }, [isOpen, isAuthenticated, authToken]);

  // Fetch products when supplier or material center changes
  useEffect(() => {
    if (orderDetails.supplier && orderDetails.materialCenterId && authToken) {
      fetchProducts();
    }
  }, [orderDetails.supplier, orderDetails.materialCenterId, authToken]);

  // Early return if not authenticated
  if (!isAuthenticated) {
    return null; // or redirect to login
  }

  // Reset and close modal
  const handleClose = () => {
    setModalStep(0);
    setOrderDetails({
      supplier: "",
      materialCenterId: "",
      incoTerms: "FOB",
      paymentTerms: {
        type: "Credit",
        creditPercentage: 20
      },
      currency: "USD",
      currencyConversionRate: 1,
      items: [],
      discounts: [],
      taxes: [],
      note: "",
    });
    setSelectedProducts([]);
    setProducts([]);
    setSearchTerm("");
    onClose();
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle payment terms changes
  const handlePaymentChange = (field, value) => {
    setOrderDetails(prev => ({
      ...prev,
      paymentTerms: {
        ...prev.paymentTerms,
        [field]: value
      }
    }));
  };

  // Helper function to get product name
  const getProductName = (product) => {
    return product?.itemDetails?.name || product?.name || 'Unknown Product';
  };

  // Helper function to get product price (using cost as price since no specific price field)
  const getProductPrice = (product) => {
    return product?.stockInfo?.cost || product?.stockInfo?.pricing?.priceA || product?.price || 0;
  };

  // Helper function to get product stock
  const getProductStock = (product) => {
    return product?.stockInfo?.quantity || product?.stock || 0;
  };

  // Add product to selected products
  const addProduct = (product) => {
    const isAlreadyAdded = selectedProducts.find(p => p._id === product._id);
    if (!isAlreadyAdded) {
      setSelectedProducts(prev => [...prev, { 
        ...product, 
        quantity: 1,
        displayName: getProductName(product),
        displayPrice: getProductPrice(product)
      }]);
    }
  };

  // Remove product from selected products
  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p._id !== productId));
  };

  // Update product quantity
  const updateProductQuantity = (productId, quantity) => {
    setSelectedProducts(prev => 
      prev.map(p => p._id === productId ? { ...p, quantity: Number(quantity) } : p)
    );
  };

  // Filter products based on search term
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const name = getProductName(product).toLowerCase();
    const brand = product?.itemDetails?.brand?.toLowerCase() || '';
    const itemCode = product?.itemDetails?.itemCode?.toLowerCase() || '';
    const searchLower = searchTerm.toLowerCase();
    
    return name.includes(searchLower) || 
           brand.includes(searchLower) || 
           itemCode.includes(searchLower);
  }) : [];

  // Handle next step in modal
  const nextStep = () => {
    if (modalStep === 0) {
      setModalStep(1);
    } else if (modalStep === 1) {
      setModalStep(2);
    }
  };

  // Handle selecting options in first modal
  const handleOptionSelect = (option) => {
    if (option === "manual") {
      setModalStep(1);
    } else if (option === "upload") {
      console.log("Upload file selected");
    }
  };

  // Get selected supplier details
  const selectedSupplier = suppliers.find(s => s._id === orderDetails.supplier);
  const selectedMaterialCenter = materialCenters.find(mc => mc._id === orderDetails.materialCenterId);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, product) => 
      sum + (getProductPrice(product) * product.quantity), 0
    );
    const discountAmount = orderDetails.discounts.reduce((sum, discount) => 
      sum + discount.calculatedAmount, 0
    );
    const taxAmount = orderDetails.taxes.reduce((sum, tax) => 
      sum + tax.calculatedAmount, 0
    );
    const total = subtotal - discountAmount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const totals = calculateTotals();

  // Modal content based on current step
  const renderModalContent = () => {
    switch (modalStep) {
      case 0:
        return (
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-6">Create New Purchase</h2>
            
            <div className="flex justify-around">
              <button
                onClick={() => handleOptionSelect("manual")}
                className="flex flex-col items-center gap-2 p-4 rounded-md hover:bg-gray-50"
              >
                <div className="w-16 h-16 flex items-center justify-center text-teal-600 border border-teal-600 rounded-full">
                  <ShoppingCart size={28} />
                </div>
                <span className="text-gray-700">Manually Add Products</span>
              </button>
              
              <button
                onClick={() => handleOptionSelect("upload")}
                className="flex flex-col items-center gap-2 p-4 rounded-md hover:bg-gray-50"
              >
                <div className="w-16 h-16 flex items-center justify-center text-teal-600 border border-teal-600 rounded-full">
                  <Upload size={28} />
                </div>
                <span className="text-gray-700">Upload File</span>
              </button>
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="bg-white rounded-lg p-6 w-full max-w-xl">
            <h2 className="text-xl font-bold text-center mb-6">Create New Purchase</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                <div className="relative">
                  <select 
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={orderDetails.supplier}
                    onChange={(e) => handleInputChange('supplier', e.target.value)}
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier._id} value={supplier._id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <div className="relative">
                  <select 
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    value={orderDetails.materialCenterId}
                    onChange={(e) => handleInputChange('materialCenterId', e.target.value)}
                  >
                    <option value="">Select Address</option>
                    {materialCenters.map(center => (
                      <option key={center._id} value={center._id}>
                        {center.name || center.address}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">INCO Terms</label>
                <input
                  type="text"
                  value={orderDetails.incoTerms}
                  onChange={(e) => handleInputChange('incoTerms', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
                <div className="flex gap-2">
                  <select
                    value={orderDetails.paymentTerms.type}
                    onChange={(e) => handlePaymentChange('type', e.target.value)}
                    className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  >
                    <option value="Credit">Credit</option>
                    <option value="Cash">Cash</option>
                  </select>
                  {orderDetails.paymentTerms.type === 'Credit' && (
                    <input
                      type="number"
                      placeholder="%"
                      value={orderDetails.paymentTerms.creditPercentage}
                      onChange={(e) => handlePaymentChange('creditPercentage', Number(e.target.value))}
                      className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency Conversion</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">From</label>
                  <div className="relative">
                    <select 
                      value={orderDetails.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                    >
                      <option value="USD">USD</option>
                      <option value="INR">INR</option>
                      <option value="EUR">EUR</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Conversion Rate</label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderDetails.currencyConversionRate}
                    onChange={(e) => handleInputChange('currencyConversionRate', Number(e.target.value))}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Add Products to Order</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name, brand, or item code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              {loading && (
                <div className="mt-4 text-center text-gray-500">Loading products...</div>
              )}
              
              {!orderDetails.supplier || !orderDetails.materialCenterId ? (
                <div className="mt-4 text-center text-gray-500">
                  Please select supplier and delivery address to see products
                </div>
              ) : (
                <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
                  {filteredProducts.map((product) => {
                    const isAdded = selectedProducts.find(p => p._id === product._id);
                    const productName = getProductName(product);
                    const productPrice = getProductPrice(product);
                    const productStock = getProductStock(product);
                    
                    return (
                      <div key={product._id} className="flex items-center gap-3 p-2 border-b">
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{productName}</p>
                          <p className="text-xs text-gray-500">Brand: {product?.itemDetails?.brand || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Code: {product?.itemDetails?.itemCode || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Stock: {productStock}</p>
                          <p className="text-xs text-gray-500">Cost: ${productPrice.toFixed(2)}</p>
                        </div>
                        {isAdded ? (
                          <span className="text-xs text-teal-600 flex-shrink-0">Added</span>
                        ) : (
                          <button 
                            onClick={() => addProduct(product)}
                            className="text-teal-600 text-sm flex items-center flex-shrink-0"
                          >
                            <Plus size={14} /> Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {filteredProducts.length === 0 && !loading && (
                    <div className="text-center text-gray-500 py-4">No products found</div>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={nextStep}
                disabled={selectedProducts.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-800 border border-transparent rounded-md hover:bg-teal-900 disabled:bg-gray-400"
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => setModalStep(1)}
                className="text-lg font-medium text-teal-600 hover:text-teal-700"
              >
                ← Back
              </button>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                  Export
                </button>
                <button 
                  onClick={submitPurchaseOrder}
                  disabled={loading}
                  className="px-3 py-1 text-sm text-white bg-teal-800 rounded-md hover:bg-teal-900 disabled:bg-gray-400"
                >
                  {loading ? 'Sending...' : 'Send To Supplier'}
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              <p>Date - {new Date().toLocaleDateString()}</p>
              <p>Incoterms - {orderDetails.incoTerms}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Supplier Details</h3>
                {selectedSupplier && (
                  <div className="text-sm">
                    <p className="font-medium">{selectedSupplier.name}</p>
                    <p>{selectedSupplier.phoneNumber}</p>
                    <p>{selectedSupplier.managerName}</p>
                    <p>{selectedSupplier.address}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Delivery Address</h3>
                {selectedMaterialCenter && (
                  <div className="text-sm">
                    <p>{selectedMaterialCenter.name}</p>
                    <p>{selectedMaterialCenter.address}</p>
                    <p>{selectedMaterialCenter.phoneNumber}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Item Details</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="py-2">Item</th>
                    <th className="py-2">Quantity</th>
                    <th className="py-2">Unit Cost($)</th>
                    <th className="py-2">Total Cost($)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {selectedProducts.map((product) => {
                    const productPrice = getProductPrice(product);
                    return (
                      <tr key={product._id}>
                        <td className="py-2">{getProductName(product)}</td>
                        <td className="py-2">
                          <input
                            type="number"
                            min="1"
                            value={product.quantity}
                            onChange={(e) => updateProductQuantity(product._id, e.target.value)}
                            className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="py-2">{productPrice.toFixed(2)}</td>
                        <td className="py-2">{(productPrice * product.quantity).toFixed(2)}</td>
                        <td className="py-2">
                          <button 
                            onClick={() => removeProduct(product._id)}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button 
                onClick={() => setModalStep(1)}
                className="text-teal-600 text-sm flex items-center mt-2"
              >
                <Plus size={14} /> Add Products
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Payment</h3>
                <p className="text-sm">
                  {orderDetails.paymentTerms.type}
                  {orderDetails.paymentTerms.type === 'Credit' && 
                    ` - ${orderDetails.paymentTerms.creditPercentage}%`
                  }
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Order Summary</h3>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Sub Total</span>
                    <span>${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-${totals.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>+${totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1 mt-2">
                    <span>Total</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Add Note</h3>
              <textarea
                placeholder="Type Here"
                value={orderDetails.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                rows={3}
              />
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute -right-4 -top-4 bg-white rounded-full p-1 shadow-md z-10"
        >
          <X size={18} />
        </button>
        
        {renderModalContent()}
      </div>
    </div>
  );
};

export default PurchaseOrderModal;