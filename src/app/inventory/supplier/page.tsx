'use client'
import { useEffect, useState } from 'react';
import FilterDropdown from '@/components/FilterDropdown';
import SupplierTable from '@/components/Tables/SupplierTable';
import UploadModal from './UploadModal';
import { Search } from 'lucide-react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuth } from '@/context/AuthContext';



interface Supplier {
  _id: string;
  name: string;
  country: string;
  city: string;
}

interface Inventory {
  id: string;
  supplier: Supplier;
  country: string;
  freightCost: number;
  dutyCharges: number;
  priceTier: string;
  lastPurchasePrice: number;
  currentMarketPrice: number;
  currentPurchasePrice: number;
  createdAt: string;
}

interface Product {
  _id: string;
  department: string;
  designer: string;
  itemCode: string;
  description: string;
  upc: string;
  price: number;
  quantity: number;
}

interface Filters {
  search: string;
  sortOrder: 'asc' | 'desc';
}

interface ApiResponse {
  inventory: Inventory;
  products: Product[];
  filters: Filters;
  totalProducts: number;
}

interface TableProduct {
  id: string;
  supplierName: string;
  eanCode: string;
  itemDetails: string;
  quantity: number;
  productPrice: number;
  totalStockValue: number;
  department: string;
  itemCode: string;
  lastStockList: string;
}

type SortOrder = 'asc' | 'desc';

const Page = () => {
  const auth = useAuth() as { user: any } | null;
  const user = auth?.user;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [inventoryData, setInventoryData] = useState<Inventory | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [supplierInventoryList, setSupplierInventoryList] = useState<any[]>([]);
  const [supplierInventoryLoading, setSupplierInventoryLoading] = useState<boolean>(true);
  const [supplierInventoryError, setSupplierInventoryError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = async (searchTerm: string = '', sort: SortOrder = 'desc'): Promise<void> => {
    if (!user?.token) return;
    
    setLoading(true);
    try {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `http://localhost:3000/api/supplier-inventory/682988f6ab54eabc3f322767/products?search=${searchTerm}&sortOrder=${sort}`,
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      const response = await axios.request<ApiResponse>(config);
      setInventoryData(response.data.inventory);
      setProducts(response.data.products);
      
      // Set filters based on response
      if (response.data.inventory.supplier) {
        setSelectedCountry(response.data.inventory.supplier.country || '');
        setSelectedCity(response.data.inventory.supplier.city || '');
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch supplier inventory list (new API)
  useEffect(() => {
    const fetchSupplierInventory = async () => {
      setSupplierInventoryLoading(true);
      setSupplierInventoryError(null);
      try {
        const config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/api/supplier-inventory',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODY0MjI3NTZiMzNlZTUxMThmNGYyNzUiLCJyb2xlIjoiVVNFUiIsImFjY2VzcyI6WyJHRU5FUkFMX1VTRVIiXSwiaWF0IjoxNzUzODY1MzgzLCJleHAiOjE3NTM5NTE3ODN9.TVAN-flzpDr7ACVK8UroTm_0csTyF9e-iRQRvwlBOmQ'
          }
        };
        const response = await axios.request(config);
        setSupplierInventoryList(response.data);
      } catch (error) {
        setSupplierInventoryError('Failed to load supplier inventory.');
      } finally {
        setSupplierInventoryLoading(false);
      }
    };
    fetchSupplierInventory();
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
  }, [user]);

  // Handle search
  const handleSearch = (): void => {
    fetchProducts(searchQuery, sortOrder);
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery, sortOrder);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, sortOrder]);

  // Format products data for the table
  const formattedProductsData: TableProduct[] = products.map((product, index) => ({
    id: product._id || String(index),
    supplierName: inventoryData?.supplier?.name || "",
    eanCode: product.upc || "",
    itemDetails: `${product.designer || ""} - ${product.description || ""}`,
    quantity: product.quantity || 0,
    productPrice: product.price || 0,
    totalStockValue: (product.price * product.quantity) || 0,
    department: product.department || "",
    itemCode: product.itemCode || "",
    lastStockList: inventoryData?.createdAt ? new Date(inventoryData.createdAt).toLocaleDateString() : "",
  }));

  const handleOpenUploadModal = (): void => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = (): void => {
    setIsUploadModalOpen(false);
  };

  const toggleSortOrder = (): void => {
    const newSortOrder: SortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newSortOrder);
    fetchProducts(searchQuery, newSortOrder);
  };


  const countryOptions: string[] = inventoryData?.supplier?.country ? 
    [inventoryData.supplier.country, 'India', 'USA', 'China', 'Japan'] : 
    ['India', 'USA', 'China', 'Japan'];

  // City options from the API response
  const cityOptions: string[] = inventoryData?.supplier?.city ? 
    [inventoryData.supplier.city, 'Pune', 'Mumbai', 'Delhi', 'Bangalore'] :
    ['Pune', 'Mumbai', 'Delhi', 'Bangalore'];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-700">Products</h1>
        <div className="flex gap-4">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
            onClick={handleOpenUploadModal}
          >
            Upload Supply List <span>↓</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-700 text-white rounded hover:bg-teal-800">
            Export <span>↓</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          />
        </div>
        <FilterDropdown
          label="Country"
          value={selectedCountry}
          onChange={setSelectedCountry}
          options={countryOptions}
        />
        <FilterDropdown
          label="City"
          value={selectedCity}
          onChange={setSelectedCity}
          options={cityOptions}
        />
        <div className="relative min-w-32">
          <button 
            className="px-4 py-2 border border-gray-300 rounded flex items-center justify-between w-full"
            onClick={toggleSortOrder}
          >
            <span>Sort By</span>
            <span>{sortOrder === 'desc' ? '↓' : '↑'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          <p>{error}</p>
        </div>
      ) : (
        <SupplierTable data={formattedProductsData} />
      )}

      {/* New Supplier Inventory Table */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Supplier Inventory List</h2>
        {supplierInventoryLoading ? (
          <div className="text-center py-6">Loading supplier inventory...</div>
        ) : supplierInventoryError ? (
          <div className="text-center py-6 text-red-500">{supplierInventoryError}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left border-b">Supplier Name</th>
                  <th className="py-3 px-4 text-left border-b">Country</th>
                  <th className="py-3 px-4 text-left border-b">City</th>
                  <th className="py-3 px-4 text-left border-b">Freight Cost</th>
                  <th className="py-3 px-4 text-left border-b">Duty Charges</th>
                  <th className="py-3 px-4 text-left border-b">Price Tier</th>
                  <th className="py-3 px-4 text-left border-b">Last Purchase Price</th>
                  <th className="py-3 px-4 text-left border-b">Current Market Price</th>
                  <th className="py-3 px-4 text-left border-b">Current Purchase Price</th>
                  <th className="py-3 px-4 text-left border-b">Created At</th>
                </tr>
              </thead>
              <tbody>
                {supplierInventoryList.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.supplier?.name}</td>
                    <td className="py-3 px-4">{item.supplier?.country}</td>
                    <td className="py-3 px-4">{item.supplier?.city}</td>
                    <td className="py-3 px-4">{item.freightCost}</td>
                    <td className="py-3 px-4">{item.dutyCharges}</td>
                    <td className="py-3 px-4">{item.priceTier}</td>
                    <td className="py-3 px-4">{item.lastPurchasePrice}</td>
                    <td className="py-3 px-4">{item.currentMarketPrice}</td>
                    <td className="py-3 px-4">{item.currentPurchasePrice}</td>
                    <td className="py-3 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={handleCloseUploadModal}
      />
    </div>
  );
};

export default Page;
