"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  
  // Redirect to approved page
  useEffect(() => {
    router.push('/orders/sales/approved');
  }, [router]);

  return null;
}