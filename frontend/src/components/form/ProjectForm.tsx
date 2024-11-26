import { useForm as useFormContext } from '@/hooks/use-form';
import { InitialForm } from './InitialForm';
import { FollowUpQuestions } from './FollowUpQuestions';
import { PreviewOverview } from './PreviewOverview';
import { FormProgress } from './FormProgress';

export const ProjectForm = () => {
  const { currentStep, formData } = useFormContext();
  
  // If there's no project name, force back to initial step
  if (!formData.projectName) {
    return (
      <div className="max-w-2xl mx-auto">
        <FormProgress />
        <InitialForm />
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <FormProgress />
      {currentStep === 'followUp' && <FollowUpQuestions />}
      {currentStep === 'preview' && <PreviewOverview />}
      {currentStep === 'initial' && <InitialForm />}
    </div>
  );
};