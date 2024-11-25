import { FormContextState } from '@/types/form';
import { createContext } from 'react';

export const FormContext = createContext<FormContextState | undefined>(undefined); 