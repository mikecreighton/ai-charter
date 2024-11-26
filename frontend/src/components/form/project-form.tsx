import { useForm as useFormContext } from '@/hooks/use-form';
import { InitialForm } from './initial-form';
import { FollowUpQuestions } from './follow-up-questions';

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
      // Temporary preview state until we build the preview component
      return (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preview (Coming Soon)</h2>
          <pre className="p-4 bg-muted rounded-md">
            {JSON.stringify({ formData }, null, 2)}
          </pre>
        </div>
      );
    default:
      return <InitialForm />;
  }
};