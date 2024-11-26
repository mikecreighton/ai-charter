import { DocumentState } from './types';
import { initialState } from './documentReducer';

const STORAGE_KEY = 'ai-charter-documents';

export const loadInitialState = (): DocumentState => {
  if (typeof window === 'undefined') return initialState;
  
  const savedState = localStorage.getItem(STORAGE_KEY);
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (error) {
      console.error('Failed to parse saved document state:', error);
    }
  }
  return initialState;
};

export const saveState = (state: DocumentState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}; 