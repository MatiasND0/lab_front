// src/components/ui/Button.js
import React from 'react';

const Button = ({ children, onClick, className, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;