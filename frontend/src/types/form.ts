export interface ProjectFormData {
  projectName: string;
  description: string;
  followUpResponses?: Record<string, string>;
}

export interface FollowUpQuestion {
  id: string;
  question: string;
  suggestedAnswer?: string;
}

export interface InitialAnalysisResponse {
  needsFollowUp: boolean;
  analysis: string;
  followUpQuestions?: FollowUpQuestion[];
}

export type FormStep = 'initial' | 'followUp' | 'preview';

export interface FormContextState {
  formData: ProjectFormData;
  followUpQuestions: FollowUpQuestion[];
  currentStep: 'initial' | 'followUp' | 'preview';
  isProcessing: boolean;
  analysis?: string;
  overview?: string;
  initialResponse?: InitialAnalysisResponse;
  
  // Methods
  updateFormData: (data: Partial<ProjectFormData>) => void;
  updateFollowUpResponse: (id: string, response: string) => void;
  setStep: (step: 'initial' | 'followUp' | 'preview') => boolean;
  setFollowUps: (questions: FollowUpQuestion[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  setAnalysis: (analysis: string) => void;
  setInitialResponse: (response: InitialAnalysisResponse) => void;
  setOverview: (overview: string) => void;
  resetForm: () => void;
  setAnalysisAndResponse: (analysis: string, response: InitialAnalysisResponse) => void;
} 