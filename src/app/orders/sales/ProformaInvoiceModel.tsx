import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import ProformaInvoiceStep2 from "./ProformaInvoiceStep2";

export default function ProformaInvoiceModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customer: "",
    deliveryAddress: "",
    payment: "Credit- 20%",
    proformaType: "EXPORT",
    marka: "XYZ YT",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => {
    setCurrentStep(2);
  };

  if (currentStep === 2) {
    return <ProformaInvoiceStep2 onClose={onClose} formData={formData} />;
  }

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Proforma Invoice</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
            <input
              type="text"
              name="customer"
              placeholder="Type Name"
              value={formData.customer}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
            <div className="relative">
              <select 
                name="deliveryAddress"
                className="w-full border rounded-md p-2 appearance-none"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              >
                <option value="">Select</option>
                <option value="address1">Address 1</option>
                <option value="address2">Address 2</option>
              </select>
              <ChevronDown size={20} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment</label>
            <input
              type="text"
              name="payment"
              value={formData.payment}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Proforma Type</label>
            <div className="relative">
              <input
                type="text"
                name="proformaType"
                value={formData.proformaType}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
              <div className="absolute inset-x-0 top-full mt-1 bg-white border rounded-md shadow-lg z-10">
                <div className="p-2 bg-teal-100 text-teal-800">Export</div>
                <div className="p-2 hover:bg-gray-100">Local</div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marka</label>
            <input
              type="text"
              name="marka"
              value={formData.marka}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Note</label>
            <textarea
              name="notes"
              placeholder="Type Here"
              value={formData.notes}
              onChange={handleInputChange}
              className="w-full border rounded-md p-2 h-24"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-8 gap-4">
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
  );
}