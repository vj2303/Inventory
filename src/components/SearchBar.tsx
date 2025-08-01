'use client';

import { Search } from 'lucide-react';
import { InputHTMLAttributes } from 'react';

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function SearchBar({ ...props }: SearchBarProps) {
  return (
    <div className="flex items-center w-full max-w-sm rounded-xl border border-gray-300 px-4 py-2 bg-white shadow-sm">
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        className="ml-2 w-full text-gray-700 placeholder-gray-400 focus:outline-none"
        placeholder="Search"
        {...props}
      />
    </div>
  );
}
