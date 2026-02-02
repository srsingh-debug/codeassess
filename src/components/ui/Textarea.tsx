import React from 'react';

interface TextareaProps {
  name?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  name,
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  disabled = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`
          w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
          placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
          disabled:cursor-not-allowed disabled:opacity-50 resize-vertical
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        `}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};