import { ReactNode, useState, useEffect } from 'react';
import { ProjectFormData, FollowUpQuestion, FormContextState, InitialAnalysisResponse } from '@/types/form';
import { FormContext } from './form-context';

const STORAGE_KEY = 'ai-charter-form-state';

interface SavedState {
  formData: ProjectFormData;
  currentStep: FormContextState['currentStep'];
  analysis?: string;
  overview?: string;
  followUpQuestions: FollowUpQuestion[];
  initialResponse?: InitialAnalysisResponse;
}

export function FormProvider({ children }: { children: ReactNode }) {
  const loadSavedState = (): Partial<SavedState> => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
      }
    }
    return {};
  };

  const savedState = loadSavedState();

  const [formData, setFormData] = useState<ProjectFormData>(() => 
    savedState.formData || {
      projectName: '',
      description: '',
      followUpResponses: {},
    }
  );

  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>(() => 
    savedState.followUpQuestions || []
  );

  const [currentStep, setCurrentStep] = useState<FormContextState['currentStep']>(() => {
    const step = savedState.currentStep;
    const validSteps: FormContextState['currentStep'][] = ['initial', 'followUp', 'preview'];
    
    if (step && validSteps.includes(step)) {
      if (step === 'followUp' && (!savedState.formData?.projectName || !savedState.formData?.description)) {
        return 'initial';
      }
      if (step === 'preview' && !savedState.analysis) {
        return 'followUp';
      }
      return step;
    }
    return 'initial';
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<string | undefined>(() => savedState.analysis);
  const [initialResponse, setInitialResponse] = useState<InitialAnalysisResponse | undefined>(() => 
    savedState.initialResponse
  );
  const [overview, setOverview] = useState<string | undefined>(() => savedState.overview);

  useEffect(() => {
    const stateToSave: SavedState = {
      formData,
      currentStep,
      analysis,
      overview,
      followUpQuestions,
      initialResponse,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, currentStep, analysis, overview, followUpQuestions, initialResponse]);

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

  const setStep = async (newStep: FormContextState['currentStep']) => {
    if (newStep === 'followUp' && (!formData.projectName || !formData.description)) {
      console.error('Cannot proceed: Initial form data incomplete');
      return false;
    }

    if (newStep === 'preview' && (!analysis || currentStep !== 'followUp')) {
      console.error('Cannot proceed: Follow-up answers incomplete');
      return false;
    }

    setCurrentStep(newStep);
    return true;
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      description: '',
      followUpResponses: {},
    });
    setFollowUpQuestions([]);
    setCurrentStep('initial');
    setAnalysis(undefined);
    setInitialResponse(undefined);
    setOverview(undefined);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = {
    formData,
    followUpQuestions,
    currentStep,
    isProcessing,
    initialResponse,
    analysis,
    overview,
    updateFormData,
    updateFollowUpResponse,
    setStep,
    setFollowUps,
    setProcessing: setIsProcessing,
    setInitialResponse,
    setAnalysis,
    setOverview,
    resetForm,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}