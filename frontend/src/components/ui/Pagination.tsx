import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(0, currentPage - half);
    let end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`d-flex justify-content-center ${className}`}>
      <BSPagination>
        <BSPagination.Prev 
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} className="me-1" />
          Previous
        </BSPagination.Prev>

        {showPageNumbers && (
          <>
            {visiblePages[0] > 0 && (
              <>
                <BSPagination.Item onClick={() => onPageChange(0)}>
                  1
                </BSPagination.Item>
                {visiblePages[0] > 1 && (
                  <BSPagination.Ellipsis />
                )}
              </>
            )}

            {visiblePages.map((page) => (
              <BSPagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page + 1}
              </BSPagination.Item>
            ))}

            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 2 && (
                  <BSPagination.Ellipsis />
                )}
                <BSPagination.Item onClick={() => onPageChange(totalPages - 1)}>
                  {totalPages}
                </BSPagination.Item>
              </>
            )}
          </>
        )}

        <BSPagination.Next
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <ChevronRight size={16} className="ms-1" />
        </BSPagination.Next>
      </BSPagination>
    </div>
  );
};

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`d-flex justify-content-between align-items-center ${className}`}>
      <BSPagination size="sm" className="mb-0">
        <BSPagination.Prev 
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </BSPagination.Prev>
      </BSPagination>

      <span className="text-muted small">
        Page {currentPage + 1} of {totalPages}
      </span>

      <BSPagination size="sm" className="mb-0">
        <BSPagination.Next
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </BSPagination.Next>
      </BSPagination>
    </div>
  );
};

export default Pagination;