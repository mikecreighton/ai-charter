import { useForm as useFormContext } from '@/hooks/use-form';
import { InitialForm } from './initial-form';
import { FollowUpQuestions } from './follow-up-questions';

export const ProjectForm = () => {
  const { currentStep } = useFormContext();
  
  if (currentStep === 'followUp') {
    return <FollowUpQuestions />;
  }

  return <InitialForm />;
}; 