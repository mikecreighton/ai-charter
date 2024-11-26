import { config } from '@/config';
import { InitialAnalysisResponse, FollowUpQuestion } from '@/types/form';

export interface GenerateOverviewResponse {
  overview: string;
}

export async function processInitialInput(
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

export interface OverviewSubmission {
  projectName: string;
  description: string;
  analysis: string;
  followUpQuestions?: FollowUpQuestion[];
  followUpResponses?: Record<string, string>;
}

export async function generateOverview(data: OverviewSubmission): Promise<GenerateOverviewResponse> {
  const response = await fetch(`${config.apiUrl}/api/generate-overview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new Error(error.detail || 'Failed to process follow-up responses');
  }

  return response.json();
}