// app/components/TabNavigationLayout.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabNavigationLayoutProps {
  children: React.ReactNode;
}

export default function TabNavigationLayout({ children }: TabNavigationLayoutProps) {
  const pathname = usePathname();
  
  const tabs = [
    { id: 'offer-list', label: 'Offer List', path: '/approval/offer-list' },
    { id: 'stock-transfer', label: 'Stock Transfer', path: '/approval/stock-transfer' },
    { id: 'purchase-orders', label: 'Purchase Order', path: '/approval/purchase-orders' },
    { id: 'proforma-invoice', label: 'Proforma Invoice', path: '/approval/proforma-invoice' }
  ];

  const getActiveTab = () => {
    return tabs.find(tab => pathname === tab.path)?.id || '';
  };

  const activeTab = getActiveTab();

  return (
    <div className=" p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Requests</h1>
      
     
      <div className=" flex">
        {tabs.map(tab => (
          <Link 
            href={tab.path} 
            key={tab.id}
            className={`py-3 px-4 text-base font-bold relative ${
              activeTab === tab.id 
                ? 'text-[#657781]  border-b-2 border-[#657781]' 
                : 'text-[#657781] hover:text-[#008081]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      
     
      <div>{children}</div>
    </div>
  );
}