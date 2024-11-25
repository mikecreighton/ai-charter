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

export interface FormContextState {
  formData: ProjectFormData;
  followUpQuestions: FollowUpQuestion[];
  currentStep: 'initial' | 'followUp' | 'preview';
  isProcessing: boolean;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  updateFollowUpResponse: (id: string, response: string) => void;
  setStep: (step: FormContextState['currentStep']) => void;
  setFollowUps: (questions: FollowUpQuestion[]) => void;
  setProcessing: (processing: boolean) => void;
} 