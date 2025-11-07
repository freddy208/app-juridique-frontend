// src/app/(dashboard)/notes/components/note-search.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface NoteSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const NoteSearch: React.FC<NoteSearchProps> = ({ 
  value, 
  onChange,
  placeholder = "Rechercher une note...",
  className = ""
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`
        relative 
        flex 
        items-center 
        transition-all 
        duration-200
        ${isFocused ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
        rounded-lg
      `}>
        <Search className={`
          absolute 
          left-4 
          h-5 
          w-5 
          transition-colors 
          duration-200
          ${isFocused ? 'text-blue-600' : 'text-gray-400'}
        `} />
        
        <Input
          type="text"
          value={localValue}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`
            pl-12 
            pr-12 
            h-12
            bg-white
            border-2
            border-gray-300
            hover:border-blue-400
            focus:border-blue-500
            text-gray-900
            placeholder:text-gray-500
            text-sm
            rounded-lg
            transition-all
            duration-200
          `}
        />

        <AnimatePresence>
          {localValue && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-2"
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500 hover:text-red-600 transition-colors" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Indicateur de recherche active */}
      {localValue && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-gray-600 mt-2 ml-1"
        >
          Recherche de &quot;<span className="font-semibold text-blue-600">{localValue}</span>&quot;
        </motion.p>
      )}
    </div>
  );
};