import React from 'react';

interface OfferCardProps {
  materialCenterAddress: string;
  productName: string;
  quantity: string;
  lowestPrice: string;
  supplierInfo: string;
  onReject: () => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  materialCenterAddress,
  productName,
  quantity,
  lowestPrice,
  supplierInfo,
  
}) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-600">{materialCenterAddress}</div>
        <button 
          className="text-red-500 hover:text-red-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </button>
      </div>
      
      <div className="font-semibold text-lg">{productName}</div>
      
      <div className="flex justify-between mt-2">
        <span className="text-green-600 text-sm">{quantity}</span>
        <span className="text-amber-500 text-sm">{lowestPrice}</span>
      </div>
      
      <div className="text-sm text-gray-500 mt-2">{supplierInfo}</div>
    </div>
  );
};

export default OfferCard;