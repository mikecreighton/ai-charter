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
  currentStep: FormStep;
  isProcessing: boolean;
  initialResponse?: InitialAnalysisResponse;
  analysis?: string;
  overview?: string;
  
  // Methods
  updateFormData: (data: Partial<ProjectFormData>) => void;
  updateFollowUpResponse: (id: string, response: string) => void;
  setStep: (step: FormStep) => Promise<boolean>;
  setFollowUps: (questions: FollowUpQuestion[]) => void;
  setProcessing: (isProcessing: boolean) => void;
  setInitialResponse: (response: InitialAnalysisResponse) => void;
  setAnalysis: (analysis: string) => void;
  setOverview: (overview: string) => void;
  resetForm: () => void;
} 