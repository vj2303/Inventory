'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/app/dashboard/page';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
   
    if (!loading && !isAuthenticated) {
      router.push('/register');
    }
  }, [isAuthenticated, loading, router]);


  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Only render Dashboard if authenticated
  return isAuthenticated ? <Dashboard /> : null;
}




