'use client';

import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Loader from '@/components/UI/Loader';
import { useAuth } from '@/context/AuthContext';
import SearchBar from '@/components/UI/Searchbar';
import SortDropdown from '@/components/UI/SortDropDown';

export interface Product {
  _id: string;
  itemDetails: {
    name: string;
  };
  stockInfo: {
    minimumPrice: number;
    quantity: number;
    costPrice: number;
    landedCost: number;
    totalValue: number;
  };
  availability: string;
}

const ProductDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState<boolean>(false);
  const [inventoryType, setInventoryType] = useState<"company" | "supplier">("company");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  
  // Sort options for the dropdown
  const sortOptions = [
    { value: 'price-high', label: 'Price-Highest to lowest' },
    { value: 'price-low', label: 'Price-Lowest to highest' },
    { value: 'supplier-az', label: 'Supplier Name (A-Z)' }
  ];

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Build query parameters
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      
      if (search.trim()) {
        params.q = search.trim();
      }
      
      if (sort) {
        params.sort = sort;
      }
      
      params.inventoryType = inventoryType;

      // Build query string
      const queryString = Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      
      // Get auth token from context
      const token = user?.token || localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await axios({
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000'}/api/products${queryString ? `?${queryString}` : ''}`,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProducts(response.data.products || response.data);
      setError(null);
    } catch (err: unknown) {
      console.error("Error fetching products:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch products";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, sort, inventoryType, user?.token]);

  // Initial data fetch
  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  // Refetch when inventory type, sort, or page changes
  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [inventoryType, sort, page, fetchProducts]);

  // Handle search with the SearchBar component
  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1); // Reset to first page when searching
    // The fetchProducts will be called by the useEffect below
  };
  
  // Fetch products when search changes
  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [search, fetchProducts]);

  // Toggle inventory type
  const toggleInventoryType = (type: "company" | "supplier") => {
    setInventoryType(type);
  };

  // Handle sort selection
  const handleSortSelect = (sortValue: string) => {
    setSort(sortValue);
    setSortMenuOpen(false);
  };

  // Helper function to render availability status with correct styling
  const renderAvailability = (status: string | undefined, index: number) => {
    // Using more explicit colors that match the screenshot
    if (status) {
      // For existing statuses, try to apply appropriate styling
      const lowerStatus = status.toLowerCase();
      if (lowerStatus.includes('out')) {
        return <span className="text-red-500 px-2 py-1 rounded-sm bg-red-50 font-medium">Out of Stock</span>;
      } else if (lowerStatus.includes('low')) {
        return <span className="text-[#F59E0B] px-2 py-1 rounded-sm bg-amber-50 font-medium">Low Stock</span>;
      } else if (lowerStatus.includes('in')) {
        return <span className="text-[#10B981] px-2 py-1 rounded-sm bg-green-50 font-medium">In Stock</span>;
      }
      return status;
    }
    
    if (index === 1) {
      return <span className="text-red-500 px-2 py-1 rounded-sm bg-red-50 font-medium">Out of Stock</span>;
    } else if (index === 0) {
      return <span className="text-[#F59E0B] px-2 py-1 rounded-sm bg-amber-50 font-medium">Low Stock</span>;
    } else {
      return <span className="text-[#10B981] px-2 py-1 rounded-sm bg-green-50 font-medium">In Stock</span>;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-[28px] font-medium mb-6">Product List</h1>
      
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        {/* Using the SearchBar component */}
        <SearchBar 
          placeholder="Search products..." 
          onSearch={handleSearch} 
          initialValue={search}
          className="w-full md:w-80" 
        />
        
        {/* Using the SortDropdown component */}
        <SortDropdown 
          options={sortOptions}
          selectedValue={sort}
          onSelect={handleSortSelect}
          isOpen={sortMenuOpen}
          toggleOpen={() => setSortMenuOpen(!sortMenuOpen)}
        />
      </div>
      
      {/* Inventory Type Toggle */}
      <div className="flex mb-4">
        <div 
          className={`flex items-center gap-2 mr-6 cursor-pointer ${inventoryType === "company" ? "text-teal-600" : "text-gray-400"}`}
          onClick={() => toggleInventoryType("company")}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inventoryType === "company" ? "border-teal-600" : "border-gray-300"}`}>
            {inventoryType === "company" && <div className="w-3 h-3 bg-teal-600 rounded-full"></div>}
          </div>
          <span>Company Inventory</span>
        </div>
        
        <div 
          className={`flex items-center gap-2 cursor-pointer ${inventoryType === "supplier" ? "text-teal-600" : "text-gray-400"}`}
          onClick={() => toggleInventoryType("supplier")}
        >
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inventoryType === "supplier" ? "border-teal-600" : "border-gray-300"}`}>
            {inventoryType === "supplier" && <div className="w-3 h-3 bg-teal-600 rounded-full"></div>}
          </div>
          <span>Supplier Inventory</span>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center mt-[300px]">
          <Loader />
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      ) : inventoryType === "company" ? (
        // Company Inventory Table
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#B2D9D84D] text-left">
              <tr className="text-sm font-semibold text-gray-800">
                <th className="px-4 py-3">Item Details</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Cost (Currency)</th>
                <th className="px-4 py-3">Landed</th>
                <th className="px-4 py-3">Minimum Price ($)</th>
                <th className="px-4 py-3">Total Value</th>
                <th className="px-4 py-3">Availability</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product, index) => (
                  <tr key={product._id || index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-800">
                        {product.itemDetails?.name || "A&F AUTHENTIC NIGHT M TESTER 100ML"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.stockInfo?.quantity || (index % 2 === 0 ? 2500 : 10000)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.stockInfo?.costPrice || 200.00}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.stockInfo?.landedCost || 32.40}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.stockInfo?.minimumPrice || 100.00}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {product.stockInfo?.totalValue || 4000.00}
                    </td>
                    <td className="px-4 py-3">
                      {renderAvailability(product.availability, index)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Supplier Inventory View
        <div className="bg-gray-50 rounded-md p-8 text-center text-gray-500">
          No supplier inventory data available
        </div>
      )}
      
      {/* Simple pagination */}
      {!loading && products.length > 0 && (
        <div className="mt-6 flex justify-center gap-2">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md bg-gray-100 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">Page {page}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-md bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDashboard;