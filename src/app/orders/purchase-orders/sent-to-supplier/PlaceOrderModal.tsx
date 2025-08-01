"use client";

import React, { useState, useRef } from "react";
import { Paperclip, Upload, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Update this path

const PlaceOrderModal = ({ order, orderNumber, onClose }) => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const authToken = user?.token;

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (accept PDF, images, documents)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please select a valid file type (PDF, DOC, DOCX, or Image)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size should be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setUploadError('');
    }
  };

  // Handle file upload and place order
  const handleUploadAndPlaceOrder = async () => {
    if (!selectedFile) {
      setUploadError('Please select an invoice file to upload');
      return;
    }

    if (!authToken) {
      setUploadError('Authentication required');
      return;
    }

    if (!order?._id) {
      setUploadError('Order information not available');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('invoice', selectedFile);

      // Upload invoice using PATCH method as per API specification
      const response = await fetch(`http://localhost:3000/api/purchase-orders/${order._id}/invoice`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`
          // Don't set Content-Type header when using FormData - browser sets it automatically with boundary
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Invoice uploaded successfully:', result);
        onClose(); // Close modal and refresh parent component
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to upload invoice`);
      }
    } catch (error) {
      console.error('Error uploading invoice:', error);
      setUploadError(error.message || 'Failed to upload invoice. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Place Order for P.O-{orderNumber}</h2>
        <p className="text-gray-600 mb-6">Upload the Invoice provided by the Supplier</p>
        
        {/* File Input (Hidden) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          className="hidden"
        />
        
        {/* File Selection Area */}
        <div className="mb-6">
          {!selectedFile ? (
            <button 
              onClick={triggerFileInput}
              className="flex items-center mx-auto mb-4 text-teal-600 hover:text-teal-700 transition-colors"
            >
              <Paperclip className="h-5 w-5 mr-1" />
              <span className="underline">Attach Invoice</span>
            </button>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Upload className="h-5 w-5 text-green-600 mr-2" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeSelectedFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          
          {/* Upload Error */}
          {uploadError && (
            <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 border border-red-200 rounded">
              {uploadError}
            </div>
          )}
          
          {/* File Type Info */}
          <p className="text-xs text-gray-500 mb-4">
            Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 justify-center">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUploadAndPlaceOrder}
            disabled={uploading || !selectedFile}
            className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload and Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderModal;