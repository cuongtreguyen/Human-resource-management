import React from 'react';
import Button from '../ui/Button';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  startIndex, 
  endIndex, 
  totalItems, 
  onPrevious, 
  onNext 
}) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} results
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onPrevious}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="px-3 py-1 text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onNext}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

