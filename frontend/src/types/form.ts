export interface ProjectFormData {
  projectName: string;
  description: string;
  techStack?: string[];
  architecture?: string;
  developmentGuidelines?: string;
}

export interface FormContextState {
  formData: ProjectFormData;
  currentStep: number;
  isComplete: boolean;
  updateFormData: (data: Partial<ProjectFormData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  setComplete: (complete: boolean) => void;
} 