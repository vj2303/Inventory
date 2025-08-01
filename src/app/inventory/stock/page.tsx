'use client'
import { useState } from 'react';
import TransferRecordsTable from './TransferRecordsTable';
import DateRangePicker from '@/components/DateRangePicker';
import TabNavigation from './TabNavigation';
import { TransferRecord, TabState, SortField, SortOrder, StatusFilter } from '@/types/types';
import Link from 'next/link';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabState>('initiated');
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({
    start: '03/12/2024',
    end: '13/12/2024'
  });
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showSortMenu, setShowSortMenu] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('oldest');
  const [statusFilters, setStatusFilters] = useState<StatusFilter>({
    'In Warehouse': true,
    'In Transit': false,
    'Out For Delivery': false
  });
  
  const [records, setRecords] = useState<TransferRecord[]>([
    {
      id: 'SHM-P24-02047',
      createdOn: '5 Jan 2025',
      createdBy: 'Samarth',
      source: 'San Francisco',
      destination: 'Los Angeles',
      numberOfItems: 6,
      status: 'In Warehouse'
    },
    {
      id: 'SHM-P24-02048',
      createdOn: '5 Jan 2025',
      createdBy: 'John Doe',
      source: 'Los Angeles',
      destination: 'Los Angeles',
      numberOfItems: 6,
      status: 'In Transit'
    },
    {
      id: 'SHM-P24-02047',
      createdOn: '5 Jan 2025',
      createdBy: 'Richaa',
      source: 'Los Angeles',
      destination: 'Los Angeles',
      numberOfItems: 6,
      status: 'In Transit'
    }
  ]);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
    if (showSortMenu) setShowSortMenu(false);
  };

  const toggleSortMenu = () => {
    setShowSortMenu(!showSortMenu);
    if (showCalendar) setShowCalendar(false);
  };

  const handleSortChange = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setStatusFilters({
      ...statusFilters,
      [status]: checked
    });
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
    setShowCalendar(false);
  };

  const applySort = () => {
    setShowSortMenu(false);
  };

  const createRequest = () => {
    console.log('Create request button clicked');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="container mx-auto p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <Link href="/inventory/stock/create">
            <button
              onClick={createRequest}
              className="bg-teal-600 text-white px-4 py-2 rounded-md"
            >
              Create Request
            </button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-4">Transfer Records</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-72">
            <input
              type="text"
              placeholder="Search Reference I'd"
              className="w-full px-4 py-2 border rounded-md pl-10"
            />
            <span className="absolute left-3 top-3 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={toggleCalendar}
                className="px-4 py-2 border rounded-md flex items-center"
              >
                {dateRange.start} - {dateRange.end}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {showCalendar && (
                <DateRangePicker 
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onDateRangeChange={handleDateRangeChange}
                />
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleSortMenu}
                className="px-4 py-2 border rounded-md flex items-center"
              >
                Sort By
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
              </button>
              
              {showSortMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border">
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700">Sort by</h3>
                    
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Date</p>
                      <div className="mt-1 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={sortField === 'date' && sortOrder === 'oldest'}
                            onChange={() => handleSortChange('date', 'oldest')}
                            className="form-checkbox h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Oldest to newest</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={sortField === 'date' && sortOrder === 'newest'}
                            onChange={() => handleSortChange('date', 'newest')}
                            className="form-checkbox h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Newest to oldest</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">Status</p>
                      <div className="mt-1 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={statusFilters['In Warehouse']}
                            onChange={(e) => handleStatusFilterChange('In Warehouse', e.target.checked)}
                            className="form-checkbox h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">In Warehouse</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={statusFilters['In Transit']}
                            onChange={(e) => handleStatusFilterChange('In Transit', e.target.checked)}
                            className="form-checkbox h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">In Transit</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={statusFilters['Out For Delivery']}
                            onChange={(e) => handleStatusFilterChange('Out For Delivery', e.target.checked)}
                            className="form-checkbox h-4 w-4 text-teal-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Out For Delivery</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={applySort}
                        className="px-4 py-1 text-sm text-teal-600"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-grow flex flex-col">
          <TransferRecordsTable 
            records={records} 
            activeTab={activeTab} 
            statusFilters={statusFilters}
            sortField={sortField}
            sortOrder={sortOrder}
          />
        </div>
      </div>
    </div>
  );
}