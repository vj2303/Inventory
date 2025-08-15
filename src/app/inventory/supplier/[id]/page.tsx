'use client'
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Search, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';

const SupplierProductPage = () => {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierInventory, setSupplierInventory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // Get supplier ID from URL params
  const supplierId = params.id as string;

  useEffect(() => {
    const fetchSupplierInventory = async () => {
      if (!user?.token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch supplier inventory with products
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: `http://localhost:3000/api/supplier-inventory?includeProducts=true&supplierId=${supplierId}`,
          headers: { 
            'Authorization': `Bearer ${user.token}`
          }
        };
        
        const response = await axios.request(config);
        console.log('Supplier inventory response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          const supplierData = response.data.find((item: any) => item._id === supplierId);
          if (supplierData) {
            setSupplierInventory(supplierData);
            if (supplierData.products && Array.isArray(supplierData.products)) {
              setProducts(supplierData.products);
            } else {
              setProducts([]);
            }
          } else {
            setError('Supplier not found');
            setProducts([]);
          }
        } else {
          setError('Invalid response format');
          setProducts([]);
        }
      } catch (err: any) {
        console.error('Error fetching supplier inventory:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (supplierId && user?.token) {
      fetchSupplierInventory();
    }
  }, [user, supplierId]);



  // Handle loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <h3 className="font-bold">Error loading data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Extract supplier details from API response
  const supplierDetails = supplierInventory?.supplier || {
    name: "Supplier Name",
    managerName: "Manager Name",
    phoneNumber: "Phone Number",
    address: "Address",
    city: "City"
  };

  // Extract price data from API response
  const priceData = {
    lastPurchasePrice: supplierInventory?.lastPurchasePrice || 0,
    currentMarketPrice: supplierInventory?.currentMarketPrice || 0,
    currentPurchasePrice: supplierInventory?.currentPurchasePrice || 0
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white p-4 shadow">
        <button 
          onClick={() => router.push('/inventory/supplier')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back To Supply Lists</span>
        </button>
      </div>

      {/* Supplier info cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">{supplierDetails.name}</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Manager</span>
              <span>{supplierDetails.managerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone No.</span>
              <span className="text-blue-500">{supplierDetails.phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">E-mail</span>
              <span>{supplierDetails.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address</span>
              <span>{`${supplierDetails.address}, ${supplierDetails.city}`}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-700">${priceData.lastPurchasePrice}</h3>
            <p className="text-gray-500">Last Purchase Price</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-700">${priceData.currentMarketPrice}</h3>
            <p className="text-gray-500">Current Market Price</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-700">${priceData.currentPurchasePrice}</h3>
            <p className="text-gray-500">Current Purchase Price</p>
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="flex-1 p-4">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Products</h2>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-md"
              />
              <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort By</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <button className="bg-green-700 text-white px-4 py-2 rounded-md flex items-center">
              Export
              <ChevronDown className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-md shadow overflow-x-auto">
          {products.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No products found for this supplier.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Freight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Landed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Stock Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => {
                  // Extract dates
                  const createdAt = product.createdAt ? new Date(product.createdAt) : null;
                  const formattedDate = createdAt 
                    ? `${createdAt.getDate()} ${createdAt.toLocaleString('default', { month: 'short' })} ${createdAt.getFullYear()}`
                    : product.uploadDate || 'N/A';
                    
                  return (
                    <tr key={product._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.itemDetails?.name || product.itemDetails || "A&F AUTHENTIC NIGHT M TESTER 100ML"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.itemDetails?.itemCode || product.itemCode || "#u76855"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantityAvailable || product.quantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.cost || product.price || 0}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.freight || supplierInventory?.freightCost || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.duty || supplierInventory?.dutyCharges || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.landed || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.a || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.b || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.c || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.d || 100}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.totalStockValue || (product.cost * product.quantityAvailable) || 4000}.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierProductPage;



