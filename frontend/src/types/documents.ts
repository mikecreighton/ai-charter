export type DocumentType = 'overview' | 'prd' | 'techStack' | 'codeRules' | 'developmentPlan';

export interface GeneratedDocument {
  type: DocumentType;
  content: string;
  status: 'pending' | 'generating' | 'complete' | 'error';
  error?: string;
}

export interface DocumentGenerationResponse {
  success: boolean;
  content?: string;
  error?: string;
}

// New type for document generation input
export interface DocumentGenerationState {
  formData: {
    projectName: string;
    description: string;
    followUpResponses: Record<string, string>;
  };
  analysis?: string;
  followUpQuestions: Array<{
    id: string;
    question: string;
    suggestedAnswer?: string;
  }>;
} 