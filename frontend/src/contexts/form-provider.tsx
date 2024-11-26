import { ReactNode, useState } from 'react';
import { ProjectFormData, FollowUpQuestion, FormContextState } from '@/types/form';
import { FormContext } from './form-context';

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    description: '',
    followUpResponses: {},
  });
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [currentStep, setCurrentStep] = useState<FormContextState['currentStep']>('initial');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string>();

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateFollowUpResponse = (id: string, response: string) => {
    setFormData(prev => ({
      ...prev,
      followUpResponses: {
        ...prev.followUpResponses,
        [id]: response,
      },
    }));
  };

  const setFollowUps = (questions: FollowUpQuestion[]) => {
    setFollowUpQuestions(questions);
  };

  const value = {
    formData,
    followUpQuestions,
    currentStep,
    isProcessing,
    updateFormData,
    updateFollowUpResponse,
    setStep: setCurrentStep,
    setFollowUps,
    setProcessing: setIsProcessing,
    analysis,
    setAnalysis,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
} 