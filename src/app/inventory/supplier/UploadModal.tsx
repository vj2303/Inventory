'use client'
import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Product {
  department?: string;
  designer?: string;
  itemCode?: string;
  description?: string;
  upc?: string;
  price?: number;
  quantity?: number;
  MPN?: string;
  cpack?: string;
  brand?: string;
  itemType?: string;
  sku?: string;
  name?: string;
  special?: string;
  [key: string]: any;
}

interface Supplier {
  _id: string;
  name: string;
  profile?: string;
  managerName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  supplierImage?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SupplierInventory {
  _id: string;
  supplier: {
    _id: string;
    name: string;
    country: string;
    city: string;
  };
  country: string;
  freightCost: number;
  dutyCharges: number;
  priceTier: string;
  lastPurchasePrice: number;
  currentMarketPrice: number;
  currentPurchasePrice: number;
  createdAt: string;
  updatedAt: string;
}

const UploadModal = ({ isOpen, onClose }: UploadModalProps) => {
  const { user } = useAuth() as any;
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  // Form state for step 2
  const [supplier, setSupplier] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [freightCost, setFreightCost] = useState<string>('5');
  const [freightType, setFreightType] = useState<string>('Per Piece');
  const [dutyCharges, setDutyCharges] = useState<string>('20');
  const [priceType, setPriceType] = useState<string>('A');
  const [priceValue, setPriceValue] = useState<string>('20');
  const [showPriceTypeDropdown, setShowPriceTypeDropdown] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Suppliers state
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [suppliersLoading, setSuppliersLoading] = useState<boolean>(false);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);

  // Supplier Inventory state
  const [supplierInventory, setSupplierInventory] = useState<SupplierInventory[]>([]);
  const [supplierInventoryLoading, setSupplierInventoryLoading] = useState<boolean>(false);
  const [supplierInventoryError, setSupplierInventoryError] = useState<string | null>(null);

