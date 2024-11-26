import { useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { DocumentContextType } from './types';
import { DocumentType } from '@/types/documents';
import { documentReducer, initialState } from './documentReducer';
import { loadInitialState, saveState } from './storage';
import { DocumentContext } from './context';

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [state, dispatch] = useReducer(documentReducer, initialState, loadInitialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const startGeneration = (type: DocumentType) => {
    dispatch({ type: 'START_GENERATION', documentType: type });
  };

  const completeGeneration = (type: DocumentType, content: string) => {
    dispatch({ type: 'COMPLETE_GENERATION', documentType: type, content });
  };

  const setError = (type: DocumentType, error: string) => {
    dispatch({ type: 'SET_ERROR', documentType: type, error });
  };

  const updateDocument = (type: DocumentType, content: string) => {
    dispatch({ type: 'UPDATE_DOCUMENT', documentType: type, content });
  };

  const resetDocuments = () => {
    dispatch({ type: 'RESET_DOCUMENTS' });
  };

  const value: DocumentContextType = {
    state,
    startGeneration,
    completeGeneration,
    setError,
    updateDocument,
    resetDocuments
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}; 