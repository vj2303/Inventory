'use client'
// src/app/company/product/[id]/page.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGlobal } from '@/context/GlobalContext';

// Product type from Inventory Dashboard - updated to match actual API response
export interface Product {
  _id: string;
  itemDetails: {
    name: string;
    eanCode: string;
    brand: string;
    sex: string;
    itemCode: string;
    ml: string;
    type: string;
    subtype: string;
  };
  stockInfo: {
    pricing: {
      priceA: number;
      priceB: number;
      priceC: number;
      priceD: number;
    };
    quantity: number;
    cost: number;
    freight: number;
    duty: number;
    landed: number;
    minimumPrice: number;
    meanCP: number;
    totalValue: number;
    currency: string;
  };
  supplier: string;
  materialCenter: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { getSupplierName, getMaterialCenterAddress } = useGlobal();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'ledger'>('details');

  // Get server URL from environment
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000';

  // Fetch product data
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated and has token
        if (!isAuthenticated || !user?.token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${SERVER_URL}/api/products/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        // The API returns the product data directly, not wrapped in a 'product' property
        const productData = response.data;
        
        // Validate the response structure
        if (!productData || !productData._id || !productData.itemDetails || !productData.stockInfo) {
          throw new Error('Invalid product data structure received from server');
        }
        
        setProduct(productData);
      } catch (err: any) {
        console.error('Error fetching product details:', err);
        
        // Handle different types of errors
        if (err?.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Clear invalid token and redirect to login
          logout();
          router.push('/register');
          return;
        } else if (err?.response?.status === 403) {
          setError('You do not have permission to view this product.');
        } else if (err?.response?.status === 404) {
          setError('Product not found.');
        } else if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else if (err?.code === 'ECONNREFUSED' || err?.code === 'ERR_NETWORK') {
          setError('Unable to connect to server. Please check if the backend server is running.');
        } else if (err?.message?.includes('Invalid product data structure')) {
          setError('Invalid product data received from server. Please try again.');
        } else {
          setError('Failed to fetch product details. Please try again.');
        }
        
        // Fallback to dummy data for development (only if not a 401/403 error)
        if (err?.response?.status !== 401 && err?.response?.status !== 403) {
          setProduct({
            "_id": id as string,
            "itemDetails": {
              "name": "Sample Product",
              "eanCode": "9876543210987",
              "brand": "Sample Brand",
              "sex": "U",
              "itemCode": "SAMPLE-001",
              "ml": "100",
              "type": "Perfume",
              "subtype": "EDT"
            },
            "stockInfo": {
              "pricing": {
                "priceA": 45.99,
                "priceB": 42.99,
                "priceC": 39.99,
                "priceD": 36.99
              },
              "quantity": 15,
              "cost": 25.75,
              "freight": 2.25,
              "duty": 5,
              "landed": 28.25,
              "minimumPrice": 35,
              "meanCP": 25.75,
              "totalValue": 386.25,
              "currency": "USD"
            },
            "supplier": "Sample Supplier",
            "materialCenter": "Sample Material Center",
            "imageUrl": null,
            "imagePublicId": null,
            "createdAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString(),
            "__v": 0
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProductDetails();
    }
  }, [id, user, isAuthenticated, logout, router, SERVER_URL]);

  const handleGoBack = () => {
    router.back();
  };

  const getStatusBadgeClass = (quantity: number) => {
    if (quantity <= 0) return "bg-red-100 text-red-800";
    if (quantity < 10) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (quantity: number) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity < 10) return "Low Stock";
    return "In Stock";
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show authentication error
  if (error && (error.includes('Authentication') || error.includes('permission'))) {
    return (
      <div className="min-h-screen p-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-teal-700 hover:text-teal-900 mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Inventory</span>
        </button>
        <div className="bg-red-50 p-6 rounded-lg">
          <h1 className="text-xl font-semibold text-red-700 mb-2">Authentication Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex gap-3">
            <button 
              onClick={() => router.push('/register')}
              className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
            >
              Go to Login
            </button>
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
            >
              Return to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show server connection error
  if (error && error.includes('Unable to connect to server')) {
    return (
      <div className="min-h-screen p-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-teal-700 hover:text-teal-900 mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Inventory</span>
        </button>
        <div className="bg-orange-50 p-6 rounded-lg">
          <h1 className="text-xl font-semibold text-orange-700 mb-2">Server Connection Error</h1>
          <p className="text-orange-600 mb-4">{error}</p>
          <div className="bg-orange-100 p-4 rounded mb-4">
            <h3 className="font-medium text-orange-800 mb-2">Troubleshooting:</h3>
            <ul className="text-orange-700 text-sm space-y-1">
              <li>• Make sure the backend server is running on {SERVER_URL}</li>
              <li>• Check if the server is accessible</li>
              <li>• Verify your network connection</li>
            </ul>
          </div>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            Return to Inventory
          </button>
        </div>
      </div>
    );
  }

  // Show other errors
  if (error) {
    return (
      <div className="min-h-screen p-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-teal-700 hover:text-teal-900 mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Inventory</span>
        </button>
        <div className="bg-red-50 p-6 rounded-lg">
          <h1 className="text-xl font-semibold text-red-700 mb-2">Error</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            Return to Inventory
          </button>
        </div>
      </div>
    );
  }

  // Show product not found
  if (!product) {
    return (
      <div className="min-h-screen p-6">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-teal-700 hover:text-teal-900 mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Inventory</span>
        </button>
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h1 className="text-xl font-semibold text-yellow-700 mb-2">Product Not Found</h1>
          <p className="text-yellow-600 mb-4">The requested product could not be found.</p>
          <button 
            onClick={handleGoBack}
            className="px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
          >
            Return to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={handleGoBack}
          className="flex items-center text-teal-700 hover:text-teal-900 mb-4"
        >
          <ChevronLeft size={20} />
          <span>Back to Inventory</span>
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Product Details</h1>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-4 py-2 border border-teal-600 rounded text-teal-600 hover:bg-teal-50">
              <Edit size={16} />
              Edit Product
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-500 rounded text-red-500 hover:bg-red-50">
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-6">
            <button
              className={`py-3 ${activeTab === 'details' 
                ? 'text-teal-600 border-b-2 border-teal-600 font-medium' 
                : 'text-gray-500 hover:text-teal-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Product Details
            </button>
            <button
              className={`py-3 ${activeTab === 'ledger' 
                ? 'text-teal-600 border-b-2 border-teal-600 font-medium' 
                : 'text-gray-500 hover:text-teal-500'}`}
              onClick={() => setActiveTab('ledger')}
            >
              Stock Ledger
            </button>
          </div>
        </div>
        
        {/* Product Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product.itemDetails.name}</h2>
              <p className="text-gray-600 mt-1">
                {typeof product.supplier === 'string' && typeof product.materialCenter === 'string' && 
                 typeof getSupplierName === 'function' && typeof getMaterialCenterAddress === 'function' ? (
                  <>
                    {getSupplierName(product.supplier)} • {getMaterialCenterAddress(product.materialCenter)}
                  </>
                ) : (
                  <>
                    {typeof product.supplier === 'string' ? product.supplier : 'Unknown Supplier'} • 
                    {typeof product.materialCenter === 'string' ? product.materialCenter : 'Unknown Location'}
                  </>
                )}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                getStatusBadgeClass(product.stockInfo.quantity)
              }`}>
                {getStatusText(product.stockInfo.quantity)}
              </span>
            </div>
          </div>
        </div>
        
        {activeTab === 'details' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Item Name</span>
                  <span className="font-medium">{product.itemDetails.name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">EAN Code</span>
                  <span className="font-medium">{product.itemDetails.eanCode}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium">{product.itemDetails.brand}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Sex</span>
                  <span className="font-medium">{product.itemDetails.sex}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Item Code</span>
                  <span className="font-medium">{product.itemDetails.itemCode}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">ML</span>
                  <span className="font-medium">{product.itemDetails.ml}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Type</span>
                  <span className="font-medium">{product.itemDetails.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtype</span>
                  <span className="font-medium">{product.itemDetails.subtype}</span>
                </div>
              </div>
            </div>
            
            {/* Stock Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Quantity</span>
                  <span className="font-medium">{product.stockInfo.quantity}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Cost ({product.stockInfo.currency})</span>
                  <span className="font-medium">{product.stockInfo.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Freight</span>
                  <span className="font-medium">{product.stockInfo.freight.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Duty</span>
                  <span className="font-medium">{product.stockInfo.duty.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Landed</span>
                  <span className="font-medium">{product.stockInfo.landed.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Minimum Price</span>
                  <span className="font-medium">{product.stockInfo.minimumPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-medium font-bold">{product.stockInfo.totalValue.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Pricing Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Pricing Tiers</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Price A</span>
                  <span className="font-medium">{product.stockInfo.pricing.priceA.toFixed(2)} {product.stockInfo.currency}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Price B</span>
                  <span className="font-medium">{product.stockInfo.pricing.priceB.toFixed(2)} {product.stockInfo.currency}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Price C</span>
                  <span className="font-medium">{product.stockInfo.pricing.priceC.toFixed(2)} {product.stockInfo.currency}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Price D</span>
                  <span className="font-medium">{product.stockInfo.pricing.priceD.toFixed(2)} {product.stockInfo.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean CP</span>
                  <span className="font-medium">{product.stockInfo.meanCP.toFixed(2)} {product.stockInfo.currency}</span>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Created At</span>
                  <span className="font-medium">{new Date(product.createdAt).toLocaleDateString()} {new Date(product.createdAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{new Date(product.updatedAt).toLocaleDateString()} {new Date(product.updatedAt).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Product ID</span>
                  <span className="font-medium text-xs text-gray-500">{product._id}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Supplier ID</span>
                  <span className="font-medium text-xs text-gray-500">{product.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Material Center ID</span>
                  <span className="font-medium text-xs text-gray-500">{product.materialCenter}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Ledger</h3>
            <p className="text-gray-500 italic">Stock movement history will be displayed here.</p>
            {/* This is where we would display stock movement history if available */}
            <div className="flex justify-center items-center py-10">
              <div className="text-center">
                <div className="text-gray-400 text-4xl mb-2">📊</div>
                <h4 className="font-medium text-gray-700 mb-1">No transactions yet</h4>
                <p className="text-gray-500 text-sm">Stock movement history will appear here once available</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;