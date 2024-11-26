import { DocumentType, GeneratedDocument } from '@/types/documents';

export interface DocumentState {
  documents: Record<DocumentType, GeneratedDocument>;
}

export interface DocumentContextType {
  state: DocumentState;
  startGeneration: (type: DocumentType) => void;
  completeGeneration: (type: DocumentType, content: string) => void;
  setError: (type: DocumentType, error: string) => void;
  updateDocument: (type: DocumentType, content: string) => void;
  resetDocuments: () => void;
} 