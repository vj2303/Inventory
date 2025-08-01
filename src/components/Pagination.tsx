'use client';

import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const maxVisiblePages = 5;
  
  // Calculate the range of page numbers to display
  const getPageNumbers = () => {
    if (!totalPages || totalPages <= 0) return [1]; // Default to at least one page
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page, last page, current page, and one page before and after current
    const pages = [1];
    
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust range to always show 3 pages (unless at edges)
    if (startPage === 2) endPage = Math.min(4, totalPages - 1);
    if (endPage === totalPages - 1) startPage = Math.max(2, totalPages - 3);
    
    // Add ellipsis if needed
    if (startPage > 2) pages.push(-1); // -1 represents an ellipsis
    
    // Add the range of visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) pages.push(-2); // -2 represents an ellipsis (using different value to avoid React key warning)
    
    // Add the last page
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 flex items-center"
        aria-label="Previous page"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      <div className="hidden sm:flex gap-1">
        {getPageNumbers().map((pageNum, index) => (
          pageNum < 0 ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-2 rounded-md transition-all duration-300 ${
                currentPage === pageNum
                  ? 'bg-teal-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>
      
      <div className="sm:hidden px-3 py-2">
        <span className="font-medium">{currentPage}</span> of <span>{totalPages}</span>
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-md border hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 flex items-center"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="ml-1"
        >
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    </div>
  );
};

export default Pagination;