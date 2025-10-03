import React from 'react';

const Select = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option...',
  error,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-50 disabled:cursor-not-allowed';
  
  const errorClasses = error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className="form-group">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={classes}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <div className="mt-1">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Select;
