import React from "react";
import { Input } from "@/components/ui/input";

interface InputWithValidationProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  showPassword?: boolean;
  required?: boolean;
  className?: string;
}

export function InputWithValidation({
  id,
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  showPasswordToggle,
  onTogglePassword,
  showPassword,
  required = false,
  className = "",
}: InputWithValidationProps) {
  const baseClasses = `${icon ? "pl-10" : ""} ${showPasswordToggle ? "pr-10" : ""} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base`;

  const borderClasses = error
    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
    : "border-gray-300 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400";

  return (
    <div className="space-y-1">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${baseClasses} ${borderClasses} ${className}`}
          required={required}
        />
        {showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? "🙈" : "👁��"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs flex items-center">
          <span className="mr-1">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
}
