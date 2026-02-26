import React from 'react';

const Input = ({ label, error, required, className = "", ...props }) => {
  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      
      <input 
        className={`
          w-full px-4 py-3 bg-white rounded-xl border transition-all outline-none focus:ring-1 
          ${error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-200 focus:border-dapur-orange focus:ring-dapur-orange'
          }
        `}
        {...props}
      />
      
      {/* Pesan Error otomatis muncul jika properti error dikirim */}
      {error && (
        <p className="text-xs text-red-500 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;