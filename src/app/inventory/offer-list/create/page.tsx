"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, Upload, AlignLeft, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useOfferList } from '@/context/OfferListContext';

// Type definitions
interface InventoryItem {
  id?: string;
  _id?: string;
  selected?: boolean;
  itemDetails?: {
    name?: string;
    eanCode?: string;
    sex?: string;
  };
  stockInfo?: {
    quantity?: number;
    pricing?: {
      priceA?: number;
    };
  };
  quantity?: number;
  price?: number;
  supplierName?: string;
  supplierImage?: string;
}

interface OfferListItem {
  id: string;
  name: string;
  quantity: string | number;
  price: string | number;
  sex: string;
  source: string;
}

interface User {
  token: string;
  id?: string;
}

interface OfferListContext {
  offerList: OfferListItem[];
  updateOfferList: (list: OfferListItem[]) => void;
}

const SupplierInventoryRow = ({ item, onSelect }: { item: InventoryItem; onSelect: (id: string) => void }) => {
  // Get quantity from stockInfo if available
  const quantity = item.stockInfo?.quantity || item.quantity || 'N/A';
  // Get price from stockInfo pricing if available
  const price = item.stockInfo?.pricing?.priceA || item.price || 'N/A';
  
  return (
    <tr className="border-b">
      <td className="p-3">
        <input 
          type="checkbox" 
          className="w-4 h-4"
          checked={item.selected} 
          onChange={() => onSelect(item.id || item._id || '')}
        />
      </td>
      <td className="p-3">{item.itemDetails?.name || 'N/A'}</td>
      <td className="p-3">
        <div className="flex items-center">
          <img src={item.supplierImage || '/api/placeholder/40/40'} alt={item.supplierName} className="w-8 h-8 rounded-full mr-2" />
          {item.supplierName || 'N/A'}
        </div>
      </td>
      <td className="p-3 text-green-500">{quantity}</td>
      <td className="p-3 text-yellow-500">${price}</td>
      <td className="p-3">{item.itemDetails?.sex || 'N/A'}</td>
    </tr>
  );
};

const CompanyInventoryRow = ({ item, onSelect }: { item: InventoryItem; onSelect: (id: string) => void }) => {
  // Get quantity from stockInfo if available
  const quantity = item.stockInfo?.quantity || item.quantity || 'N/A';
  // Get price from stockInfo pricing if available
  const price = item.stockInfo?.pricing?.priceA || item.price || 'N/A';
  
  return (
    <tr className="border-b">
      <td className="p-3">
        <input 
          type="checkbox" 
          className="w-4 h-4"
          checked={item.selected} 
          onChange={() => onSelect(item.id || item._id || '')}
        />
      </td>
      <td className="p-3">{item.itemDetails?.name || 'N/A'}</td>
      <td className="p-3">{item.itemDetails?.eanCode || 'N/A'}</td>
      <td className="p-3 text-green-500">{quantity}</td>
      <td className="p-3 text-yellow-500">${price}</td>
      <td className="p-3">{item.itemDetails?.sex || 'N/A'}</td>
    </tr>
  );
};

// Offer List Item Component
const OfferListItem = ({ item, onRemove }: { item: OfferListItem; onRemove: (id: string) => void }) => {
  return (
    <div className="border rounded mb-2 p-3 relative">
      <button 
        className="absolute top-2 right-2 text-red-500" 
        onClick={() => onRemove(item.id)}
      >
        <X className="w-5 h-5" />
      </button>
      
      <h3 className="font-medium">{item.name}</h3>
      <div className="flex justify-between mt-2">
        <span className="text-green-500">Quantity {item.quantity}</span>
        <span className="text-yellow-500">Lowest Price ${item.price}</span>
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {item.source}, Sex-{item.sex}
      </div>
    </div>
  );
};

