import { createContext, useContext, useReducer, ReactNode } from 'react';
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

type DocumentAction = 
  | { type: 'START_GENERATION'; documentType: DocumentType }
  | { type: 'GENERATION_COMPLETE'; documentType: DocumentType; content: string }
  | { type: 'GENERATION_ERROR'; documentType: DocumentType; error: string };

function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  switch (action.type) {
    case 'START_GENERATION':
      return {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: {
            ...state.documents[action.documentType],
            status: 'generating'
          }
        }
      };
    case 'GENERATION_COMPLETE':
      return {
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
    case 'GENERATION_ERROR':
      return {
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
    default:
      return state;
  }
}

const DocumentContext = createContext<{
  state: DocumentState;
  startGeneration: (type: DocumentType) => void;
  completeGeneration: (type: DocumentType, content: string) => void;
  setError: (type: DocumentType, error: string) => void;
} | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, initialState);

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