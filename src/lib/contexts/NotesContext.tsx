// src/contexts/NotesContext.tsx

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { NotesState, Note, NotesQuery, NoteStats } from '../types/note.types';

// Type pour les actions du reducer
type NotesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'SET_CURRENT_NOTE'; payload: Note | null }
  | { type: 'SET_STATS'; payload: NoteStats | null }
  | { type: 'SET_PAGINATION'; payload: { page: number; limit: number; total: number; totalPages: number } }
  | { type: 'SET_FILTERS'; payload: NotesQuery }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'REMOVE_NOTE'; payload: string };

// État initial
const initialState: NotesState = {
  notes: [],
  currentNote: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {},
};

// Reducer pour gérer les actions
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false };
    case 'SET_CURRENT_NOTE':
      return { ...state, currentNote: action.payload, loading: false };
    case 'SET_STATS':
      return { ...state, stats: action.payload, loading: false };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note =>
          note.id === action.payload.id ? action.payload : note
        ),
        currentNote: state.currentNote?.id === action.payload.id ? action.payload : state.currentNote,
      };
    case 'REMOVE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
        currentNote: state.currentNote?.id === action.payload ? null : state.currentNote,
      };
    default:
      return state;
  }
};

// Création du contexte
const NotesContext = createContext<{
  state: NotesState;
  dispatch: React.Dispatch<NotesAction>;
} | null>(null);

// Provider du contexte
export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  return (
    <NotesContext.Provider value={{ state, dispatch }}>
      {children}
    </NotesContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useNotesContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return context;
};