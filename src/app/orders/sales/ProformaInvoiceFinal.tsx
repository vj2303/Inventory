// ProformaInvoiceFinal.tsx
import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface FormDataProps {
  customer: string;
  deliveryAddress: string;
  payment: string;
  proformaType: string;
  marka: string;
  notes: string;
}

interface ProductItem {
  name: string;
  stock: number;
  price: number;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export default function ProformaInvoiceFinal({ 
  onClose, 
  formData,
  selectedItems
}: { 
  onClose: () => void;
  formData: FormDataProps;
  selectedItems: string[];
}) {
  // Initial product
  const initialProduct: ProductItem = {
    name: "A&F AUTHENTIC NIGHT M TESTER 100ML",
    stock: 240,
    price: 80,
    quantity: 40,
    unitCost: 50.00,
    totalCost: 2000.00
  };

  // State for products
  const [products, setProducts] = useState<ProductItem[]>([initialProduct]);
  
  // Calculate order values
  const subtotal = products.reduce((sum, product) => sum + product.totalCost, 0);
  const discountPercentage = 20;
  const discountAmount = (subtotal * discountPercentage) / 100;
  const tax = 221.88;
  const vat = 0.00;
  const total = subtotal - discountAmount + tax + vat;

  // Function to handle quantity change
  const handleQuantityChange = (index: number, value: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].quantity = value;
    updatedProducts[index].totalCost = value * updatedProducts[index].unitCost;
    setProducts(updatedProducts);
  };

  // Function to handle unit cost change
  const handleUnitCostChange = (index: number, value: number) => {
    const updatedProducts = [...products];
    updatedProducts[index].unitCost = value;
    updatedProducts[index].totalCost = value * updatedProducts[index].quantity;
    setProducts(updatedProducts);
  };

  // Function to remove a product
  const removeProduct = (index: number) => {
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
  };

  // Function to add a product (placeholder)
  const addProduct = () => {
    // In a real application, this would open a product selector or form
    alert("Add product functionality would be implemented here");
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">Proforma Number- SHM-P24-02047</h2>
            <p className="text-gray-500 text-sm">Date- 5 Jan 2025</p>
          </div>
          <div className="flex gap-3">
            <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50">
              Export
            </button>
            <button className="bg-teal-700 text-white rounded-md px-4 py-2 hover:bg-teal-800">
              Send To Customer
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-6 rounded-md">
            <h3 className="font-bold text-lg mb-4">Billed To</h3>
            
            <div className="mb-3">
              <p className="text-sm font-medium">Name:</p>
              <p>ABC XY</p>
            </div>
            
            <div className="mb-3">
              <p className="text-sm font-medium">Address:</p>
              <p>San Francisco, CA 92102, United States of America</p>
            </div>
            
            <div>
              <p className="text-sm font-medium">Marka:</p>
              <p>KJHCN</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-md">
            <h3 className="font-bold text-lg mb-4">Notes</h3>
            <p className="text-gray-600">-</p>
          </div>
        </div>
        
        <div className="mb-6 bg-white rounded-md overflow-hidden border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Item Details</th>
                <th className="px-4 py-3 text-left">Quantity</th>
                <th className="px-4 py-3 text-left">Unit Cost($)</th>
                <th className="px-4 py-3 text-left">Total Cost($)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">In Stock : {product.stock}</p>
                      <p className="text-sm text-gray-500">Price : $ {product.price}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <input 
                      type="number" 
                      value={product.quantity} 
                      onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                      className="border rounded-md px-3 py-2 w-24"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input 
                      type="number" 
                      value={product.unitCost.toFixed(2)} 
                      onChange={(e) => handleUnitCostChange(index, parseFloat(e.target.value) || 0)}
                      className="border rounded-md px-3 py-2 w-24"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-medium">{product.totalCost.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => removeProduct(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="py-3 px-4 border-t">
            <button onClick={addProduct} className="flex items-center text-teal-700 hover:text-teal-800">
              <Plus size={20} />
              <span className="ml-1">Add Products</span>
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">Order Summary</h3>
            <button className="text-teal-700 border border-teal-700 rounded-md px-3 py-1 text-sm hover:bg-teal-50 flex items-center">
              <Plus size={16} />
              <span className="ml-1">Add field</span>
            </button>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-600">Sub Total</p>
              <p className="font-medium">${subtotal.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-gray-600">Discount</p>
                <button className="ml-2 bg-gray-200 rounded-full p-1">
                  <Plus size={16} />
                </button>
              </div>
              <p className="font-medium">(20%) - ${discountAmount.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-gray-600">Vat</p>
                <button className="ml-2 bg-gray-200 rounded-full p-1">
                  <Plus size={16} />
                </button>
              </div>
              <p className="font-medium">${vat.toFixed(2)}</p>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <p className="text-gray-600">Tax</p>
                <button className="ml-2 bg-gray-200 rounded-full p-1">
                  <Plus size={16} />
                </button>
              </div>
              <p className="font-medium">+${tax.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder="Type Field" 
                className="border rounded-md px-3 py-2 w-40"
              />
              <input 
                type="text" 
                placeholder="" 
                className="border rounded-md px-3 py-2 ml-auto w-40"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center pt-4 border-t">
            <h3 className="font-bold text-lg">Total</h3>
            <p className="font-bold text-xl">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}