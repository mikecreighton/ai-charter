import { createContext, useContext, useReducer, useEffect } from 'react';

export type DocumentType = 'overview' | 'prd' | 'techStack' | 'codeRules' | 'developmentPlan';
export type DocumentStatus = 'pending' | 'generating' | 'complete' | 'error';

export interface GeneratedDocument {
  content: string;
  status: DocumentStatus;
  error?: string;
}

export interface DocumentState {
  documents: Record<DocumentType, GeneratedDocument>;
}

type DocumentAction = 
  | { type: 'START_GENERATION'; documentType: DocumentType }
  | { type: 'COMPLETE_GENERATION'; documentType: DocumentType; content: string }
  | { type: 'SET_ERROR'; documentType: DocumentType; error: string }
  | { type: 'UPDATE_DOCUMENT'; documentType: DocumentType; content: string };

const initialState: DocumentState = {
  documents: {
    overview: { status: 'pending', content: '' },
    prd: { status: 'pending', content: '' },
    techStack: { status: 'pending', content: '' },
    codeRules: { status: 'pending', content: '' },
    developmentPlan: { status: 'pending', content: '' },
  },
};

const STORAGE_KEY = 'ai-charter-documents';

const loadInitialState = (): DocumentState => {
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

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  let newState: DocumentState;
  
  switch (action.type) {
    case 'START_GENERATION':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { ...state.documents[action.documentType], status: 'generating' },
        },
      };
      break;
    case 'COMPLETE_GENERATION':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { status: 'complete', content: action.content },
        },
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { status: 'error', content: '', error: action.error },
        },
      };
      break;
    case 'UPDATE_DOCUMENT':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { status: 'complete', content: action.content },
        },
      };
      break;
    default:
      return state;
  }

  // Save to localStorage after each state change
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }
  
  return newState;
};

interface DocumentContextType {
  state: DocumentState;
  startGeneration: (type: DocumentType) => void;
  completeGeneration: (type: DocumentType, content: string) => void;
  setError: (type: DocumentType, error: string) => void;
  updateDocument: (type: DocumentType, content: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState, loadInitialState);

  // Optional: Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  return (
    <DocumentContext.Provider value={{ state, startGeneration, completeGeneration, setError, updateDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}; 