export interface ProcessInitialInputResponse {
  needsFollowUp: boolean;
  followUpQuestions?: Array<{
    id: string;
    question: string;
    suggestedAnswer?: string;
  }>;
  overview?: string;
}

export async function processInitialInput(projectName: string, description: string): Promise<ProcessInitialInputResponse> {
  const response = await fetch('/api/process-initial', {
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
    throw new Error('Failed to process project description');
  }

  return response.json();
} 