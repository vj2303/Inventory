// pages/product-selection.tsx
'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface Product {
  _id: string;
  itemDetails: {
    name: string;
    eanCode: string;
    itemCode: string;
    brand: string;
    sex: string;
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
  materialCenter: string;
  availability?: string; // Added for UI display purposes
}

interface MaterialCenter {
  _id: string;
  city: string;
  country: string;
  address: string;
  warehouseSize: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ProductSelection() {
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [materialCenters, setMaterialCenters] = useState<MaterialCenter[]>([]);
  const [sourceMaterialCenter, setSourceMaterialCenter] = useState('');
  const [destinationMaterialCenter, setDestinationMaterialCenter] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const countries = ['India', 'USA', 'Spain'];
   
  const router = useRouter();
  const { user } = useAuth() as { user: { token: string } | null };

  const handleNextClick = () => {
    if (selectedProductIds.length === 0 || !destinationMaterialCenter) {
      return;
    }
   
    // Create an array of selected products with necessary details
    const selectedProducts = products
    .filter(product => selectedProductIds.includes(product._id))
    .map(product => ({
      id: product._id,
      productId: product._id,
      name: product.itemDetails.name,
      inStock: product.stockInfo.quantity,
      transferQuantity: 1, // Default quantity, can be adjusted on next screen
      unitCost: product.stockInfo.cost || 0,
      totalValue: product.stockInfo.cost || 0 // Will be recalculated based on quantity
    }));
  
  // Store in localStorage (alternative to state management)
  localStorage.setItem('transferProducts', JSON.stringify(selectedProducts));
  localStorage.setItem('sourceMaterialCenterId', sourceMaterialCenter);
  localStorage.setItem('destinationMaterialCenterId', destinationMaterialCenter);
  
  // Navigate to transfer details page
  router.push('/inventory/stock/transfer');
};



  // Fetch material centers when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchMaterialCenters(selectedCountry);
    }
  }, [selectedCountry]);

  // Fetch products when source material center changes
  useEffect(() => {
    if (sourceMaterialCenter) {
      fetchProducts(sourceMaterialCenter);
    }
  }, [sourceMaterialCenter]);

  const fetchMaterialCenters = async (country: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/material-center/country/${country}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      setMaterialCenters(response.data.materialCenters);
    } catch (error) {
      console.error('Error fetching material centers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (materialCenterId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/stock-transfer/products?materialCenterId=${materialCenterId}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      // Add availability status based on quantity
      const productsWithAvailability = response.data.products.map((product: Product) => {
        let availability = 'Out of Stock';
        if (product.stockInfo.quantity > 500) {
          availability = 'In Stock';
        } else if (product.stockInfo.quantity > 0) {
          availability = 'Low Stock';
        }
        return { ...product, availability };
      });
      
      setProducts(productsWithAvailability);
      setTotalItems(response.data.count);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityClass = (availability: string) => {
    switch (availability) {
      case 'In Stock':
        return 'text-green-600';
      case 'Low Stock':
        return 'text-orange-500';
      case 'Out of Stock':
        return 'text-red-500';
      default:
        return 'text-gray-600';
    }
  };

  const toggleProductSelection = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter(id => id !== productId));
    } else {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(e.target.value);
    setSourceMaterialCenter('');
    setDestinationMaterialCenter('');
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceMaterialCenter(e.target.value);
    // If destination is the same as new source, clear destination
    if (destinationMaterialCenter === e.target.value) {
      setDestinationMaterialCenter('');
    }
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestinationMaterialCenter(e.target.value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFiltersClick = () => {
    console.log('Filters button clicked');
  };

  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // Filter out source material center from destination options
  const destinationOptions = materialCenters.filter(
    center => center._id !== sourceMaterialCenter
  );

  // Filtered and sorted products
  const filteredProducts = products
    .filter(product => {
      if (!searchTerm) return true;
      return (
        product.itemDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemDetails.eanCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.itemDetails.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.itemDetails.name.localeCompare(b.itemDetails.name);
      } else {
        return b.itemDetails.name.localeCompare(a.itemDetails.name);
      }
    });

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Request ID- 33566687</h1>
            <p className="text-sm text-gray-500">Date- 21/12/1436</p>
          </div>
        </div>
      </div>

      {/* Source and Destination Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
        <div className="w-full md:w-1/4">
          <div className="relative">
            <select 
              className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="w-full md:flex md:items-center md:w-3/4 gap-2">
          <div className="font-medium mb-2 md:mb-0 md:w-1/6">Source</div>
          <div className="relative md:w-1/3">
            <select 
              className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={sourceMaterialCenter}
              onChange={handleSourceChange}
              disabled={!selectedCountry || materialCenters.length === 0}
            >
              <option value="">Select Warehouse</option>
              {materialCenters.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.city} - {center.address}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="flex justify-center my-2 md:my-0 md:mx-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>

          <div className="font-medium mb-2 md:mb-0 md:w-1/6">Destination</div>
          <div className="relative md:w-1/3">
            <select 
              className="appearance-none block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={destinationMaterialCenter}
              onChange={handleDestinationChange}
              disabled={!sourceMaterialCenter || destinationOptions.length === 0}
            >
              <option value="">Select Warehouse</option>
              {destinationOptions.map((center) => (
                <option key={center._id} value={center._id}>
                  {center.city} - {center.address}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Select Products Section */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">Select Products from Inventory</h2>
            {sourceMaterialCenter && materialCenters.find(center => center._id === sourceMaterialCenter) && (
              <p className="text-sm text-gray-500">
                Warehouse Inventory: {materialCenters.find(center => center._id === sourceMaterialCenter)?.city}, 
                {selectedCountry}
              </p>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center mt-4 md:mt-0">
            <div className="bg-gray-100 px-4 py-2 rounded mr-0 md:mr-4 mb-2 md:mb-0">
              <span className="font-medium">Number of Item Selected: </span>
              <span>{selectedProductIds.length}</span>
            </div>
            <Link href='/inventory/stock/transfer'>
            <button 
                  className="bg-teal-600 text-white px-6 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={selectedProductIds.length === 0 || !destinationMaterialCenter}
                  onClick={handleNextClick}
                >
                  Next
                </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="absolute left-3 top-2.5">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <button 
            onClick={handleSortToggle}
            className="flex items-center border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <span className="mr-2">Sort By</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <button 
            onClick={handleFiltersClick}
            className="flex items-center border border-gray-300 rounded-md px-4 py-2 bg-white"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}

      {/* Products Table */}
      {!loading && products.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border-t border-b border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left"></th>
                <th className="py-3 px-4 text-left">Item Details</th>
                <th className="py-3 px-4 text-left">EAN code</th>
                <th className="py-3 px-4 text-left">Item Code</th>
                <th className="py-3 px-4 text-left">Brand</th>
                <th className="py-3 px-4 text-left">Sex</th>
                <th className="py-3 px-4 text-left">ml</th>
                <th className="py-3 px-4 text-right">Total Stock</th>
                <th className="py-3 px-4 text-right">Total Value</th>
                <th className="py-3 px-4 text-center">Availability</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product._id)}
                      onChange={() => toggleProductSelection(product._id)}
                      className="form-checkbox h-5 w-5 text-teal-600"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 mr-3">
                        {/* Placeholder for product image */}
                      </div>
                      <div>
                        <p className="font-medium">{product.itemDetails.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">{product.itemDetails.eanCode}</td>
                  <td className="py-3 px-4">{product.itemDetails.itemCode}</td>
                  <td className="py-3 px-4">{product.itemDetails.brand}</td>
                  <td className="py-3 px-4">{product.itemDetails.sex || '-'}</td>
                  <td className="py-3 px-4">{product.itemDetails.ml} ml</td>
                  <td className="py-3 px-4 text-right">{product.stockInfo.quantity}</td>
                  <td className="py-3 px-4 text-right">{product.stockInfo.totalValue.toFixed(2)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={getAvailabilityClass(product.availability || '')}>
                      {product.availability}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No products message */}
      {!loading && products.length === 0 && sourceMaterialCenter && (
        <div className="text-center py-8 text-gray-500">
          No products found in this warehouse.
        </div>
      )}

      {/* Pagination */}
      {!loading && products.length > 0 && (
        <>
          <div className="flex justify-center items-center text-sm">
            <button 
              onClick={() => handlePagination(currentPage - 1)}
              disabled={currentPage === 1}
              className="mx-1 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              index < 8 && (
                <button 
                  key={index}
                  onClick={() => handlePagination(index + 1)}
                  className={`mx-1 w-8 h-8 rounded flex items-center justify-center ${currentPage === index + 1 ? 'bg-gray-800 text-white' : 'hover:bg-gray-200'}`}
                >
                  {index + 1}
                </button>
              )
            ))}
            
            <button 
              onClick={() => handlePagination(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="mx-1 px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {totalPages > 8 && (
              <button 
                onClick={() => handlePagination(totalPages)}
                className="mx-1 px-2 py-1 rounded hover:bg-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-2">
            {currentPage} of {totalPages} pages ({totalItems} items)
          </div>
        </>
      )}
    </div>
  );
}