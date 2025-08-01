import { useState } from 'react';
import { TransferRecord, TabState, SortField, SortOrder, StatusFilter } from '../types';
import Link from 'next/link';

interface TransferRecordsTableProps {
  records: TransferRecord[];
  activeTab: TabState;
  statusFilters: StatusFilter;
  sortField: SortField;
  sortOrder: SortOrder;
}

export default function TransferRecordsTable({ 
  records, 
  activeTab,
  statusFilters,
  sortField,
  sortOrder
}: TransferRecordsTableProps) {
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  const toggleActionMenu = (recordId: string, e: React.MouseEvent) => {
    // Prevent the event from bubbling up and causing table scroll
    e.preventDefault();
    e.stopPropagation();
    
    if (showActionMenu === recordId) {
      setShowActionMenu(null);
    } else {
      setShowActionMenu(recordId);
    }
  };

  // Close action menu when clicking outside
  const handleGlobalClick = () => {
    if (showActionMenu) {
      setShowActionMenu(null);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'In Warehouse':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out For Delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter records based on status filters
  const filteredRecords = records.filter(record => statusFilters[record.status]);

  // Sort records based on sort field and order
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortField === 'date') {
      const dateA = new Date(a.createdOn).getTime();
      const dateB = new Date(b.createdOn).getTime();
      return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  return (
    <div className="overflow-x-auto flex-grow" onClick={handleGlobalClick}>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Request I'D</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Created On</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Created By</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Source</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Destination</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">No. OF Items</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedRecords.map((record) => (
            <tr key={`${record.id}-${record.createdBy}`} className="hover:bg-gray-50">
              <td className="py-4 px-4 text-sm">{record.id}</td>
              <td className="py-4 px-4 text-sm">{record.createdOn}</td>
              <td className="py-4 px-4 text-sm">{record.createdBy}</td>
              <td className="py-4 px-4 text-sm">{record.source}</td>
              <td className="py-4 px-4 text-sm">{record.destination}</td>
              <td className="py-4 px-4 text-sm">{record.numberOfItems}</td>
              <td className="py-4 px-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(record.status)}`}>
                  {record.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm">
                <div className="flex items-center relative">
                 <Link href={'/inventory/stock/details'}>
                  <button
                      className="text-blue-500 hover:text-blue-700 mr-4">
                      View Details
                    </button>
                 </Link>
                  <button
                    onClick={(e) => toggleActionMenu(record.id, e)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                    </svg>
                  </button>
                  
                  {showActionMenu === record.id && (
                    <div 
                      className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-10 border"
                      style={{ top: 'calc(100% + 5px)' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Print clicked');
                            setShowActionMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Print
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Export clicked');
                            setShowActionMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}