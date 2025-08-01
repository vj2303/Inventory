'use client'
import { RootState } from '@/app/redux';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';

export interface PopupRef {
    open: () => void;
    close: () => void;
}

const Popup = forwardRef<PopupRef>((props, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const { currentProduct } = useSelector((state: RootState) => state.products);

    useImperativeHandle(ref, () => ({
        open: () => dialogRef.current?.showModal(),
        close: () => dialogRef.current?.close(),
    }));

    return (
        <dialog
            ref={dialogRef}
            className="rounded-xl w-[90%] max-w-4xl p-8 bg-white shadow-xl 
                    top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fixed overflow-auto relative"
        >
            {/* Close Button */}
            <button
                className="absolute top-4 right-4 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm hover:bg-gray-800"
                onClick={() => dialogRef.current?.close()}
                aria-label="Close"
            >
                ✕
            </button>

            <h2 className="text-2xl font-extrabold text-black mb-6">
                {currentProduct?.itemDetails.name}
            </h2>

            {/* Supplier Section */}
            <div className="border border-[#E2ECF9] rounded-xl mb-6 p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Suppliers Details</h4>
                <div className="space-y-3 text-[15px]">
                    <p className="text-[#858D9D] font-medium">
                        Name: <span className="ml-4 text-[#2A2E33] font-bold">{currentProduct?.supplier.name}</span>
                    </p>
                    <p className="text-[#858D9D] font-medium">
                        Manager: <span className="ml-4 text-[#2A2E33]">{currentProduct?.supplier.manager}</span>
                    </p>
                    <p className="text-[#858D9D] font-medium">
                        Phone No.: <span className="ml-4 text-blue-600">{currentProduct?.supplier.phoneNo}</span>
                    </p>
                    <p className="text-[#858D9D] font-medium">
                        E-mail: <span className="ml-4 text-[#2A2E33]">{currentProduct?.supplier.email || '-'}</span>
                    </p>
                    <p className="text-[#858D9D] font-medium">
                        Address: <span className="ml-4 text-[#2A2E33]">{currentProduct?.supplier.address}</span>
                    </p>
                </div>
            </div>

            {/* Stock Section */}
            <div className="border border-[#E2ECF9] rounded-xl p-6">
                <h4 className="text-lg font-semibold text-black mb-4">Stock Details</h4>
                <div className="space-y-3 text-[15px]">
                    <p className="text-[#858D9D] font-medium">
                        Quantity: <span className="ml-4 text-[#2A2E33] font-semibold">{currentProduct?.stockInfo?.quantity}</span>
                    </p>
                    <p className="text-[#858D9D] font-medium">
                        Cost ($): <span className="ml-4 text-[#2A2E33] font-semibold">{currentProduct?.stockInfo?.cost.toFixed(2)}</span>
                    </p>
                    <p className="text-[#858D9D] font-medium">
                        Total Value: <span className="ml-4 text-[#2A2E33] font-semibold">{currentProduct?.stockInfo?.totalValue.toFixed(2)}</span>
                    </p>
                </div>
            </div>
        </dialog>
    );
});

Popup.displayName = 'Popup';
export default Popup;
