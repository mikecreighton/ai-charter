import { config } from '@/config';
import { InitialAnalysisResponse, FollowUpQuestion } from '@/types/form';
import { DocumentType } from '@/types/documents';
import { ProjectFormData } from '@/types/form';

export interface GenerateOverviewResponse {
  overview: string;
}

export interface OverviewSubmission {
  projectName: string;
  description: string;
  analysis: string;
  followUpQuestions?: FollowUpQuestion[];
  followUpResponses?: Record<string, string>;
}

interface GenerateDocumentParams {
  documentType: DocumentType;
  formData: ProjectFormData;
  previousDocuments: Record<string, string>;
}

export const generateDocument = async ({
  documentType,
  formData,
  previousDocuments
}: GenerateDocumentParams): Promise<string> => {
  const response = await fetch('/api/generate-document', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentType,
      formData,
      previousDocuments
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to generate document');
  }

  const data = await response.json();
  return data.content;
};

class LLMService {
  async processInitialInput(
    projectName: string,
    description: string
  ): Promise<InitialAnalysisResponse> {
    const response = await fetch(`${config.apiUrl}/api/process-initial`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName,
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
      throw new Error(error.detail || 'Failed to process project description');
    }

    return response.json();
  }

  async generate(jsonStringPayload: string): Promise<string> {
    const response = await fetch(`${config.apiUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonStringPayload,
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage = data.detail || `Server error (${response.status}): Failed to generate content`;
      throw new Error(errorMessage);
    }

    if (!data.success) {
      throw new Error(data.error || 'Generation failed');
    }

    if (!data.content) {
      throw new Error('No content received from server');
    }

    return data.content;
  }
}

export const llmService = new LLMService();