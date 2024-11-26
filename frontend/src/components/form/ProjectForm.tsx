import { useForm as useFormContext } from '@/hooks/use-form';
import { InitialForm } from './InitialForm';
import { FollowUpQuestions } from './FollowUpQuestions';
import { PreviewOverview } from './PreviewOverview';
import { FormProgress } from './FormProgress';

export const ProjectForm = () => {
  const { currentStep } = useFormContext();
  
  return (
    <div className="max-w-2xl mx-auto">
      <FormProgress />
      {currentStep === 'followUp' && <FollowUpQuestions />}
      {currentStep === 'preview' && <PreviewOverview />}
      {currentStep === 'initial' && <InitialForm />}
    </div>
  );
};