// Dropdown Component
const Dropdown = ({ 
  label, 
  className = "", 
  options = [], 
  value = "", 
  onChange = () => {},
  disabled = false 
}: { 
  label: string; 
  className?: string;
  options?: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        className={`w-full flex items-center justify-between border border-gray-300 rounded p-2 bg-white ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="text-gray-700">
          {value ? options.find(opt => opt.value === value)?.label || value : label}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && options.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-4/5 max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-medium">{title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 overflow-auto max-h-[calc(80vh-70px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function CreateOfferListPage() {
  const { user } = useAuth() as { user: User | null };
  const { offerList, updateOfferList } = useOfferList() as OfferListContext;
  const [offerListNumber] = useState('33566687');
  const [offerName, setOfferName] = useState('Summer Collection 2025');
  const [date] = useState('21/12/1436');
  const [inventoryType, setInventoryType] = useState<'both' | 'company' | 'supplier'>('both');
  const [showProductQuantity, setShowProductQuantity] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  
  // States for inventory data
  const [supplierInventory, setSupplierInventory] = useState<InventoryItem[]>([]);
  const [companyInventory, setCompanyInventory] = useState<InventoryItem[]>([]);
  
  // States for country and city selection
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // States for other dropdowns
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedMaterialCenter, setSelectedMaterialCenter] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedIncoTerms, setSelectedIncoTerms] = useState('');
  
  // States for supplier data
  const [suppliers, setSuppliers] = useState<{ value: string; label: string }[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [supplierError, setSupplierError] = useState<string | null>(null);
  
  // States for material center data
  const [materialCenters, setMaterialCenters] = useState<{ value: string; label: string; country: string; city: string; address: string; warehouseSize: string }[]>([]);
  const [loadingMaterialCenters, setLoadingMaterialCenters] = useState(false);
  const [materialCenterError, setMaterialCenterError] = useState<string | null>(null);
  
  // Options for dropdowns
  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'JPY', label: 'JPY - Japanese Yen' }
  ];
  
  const priceOptions = [
    { value: 'priceA', label: 'Price A' },
    { value: 'priceB', label: 'Price B' },
    { value: 'priceC', label: 'Price C' },
    { value: 'priceD', label: 'Price D' }
  ];
  
  const incoTermsOptions = [
    { value: 'FOB', label: 'FOB - Free On Board' },
    { value: 'CIF', label: 'CIF - Cost, Insurance and Freight' },
    { value: 'EXW', label: 'EXW - Ex Works' },
    { value: 'DDP', label: 'DDP - Delivered Duty Paid' },
    { value: 'DAP', label: 'DAP - Delivered At Place' }
  ];
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  // Function to fetch countries
  const fetchCountries = useCallback(async () => {
    if (!user || !user.token) return;
    
    try {
      // For now, we'll use a static list of countries
      // In a real implementation, you would fetch this from an API
      const countriesList = [
        { value: 'India', label: 'India' },
        { value: 'USA', label: 'USA' },
        { value: 'Spain', label: 'Spain' },
        { value: 'Germany', label: 'Germany' },
        { value: 'France', label: 'France' },
        { value: 'Italy', label: 'Italy' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'Canada', label: 'Canada' },
        { value: 'Australia', label: 'Australia' },
        { value: 'Japan', label: 'Japan' }
      ];
      setCountries(countriesList);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }, [user]);

  // Function to fetch suppliers
  const fetchSuppliers = useCallback(async () => {
    if (!user || !user.token) return;
    
    setLoadingSuppliers(true);
    setSupplierError(null);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/suppliers',
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };

      const response = await axios.request(config);
      
      if (response.data && Array.isArray(response.data)) {
        const suppliersList = response.data.map((supplier: any) => ({
          value: supplier._id || supplier.id,
          label: supplier.name || 'Unknown Supplier'
        }));
        setSuppliers(suppliersList);
        
        // Log the number of suppliers found for debugging
        console.log(`Found ${suppliersList.length} suppliers`);
      } else {
        setSuppliers([]);
        setSupplierError('No suppliers data found');
        console.log('No suppliers data found in response');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setSuppliers([]);
      setSupplierError('Failed to load suppliers');
    } finally {
      setLoadingSuppliers(false);
    }
  }, [user]);

  // Function to fetch cities for a selected country
  const fetchCities = useCallback(async (country: string) => {
    if (!user || !user.token || !country) {
      setCities([]);
      return;
    }
    
    setLoadingCities(true);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://localhost:3000/api/material-center/countries/${country}/cities`,
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };

      const response = await axios.request(config);
      
      if (response.data && response.data.cities) {
        const citiesList = response.data.cities.map((city: string) => ({
          value: city,
          label: city
        }));
        setCities(citiesList);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, [user]);

  // Function to fetch material centers
  const fetchMaterialCenters = useCallback(async () => {
    if (!user || !user.token) return;
    
    setLoadingMaterialCenters(true);
    setMaterialCenterError(null);
    try {
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/material-center',
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };

      const response = await axios.request(config);
      
      if (response.data && response.data.materialCenters && Array.isArray(response.data.materialCenters)) {
        const materialCentersList = response.data.materialCenters.map((center: any) => ({
          value: center._id || center.id,
          label: `${center.city} - ${center.warehouseSize === 'LARGE' ? 'Large' : 'Small'} Material Center`,
          country: center.country,
          city: center.city,
          address: center.address,
          warehouseSize: center.warehouseSize
        }));
        setMaterialCenters(materialCentersList);
        
        // Log the number of material centers found for debugging
        console.log(`Found ${materialCentersList.length} material centers`);
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where response.data is directly an array
        const materialCentersList = response.data.map((center: any) => ({
          value: center._id || center.id,
          label: `${center.city} - ${center.warehouseSize === 'LARGE' ? 'Large' : 'Small'} Material Center`,
          country: center.country,
          city: center.city,
          address: center.address,
          warehouseSize: center.warehouseSize
        }));
        setMaterialCenters(materialCentersList);
        
        console.log(`Found ${materialCentersList.length} material centers`);
      } else {
        setMaterialCenters([]);
        setMaterialCenterError('No material centers data found');
        console.log('No material centers data found in response');
      }
    } catch (error) {
      console.error('Error fetching material centers:', error);
      setMaterialCenters([]);
      setMaterialCenterError('Failed to load material centers');
    } finally {
      setLoadingMaterialCenters(false);
    }
  }, [user]);

  // Function to get filtered material centers based on selected country and city
  const getFilteredMaterialCenters = useCallback(() => {
    if (!materialCenters.length) return [];
    
    let filtered = materialCenters;
    
    // Filter by country if selected
    if (selectedCountry) {
      filtered = filtered.filter(center => center.country === selectedCountry);
    }
    
    // Filter by city if selected
    if (selectedCity) {
      filtered = filtered.filter(center => center.city === selectedCity);
    }
    
    return filtered;
  }, [materialCenters, selectedCountry, selectedCity]);

  // Handle country selection
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity(''); // Reset city when country changes
    setSelectedMaterialCenter(''); // Reset material center when country changes
    if (country) {
      fetchCities(country);
    } else {
      setCities([]);
    }
  };

  // Handle city selection
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedMaterialCenter(''); // Reset material center when city changes
  };

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
    fetchSuppliers(); // Call fetchSuppliers on component mount
    fetchMaterialCenters(); // Call fetchMaterialCenters on component mount
  }, [fetchCountries, fetchSuppliers, fetchMaterialCenters]);

  // Clear selected material center if it's no longer in filtered options
  useEffect(() => {
    const filteredCenters = getFilteredMaterialCenters();
    if (selectedMaterialCenter && !filteredCenters.find(center => center.value === selectedMaterialCenter)) {
      setSelectedMaterialCenter('');
    }
  }, [selectedMaterialCenter, getFilteredMaterialCenters]);

  // Function to fetch inventory data based on type - moved before useEffect
  const fetchInventoryData = useCallback(async (type: 'both' | 'company' | 'supplier') => {
    if (!user || !user.token) {
      setError(true);
      return;
    }
    
    setLoading(true);
    setError(false);
    
    try {
      const url = `http://localhost:3000/api/offer-list/inventory-products?inventoryType=${type}`;
      
      const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };

      const response = await axios.request(config);
      
      // Process the response data
      if (response.data) {
        if (type === 'both' || type === 'supplier') {
          if (response.data.supplierInventory) {
            const mappedSupplierData = response.data.supplierInventory.map((item: any) => ({
              ...item,
              id: item._id || item.id,
              selected: offerList.some((offerItem: OfferListItem) => 
                (offerItem.id === (item._id || item.id)) && 
                offerItem.source.includes('Supplier')
              )
            }));
            setSupplierInventory(mappedSupplierData);
          } else {
            setSupplierInventory([]);
          }
        }
        
        if (type === 'both' || type === 'company') {
          if (response.data.companyInventory) {
            const mappedCompanyData = response.data.companyInventory.map((item: any) => ({
              ...item,
              id: item._id || item.id,
              selected: offerList.some((offerItem: OfferListItem) => 
                (offerItem.id === (item._id || item.id)) && 
                offerItem.source === 'Company Inventory'
              )
            }));
            setCompanyInventory(mappedCompanyData);
          } else {
            setCompanyInventory([]);
          }
        }
      }

    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setError(true);
      
      // Reset the inventory data
      if (type === 'both' || type === 'supplier') {
        setSupplierInventory([]);
      }
      
      if (type === 'both' || type === 'company') {
        setCompanyInventory([]);
      }
    } finally {
      setLoading(false);
    }
  }, [user, offerList]);

  // Fetch inventory data when inventory type changes
  useEffect(() => {
    fetchInventoryData(inventoryType);
  }, [inventoryType, user, fetchInventoryData]);

  const addToOfferList = (id: string, source: 'supplier' | 'company') => {
    const items = source === 'supplier' ? supplierInventory : companyInventory;
    const item = items.find(item => item.id === id || item._id === id);
    
    if (item) {
      const itemId = item.id || item._id || '';
      
      if (item.selected) {
        // Remove from offer list
        const updatedOfferList = offerList.filter((offerItem: OfferListItem) => 
          !(offerItem.id === itemId && offerItem.source.includes(source === 'supplier' ? 'Supplier' : 'Company'))
        );
        updateOfferList(updatedOfferList);
      } else {
        // Add to offer list
        const newItem: OfferListItem = {
          id: itemId,
          name: item.itemDetails?.name || 'Unknown Item',
          quantity: item.stockInfo?.quantity || item.quantity || 'N/A',
          price: item.stockInfo?.pricing?.priceA || item.price || 'N/A',
          sex: item.itemDetails?.sex || 'N/A',
          source: source === 'supplier' ? 
            `Supplier ${item.supplierName || 'Unknown'}` : 
            'Company Inventory'
        };
        updateOfferList([...offerList, newItem]);
      }
      
      // Toggle selected state for the specific item
      if (source === 'supplier') {
        const updatedInventory = supplierInventory.map(i => 
          (i.id === itemId || i._id === itemId) ? { ...i, selected: !i.selected } : i
        );
        setSupplierInventory(updatedInventory);
      } else {
        const updatedInventory = companyInventory.map(i => 
          (i.id === itemId || i._id === itemId) ? { ...i, selected: !i.selected } : i
        );
        setCompanyInventory(updatedInventory);
      }
    }
  };

  // Function to refresh the modal content when inventory changes
  const refreshModalContent = useCallback(() => {
    if (modalOpen) {
      if (modalTitle.includes('Supplier')) {
        setModalContent(
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Item Details</th>
                <th className="p-3 text-left">Supplier Name</th>
                <th className="p-3 text-left">Quantity Available</th>
                <th className="p-3 text-left">Lowest Price</th>
                <th className="p-3 text-left">Sex</th>
              </tr>
            </thead>
            <tbody>
              {supplierInventory.map(item => (
                <SupplierInventoryRow 
                  key={item.id || item._id} 
                  item={item} 
                  onSelect={(id) => addToOfferList(id, 'supplier')} 
                />
              ))}
            </tbody>
          </table>
        );
      } else {
        setModalContent(
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left"></th>
                <th className="p-3 text-left">Item Details</th>
                <th className="p-3 text-left">EAN Code</th>
                <th className="p-3 text-left">Quantity Available</th>
                <th className="p-3 text-left">Lowest Price</th>
                <th className="p-3 text-left">Sex</th>
              </tr>
            </thead>
            <tbody>
              {companyInventory.map(item => (
                <CompanyInventoryRow 
                  key={item.id || item._id} 
                  item={item} 
                  onSelect={(id) => addToOfferList(id, 'company')} 
                />
              ))}
            </tbody>
          </table>
        );
      }
    }
  }, [modalOpen, modalTitle, supplierInventory, companyInventory, addToOfferList]);

  // Add useEffect to refresh modal content when inventory or offerList changes
  useEffect(() => {
    refreshModalContent();
  }, [supplierInventory, companyInventory, offerList, refreshModalContent]);

  const removeFromOfferList = (id: string) => {
    const itemToRemove = offerList.find(item => item.id === id);
    if (!itemToRemove) return;
    
    const updatedOfferList = offerList.filter(item => item.id !== id);
    updateOfferList(updatedOfferList);
    
    // Determine if item is from supplier or company inventory
    const isSupplier = itemToRemove.source.includes('Supplier');
    
    // Update selected state in appropriate inventory
    if (isSupplier) {
      setSupplierInventory(supplierInventory.map(i => 
        i.id === id ? { ...i, selected: false } : i
      ));
    } else {
      setCompanyInventory(companyInventory.map(i => 
        i.id === id ? { ...i, selected: false } : i
      ));
    }
  };

  // Function to handle generating the offer list
  const handleGenerateOfferList = async () => {
    if (!user || !user.token) {
      setSubmitError("Authentication required");
      return;
    }

    if (offerList.length === 0) {
      setSubmitError("Please add at least one product to the offer list");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Extract product IDs from the offer list
      const productIds = offerList.map(item => item.id);

      // Prepare the request data
      const data = JSON.stringify({
        name: "vishnu",
        productIds: productIds,
        userId: user.id,
        showPlusWithQuantity: showProductQuantity
      });

      // Configure the request
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/api/offer-list',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        data: data
      };

      // Make the API call
      const response = await axios.request(config);
      
      console.log("Offer list created successfully:", response.data);
      
      // Navigate to the offers page on success
      router.push('/inventory/offer-list/offers');
      
    } catch (error) {
      console.error("Error creating offer list:", error);
      setSubmitError("Failed to create offer list. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Open modal with all inventory items
  const openViewAllModal = (type: 'supplier' | 'company') => {
    if (type === 'supplier') {
      setModalTitle('All Supplier Inventory');
      setModalContent(
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">Item Details</th>
              <th className="p-3 text-left">Supplier Name</th>
              <th className="p-3 text-left">Quantity Available</th>
              <th className="p-3 text-left">Lowest Price</th>
              <th className="p-3 text-left">Sex</th>
            </tr>
          </thead>
          <tbody>
            {supplierInventory.map(item => (
              <SupplierInventoryRow 
                key={item.id || item._id} 
                item={item} 
                onSelect={(id) => addToOfferList(id, 'supplier')} 
              />
            ))}
          </tbody>
        </table>
      );
    } else {
      setModalTitle('All Company Inventory');
      setModalContent(
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left"></th>
              <th className="p-3 text-left">Item Details</th>
              <th className="p-3 text-left">EAN Code</th>
              <th className="p-3 text-left">Quantity Available</th>
              <th className="p-3 text-left">Lowest Price</th>
              <th className="p-3 text-left">Sex</th>
            </tr>
          </thead>
          <tbody>
            {companyInventory.map(item => (
              <CompanyInventoryRow 
                key={item.id || item._id} 
                item={item} 
                onSelect={(id) => addToOfferList(id, 'company')} 
              />
            ))}
          </tbody>
        </table>
      );
    }
    setModalOpen(true);
  };

  // Get limited items for display (only 4 items)
  const getLimitedItems = (items: InventoryItem[]) => {
    return items.slice(0, 4);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 pr-0 lg:pr-4">
          <h2 className="text-lg font-medium mb-4">Create new list</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div>
                  <span className="text-sm font-medium block mb-1">Offer List Number-{offerListNumber}</span>
                </div>
                <div>
                  <span className="text-sm font-medium block mb-1">Date- {date}</span>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Offer List Name"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full mb-2"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <button className="bg-teal-700 hover:bg-teal-800 text-white py-2 px-6 rounded flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </button>
              
              <div className="flex items-center">
                <button className="border border-gray-300 rounded p-2">
                  <AlignLeft className="w-5 h-5" />
                </button>
                <span className="ml-1 mt-2">Notes</span>
              </div>
            </div>
          </div>
          
          {/* First row of dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Dropdown 
              label="Select Currency" 
              options={currencyOptions}
              value={selectedCurrency}
              onChange={setSelectedCurrency}
            />
            <div className="relative">
              <Dropdown 
                label={loadingSuppliers ? "Loading suppliers..." : supplierError ? supplierError : suppliers.length === 0 ? "No suppliers available" : "Select Supplier to (exclude)"} 
                options={suppliers}
                value={selectedSupplier}
                onChange={setSelectedSupplier}
                disabled={loadingSuppliers || suppliers.length === 0 || !!supplierError}
              />
              {supplierError && (
                <button 
                  onClick={fetchSuppliers}
                  className="absolute right-0 top-0 text-xs text-teal-600 hover:text-teal-800 underline mt-1"
                  disabled={loadingSuppliers}
                >
                  Retry
                </button>
              )}
            </div>
          </div>
          
          {/* Second row of dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Dropdown 
              label="Country" 
              options={countries}
              value={selectedCountry}
              onChange={handleCountryChange}
            />
            <Dropdown 
              label={loadingCities ? "Loading cities..." : "City"} 
              options={cities}
              value={selectedCity}
              onChange={handleCityChange}
              disabled={!selectedCountry || loadingCities}
            />
          </div>
          
          {/* Third row of dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Dropdown 
                label={loadingMaterialCenters ? "Loading material centers..." : materialCenterError ? materialCenterError : getFilteredMaterialCenters().length === 0 ? "No material centers available" : "Large Material Center"} 
                options={getFilteredMaterialCenters()}
                value={selectedMaterialCenter}
                onChange={setSelectedMaterialCenter}
                disabled={loadingMaterialCenters || getFilteredMaterialCenters().length === 0 || !!materialCenterError}
              />
              {materialCenterError && (
                <button 
                  onClick={fetchMaterialCenters}
                  className="absolute right-0 top-0 text-xs text-teal-600 hover:text-teal-800 underline mt-1"
                  disabled={loadingMaterialCenters}
                >
                  Retry
                </button>
              )}
            </div>
            <Dropdown 
              label="Select Price" 
              options={priceOptions}
              value={selectedPrice}
              onChange={setSelectedPrice}
            />
          </div>
          
          {/* Radio buttons */}
          <div className="flex space-x-8 mb-6">
            <label className="flex items-center">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                inventoryType === 'both' ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
              }`}>
                {inventoryType === 'both' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <span className="ml-2 text-gray-700">Both</span>
              <input 
                type="radio" 
                className="hidden" 
                checked={inventoryType === 'both'} 
                onChange={() => setInventoryType('both')} 
              />
            </label>
            
            <label className="flex items-center">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                inventoryType === 'company' ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
              }`}>
                {inventoryType === 'company' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <span className="ml-2 text-gray-700">Company Inventory</span>
              <input 
                type="radio" 
                className="hidden" 
                checked={inventoryType === 'company'} 
                onChange={() => setInventoryType('company')} 
              />
            </label>
            
            <label className="flex items-center">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                inventoryType === 'supplier' ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
              }`}>
                {inventoryType === 'supplier' && (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>
              <span className="ml-2 text-gray-700">Supplier Inventory</span>
              <input 
                type="radio" 
                className="hidden" 
                checked={inventoryType === 'supplier'} 
                onChange={() => setInventoryType('supplier')} 
              />
            </label>
          </div>
          
          {/* Final row */}
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="relative w-full md:w-auto mb-4 md:mb-0">
              <Dropdown 
                label="Select Inco Terms" 
                className="w-full md:w-60"
                options={incoTermsOptions}
                value={selectedIncoTerms}
                onChange={setSelectedIncoTerms}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-700">Show Product Quantity (120+)</span>
              <div 
                className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
                  showProductQuantity ? 'bg-teal-700 justify-end' : 'bg-gray-300 justify-start'
                }`}
                onClick={() => setShowProductQuantity(!showProductQuantity)}
              >
                <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
          
          {/* Loading indicator */}
          {loading && (
            <div className="text-center p-4">
              <p>Loading inventory data...</p>
            </div>
          )}
          
          {/* Error message */}
          {error && (
            <div className="text-center p-4 text-red-500">
              <p>Failed to fetch inventory data. Please try again later.</p>
            </div>
          )}
          
          {/* Supplier Inventory Table - Limited to 4 items */}
          {!loading && !error && (inventoryType === 'both' || inventoryType === 'supplier') && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-medium">Supplier Inventory</h2>
                <button 
                  className="text-teal-700 text-sm"
                  onClick={() => openViewAllModal('supplier')}
                >
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                {supplierInventory.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left"></th>
                        <th className="p-3 text-left">Item Details</th>
                        <th className="p-3 text-left">Supplier Name</th>
                        <th className="p-3 text-left">Quantity Available</th>
                        <th className="p-3 text-left">Lowest Price</th>
                        <th className="p-3 text-left">Sex</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getLimitedItems(supplierInventory).map(item => (
                        <SupplierInventoryRow 
                          key={item.id || item._id} 
                          item={item} 
                          onSelect={(id) => addToOfferList(id, 'supplier')} 
                        />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center p-4">No supplier inventory items available</p>
                )}
              </div>
            </div>
          )}
          
          {/* Company Inventory Table - Limited to 4 items */}
          {!loading && !error && (inventoryType === 'both' || inventoryType === 'company') && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-medium">Company Inventory</h2>
                <button 
                  className="text-teal-700 text-sm"
                  onClick={() => openViewAllModal('company')}
                >
                  View all
                </button>
              </div>
              <div className="overflow-x-auto">
                {companyInventory.length > 0 ? (
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left"></th>
                        <th className="p-3 text-left">Item Details</th>
                        <th className="p-3 text-left">EAN Code</th>
                        <th className="p-3 text-left">Quantity Available</th>
                        <th className="p-3 text-left">Lowest Price</th>
                        <th className="p-3 text-left">Sex</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getLimitedItems(companyInventory).map(item => (
                        <CompanyInventoryRow 
                          key={item.id || item._id} 
                          item={item} 
                          onSelect={(id) => addToOfferList(id, 'company')} 
                        />
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center p-4">No company inventory items available</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full lg:w-1/2 lg:border-l lg:pl-4">
          <h2 className="text-xl font-medium mb-6">Offer List</h2>
          
          {offerList.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <p>Add Products to create offer List.</p>
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {offerList.map(item => (
                <OfferListItem 
                  key={item.id} 
                  item={item} 
                  onRemove={removeFromOfferList}
                />
              ))}
              
              {submitError && (
                <div className="text-red-500 mt-4 mb-2">
                  {submitError}
                </div>
              )}
              
              <button 
                className={`w-full bg-teal-700 hover:bg-teal-800 text-white py-3 px-4 rounded mt-6 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                onClick={handleGenerateOfferList}
                disabled={submitting}
              >
                {submitting ? 'Generating...' : 'Generate Offer List'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal for View All */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle}
      >
        {modalContent}
      </Modal>
    </div>
  );
}