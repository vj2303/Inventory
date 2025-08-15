'use client'
// src/components/InventoryDashboard.tsx with integrated filter functionality
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';
import StatCard from '@/components/StatCard';
import ProductsTable from '@/components/ProductTable';
import FilterDropdown from '@/components/FilterDropdown';
import FilterButton from '@/components/FilterButton';
import AddProductModal, { CompleteProductData } from '@/components/AddProductModal';
import InventoryUploadModal from './UploadInventoryModal';
import { useAuth } from '@/context/AuthContext';
import { useGlobal } from '@/context/GlobalContext';
import FilterSortButton from './FilterButton';

// Types
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
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  totalValue: number;
  countriesCovered: number;
  totalMaterialCenters: number;
  lowStock: number;
  outOfStock: number;
}

// Filter type definition
export interface FilterOptions {
  productType: string;
  brands: string[];
  sex: string;
  volume: string;
  type: string;
  subtype: string;
  priceRange: { min: number; max: number };
  quantityRange: { min: number; max: number };
  landedCost: { min: number; max: number };
}

const InventoryDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedMaterialCenter, setSelectedMaterialCenter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    productType: '',
    brands: [],
    sex: '',
    volume: '',
    type: '',
    subtype: '',
    priceRange: { min: 0, max: 250 },
    quantityRange: { min: 0, max: 250 },
    landedCost: { min: 0, max: 250 }
  });
  const [stats, setStats] = useState<Stats>({
    totalValue: 0,
    countriesCovered: 0,
    totalMaterialCenters: 0,
    lowStock: 0,
    outOfStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get auth context for token
  const { user } = useAuth();
  
  // Get global context for material centers
  const { materialCenters, getSupplierName, getMaterialCenterAddress } = useGlobal();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // Simplified URL - fetch all products
        const url = 'http://localhost:3000/api/products';
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Initialize filtered products with all products
        setError(null);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    
    if (user?.token) {
      fetchProducts();
    }
  }, [user]);
  
  // Fetch statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products/stats', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        // Updated to match the actual API response format
        setStats({
          totalValue: response.data.data.totalInventoryValue || 0,
          countriesCovered: response.data.data.countriesCovered || 0,
          totalMaterialCenters: response.data.data.totalMaterialCenters || 0,
          lowStock: response.data.data.lowStockItems || 0,
          outOfStock: response.data.data.outOfStock || 0
        });
      } catch (err: unknown) {
        console.error('Error fetching stats:', err);
      }
    };
    
    if (user?.token) {
      fetchStats();
    }
  }, [user]);

  // Apply filters whenever products or filter criteria change
  useEffect(() => {
    // Skip if no products yet
    if (products.length === 0) return;
    
    // Apply search filter and other filters
    const filtered = products.filter(product => {
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          product.itemDetails.name.toLowerCase().includes(query) ||
          product.itemDetails.brand.toLowerCase().includes(query) ||
          product.itemDetails.itemCode.toLowerCase().includes(query) ||
          product.itemDetails.eanCode.toLowerCase().includes(query);
        
        if (!matchesSearch) return false;
      }
      
      // Apply material center filter
      if (selectedMaterialCenter && product.materialCenter !== selectedMaterialCenter) {
        return false;
      }
      
      // Apply modal filters
      // Product Type filter
      if (activeFilters.productType && product.itemDetails.type !== activeFilters.productType) {
        return false;
      }
      
      // Brand filter
      if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.itemDetails.brand)) {
        return false;
      }
      
      // Sex filter
      if (activeFilters.sex && product.itemDetails.sex !== activeFilters.sex) {
        return false;
      }
      
      // Volume filter
      if (activeFilters.volume && product.itemDetails.ml !== activeFilters.volume) {
        return false;
      }
      
      // Type filter
      if (activeFilters.type && product.itemDetails.type !== activeFilters.type) {
        return false;
      }
      
      // Subtype filter
      if (activeFilters.subtype && product.itemDetails.subtype !== activeFilters.subtype) {
        return false;
      }
      
      // Price range filter - using priceA as an example
      const productPrice = product.stockInfo.pricing.priceA;
      if (
        productPrice < activeFilters.priceRange.min ||
        productPrice > activeFilters.priceRange.max
      ) {
        return false;
      }
      
      // Quantity range filter
      if (
        product.stockInfo.quantity < activeFilters.quantityRange.min ||
        product.stockInfo.quantity > activeFilters.quantityRange.max
      ) {
        return false;
      }
      
      // Landed cost filter
      if (
        product.stockInfo.landed < activeFilters.landedCost.min ||
        product.stockInfo.landed > activeFilters.landedCost.max
      ) {
        return false;
      }
      
      // If product passes all filters
      return true;
    });
    
    setFilteredProducts(filtered);
  }, [
    products, 
    searchQuery, 
    selectedMaterialCenter, 
    activeFilters
  ]);

  // Handle applying filters from the filter modal
  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);
    // The useEffect above will handle the actual filtering
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleAddProduct = async () => {
    try {
      // Refresh all products after adding
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      const fetchedProducts = response.data.products || [];
      setProducts(fetchedProducts);
      
      // Refresh stats
      const statsResponse = await axios.get('http://localhost:3000/api/products/stats', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      setStats({
        totalValue: statsResponse.data.data.totalInventoryValue || 0,
        countriesCovered: statsResponse.data.data.countriesCovered || 0,
        totalMaterialCenters: statsResponse.data.data.totalMaterialCenters || 0,
        lowStock: statsResponse.data.data.lowStockItems || 0,
        outOfStock: statsResponse.data.data.outOfStock || 0
      });
      
    } catch (err) {
      console.error('Error refreshing data after add product:', err);
    }
  };

  const handleUploadComplete = async (message: string, success: boolean) => {
    if (success) {
      try {
        // Refresh products list
        const response = await axios.get('http://localhost:3000/api/products', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        
        // Refresh stats
        const statsResponse = await axios.get('http://localhost:3000/api/products/stats', {
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        setStats({
          totalValue: statsResponse.data.data.totalInventoryValue || 0,
          countriesCovered: statsResponse.data.data.countriesCovered || 0,
          totalMaterialCenters: statsResponse.data.data.totalMaterialCenters || 0,
          lowStock: statsResponse.data.data.lowStockItems || 0,
          outOfStock: statsResponse.data.data.outOfStock || 0
        });
      } catch (err) {
        console.error('Error refreshing data after upload:', err);
      }
    }
  };

  // Convert country codes to names for dropdown
  const countries = [...new Set(materialCenters.map(center => center.country))];
  
  // Get unique cities based on selected country
  const cities = [...new Set(materialCenters
    .filter(center => !selectedCountry || center.country === selectedCountry)
    .map(center => center.city))];
  
  // Get material centers based on selected country and city
  const filteredMaterialCenters = materialCenters.filter(center => 
    (!selectedCountry || center.country === selectedCountry) &&
    (!selectedCity || center.city === selectedCity)
  );

  // Count active filters for the button display
  const countActiveFilters = () => {
    let count = 0;
    if (activeFilters.productType) count++;
    if (activeFilters.brands.length > 0) count++;
    if (activeFilters.sex) count++;
    if (activeFilters.volume) count++;
    if (activeFilters.type) count++;
    if (activeFilters.subtype) count++;
    
    // For range filters, check if they're different from default
    if (
      activeFilters.priceRange.min > 0 || 
      activeFilters.priceRange.max < 250
    ) count++;
    
    if (
      activeFilters.quantityRange.min > 0 || 
      activeFilters.quantityRange.max < 250
    ) count++;
    
    if (
      activeFilters.landedCost.min > 0 || 
      activeFilters.landedCost.max < 250
    ) count++;
    
    return count;
  };

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-700">Overall Inventory</h1>
          <div className="flex gap-4">
            <button 
              className="flex items-center gap-2 px-4 py-2 border cursor-pointer border-[#004C4C] rounded text-teal-600 hover:bg-teal-50"
              onClick={handleOpenAddModal}
            >
              <span className="text-sm">+</span> Add Product
            </button>
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-[#004C4C] cursor-pointer text-white rounded"
              onClick={handleOpenUploadModal}
            >
              Upload Inventory <span>↓</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#004C4C] cursor-pointer text-white rounded">
              Export <span>↓</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Inventory Value" 
            value={`$${stats.totalValue.toLocaleString()}`} 
            type="currency" 
          />
          <StatCard 
            title="Countries Covered" 
            value={stats.countriesCovered.toString()} 
            type="number" 
          />
          <StatCard 
            title="Total Material Center" 
            value={stats.totalMaterialCenters.toString()} 
            type="number" 
          />
          <StatCard 
            title="Stock Status" 
            primaryValue={stats.lowStock.toString()} 
            primaryLabel="Low Stock"
            secondaryValue={stats.outOfStock.toString()} 
            secondaryLabel="Out of Stock" 
            type="split" 
            isAlert={stats.lowStock > 0 || stats.outOfStock > 0}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Products</h2>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by product name, code, or brand"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative min-w-32">
                    {/* <button className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between w-full">
                      <span>Sort By</span>
                      <span>↑↓</span>
                    </button> */}
                    <FilterSortButton onApplyFilters={handleApplyFilters} />
                  </div>
                  <div className="relative cursor-pointer min-w-32">
                    <FilterButton onApplyFilters={handleApplyFilters} />
                    {countActiveFilters() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-teal-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {countActiveFilters()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <FilterDropdown 
              label="Country" 
              value={selectedCountry} 
              onChange={setSelectedCountry} 
              options={countries}
            />
            <FilterDropdown 
              label="City" 
              value={selectedCity} 
              onChange={setSelectedCity} 
              options={cities}
            />
            <FilterDropdown 
              label="Material Center" 
              value={selectedMaterialCenter} 
              onChange={setSelectedMaterialCenter} 
              options={filteredMaterialCenters.map(center => ({
                value: center._id || center.id,
                label: `${center.city} - ${center.address}`
              }))}
            />
          </div>

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-600">{error}</div>
          ) : (
            <ProductsTable 
              products={filteredProducts.map(product => ({
                id: product._id,
                itemDetails: product.itemDetails.name,
                eanCode: product.itemDetails.eanCode,
                itemCode: product.itemDetails.itemCode,
                brand: product.itemDetails.brand,
                sex: product.itemDetails.sex,
                totalStock: product.stockInfo.quantity,
                totalValue: product.stockInfo.totalValue,
                availability: product.stockInfo.quantity > 0 
                  ? product.stockInfo.quantity < 10 ? "Low Stock" : "In Stock" 
                  : "Out of Stock",
                supplier: getSupplierName(product.supplier),
                materialCenter: getMaterialCenterAddress(product.materialCenter),
                imageUrl: product.imageUrl,
                // Add all stock info details
                costPrice: product.stockInfo.cost,
                freight: product.stockInfo.freight,
                duty: product.stockInfo.duty,
                landed: product.stockInfo.landed,
                minimumPrice: product.stockInfo.minimumPrice,
                meanCP: product.stockInfo.meanCP,
                currency: product.stockInfo.currency,
                pricing: product.stockInfo.pricing
              }))} 
            />
          )}
        </div>
      </div>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddProduct}
      />
      
      <InventoryUploadModal 
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onUploadComplete={handleUploadComplete}
        token={user?.token}
      />
    </>
  );
};

export default InventoryDashboard;