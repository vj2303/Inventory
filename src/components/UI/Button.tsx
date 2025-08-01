import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  variant: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false
}) => {
  const baseClasses = "px-4 py-2 rounded text-sm font-medium focus:outline-none transition-colors";
  
  const variantClasses = {
    primary: "bg-teal-700 text-white hover:bg-teal-800 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50",
    secondary: "bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default Button;