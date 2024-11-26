import { useForm as useFormContext } from '@/hooks/use-form';
import { useDocuments } from '@/contexts/DocumentContext';

export const PreviewOverview = () => {
  const { formData } = useFormContext();
  const { state: documentState } = useDocuments();

  if (documentState.documents.overview.status !== 'complete') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading Preview...</h2>
        <p>Please wait while we generate the document preview.</p>
      </div>
    );
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
            __html: documentState.documents.overview.content.replace(/\n/g, '<br />') 
          }} 
        />
      </div>
    </div>
  );
}; 