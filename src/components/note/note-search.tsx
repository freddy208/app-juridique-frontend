// src/app/(dashboard)/notes/components/note-search.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/lib/hooks/use-debounce';

interface NoteSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const NoteSearch: React.FC<NoteSearchProps> = ({
  value,
  onChange,
  placeholder = "Rechercher une note..."
}) => {
  // ✅ Ajouter un état pour l'hydratation
  const [isMounted, setIsMounted] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // ✅ Marquer le composant comme monté
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, isMounted]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  // ✅ Rendu simplifié pendant l'hydratation (sans animations)
  if (!isMounted) {
    return (
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={localValue}
          onChange={(e: { target: { value: React.SetStateAction<string> } }) => setLocalValue(e.target.value)}
          className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {localValue && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  // ✅ Rendu complet avec animations après hydratation
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-md"
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={localValue}
        onChange={(e: { target: { value: React.SetStateAction<string> } }) => setLocalValue(e.target.value)}
        className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
      {localValue && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
};