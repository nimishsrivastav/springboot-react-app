import React from 'react';
import { cn } from '../../utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={cn(
        'btn',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-sm': size === 'sm',
          'btn-lg': size === 'lg',
        },
        variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="spinner mr-2" />}
      {children}
    </button>
  );
};

export default Button;