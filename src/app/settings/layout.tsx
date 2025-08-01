// components/Layout.tsx
import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className=" bg-gray-50">
     
      <main>
        <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8">
          <div className="px-4  sm:px-0">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;