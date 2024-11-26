import { useDocuments } from '@/contexts/document';
import { useForm } from '@/hooks/use-form';
import { FormContextState } from '@/types/form';

export const FormProgress = () => {
  const { currentStep, formData, setStep } = useForm();
  const { state: documentState } = useDocuments();
  
  const steps = [
    { id: 'initial', label: 'Project Description' },
    { id: 'followUp', label: 'Follow-up Questions' },
    { id: 'preview', label: 'Preview & Export' },
  ];

  const canAccessStep = (stepId: string) => {
    let isAccessible = false;
    switch (stepId) {
      case 'initial':
        isAccessible = true;
        break;
      case 'followUp':
        isAccessible = Boolean(formData.projectName && formData.description);
        break;
      case 'preview':
        isAccessible = documentState.documents.overview.status === 'complete';
        break;
    }
    return isAccessible;
  };

  const handleStepClick = async (stepId: string) => {
    if (canAccessStep(stepId)) {
      await setStep(stepId as FormContextState['currentStep']);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, idx) => {
          const isAccessible = canAccessStep(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <div 
              key={step.id}
              className={`flex items-center ${
                idx < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <button
                onClick={() => handleStepClick(step.id)}
                disabled={!isAccessible}
                className={`flex items-center group ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                    ${isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : isAccessible
                        ? 'border-gray-300 bg-secondary group-hover:border-primary group-hover:text-primary'
                        : 'border-gray-300 bg-secondary opacity-50'
                    }
                  `}
                >
                  {idx + 1}
                </div>
                <div
                  className={`
                    ml-2 text-sm transition-colors
                    ${isCurrent
                      ? 'text-primary'
                      : isAccessible
                        ? 'text-gray-500 group-hover:text-primary'
                        : 'text-gray-400'
                    }
                  `}
                >
                  {step.label}
                </div>
              </button>
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-200" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}; 