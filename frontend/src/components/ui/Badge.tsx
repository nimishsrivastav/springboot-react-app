import React from 'react';
import { cn } from '../../utils';
import { PostStatus } from '../../types';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'secondary';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'secondary', 
  children, 
  className 
}) => {
  return (
    <span
      className={cn(
        'badge',
        {
          'badge-success': variant === 'success',
          'badge-warning': variant === 'warning',
          'badge-error': variant === 'error',
          'badge-secondary': variant === 'secondary',
        },
        className
      )}
    >
      {children}
    </span>
  );
};

interface StatusBadgeProps {
  status: PostStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  className 
}) => {
  const getVariant = (status: PostStatus) => {
    switch (status) {
      case PostStatus.PUBLISHED:
        return 'success';
      case PostStatus.DRAFT:
        return 'warning';
      case PostStatus.ARCHIVED:
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Badge variant={getVariant(status)} className={className}>
      {status}
    </Badge>
  );
};

interface TagProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({ 
  children, 
  className, 
  onClick 
}) => {
  return (
    <span
      className={cn(
        'tag',
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default Badge;