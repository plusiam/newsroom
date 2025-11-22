import React from 'react';
import Spinner from './Spinner';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:hover:bg-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 disabled:hover:bg-green-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:hover:bg-transparent'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      <span>{children}</span>
    </button>
  );
};

export default Button;
