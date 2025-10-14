import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helper?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable form field component with label, validation, and helper text
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  helper,
  children,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input */}
      <div className="relative">
        {children}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center space-x-1">
          <span className="w-4 h-4 text-red-500">⚠</span>
          <span>{error}</span>
        </p>
      )}

      {/* Helper Text */}
      {helper && !error && (
        <p className="text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
};

export default FormField;