import React, { useState } from "react";
import { X, ChevronDown, Search } from "lucide-react";
import ProformaInvoiceFinal from "./ProformaInvoiceFinal";

interface FormDataProps {
  customer: string;
  deliveryAddress: string;
  payment: string;
  proformaType: string;
  marka: string;
  notes: string;
}

export default function ProformaInvoiceStep2({ 
  onClose, 
  formData 
}: { 
  onClose: () => void;
  formData: FormDataProps;
}) {
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [step2Data, setStep2Data] = useState({
    fromCurrency: "INR",
    toCurrency: "Dollars",
    country: "",
    city: "",
    materialCenter: "Large Material Center",
    incoTerms: "",
    inventoryType: "both" // both, company, supplier
  });

  const handleNext = () => {
    setCurrentStep(3);
  };

  const handleItemSelect = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  if (currentStep === 3) {
    return <ProformaInvoiceFinal onClose={onClose} formData={formData} selectedItems={selectedItems} />;
  }

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Proforma Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-md mb-6">
          <h3 className="font-medium text-lg mb-4">Currency Conversion</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <div className="relative">
                <select 
                  className="w-full border rounded-md p-2 appearance-none"
                  value={step2Data.fromCurrency}
                  onChange={(e) => setStep2Data({ ...step2Data, fromCurrency: e.target.value })}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <div className="relative">
                <select 
                  className="w-full border rounded-md p-2 appearance-none"
                  value={step2Data.toCurrency}
                  onChange={(e) => setStep2Data({ ...step2Data, toCurrency: e.target.value })}
                >
                  <option value="Dollars">Dollars</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
        
        <h3 className="font-medium text-lg mb-4">Add Products to Order</h3>
        
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search products"
            className="w-full border rounded-md p-2 pl-10"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <select className="w-full border rounded-md p-2 appearance-none">
              <option>Country</option>
              <option>USA</option>
              <option>India</option>
              <option>Germany</option>
            </select>
            <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="relative">
            <select className="w-full border rounded-md p-2 appearance-none">
              <option>City</option>
              <option>New York</option>
              <option>Mumbai</option>
              <option>Berlin</option>
            </select>
            <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="relative">
            <select 
              className="w-full border rounded-md p-2 appearance-none"
              value={step2Data.materialCenter}
              onChange={(e) => setStep2Data({ ...step2Data, materialCenter: e.target.value })}
            >
              <option>Large Material Center</option>
              <option>Small Material Center</option>
            </select>
            <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          
          <div className="relative">
            <select className="w-full border rounded-md p-2 appearance-none">
              <option>Select Inco Terms</option>
              <option>FOB</option>
              <option>CIF</option>
              <option>EXW</option>
            </select>
            <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        
        <div className="flex mb-6">
          <label className="flex items-center mr-8">
            <input 
              type="radio" 
              name="inventoryType" 
              value="both"
              checked={step2Data.inventoryType === "both"}
              onChange={() => setStep2Data({ ...step2Data, inventoryType: "both" })}
              className="mr-2"
            />
            <span>Both</span>
          </label>
          
          <label className="flex items-center mr-8">
            <input 
              type="radio" 
              name="inventoryType"
              value="company"
              checked={step2Data.inventoryType === "company"}
              onChange={() => setStep2Data({ ...step2Data, inventoryType: "company" })}
              className="mr-2"
            />
            <span>Company Inventory</span>
          </label>
          
          <label className="flex items-center">
            <input 
              type="radio" 
              name="inventoryType"
              value="supplier"
              checked={step2Data.inventoryType === "supplier"}
              onChange={() => setStep2Data({ ...step2Data, inventoryType: "supplier" })}
              className="mr-2"
            />
            <span>Supplier Inventory</span>
          </label>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Supplier Inventory</h3>
            <button className="text-sm text-gray-500">View all</button>
          </div>
          
          <div className="bg-gray-50 rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-50 text-left">
                  <th className="p-3">Item Details</th>
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Quantity Available</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Sex</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes('gucci-supplier')}
                        onChange={() => handleItemSelect('gucci-supplier')}
                        className="mr-2" 
                      />
                      Gucci Perfume
                    </label>
                  </td>
                  <td className="p-3">Tim Jennings</td>
                  <td className="p-3 text-green-600">240</td>
                  <td className="p-3 text-amber-500">$10</td>
                  <td className="p-3">M</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes('perfume1')}
                        onChange={() => handleItemSelect('perfume1')}
                        className="mr-2" 
                      />
                      Perfume
                    </label>
                  </td>
                  <td className="p-3">Nathan Roberts</td>
                  <td className="p-3 text-green-600">120</td>
                  <td className="p-3 text-amber-500">$20</td>
                  <td className="p-3">F</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes('perfume2')}
                        onChange={() => handleItemSelect('perfume2')}
                        className="mr-2" 
                      />
                      Perfume
                    </label>
                  </td>
                  <td className="p-3">Nathan Roberts</td>
                  <td className="p-3 text-green-600">120</td>
                  <td className="p-3 text-amber-500">$20</td>
                  <td className="p-3">F</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">Company Inventory</h3>
            <button className="text-sm text-gray-500">View all</button>
          </div>
          
          <div className="bg-gray-50 rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-50 text-left">
                  <th className="p-3">Item Details</th>
                  <th className="p-3">EAN Code</th>
                  <th className="p-3">Quantity Available</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Sex</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes('gucci-company')}
                        onChange={() => handleItemSelect('gucci-company')}
                        className="mr-2" 
                      />
                      Gucci Perfume
                    </label>
                  </td>
                  <td className="p-3">556778</td>
                  <td className="p-3 text-green-600">240</td>
                  <td className="p-3 text-amber-500">$9</td>
                  <td className="p-3">M</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={selectedItems.includes('perfume-company')}
                        onChange={() => handleItemSelect('perfume-company')}
                        className="mr-2" 
                      />
                      Perfume
                    </label>
                  </td>
                  <td className="p-3">556778</td>
                  <td className="p-3 text-green-600">240</td>
                  <td className="p-3 text-amber-500">$20</td>
                  <td className="p-3">M</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-between">
          <div className="text-sm text-gray-600">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleNext}
              className="bg-teal-700 text-white rounded-md px-8 py-2 hover:bg-teal-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}