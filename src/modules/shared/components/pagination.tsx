"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showItemsInfo?: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  showItemsInfo = true 
}: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
   
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const maxPagesToShow = isMobile ? 5 : 7;
    
    if (totalPages <= maxPagesToShow) {
    
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
     
      pages.push(1);
      
      if (isMobile) {
        // Mobile
        if (currentPage <= 3) {
          for (let i = 2; i <= 3; i++) {
            if (i <= totalPages) pages.push(i);
          }
          if (totalPages > 4) pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push('...');
          for (let i = totalPages - 2; i <= totalPages; i++) {
            if (i > 1) pages.push(i);
          }
        } else {
          pages.push('...');
          pages.push(currentPage);
          pages.push('...');
          pages.push(totalPages);
        }
      } else {
        // Desktop
        if (currentPage <= 4) {
          for (let i = 2; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push('...');
          for (let i = totalPages - 4; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return showItemsInfo ? (
      <div className="flex items-center justify-center text-sm text-gray-600">
        Showing {totalItems} item{totalItems !== 1 ? 's' : ''}
      </div>
    ) : null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
      {showItemsInfo && (
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {startItem} to {endItem} of {totalItems} item{totalItems !== 1 ? 's' : ''}
        </div>
      )}
      
      <nav className="flex items-center gap-1 order-1 sm:order-2">
    
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors
            ${currentPage === 1 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>


        <div className="flex items-center gap-0.5 sm:gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
              disabled={typeof page === 'string'}
              className={`
                px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors min-w-[32px] sm:min-w-[40px]
                ${typeof page === 'string'
                  ? 'text-gray-400 cursor-default'
                  : page === currentPage
                  ? 'bg-[#007F4E] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors
            ${currentPage === totalPages 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }
          `}
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </button>
      </nav>
    </div>
  );
}