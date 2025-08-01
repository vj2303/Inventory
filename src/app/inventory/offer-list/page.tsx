"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, MoreVertical, ArrowUpDown } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface OfferList {
  _id: string;
  name: string;
  createdOn: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  numberOfItems: number;
}

export default function OfferListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('03/12/2024 - 13/12/2024');
  const [offerLists, setOfferLists] = useState<OfferList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only fetch data when auth is not loading and user is authenticated
    if (!authLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }
      
      fetchOfferLists();
    }
  }, [user, isAuthenticated, authLoading, router]);

  const fetchOfferLists = async () => {
    try {
      if (!user?.token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const config = {
        method: 'get',
        url: `${process.env.NEXT_PUBLIC_SERVER_HOSTNAME || 'http://localhost:3000'}/api/offer-list`,
        headers: { 
          'Authorization': `Bearer ${user.token}`
        }
      };

      const response = await axios(config);
      setOfferLists(response.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching offer lists:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch offer lists");
      setLoading(false);
    }
  };

  // Filter offer lists based on search query
  const filteredOfferLists = offerLists.filter(list => 
    list.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Show loading when auth is still being checked
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-xl">Checking authentication...</p>
      </div>
    );
  }

  // Show loading when fetching data
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <p className="text-xl">Loading offer lists...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <p>Error: {error}</p>
          <p className="mt-2">Please try again or check your authentication status.</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-3 bg-red-100 hover:bg-red-200 text-red-700 py-1 px-3 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">All Offer Lists</h1>
        <Link href="/inventory/offer-list/create">
          <button className="bg-teal-700 hover:bg-teal-800 text-white py-2 px-4 rounded">
            Create Offer list
          </button>
        </Link>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
            placeholder="Search offer list name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative w-full md:w-auto">
          <button
            className="w-full md:w-auto flex items-center justify-between border border-gray-300 rounded p-2 bg-white"
          >
            <span>{dateRange}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
        </div>
        
        <div className="relative w-full md:w-auto">
          <button
            className="w-full md:w-auto flex items-center justify-between border border-gray-300 rounded p-2 bg-white"
          >
            <span>Sort By</span>
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
      
      {filteredOfferLists.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No offer lists found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-50">
                <th className="text-left p-4 border-b">Offer List Name</th>
                <th className="text-left p-4 border-b">Created On</th>
                <th className="text-left p-4 border-b">Created By</th>
                <th className="text-left p-4 border-b">No. OF Items</th>
                <th className="text-left p-4 border-b">Action</th>
                <th className="text-left p-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOfferLists.map((list) => (
                <tr key={list._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{list.name}</td>
                  <td className="p-4">{formatDate(list.createdOn)}</td>
                  <td className="p-4">{list.createdBy?.name || 'Unknown'}</td>
                  <td className="p-4">{list.numberOfItems}</td>
                  <td className="p-4">
                    <Link href={`/offer-list/${list._id}`}>
                      <button className="text-blue-500 hover:underline">View Details</button>
                    </Link>
                  </td>
                  <td className="p-4">
                    <button className="p-1 rounded-full hover:bg-gray-200">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}