import React from 'react';

// A colored spinner for general use in cards or page loading states
const Spinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
    </div>
  );
};

// A smaller, white spinner specifically for use inside buttons
export const ButtonSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
    </div>
  );
};

// Default export is the main spinner
export default Spinner;
