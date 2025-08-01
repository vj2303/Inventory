'use client'
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext'; // Update this path
import axios from 'axios';
import { useRouter } from 'next/navigation'; // or 'next/router' depending on your Next.js version
import toast from 'react-hot-toast'; // If you have a toast library, otherwise we'll use alert

export default function TransferDetails() {
  const { user } = useAuth();
  const router = useRouter();
  
  // State for source and destination
  const [sourceId, setSourceId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [sourceInfo, setSourceInfo] = useState({ city: "", country: "" });
  const [destinationInfo, setDestinationInfo] = useState({ city: "", country: "" });
  
  // State for products
  const [items, setItems] = useState([]);
  const [transferId, setTransferId] = useState('9809'); // Generate a random ID or get from server
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('transferProducts');
    const sourceMaterialCenterId = localStorage.getItem('sourceMaterialCenterId');
    const destinationMaterialCenterId = localStorage.getItem('destinationMaterialCenterId');
    
    if (storedProducts) {
      setItems(JSON.parse(storedProducts));
    }
    
    if (sourceMaterialCenterId) {
      setSourceId(sourceMaterialCenterId);
      // You could fetch material center info here to display city/country
    }
    
    if (destinationMaterialCenterId) {
      setDestinationId(destinationMaterialCenterId);
      // You could fetch material center info here to display city/country
    }
    
    // Optional: Fetch warehouse info for display
    fetchWarehouseInfo(sourceMaterialCenterId, destinationMaterialCenterId);
    
  }, []);

  // Function to fetch warehouse info
  const fetchWarehouseInfo = async (sourceId, destId) => {
    if (!sourceId || !destId) return;
    
    try {
      // Get the token from auth context or localStorage
      const token = user?.token || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Example API call - adjust to your actual endpoint
      const sourceResponse = await axios.get(`http://localhost:3000/api/material-center/${sourceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const destResponse = await axios.get(`http://localhost:3000/api/material-center/${destId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSourceInfo({
        city: sourceResponse.data.city,
        country: sourceResponse.data.country,
        address: sourceResponse.data.address
      });
      
      setDestinationInfo({
        city: destResponse.data.city,
        country: destResponse.data.country,
        address: destResponse.data.address
      });
    } catch (error) {
      console.error("Error fetching warehouse info:", error);
    }
  };

  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);

  const handleUpdateQuantity = (id, value) => {
    const numValue = parseInt(value) || 0;
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          transferQuantity: numValue,
          totalValue: numValue * item.unitCost
        };
      }
      return item;
    }));
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const toggleExportOptions = () => {
    setShowExportOptions(!showExportOptions);
  };

  const initiateStockTransfer = async () => {
    try {
      setLoading(true);
      
      // Get user ID from context or use a default/placeholder
      const userId = user?.id || "67f671776361ee21b6a1c597";
      
      // Format the items for the API request
      const transferItems = items.map(item => ({
        productId: item.productId,
        quantity: item.transferQuantity
      }));
      
      // Prepare request data
      const requestData = {
        sourceMaterialCenterId: sourceId,
        destinationMaterialCenterId: destinationId,
        userId: userId,
        items: transferItems
      };
      
      // Get token from auth context
      const token = user?.token || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Make API request
      const response = await axios({
        method: 'post',
        url: 'http://localhost:3000/api/stock-transfer',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: requestData
      });
      
      // Show success message
      if (typeof toast !== 'undefined') {
        toast.success("Stock transferred successfully!");
      } else {
        alert("Stock transferred successfully!");
      }
      
      // Clear transfer data from localStorage
      localStorage.removeItem('transferProducts');
      localStorage.removeItem('sourceMaterialCenterId');
      localStorage.removeItem('destinationMaterialCenterId');
      
      // Navigate to a confirmation page or back to inventory
      setTimeout(() => {
        router.push('/inventory'); // Adjust this path to your inventory page
      }, 2000);
      
    } catch (error) {
      console.error("Transfer failed:", error);
      
      // Show error message
      if (typeof toast !== 'undefined') {
        toast.error(error.response?.data?.message || "Failed to transfer stock");
      } else {
        alert(error.response?.data?.message || "Failed to transfer stock");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get current date in required format
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transfer reference ID- {transferId}</h1>
          <p className="text-gray-500">Date- {currentDate}</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={toggleExportOptions}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              Export
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                <div className="py-1">
                  <button
                    onClick={() => {
                      console.log('Export to PDF');
                      setShowExportOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => {
                      console.log('Export to CSV');
                      setShowExportOptions(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Export as CSV
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            className="px-6 py-2 bg-teal-700 text-white rounded-md disabled:bg-gray-400"
            onClick={initiateStockTransfer}
            disabled={items.length === 0 || loading}
          >
            {loading ? 'Processing...' : 'Initiate Transfer'}
          </button>
        </div>
      </div>

      {/* Warehouse Information Box */}
      <div className="bg-gray-50 border rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Source Warehouse */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Source Warehouse</h2>
            <p className="text-gray-600 text-sm">
              {sourceInfo.city ? 
                `${sourceInfo.city}, ${sourceInfo.country}, ${sourceInfo.address}` : 
                "Pablo Alto, San Francisco, CA 92102, United States of America"}
            </p>
          </div>
          
          {/* Destination Warehouse */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Destination Warehouse</h2>
            <p className="text-gray-600 text-sm">
              {destinationInfo.city ? 
                `${destinationInfo.city}, ${destinationInfo.country}, ${destinationInfo.address}` : 
                "San Francisco, CA 94109, United States of America"}
            </p>
          </div>
        </div>
      </div>

      {/* Product Details Table */}
      <div className="bg-white border rounded-lg overflow-hidden mb-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Details
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Stock
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transfer Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Cost($)
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-800 font-medium">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                  {item.inStock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <input
                    type="number"
                    value={item.transferQuantity}
                    onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
                    className="border rounded-md py-1 px-2 w-24 text-center text-sm"
                    min="1"
                    max={item.inStock}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                  {item.unitCost.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                  {item.totalValue.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="flex justify-end mb-8">
        <div className="bg-gray-50 rounded-lg p-4 w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Number of Items: {totalItems}</span>
            <span className="text-sm font-medium">Total Value - ${totalValue.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}