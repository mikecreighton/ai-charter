import { useForm as useFormContext } from '@/hooks/use-form';
import { InitialForm } from './InitialForm';
import { FollowUpQuestions } from './FollowUpQuestions';
import { DocumentPreview } from './DocumentPreview';
import { FormProgress } from './FormProgress';

export const ProjectForm = () => {
  const { currentStep } = useFormContext();
  
  return (
    <div className="max-w-4xl mx-auto">
      <FormProgress />
      {currentStep === 'followUp' && <FollowUpQuestions />}
      {currentStep === 'preview' && <DocumentPreview />}
      {currentStep === 'initial' && <InitialForm />}
    </div>
  );
};