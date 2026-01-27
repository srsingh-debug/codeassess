import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'elevated' | 'glass';
  borderColor?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  variant = 'default',
  borderColor = 'default',
  shadow = 'md'
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 border-0',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/50'
  };

  const borderClasses = {
    default: 'border-gray-200 dark:border-gray-700',
    primary: 'border-blue-500',
    success: 'border-green-500',
    warning: 'border-yellow-500',
    danger: 'border-red-500'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  // Apply border color only to default and outlined variants
  const borderClass = (variant === 'default' || variant === 'outlined') ? borderClasses[borderColor] : '';

  // Enhanced shadow for elevated variant
  const shadowClass = variant === 'elevated' ? `shadow-${shadow}` : shadowClasses[shadow];

  return (
    <div className={`
      rounded-xl
      ${variantClasses[variant]}
      ${borderClass}
      ${shadowClass}
      ${hover ? 'hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5' : 'transition-all duration-300'}
      ${padding !== 'none' ? paddingClasses[padding] : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`pb-4 ${className}`}>
    <div className="border-b border-gray-100 dark:border-gray-700">
      {children}
    </div>
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`pt-4 mt-4 border-t border-gray-100 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);