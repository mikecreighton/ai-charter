import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { DocumentType, GeneratedDocument } from '@/types/documents';

interface DocumentState {
  documents: Record<DocumentType, GeneratedDocument>;
}

const initialState: DocumentState = {
  documents: {
    overview: { type: 'overview', content: '', status: 'pending' },
    prd: { type: 'prd', content: '', status: 'pending' },
    techStack: { type: 'techStack', content: '', status: 'pending' },
    codeRules: { type: 'codeRules', content: '', status: 'pending' },
    developmentPlan: { type: 'developmentPlan', content: '', status: 'pending' }
  }
};

const STORAGE_KEY = 'ai-charter-documents';

function loadInitialState(): DocumentState {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Error loading documents from localStorage:', error);
  }
  return initialState;
}

type DocumentAction = 
  | { type: 'START_GENERATION'; documentType: DocumentType }
  | { type: 'GENERATION_COMPLETE'; documentType: DocumentType; content: string }
  | { type: 'GENERATION_ERROR'; documentType: DocumentType; error: string };

function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  let newState: DocumentState;
  
  switch (action.type) {
    case 'START_GENERATION':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: {
            ...state.documents[action.documentType],
            status: 'generating'
          }
        }
      };
      break;
      
    case 'GENERATION_COMPLETE':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: {
            type: action.documentType,
            content: action.content,
            status: 'complete'
          }
        }
      };
      break;
      
    case 'GENERATION_ERROR':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: {
            ...state.documents[action.documentType],
            status: 'error',
            error: action.error
          }
        }
      };
      break;
      
    default:
      return state;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Error saving documents to localStorage:', error);
  }

  return newState;
}

const DocumentContext = createContext<{
  state: DocumentState;
  startGeneration: (type: DocumentType) => void;
  completeGeneration: (type: DocumentType, content: string) => void;
  setError: (type: DocumentType, error: string) => void;
} | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, loadInitialState());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving documents to localStorage:', error);
    }
  }, [state]);

  const startGeneration = (type: DocumentType) => {
    dispatch({ type: 'START_GENERATION', documentType: type });
  };

  const completeGeneration = (type: DocumentType, content: string) => {
    dispatch({ type: 'GENERATION_COMPLETE', documentType: type, content });
  };

  const setError = (type: DocumentType, error: string) => {
    dispatch({ type: 'GENERATION_ERROR', documentType: type, error });
  };

  return (
    <DocumentContext.Provider value={{ state, startGeneration, completeGeneration, setError }}>
      {children}
    </DocumentContext.Provider>
  );
}

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}; 