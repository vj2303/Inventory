'use client'
import { useRouter } from 'next/navigation';
import React from 'react';

const SupplierTable = ({ data }) => {
  const router = useRouter();
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left border-b">Supplier Name</th>
            <th className="py-3 px-4 text-left border-b">EAN code</th>
            <th className="py-3 px-4 text-left border-b">Item Details</th>
            <th className="py-3 px-4 text-left border-b">Quantity</th>
            <th className="py-3 px-4 text-left border-b">Product Price (Currency)</th>
            <th className="py-3 px-4 text-left border-b">Total Stock Value</th>
            <th className="py-3 px-4 text-left border-b">Last Stock List</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50" onClick={()=>router.push(`/inventory/supplier/${item.id}`)} >
              <td className="py-3 px-4">{item.supplierName}</td>
              <td className="py-3 px-4">{item.eanCode}</td>
              <td className="py-3 px-4">{item.itemDetails}</td>
              <td className="py-3 px-4">{item.quantity}</td>
              <td className="py-3 px-4">{item.productPrice.toFixed(2)}</td>
              <td className="py-3 px-4">{item.totalStockValue.toFixed(2)}</td>
              <td className="py-3 px-4">{item.lastStockList}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplierTable;