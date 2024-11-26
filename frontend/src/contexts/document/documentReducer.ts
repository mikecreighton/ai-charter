import { DocumentState } from './types';
import { DocumentType } from '@/types/documents';

export type DocumentAction = 
  | { type: 'START_GENERATION'; documentType: DocumentType }
  | { type: 'COMPLETE_GENERATION'; documentType: DocumentType; content: string }
  | { type: 'SET_ERROR'; documentType: DocumentType; error: string }
  | { type: 'UPDATE_DOCUMENT'; documentType: DocumentType; content: string }
  | { type: 'RESET_DOCUMENTS' };

export const initialState: DocumentState = {
  documents: {
    overview: { type: 'overview', status: 'pending', content: '' },
    prd: { type: 'prd', status: 'pending', content: '' },
    techStack: { type: 'techStack', status: 'pending', content: '' },
    codeRules: { type: 'codeRules', status: 'pending', content: '' },
    developmentPlan: { type: 'developmentPlan', status: 'pending', content: '' },
  },
};

export const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  let newState: DocumentState;
  
  switch (action.type) {
    case 'RESET_DOCUMENTS':
      newState = initialState;
      break;
    case 'START_GENERATION':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { 
            ...state.documents[action.documentType], 
            status: 'generating' 
          },
        },
      };
      break;
    case 'COMPLETE_GENERATION':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { 
            type: action.documentType,
            status: 'complete', 
            content: action.content 
          },
        },
      };
      break;
    case 'SET_ERROR':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { 
            type: action.documentType,
            status: 'error', 
            content: '', 
            error: action.error 
          },
        },
      };
      break;
    case 'UPDATE_DOCUMENT':
      newState = {
        ...state,
        documents: {
          ...state.documents,
          [action.documentType]: { 
            type: action.documentType,
            status: 'complete', 
            content: action.content 
          },
        },
      };
      break;
    default:
      return state;
  }
  
  return newState;
}; 