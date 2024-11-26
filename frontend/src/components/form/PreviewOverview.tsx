import { useForm as useFormContext } from '@/hooks/use-form';
import { Button } from '@/components/ui/button';

export const PreviewOverview = () => {
  const { overview, formData, setStep } = useFormContext();

  if (!overview) {
    setStep('initial');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Project Overview</h2>
        <h3 className="text-lg font-medium">{formData.projectName}</h3>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: overview.replace(/\n/g, '<br />') 
          }} 
        />
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('initial')}
        >
          Start Over
        </Button>
        {/* Add more actions here like downloading or editing */}
      </div>
    </div>
  );
}; 