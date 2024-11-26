import { createContext } from 'react';
import { FormContextState } from '@/types/form';

export const FormContext = createContext<FormContextState | undefined>(undefined);