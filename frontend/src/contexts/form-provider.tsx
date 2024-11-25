import { ReactNode, useState } from 'react';
import { ProjectFormData } from '@/types/form';
import { FormContext } from './form-context-types';

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    description: '',
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const updateFormData = (data: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const previousStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const value = {
    formData,
    currentStep,
    isComplete,
    updateFormData,
    nextStep,
    previousStep,
    setComplete: setIsComplete,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
} 