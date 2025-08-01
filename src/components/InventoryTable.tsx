'use client';

import { filteredProduct } from '@/app/dashboard/page';
import { ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import Popup, { PopupRef } from './Popup';
import Button from './UI/Button';


interface props {
  data: filteredProduct[],
  showDetails: (id: string) => void
}

export default function InventoryTable({ data, showDetails }: props) {

  const popupRef = useRef<PopupRef>(null);

  const handleShowDetails = (id: string) => {
    showDetails(id)
    popupRef.current?.open();
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-teal-50 text-left">
          <tr className="text-sm bg-teal-50 font-semibold text-gray-800">
            <th className="px-4 py-3">Item Details</th>
            <th className="px-4 py-3">Quantity Available</th>
            <th className="px-4 py-3">Cost($)</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
              </td>
              <td className="px-4 py-3 text-green-600 font-bold text-sm">{item.quantity || "Out Of Stock"}</td>
              <td className="px-4 py-3 text-amber-500 font-semibold text-sm">
                {Array.isArray(item.cost) ? (
                  <div className="flex flex-col">
                    {item.cost.map((c, idx) => (
                      <span key={idx}>{c}</span>
                    ))}
                  </div>
                ) : item.cost ? (
                  item.cost || "Not Available"
                ) : (
                  <div className="w-16 h-6 bg-gray-300 rounded" />
                )}
              </td>
              <td className="px-4 py-3">
              <Button bg="teal" onClick={() => handleShowDetails(item._id)}>
                Vendor Details <ChevronRight className="w-4 h-4" />
              </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Popup ref={popupRef} />
    </div>
  );
}
