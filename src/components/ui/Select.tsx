// src/components/ui/Select.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
}

export function Select({
  label,
  options,
  error,
  placeholder = 'Sélectionner une option',
  className,
  id,
  name,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  
  // Trouver l'option sélectionnée à partir de la valeur
  const selectedOption = options.find(option => option.value === value) || null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (option: SelectOption) => {
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

  const getDisplayValue = () => {
    if (selectedOption) {
      return selectedOption.label;
    }
    return placeholder;
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-danger ml-1">*</span>}
        </label>
      )}
      <div className="relative" ref={selectRef}>
        <div
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 border rounded-md bg-white text-sm cursor-pointer',
            error ? 'border-danger' : 'border-slate-300',
            isOpen ? 'ring-1 ring-primary-500 border-primary-500' : '',
            disabled ? 'bg-slate-100 cursor-not-allowed opacity-70' : '',
            'focus:outline-none'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <span className={cn(
            'block truncate',
            selectedOption ? 'text-slate-900' : 'text-slate-500'
          )}>
            {getDisplayValue()}
          </span>
          <ChevronDown className={cn(
            'h-4 w-4 text-slate-400 transition-transform',
            isOpen ? 'transform rotate-180' : ''
          )} />
        </div>
        
        {isOpen && !disabled && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <ul className="py-1">
              {options.map((option) => (
                <li
                  key={option.value}
                  className={cn(
                    'px-3 py-2 text-sm cursor-pointer hover:bg-primary-50',
                    selectedOption?.value === option.value ? 'bg-primary-100 text-primary-700' : 'text-slate-700'
                  )}
                  onClick={() => handleSelectOption(option)}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Input caché pour react-hook-form */}
        <input
          id={id}
          name={name}
          type="hidden"
          value={selectedOption?.value || ''}
          onChange={() => {}} // Géré par notre propre onChange
          onBlur={onBlur}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}