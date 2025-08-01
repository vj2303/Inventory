'use client';
import { filteredProduct } from '@/app/dashboard/page';
import React, { useRef } from 'react';
import Popup, { PopupRef } from './Popup';
import { ArrowRight } from 'lucide-react';

interface props {
    data: filteredProduct[];
    showDetails: (id: string) => void;
}

const InventoryList = ({ data, showDetails }: props) => {
    const popupRef = useRef<PopupRef>(null);

    const handleShowDetails = (id: string) => {
        showDetails(id);
        popupRef.current?.open();
    };

    return (
        <div>
            <div className="flex gap-5 flex-wrap justify-between">
                {data.map((ele) => (
                    <Card product={ele} key={ele.name} handleShowDetails={handleShowDetails} />
                ))}
            </div>
            <Popup ref={popupRef} />
        </div>
    );
};

const Card = ({
    product,
    handleShowDetails,
}: {
    product: filteredProduct;
    handleShowDetails: (id: string) => void;
}) => {
    const { name, cost } = product;

    return (
        <div className="rounded-xl border border-[#E1E8ED] p-4 bg-white flex flex-col justify-between shadow-sm w-full sm:w-[48%] md:w-[30%] relative">
            {/* Top Section */}
            <div className="flex justify-between items-start mb-4">
                {/* Circle image placeholder */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-900 to-black"></div>

                {/* Price */}
                <div className="text-right">
                    <p className="text-lg font-bold text-black">${cost}</p>
                    <p className="text-xs text-[#B8754A]">Lowest price</p>
                </div>
            </div>

            {/* Product name */}
            <p className="text-black font-semibold text-base mb-4">{name}</p>

            {/* Button */}
            <button
                onClick={() => handleShowDetails(product._id)}
                className="bg-[#7DB6B1] text-white text-sm px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#69a19c] transition"
            >
                Vendor Details <ArrowRight size={16} />
            </button>
        </div>
    );
};

export default InventoryList;
