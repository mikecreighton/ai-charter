import { ReactNode, useReducer, useEffect } from 'react';
import { ProjectFormData, FollowUpQuestion, FormContextState, InitialAnalysisResponse } from '@/types/form';
import { FormContext } from './FormContext';

const STORAGE_KEY = 'ai-charter-form-state';

const loadSavedState = (): Partial<FormState> => {
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

const initialState: FormState = {
  formData: {
    projectName: '',
    description: '',
    followUpResponses: {},
  },
  currentStep: 'initial',
  followUpQuestions: [],
  isProcessing: false,
};

type FormAction = 
  | { type: 'UPDATE_FORM_DATA'; payload: Partial<ProjectFormData> }
  | { type: 'SET_ANALYSIS'; payload: { analysis: string; response: InitialAnalysisResponse } }
  | { type: 'SET_FOLLOW_UPS'; payload: FollowUpQuestion[] }
  | { type: 'SET_STEP'; payload: FormContextState['currentStep'] }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_OVERVIEW'; payload: string }
  | { type: 'RESET' };

type FormState = {
  formData: ProjectFormData;
  currentStep: FormContextState['currentStep'];
  analysis?: string;
  initialResponse?: InitialAnalysisResponse;
  followUpQuestions: FollowUpQuestion[];
  overview?: string;
  isProcessing: boolean;
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
          followUpResponses: {
            ...state.formData.followUpResponses,
            ...(action.payload.followUpResponses || {})
          }
        }
      };
    
    case 'SET_ANALYSIS':
      return {
        ...state,
        analysis: action.payload.analysis,
        initialResponse: action.payload.response
      };
    
    case 'SET_FOLLOW_UPS':
      return {
        ...state,
        followUpQuestions: action.payload,
        currentStep: 'followUp'
      };
    
    case 'SET_STEP':
      // Validate step transitions
      if (action.payload === 'followUp' && 
          (!state.formData.projectName || !state.formData.description)) {
        return state;
      }
      if (action.payload === 'preview' && !state.analysis) {
        return state;
      }
      return {
        ...state,
        currentStep: action.payload
      };
    
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload
      };
    
    case 'SET_OVERVIEW':
      return {
        ...state,
        overview: action.payload
      };
    
    case 'RESET':
      return initialState;
    
    default:
      return state;
  }
}

export function FormProvider({ children }: { children: ReactNode }) {
  const savedState = loadSavedState();
  const [state, dispatch] = useReducer(formReducer, {
    ...initialState,
    ...savedState,
  });
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = {
    ...state,
    updateFormData: (data: Partial<ProjectFormData>) => {
      dispatch({ type: 'UPDATE_FORM_DATA', payload: data });
    },
    setAnalysisAndResponse: (analysis: string, response: InitialAnalysisResponse) => {
      dispatch({ type: 'SET_ANALYSIS', payload: { analysis, response } });
    },
    setFollowUps: (questions: FollowUpQuestion[]) => {
      dispatch({ type: 'SET_FOLLOW_UPS', payload: questions });
    },
    setStep: (step: FormContextState['currentStep']) => {
      dispatch({ type: 'SET_STEP', payload: step });
      return true;
    },
    setProcessing: (isProcessing: boolean) => {
      dispatch({ type: 'SET_PROCESSING', payload: isProcessing });
    },
    setAnalysis: (analysis: string) => {
      dispatch({ type: 'SET_ANALYSIS', payload: { analysis, response: state.initialResponse! } });
    },
    setInitialResponse: (response: InitialAnalysisResponse) => {
      if (state.analysis) {
        dispatch({ type: 'SET_ANALYSIS', payload: { analysis: state.analysis, response } });
      }
    },
    updateFollowUpResponse: (id: string, response: string) => {
      dispatch({ 
        type: 'UPDATE_FORM_DATA', 
        payload: { 
          followUpResponses: { ...state.formData.followUpResponses, [id]: response } 
        } 
      });
    },
    resetForm: () => dispatch({ type: 'RESET' }),
    setOverview: (overview: string) => {
      dispatch({ type: 'SET_OVERVIEW', payload: overview });
    },
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}