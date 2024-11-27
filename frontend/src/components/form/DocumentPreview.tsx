import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocuments } from '@/contexts/document';
import { useForm } from '@/hooks/use-form';
import { DocumentMarkdownEditor } from './DocumentMarkdownEditor';
import { DocumentGenerator } from '@/services/DocumentGenerator';
import { DocumentGenerationState, DocumentType } from '@/types/documents';
import { useState } from 'react';

const DOCUMENT_SEQUENCE = [
  'overview',
  'prd',
  'techStack',
  'codeRules',
  'developmentPlan'
] as const;

const DOCUMENT_LABELS: Record<typeof DOCUMENT_SEQUENCE[number], string> = {
  overview: 'Project Overview',
  prd: 'PRD',
  techStack: 'Tech Stack',
  codeRules: 'Code Rules',
  developmentPlan: 'Development Plan'
};

export const DocumentPreview = () => {
  const { state: documentState, startGeneration, completeGeneration, setError } = useDocuments();
  const { formData, analysis, followUpQuestions } = useForm();
  const [activeTab, setActiveTab] = useState<DocumentType>('overview');

  const handleGenerateNext = async (currentDoc: DocumentType) => {
    const currentIndex = DOCUMENT_SEQUENCE.indexOf(currentDoc);
    const nextDoc = DOCUMENT_SEQUENCE[currentIndex + 1];
    
    if (nextDoc && formData.projectName && formData.description) {
      startGeneration(nextDoc);
      
      try {
        const generationState: DocumentGenerationState = {
          formData: {
            projectName: formData.projectName,
            description: formData.description,
            followUpResponses: formData.followUpResponses || {},
          },
          analysis: analysis || '',
          followUpQuestions: followUpQuestions || [],
        };

        const generationResult = await DocumentGenerator.generateDocument(
          nextDoc,
          generationState,
          documentState.documents
        );

        if (generationResult.success && generationResult.content) {
          completeGeneration(nextDoc, generationResult.content);
          setActiveTab(nextDoc);
        } else {
          const errorMessage = generationResult.error || 'Failed to generate document';
          console.error(`Document generation failed: ${errorMessage}`);
          setError(nextDoc, errorMessage);
          setActiveTab(currentDoc);
        }
      } catch (error) {
        console.error('Unexpected error during document generation:', error);
        setError(nextDoc, error instanceof Error ? error.message : 'An unexpected error occurred');
        setActiveTab(currentDoc);
      }
    }
  };

  const getNextDocument = (currentDoc: DocumentType): DocumentType | undefined => {
    const currentIndex = DOCUMENT_SEQUENCE.indexOf(currentDoc);
    return DOCUMENT_SEQUENCE[currentIndex + 1];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Document Preview</h2>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as DocumentType)} className="w-full">
        <TabsList className="w-full">
          {DOCUMENT_SEQUENCE.map((docId) => (
            <TabsTrigger 
              key={docId} 
              value={docId}
              disabled={documentState.documents[docId]?.status !== 'complete' && 
                docId !== activeTab}
            >
              {DOCUMENT_LABELS[docId]}
            </TabsTrigger>
          ))}
        </TabsList>

        {DOCUMENT_SEQUENCE.map((docId) => (
          <TabsContent key={docId} value={docId}>
            {documentState.documents[docId]?.status === 'complete' ? (
              <DocumentMarkdownEditor
                content={documentState.documents[docId].content}
                documentId={docId}
                nextDocument={getNextDocument(docId)}
                onGenerateNext={() => handleGenerateNext(docId)}
              />
            ) : documentState.documents[docId]?.status === 'generating' ? (
              <div className="p-4 text-center text-muted-foreground">
                Generating {DOCUMENT_LABELS[docId]}...
              </div>
            ) : documentState.documents[docId]?.status === 'error' ? (
              <div className="p-4 text-center text-destructive space-y-4">
                <div>Error: {documentState.documents[docId].error}</div>
                <button
                  onClick={() => handleGenerateNext(
                    DOCUMENT_SEQUENCE[DOCUMENT_SEQUENCE.indexOf(docId) - 1]
                  )}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
                >
                  Retry Generation
                </button>
              </div>
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