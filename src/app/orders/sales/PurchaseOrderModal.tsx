import React, { useState } from "react";
import { X } from "lucide-react";
import ProformaInvoiceModal from "./ProformaInvoiceModel";

export default function PurchaseOrderModal({ onClose }: { onClose: () => void }) {
  const [showProformaModal, setShowProformaModal] = useState(false);

  const handleManuallyAddClick = () => {
    setShowProformaModal(true);
  };

  const handleProformaClose = () => {
    setShowProformaModal(false);
    onClose();
  };

  if (showProformaModal) {
    return <ProformaInvoiceModal onClose={handleProformaClose} />;
  }

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Purchase</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-col gap-8">
          <button
            onClick={handleManuallyAddClick}
            className="border rounded-lg p-6 flex flex-col items-center gap-3 hover:bg-gray-50"
          >
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-lg font-medium">Manually Add Products</span>
          </button>
          
          <button
            className="border rounded-lg p-6 flex flex-col items-center gap-3 hover:bg-gray-50"
          >
            <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <span className="text-lg font-medium">Upload File</span>
          </button>
        </div>
      </div>
    </div>
  );
}