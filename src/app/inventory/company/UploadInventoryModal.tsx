'use client'
// src/components/InventoryUploadModal.tsx
import React, { useState, useRef } from 'react';
import { FileIcon, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useGlobal } from '@/context/GlobalContext'; // Import the global context

export interface UploadDetails {
  supplier: string;
  materialCenter: string;
  currency: string;
}

interface InventoryUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (message: string, success: boolean) => void;
  token?: string;
}

const InventoryUploadModal: React.FC<InventoryUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  token
}) => {
  // Get suppliers and material centers from global context
  const { suppliers, materialCenters, loading } = useGlobal();
  
  // States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<'upload' | 'details'>('upload');
  const [details, setDetails] = useState<UploadDetails>({
    supplier: '',
    materialCenter: '',
    currency: 'USD'
  });
  const [isUploading, setIsUploading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // File handling functions (unchanged)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/vnd.ms-excel' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.name.endsWith('.xls') || 
          file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        await processExcelFile(file);
      } else {
        alert('Please upload an Excel file (.xls or .xlsx)');
      }
    }
  };

  const processExcelFile = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Just store the row count, not the actual data
      setRowCount(jsonData.length);
      
      console.log('Excel data processed successfully:', jsonData.length, 'rows found');
    } catch (error) {
      console.error('Error processing Excel file:', error);
      alert('Error processing Excel file. Please check the format.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/vnd.ms-excel' || 
          file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          file.name.endsWith('.xls') || 
          file.name.endsWith('.xlsx')) {
        setSelectedFile(file);
        await processExcelFile(file);
      } else {
        alert('Please upload an Excel file (.xls or .xlsx)');
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Navigation functions
  const handleNext = () => {
    if (selectedFile) {
      setCurrentStep('details');
    }
  };

  const handleBack = () => {
    setCurrentStep('upload');
  };

  const handleUploadComplete = async () => {
    if (selectedFile && details.supplier && details.materialCenter) {
      try {
        setIsUploading(true);
        
        // Process Excel file
        const data = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform data to match API format with supplier and materialCenter values
        const products = jsonData.map((row: any) => ({
          itemName: row.itemName || row.ItemName || row['Item Details'] || '',
          eanCode: row.eanCode || row.EanCode || row['EAN CODES'] || '',
          brand: row.brand || row.Brand || row['BRAND'] || '',
          sex: row.sex || row.Sex || row.Gender || '',
          itemCode: row.itemCode || row.ItemCode || row['ITEM CODE'] || '',
          ml: row.ml || row.ML || row.Volume || 0,
          type: row.type || row.Type || '',
          subtype: row.subtype || row.Subtype || row['Sub Type'] || '',
          quantity: row.quantity || row.Quantity || row.Stock || '0',
          cost: row.cost || row.Cost || '0',
          freight: row.freight || row.Freight || '0',
          duty: row.duty || row.Duty || '0',
          landed: row.landed || row.Landed || '0',
          minimumPrice: row.minimumPrice || row.MinimumPrice || row['Minimum Price'] || '0',
          priceA: row.priceA || row.PriceA || row['Price A'] || '0',
          priceB: row.priceB || row.PriceB || row['Price B'] || '0',
          priceC: row.priceC || row.PriceC || row['Price C'] || '0',
          priceD: row.priceD || row.PriceD || row['Price D'] || '0',
          meanCP: row.meanCP || row.MeanCP || row['Mean CP'] || '0',
          totalValue: row.totalValue || row.TotalValue || row['Total Value'] || '0',
          currency: details.currency, // Always use the selected currency code, not from Excel
          supplier: details.supplier,
          materialCenter: details.materialCenter
        }));

        // Debug: Log the first product to verify currency format
        if (products.length > 0) {
          console.log('First product currency:', products[0].currency);
          console.log('Selected currency details:', details.currency);
        }

        // Debug: Log the payload being sent to API
        console.log('API Payload currency sample:', products.slice(0, 3).map(p => ({ itemName: p.itemName, currency: p.currency })));
        
        // Make API request
        const response = await axios.request({
          method: 'post',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/api/products/bulk',
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          },
          data: { products }
        });

        console.log('Upload successful:', response.data);
        onUploadComplete(`Successfully uploaded ${products.length} products`, true);
        onClose();
      } catch (error: any) {
        console.error('Error uploading products:', error);
        onUploadComplete(`Error: ${error.message || 'Failed to upload products'}`, false);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Step 1: File Upload UI (unchanged)
  const renderFileUploadStep = () => (
    <>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Upload Inventory</h2>
      </div>
      
      <div className="p-6">
        <div 
          className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer ${
            isDragging ? 'border-teal-600 bg-teal-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden" 
            onChange={handleFileChange}
            accept=".xls,.xlsx"
          />
          
          {selectedFile ? (
            <div className="text-center">
              <FileIcon size={48} className="mx-auto mb-2 text-teal-600" />
              <p className="text-gray-700 font-medium">{selectedFile.name}</p>
              <p className="text-gray-500 text-sm">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {rowCount > 0 && (
                <div className="mt-2 text-green-600 flex items-center justify-center">
                  <CheckCircle size={16} className="mr-1" />
                  <span>{rowCount} rows found</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="bg-gray-100 p-3 rounded-full mb-3">
                <FileIcon size={24} className="text-gray-600" />
              </div>
              <p className="font-medium mb-1">Click to Upload</p>
              <p className="text-gray-500 mb-1">or drag and drop</p>
              <p className="text-gray-400 text-sm">(Max. File size: 25 MB)</p>
            </>
          )}
        </div>
        
        <p className="text-gray-500 mt-4">Formats accepted are .xls and .xlsx</p>
      </div>
      
      <div className="p-4 flex justify-end gap-3 border-t">
        <button 
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button 
          className={`px-6 py-2 rounded-md text-white ${
            selectedFile ? 'bg-teal-700 hover:bg-teal-800' : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={handleNext}
          disabled={!selectedFile}
        >
          Next
        </button>
      </div>
    </>
  );

  // Step 2: Updated Select Details UI with suppliers and material centers from context
  const renderSelectDetailsStep = () => (
    <>
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">Select details</h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier
            </label>
            <div className="relative">
              <select
                name="supplier"
                value={details.supplier}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" disabled>Select</option>
                {suppliers.map((supplier: any) => (
                  <option key={supplier._id || supplier.id} value={supplier._id || supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Material Center
            </label>
            <div className="relative">
              <select
                name="materialCenter"
                value={details.materialCenter}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="" disabled>Select</option>
                {materialCenters.map((center: any) => (
                  <option key={center._id || center.id} value={center._id || center.id}>
                    {center.name || `${center.city}, ${center.country}`}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <div className="relative">
              <select
                name="currency"
                value={details.currency}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="USD">USD - Dollars</option>
                <option value="EUR">EUR - Euros</option>
                <option value="GBP">GBP - Pounds</option>
                <option value="JPY">JPY - Yen</option>
                <option value="INR">INR - Rupees</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center">
            <FileIcon size={20} className="mr-2 text-teal-600" />
            <span className="text-sm text-gray-700">{selectedFile.name} - {rowCount} rows detected</span>
          </div>
        )}
        
        {loading && (
          <div className="mt-4 p-2 text-sm text-gray-500">
            Loading suppliers and material centers...
          </div>
        )}
      </div>
      
      <div className="p-4 flex justify-between gap-3 border-t">
        <button 
          className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          onClick={handleBack}
          disabled={isUploading}
        >
          Back
        </button>
        <div className="flex gap-3">
          <button 
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button 
            className={`px-6 py-2 rounded-md text-white bg-teal-700 hover:bg-teal-800 ${
              (!details.supplier || !details.materialCenter || isUploading || loading) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleUploadComplete}
            disabled={!details.supplier || !details.materialCenter || isUploading || loading}
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg">
        {currentStep === 'upload' ? renderFileUploadStep() : renderSelectDetailsStep()}
      </div>
    </div>
  );
};

export default InventoryUploadModal;