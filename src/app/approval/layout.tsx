// app/approval/layout.tsx
"use client";

import { usePathname } from 'next/navigation';
import TabNavigationLayout from '@/components/TabNavigationLayout';

export default function ApprovalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const excludePaths = [
    '/approval/offer-list/',
    '/approval/proforma-invoice/',
    '/approval/purchase-orders/',
    '/approval/stock-transfer/'
  ];
  
  const shouldExcludeNavigation = excludePaths.some(path => pathname.includes(path));
  
  if (shouldExcludeNavigation) {
    return <div className="">{children}</div>;
  }
  
  return <TabNavigationLayout>{children}</TabNavigationLayout>;
}