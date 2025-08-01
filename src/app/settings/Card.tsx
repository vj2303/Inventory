// components/Card.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const Card: React.FC<CardProps> = ({ title, description, icon, href }) => {
  return (
    <Link 
      href={href}
      className="block p-6 border border-gray-300 rounded-lg "
    >
      <div className="flex flex-col space-y-4">
        <div className="text-gray-700">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;