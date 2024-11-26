import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocuments, DocumentType } from '@/contexts/DocumentContext';
import { DocumentMarkdownEditor } from './DocumentMarkdownEditor';

export const DocumentPreview = () => {
  const { state: documentState } = useDocuments();

  const documents: Array<{ id: DocumentType; label: string }> = [
    { id: 'overview', label: 'Project Overview' },
    { id: 'prd', label: 'PRD' },
    { id: 'techStack', label: 'Tech Stack' },
    { id: 'codeRules', label: 'Code Rules' },
    { id: 'developmentPlan', label: 'Development Plan' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Document Preview</h2>
        {/* We'll add export controls here later */}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full">
          {documents.map(doc => (
            <TabsTrigger 
              key={doc.id} 
              value={doc.id}
              disabled={documentState.documents[doc.id]?.status !== 'complete'}
            >
              {doc.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {documents.map(doc => (
          <TabsContent key={doc.id} value={doc.id}>
            {documentState.documents[doc.id]?.status === 'complete' ? (
              <DocumentMarkdownEditor
                content={documentState.documents[doc.id].content}
                documentId={doc.id}
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                Document not yet generated
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}; 