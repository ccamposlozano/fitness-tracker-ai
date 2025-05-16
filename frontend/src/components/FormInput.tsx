import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> {
  label: string;
  type?: string;
  options?: { value: string; label: string }[];
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  options,
  ...props
}) => {
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {options ? (
        <select {...props} className={inputClasses}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...props}
          className={inputClasses}
        />
      )}
    </div>
  );
}; 