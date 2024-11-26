import { useForm as useFormContext } from '@/hooks/use-form';
import { InitialForm } from './initial-form';
import { FollowUpQuestions } from './follow-up-questions';
import { PreviewOverview } from './preview-overview';

export const ProjectForm = () => {
  const { currentStep, formData } = useFormContext();
  
  // If there's no project name, force back to initial step
  if (!formData.projectName) {
    return <InitialForm />;
  }
  
  switch (currentStep) {
    case 'followUp':
      return <FollowUpQuestions />;
    case 'preview':
      return <PreviewOverview />;
    default:
      return <InitialForm />;
  }
};