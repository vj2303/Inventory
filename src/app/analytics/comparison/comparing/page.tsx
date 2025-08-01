'use client'
import React, { useState } from 'react';
import { Trash2, FileText, ChevronDown } from 'lucide-react';

export default function VendorComparisonTool() {
  // State for the application
  const [selectedItems, setSelectedItems] = useState([]);
  const [uploadedFile] = useState({
    name: 'perfume_stocklist.xls',
    size: '200 KB',
  });

  // Product comparison data
  const [comparisonData] = useState([
    {
      id: 1,
      product: 'Perfume',
      productCode: 'JPG LA BELLE EDP SP 50ML',
      ean: '0011587',
      quantityRequired: 300,
      quantityFulfilled: 300,
      totalAveragePrice: 41.5,
      totalCost: 12600,
      vendors: [
        {
          type: 'Lowest Price',
          price: 40,
          name: 'Vendor Name',
          quantitySupplied: 100,
          totalCost: 4000
        },
        {
          type: 'Next Best',
          price: 43,
          name: 'Vendor Name',
          quantitySupplied: 200,
          remainingQuantity: true,
          totalCost: 8600
        }
      ]
    },
    {
      id: 2,
      product: 'Perfume',
      productCode: 'JPG LA BELLE EDP SP 50ML',
      ean: '0011587',
      quantityRequired: 300,
      quantityFulfilled: 300,
      vendors: [
        {
          type: 'Lowest Price',
          price: 20,
          name: 'Vendor Name',
          quantitySupplied: 300,
          totalCost: 6000
        }
      ]
    },
    {
      id: 3,
      product: 'Perfume',
      productCode: 'JPG LA BELLE EDP SP 50ML',
      ean: '0011587',
      quantityRequired: 300,
      quantityFulfilled: 300,
      totalAveragePrice: 41.5,
      totalCost: 12600,
      vendors: [
        {
          type: 'Lowest Price',
          price: 40,
          name: 'Vendor Name',
          quantitySupplied: 100,
          totalCost: 4000
        },
        {
          type: 'Next Best',
          price: 43,
          name: 'Vendor Name',
          quantitySupplied: 150,
          remainingQuantity: true,
          totalCost: 8600
        },
        {
          type: 'Next Best',
          price: 45,
          name: 'Vendor Name',
          quantitySupplied: 150,
          remainingQuantity: true,
          totalCost: 8600
        }
      ]
    }
  ]);

  // Handle select all checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(comparisonData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Handle individual item selection
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Component for the dropdown selector
  const Dropdown = ({ label, value }) => {
    return (
      <div className="relative inline-block">
        <div className="flex items-center border rounded-md p-2 min-w-40">
          <span className="text-sm text-gray-500 mr-2">{label}:</span>
          <span className="flex-grow">{value}</span>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    );
  };

  // Component for vendor pricing card
  const VendorCard = ({ type, price, vendorName, quantitySupplied, remainingQuantity, totalCost }) => {
    const isLowestPrice = type === 'Lowest Price';
    const bgColor = isLowestPrice ? 'bg-teal-400' : 'bg-white';
    const textColor = isLowestPrice ? 'text-white' : 'text-black';

    return (
      <div className="flex-1">
        <div className={`${bgColor} p-4 rounded-t-md text-center`}>
          <div className="text-sm font-medium mb-1">{type}</div>
          <div className={`text-2xl font-bold ${textColor}`}>${price}</div>
          <div className={`text-sm ${textColor}`}>{vendorName}</div>
        </div>
        <div className="border-x border-b p-4">
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm">Price Per Unit</span>
            <span className="font-medium">${price}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-sm">Quantity Supplied</span>
            <div className="text-right">
              <div className="font-medium">{quantitySupplied}</div>
              {remainingQuantity && (
                <div className="text-xs text-gray-500">(Balance Amount)</div>
              )}
            </div>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm">Total Cost</span>
            <span className="font-medium">${totalCost}</span>
          </div>
        </div>
      </div>
    );
  };

  // Component for product comparison section
  const ProductComparison = ({ item }) => {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <div className="flex-grow">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Product Name:</span>
              <span>{item.product}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className="text-sm font-medium mr-2">Quantity Required:</span>
              <span>{item.quantityRequired}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-4">
          <div className="mr-4">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleSelectItem(item.id)}
              className="h-5 w-5 rounded border-gray-300"
            />
          </div>
          <div className="flex-grow">
            <div className="font-medium">{item.productCode}</div>
            <div className="text-xs text-gray-500">EAN: {item.ean}</div>
          </div>
        </div>

        <div className="flex gap-2">
          {item.vendors.map((vendor, index) => (
            <VendorCard
              key={index}
              type={vendor.type}
              price={vendor.price}
              vendorName={vendor.name}
              quantitySupplied={vendor.quantitySupplied}
              remainingQuantity={vendor.remainingQuantity}
              totalCost={vendor.totalCost}
            />
          ))}
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <div className="flex items-center">
            <span className="font-medium mr-2">Quantity Fulfilled</span>
            <span className="text-teal-600 font-medium">{item.quantityFulfilled}/{item.quantityRequired}</span>
          </div>
          
          {item.totalAveragePrice && (
            <>
              <div className="flex items-center">
                <span className="font-medium mr-2">Total Average Price</span>
                <span className="text-teal-600 font-medium">${item.totalAveragePrice}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium mr-2">Total Cost</span>
                <span className="text-teal-600 font-medium">${item.totalCost.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className=" bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Comparison</h1>
          <p className="text-gray-600 text-sm">Vendors offering lowest price for uploaded list.</p>
        </div>

        <div className="flex items-center bg-gray-50 rounded-md p-4 mb-6">
          <div className="mr-4">
            <FileText size={20} className="text-gray-500" />
          </div>
          <div className="flex-grow">
            <div className="font-medium">{uploadedFile.name}</div>
            <div className="text-xs text-gray-500">{uploadedFile.size}</div>
            <div className="text-xs text-blue-500 cursor-pointer">Click to view</div>
          </div>
          <div>
            <Trash2 size={18} className="text-gray-400 cursor-pointer" />
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="flex space-x-4">
            <Dropdown 
              label="Currency" 
              value="USD" 
            />
            <Dropdown 
              label="Country" 
              value="India" 
            />
          </div>
          <button className="border rounded-md px-4 py-2 flex items-center text-sm">
            Export <ChevronDown size={16} className="ml-2" />
          </button>
        </div>

        <div className="flex justify-between mb-4 items-center">
          <div className="flex items-center">
            <input
              type="checkbox" 
              onChange={handleSelectAll}
              checked={selectedItems.length === comparisonData.length && comparisonData.length > 0}
              className="h-5 w-5 rounded border-gray-300 mr-2"
            />
            <span className="font-medium">Select All</span>
          </div>
          <div className="text-sm font-medium">
            Selected Items: {selectedItems.length}
          </div>
        </div>

        <div className="divide-y">
          {comparisonData.map(item => (
            <ProductComparison key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}