  // Check authentication and fetch suppliers when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened, user context:', user); // Debug log
      if (!user?.token) {
        setSuppliersError('Please log in to access this feature.');
        return;
      }
      fetchSuppliers();
    }
  }, [isOpen, user?.token]);

  const fetchSuppliers = async () => {
    setSuppliersLoading(true);
    setSuppliersError(null);
    
    try {
      // Get auth token from context
      const token = getAuthToken();
      
      if (!token) {
        setSuppliersError('Authentication required. Please log in again.');
        setSuppliersLoading(false);
        return;
      }

      console.log('Using token:', token); // Debug log

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/suppliers',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.request(config);
      console.log('Suppliers response:', response.data); // Debug log
      setSuppliers(response.data);
    } catch (error: any) {
      console.error('Error fetching suppliers:', error);
      console.error('Error response:', error.response); // Debug log
      setSuppliersError(error.response?.data?.message || error.message || 'Failed to fetch suppliers');
    } finally {
      setSuppliersLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        setUploadedFile(file);
        parseExcel(file);
      } else {
        alert('Please upload a .xls or .xlsx file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        setUploadedFile(file);
        parseExcel(file);
      } else {
        alert('Please upload a .xls or .xlsx file');
      }
    }
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json<any>(worksheet);
      
      // Map the Excel columns to the expected product structure
      const mappedProducts: Product[] = rawData.map((row: any) => {
        // Handle different possible column names (with and without spaces/special chars)
        const getName = (obj: any) => {
          return obj['Name-07/15/2025'] || obj['Name'] || obj['name'] || '';
        };
        
        const getSpecial = (obj: any) => {
          return obj[' Special '] || obj['Special'] || obj['special'] || '';
        };
        
        const getUPC = (obj: any) => {
          return obj['UPC'] || obj['upc'] || '';
        };
        
        const getBrand = (obj: any) => {
          return obj['Brand'] || obj['brand'] || '';
        };
        
        const getItemType = (obj: any) => {
          return obj['Item Type'] || obj['ItemType'] || obj['itemType'] || '';
        };
        
        const getSKU = (obj: any) => {
          return obj['SKU'] || obj['sku'] || '';
        };
        
        const getQuantity = (obj: any) => {
          return obj['Quantity'] || obj['quantity'] || 0;
        };

        return {
          // Map Excel columns to expected API structure
          upc: String(getUPC(row)),
          brand: getBrand(row),
          itemType: getItemType(row),
          sku: getSKU(row),
          name: getName(row),
          description: getName(row), // Using name as description
          price: Number(getSpecial(row)) || 0,
          special: String(getSpecial(row)),
          quantity: Number(getQuantity(row)) || 0,
          // Add some default/derived fields
          department: 'Fragrances', // Default department
          designer: getBrand(row), // Use brand as designer
          itemCode: getSKU(row), // Use SKU as item code
          MPN: getSKU(row), // Use SKU as MPN
          cpack: '1', // Default cpack
        };
      });
      
      console.log('Mapped products:', mappedProducts.slice(0, 3)); // Log first 3 for debugging
      setProducts(mappedProducts);
    };
    reader.readAsBinaryString(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setProducts([]);
  };

  const handleNextClick = () => {
    setCurrentStep(2);
  };

  const handleCancelClick = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setProducts([]);
    onClose();
  };

  const handleUploadClick = async () => {
    setIsUploading(true);
    
    // Get auth token from context
    const token = getAuthToken();
    
    if (!token) {
      alert('Authentication required. Please log in again.');
      setIsUploading(false);
      return;
    }

    console.log('Using token for upload:', token); // Debug log
    
    // Filter out products with missing essential data
    const validProducts = products.filter(product => 
      product.upc && product.brand && product.sku && product.name
    );
    
    if (validProducts.length === 0) {
      alert('No valid products found in the uploaded file.');
      setIsUploading(false);
      return;
    }
    
    const payload = {
      supplier,
      country,
      freightCost: Number(freightCost),
      dutyCharges: Number(dutyCharges),
      priceTier: priceType,
      products: validProducts,
      lastPurchasePrice: 100, // TODO: Optionally extract from form or Excel
      currentMarketPrice: 150,
      currentPurchasePrice: 120,
    };
    
    console.log('Sending payload:', JSON.stringify(payload, null, 2)); // Debug log
    
    try {
      const response = await axios.post('http://localhost:3000/api/supplier-inventory', payload, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      alert(`Upload successful! ${validProducts.length} products uploaded.`);
      // Fetch supplier inventory and move to step 3
      await fetchSupplierInventory(token);
      setCurrentStep(3);
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  const selectPriceType = (type: string) => {
    setPriceType(type);
    setShowPriceTypeDropdown(false);
  };

  const handleSupplierChange = (supplierId: string) => {
    setSupplier(supplierId);
    
    // Auto-populate country if supplier is selected
    if (supplierId) {
      const selectedSupplier = suppliers.find(s => s._id === supplierId);
      if (selectedSupplier?.country) {
        setCountry(selectedSupplier.country);
      }
    }
  };

  const handleRefreshSuppliers = () => {
    fetchSuppliers();
  };

  // Helper function to get token with validation
  const getAuthToken = () => {
    const token = user?.token;
    if (!token) {
      console.error('No auth token found in context');
      return null;
    }
    return token;
  };

  const fetchSupplierInventory = async (customToken?: string) => {
    setSupplierInventoryLoading(true);
    setSupplierInventoryError(null);
    
    try {
      // Get auth token from context or use custom token
      const token = customToken || getAuthToken();
      
      if (!token) {
        setSupplierInventoryError('Authentication required. Please log in again.');
        setSupplierInventoryLoading(false);
        return;
      }

      console.log('Using token for inventory:', token); // Debug log

      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/supplier-inventory?includeProducts=false',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.request(config);
      console.log('Supplier inventory response:', response.data); // Debug log
      setSupplierInventory(response.data);
    } catch (error: any) {
      console.error('Error fetching supplier inventory:', error);
      console.error('Error response:', error.response); // Debug log
      
      // Check if it's an authentication error
      if (error.response?.status === 401) {
        setSupplierInventoryError('Authentication failed. Please log in again.');
      } else {
        setSupplierInventoryError(error.response?.data?.message || error.message || 'Failed to fetch supplier inventory');
      }
    } finally {
      setSupplierInventoryLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg w-full ${currentStep === 3 ? 'max-w-7xl' : 'max-w-xl'}`}>
        {/* Modal Header */}
        <div className="border-b p-4">
          <h2 className="text-xl font-semibold">
            {currentStep === 1 ? 'Upload Supply List' : currentStep === 2 ? 'Add Details' : 'Supplier Inventory List'}
          </h2>
        </div>
        {/* Modal Content */}
        <div className="p-6">
          {currentStep === 1 ? (
            // Step 1: File Upload
            <>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  accept=".xls,.xlsx" 
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload size={24} className="text-gray-500" />
                </div>
                <p className="text-center font-medium">Click to Upload or drag and drop</p>
                <p className="text-center text-gray-500 text-sm mt-1">(Max. File size: 25 MB)</p>
              </div>
              <p className="text-gray-500 mt-4">Formats accepted are .xls, .xlsx</p>
              {uploadedFile && (
                <div className="mt-4 border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText size={20} className="text-gray-500 mr-2" />
                    <div>
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-gray-500 text-sm">{Math.round(uploadedFile.size / 1024)} KB</p>
                      <p className="text-green-600 text-sm">{products.length} products found</p>
                      <button className="text-blue-600 text-sm" onClick={() => window.open(URL.createObjectURL(uploadedFile), '_blank')}>Click to view</button>
                    </div>
                  </div>
                  <button onClick={handleRemoveFile}>
                    <Trash2 size={20} className="text-gray-500" />
                  </button>
                </div>
              )}
            </>
          ) : currentStep === 2 ? (
            // Step 2: Add Details
            <>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2">Supplier <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select 
                      className="w-full border rounded-lg p-2 pr-8 appearance-none"
                      value={supplier}
                      onChange={(e) => handleSupplierChange(e.target.value)}
                      disabled={suppliersLoading}
                    >
                      <option value="">Select</option>
                      {suppliersLoading ? (
                        <option value="">Loading suppliers...</option>
                      ) : suppliersError ? (
                        <option value="">Error: {suppliersError}</option>
                      ) : suppliers.length === 0 ? (
                        <option value="">No suppliers found.</option>
                      ) : (
                        suppliers.map(s => (
                          <option key={s._id} value={s._id}>{s.name}</option>
                        ))
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {suppliersError && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-red-500 text-sm">{suppliersError}</p>
                      {suppliersError.includes('log in') ? (
                        <button 
                          onClick={() => window.location.href = '/login'}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          Go to Login
                        </button>
                      ) : (
                        <button 
                          onClick={handleRefreshSuppliers}
                          className="text-blue-600 text-sm hover:underline"
                          disabled={suppliersLoading}
                        >
                          {suppliersLoading ? 'Refreshing...' : 'Retry'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Country</label>
                  <div className="relative">
                    <select 
                      className="w-full border rounded-lg p-2 pr-8 appearance-none"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  {supplier && suppliers.length > 0 && (
                    <p className="text-green-600 text-sm mt-1">
                      Auto-filled from selected supplier
                    </p>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Freight Cost <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="w-1/2 border rounded-l-lg p-2 bg-gray-50"
                      value={freightCost}
                      onChange={(e) => setFreightCost(e.target.value)}
                    />
                    <div className="relative w-1/2">
                      <select 
                        className="w-full border border-l-0 rounded-r-lg p-2 pr-8 appearance-none"
                        value={freightType}
                        onChange={(e) => setFreightType(e.target.value)}
                      >
                        <option value="Per Piece">Per Piece</option>
                        <option value="Total">Total</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Duty Charges <span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input 
                      type="text" 
                      className="w-full border rounded-lg p-2"
                      value={dutyCharges}
                      onChange={(e) => setDutyCharges(e.target.value)}
                    />
                    <div className="flex items-center ml-2">
                      <span>%</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block mb-2">Price Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div 
                      className="border rounded-lg p-2 flex justify-between cursor-pointer"
                      onClick={() => setShowPriceTypeDropdown(!showPriceTypeDropdown)}
                    >
                      <span>{priceType}</span>
                      <span>{priceValue} %</span>
                    </div>
                    {showPriceTypeDropdown && (
                      <div className="absolute mt-1 w-full border rounded-lg bg-white shadow-lg z-10">
                        <div 
                          className="p-2 flex justify-between bg-green-50 cursor-pointer hover:bg-green-100"
                          onClick={() => selectPriceType('A')}
                        >
                          <span>A</span>
                          <span>20 %</span>
                        </div>
                        <div 
                          className="p-2 flex justify-between cursor-pointer hover:bg-gray-100"
                          onClick={() => selectPriceType('B')}
                        >
                          <span>B</span>
                          <span className="w-8">%</span>
                        </div>
                        <div 
                          className="p-2 flex justify-between cursor-pointer hover:bg-gray-100"
                          onClick={() => selectPriceType('C')}
                        >
                          <span>C</span>
                          <span className="w-8">%</span>
                        </div>
                        <div 
                          className="p-2 flex justify-between cursor-pointer hover:bg-gray-100"
                          onClick={() => selectPriceType('D')}
                        >
                          <span>D</span>
                          <span className="w-8">%</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">20% duty across all products</p>
                </div>
              </div>
              {products.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-2">Preview ({products.length} products)</h3>
                  <div className="text-sm text-gray-600">
                    <p>Sample product: {products[0]?.name}</p>
                    <p>Brand: {products[0]?.brand} | SKU: {products[0]?.sku} | Price: ${products[0]?.price}</p>
                  </div>
                </div>
              )}
              
              {supplier && suppliers.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium mb-2 text-blue-800">Selected Supplier Details</h3>
                  {(() => {
                    const selectedSupplier = suppliers.find(s => s._id === supplier);
                    return selectedSupplier ? (
                      <div className="text-sm text-blue-700">
                        <p><strong>Name:</strong> {selectedSupplier.name}</p>
                        {selectedSupplier.managerName && <p><strong>Manager:</strong> {selectedSupplier.managerName}</p>}
                        {selectedSupplier.phoneNumber && <p><strong>Phone:</strong> {selectedSupplier.phoneNumber}</p>}
                        {selectedSupplier.country && <p><strong>Country:</strong> {selectedSupplier.country}</p>}
                        {selectedSupplier.city && <p><strong>City:</strong> {selectedSupplier.city}</p>}
                      </div>
                    ) : null;
                  })()}
                </div>
              )}
            </>
          ) : (
            // Step 3: Supplier Inventory List
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Supplier Inventory List</h3>
                <button 
                  onClick={() => fetchSupplierInventory()}
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 text-sm"
                  disabled={supplierInventoryLoading}
                >
                  {supplierInventoryLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              <div className="space-y-4">
                {supplierInventoryLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-700 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading supplier inventory...</p>
                  </div>
                ) : supplierInventoryError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500 mb-2">{supplierInventoryError}</p>
                    {supplierInventoryError.includes('log in') ? (
                      <button 
                        onClick={() => window.location.href = '/login'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Go to Login
                      </button>
                    ) : (
                      <button 
                        onClick={() => fetchSupplierInventory()}
                        className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                ) : supplierInventory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No supplier inventory found.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-800 font-medium">
                        Total Supplier Inventory Records: {supplierInventory.length}
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Supplier Name</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Country</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">City</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Freight Cost</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Duty Charges</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Price Tier</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Last Purchase Price</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Current Market Price</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-medium">Current Purchase Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierInventory.map((inventory) => (
                          <tr key={inventory._id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-4 py-2">{inventory.supplier.name}</td>
                            <td className="border border-gray-300 px-4 py-2">{inventory.supplier.country}</td>
                            <td className="border border-gray-300 px-4 py-2">{inventory.supplier.city}</td>
                            <td className="border border-gray-300 px-4 py-2">${inventory.freightCost}</td>
                            <td className="border border-gray-300 px-4 py-2">{inventory.dutyCharges}%</td>
                            <td className="border border-gray-300 px-4 py-2">{inventory.priceTier}</td>
                            <td className="border border-gray-300 px-4 py-2">${inventory.lastPurchasePrice}</td>
                            <td className="border border-gray-300 px-4 py-2">${inventory.currentMarketPrice}</td>
                            <td className="border border-gray-300 px-4 py-2">${inventory.currentPurchasePrice}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        {/* Modal Footer */}
        <div className="border-t p-4 flex justify-end gap-4">
          <button 
            className="px-6 py-2 border rounded-lg"
            onClick={handleCancelClick}
            disabled={isUploading}
          >
            Cancel
          </button>
          {currentStep === 1 ? (
            <button 
              className="px-6 py-2 bg-teal-700 text-white rounded-lg"
              onClick={handleNextClick}
              disabled={!uploadedFile || products.length === 0 || isUploading}
            >
              Next
            </button>
          ) : currentStep === 2 ? (
            <button 
              className="px-6 py-2 bg-teal-700 text-white rounded-lg"
              onClick={handleUploadClick}
              disabled={isUploading || !supplier || !country || !freightCost || !dutyCharges || !priceType || products.length === 0}
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          ) : (
            <button 
              className="px-6 py-2 bg-teal-700 text-white rounded-lg"
              onClick={() => {
                setCurrentStep(1);
                setUploadedFile(null);
                setProducts([]);
                onClose();
              }}
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;  




