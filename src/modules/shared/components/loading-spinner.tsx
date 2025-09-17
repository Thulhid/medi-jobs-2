import React from "react";

export const LoadingSpinner = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-[#007F4E] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      <span className="ml-3 text-gray-600">Loading...</span>
    </div>
  );
};

export const LoadingSpinnerPage = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <LoadingSpinner />
  </div>
);
