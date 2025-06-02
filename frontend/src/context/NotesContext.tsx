import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import type { Note } from '../types';
import { useAuth } from './AuthContext';

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Notes state interface
interface NotesState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
}

// Initial notes state
const initialState: NotesState = {
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
};

// Notes action types
type NotesAction =
  | { type: 'GET_NOTES_REQUEST' }
  | { type: 'GET_NOTES_SUCCESS'; payload: Note[] }
  | { type: 'GET_NOTES_FAILURE'; payload: string }
  | { type: 'GET_NOTE_REQUEST' }
  | { type: 'GET_NOTE_SUCCESS'; payload: Note }
  | { type: 'GET_NOTE_FAILURE'; payload: string }
  | { type: 'CREATE_NOTE_REQUEST' }
  | { type: 'CREATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'CREATE_NOTE_FAILURE'; payload: string }
  | { type: 'UPDATE_NOTE_REQUEST' }
  | { type: 'UPDATE_NOTE_SUCCESS'; payload: Note }
  | { type: 'UPDATE_NOTE_FAILURE'; payload: string }
  | { type: 'DELETE_NOTE_REQUEST' }
  | { type: 'DELETE_NOTE_SUCCESS'; payload: string }
  | { type: 'DELETE_NOTE_FAILURE'; payload: string }
  | { type: 'CLEAR_CURRENT_NOTE' }
  | { type: 'CLEAR_ERROR' };

// Notes reducer
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
  switch (action.type) {
    case 'GET_NOTES_REQUEST':
    case 'GET_NOTE_REQUEST':
    case 'CREATE_NOTE_REQUEST':
    case 'UPDATE_NOTE_REQUEST':
    case 'DELETE_NOTE_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'GET_NOTES_SUCCESS':
      return {
        ...state,
        notes: action.payload,
        isLoading: false,
      };
    case 'GET_NOTE_SUCCESS':
      return {
        ...state,
        currentNote: action.payload,
        isLoading: false,
      };
    case 'CREATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: [action.payload, ...state.notes],
        currentNote: action.payload,
        isLoading: false,
      };
    case 'UPDATE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id ? action.payload : note
        ),
        currentNote: action.payload,
        isLoading: false,
      };
    case 'DELETE_NOTE_SUCCESS':
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
        currentNote: null,
        isLoading: false,
      };
    case 'GET_NOTES_FAILURE':
    case 'GET_NOTE_FAILURE':
    case 'CREATE_NOTE_FAILURE':
    case 'UPDATE_NOTE_FAILURE':
    case 'DELETE_NOTE_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case 'CLEAR_CURRENT_NOTE':
      return {
        ...state,
        currentNote: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Notes context type
interface NotesContextType extends NotesState {
  getNotes: () => Promise<void>;
  getNote: (id: string) => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  clearCurrentNote: () => void;
  clearError: () => void;
}

// Create notes context
const NotesContext = createContext<NotesContextType | undefined>(undefined);

// Notes provider component
export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Get all notes
  const getNotes = async () => {
    if (!isAuthenticated) return;
    
    dispatch({ type: 'GET_NOTES_REQUEST' });
    try {
      const res = await axios.get(`${API_URL}/notes`);
      dispatch({ type: 'GET_NOTES_SUCCESS', payload: res.data.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch notes';
      dispatch({ type: 'GET_NOTES_FAILURE', payload: errorMessage });
    }
  };

  // Get a single note by ID
  const getNote = async (id: string) => {
    dispatch({ type: 'GET_NOTE_REQUEST' });
    try {
      const res = await axios.get(`${API_URL}/notes/${id}`);
      dispatch({ type: 'GET_NOTE_SUCCESS', payload: res.data.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch note';
      dispatch({ type: 'GET_NOTE_FAILURE', payload: errorMessage });
    }
  };

  // Create a new note
  const createNote = async (note: Partial<Note>) => {
    dispatch({ type: 'CREATE_NOTE_REQUEST' });
    try {
      const res = await axios.post(`${API_URL}/notes`, note);
      dispatch({ type: 'CREATE_NOTE_SUCCESS', payload: res.data.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create note';
      dispatch({ type: 'CREATE_NOTE_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Update an existing note
  const updateNote = async (id: string, note: Partial<Note>) => {
    dispatch({ type: 'UPDATE_NOTE_REQUEST' });
    try {
      const res = await axios.put(`${API_URL}/notes/${id}`, note);
      dispatch({ type: 'UPDATE_NOTE_SUCCESS', payload: res.data.data });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update note';
      dispatch({ type: 'UPDATE_NOTE_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Delete a note
  const deleteNote = async (id: string) => {
    dispatch({ type: 'DELETE_NOTE_REQUEST' });
    try {
      await axios.delete(`${API_URL}/notes/${id}`);
      dispatch({ type: 'DELETE_NOTE_SUCCESS', payload: id });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete note';
      dispatch({ type: 'DELETE_NOTE_FAILURE', payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  // Clear current note
  const clearCurrentNote = () => {
    dispatch({ type: 'CLEAR_CURRENT_NOTE' });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Fetch notes when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getNotes();
    }
  }, [isAuthenticated]);

  return (
    <NotesContext.Provider
      value={{
        ...state,
        getNotes,
        getNote,
        createNote,
        updateNote,
        deleteNote,
        clearCurrentNote,
        clearError,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
