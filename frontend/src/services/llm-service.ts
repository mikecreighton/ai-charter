import { config } from '@/config';

export interface ProcessInitialInputResponse {
  needsFollowUp: boolean;
  followUpQuestions?: Array<{
    id: string;
    question: string;
    suggestedAnswer?: string;
  }>;
  analysis?: string;
}

export async function processInitialInput(projectName: string, description: string): Promise<ProcessInitialInputResponse> {
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