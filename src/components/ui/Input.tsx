import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  name?: string;  
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  onKeyPress,
  error,
  disabled = false,
  icon: Icon,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
            placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            disabled:cursor-not-allowed disabled:opacity-50
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};