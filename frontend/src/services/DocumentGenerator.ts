import { DocumentType, DocumentGenerationResponse, GeneratedDocument, DocumentGenerationState } from '@/types/documents';
import { llmService } from './LLMService';

export class DocumentGenerator {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // ms

  static async generateDocument(
    type: DocumentType,
    formState: DocumentGenerationState,
    existingDocs: Record<DocumentType, GeneratedDocument>,
    retryCount = 0
  ): Promise<DocumentGenerationResponse> {
    try {
      // Validate dependencies before generation
      this.validateDependencies(type, existingDocs);
      
      const requestData = await this.prepareRequestData(type, formState, existingDocs);
      
      try {
        const content = await llmService.generate(requestData);
        return {
          success: true,
          content: this.sanitizeMarkdown(content)
        };
      } catch (error) {
        // Don't retry for specific status codes
        if (error instanceof Error) {
          const errorMessage = error.message;
          
          // Don't retry for 501 (Not Implemented) or 422 (Validation Error)
          if (errorMessage.includes('501') || errorMessage.includes('422')) {
            return {
              success: false,
              error: errorMessage
            };
          }
          
          // Only retry for 500-level errors (except 501)
          if (errorMessage.includes('500') && retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
            return this.generateDocument(type, formState, existingDocs, retryCount + 1);
          }
        }
        
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
    } catch (error) {
      if (error instanceof DependencyError) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private static validateDependencies(
    type: DocumentType, 
    existingDocs: Record<DocumentType, GeneratedDocument>
  ): void {
    const dependencies = this.getDocumentDependencies(type);
    
    for (const dep of dependencies) {
      const doc = existingDocs[dep];
      if (!doc || doc.status !== 'complete') {
        throw new DependencyError(
          `Cannot generate ${type} without completed ${dep} document`
        );
      }
    }
  }

  private static getDocumentDependencies(type: DocumentType): DocumentType[] {
    switch (type) {
      case 'overview':
        return [];
      case 'prd':
        return ['overview'];
      case 'techStack':
        return ['overview', 'prd'];
      case 'codeRules':
        return ['techStack'];
      case 'developmentPlan':
        return ['overview', 'prd', 'techStack', 'codeRules'];
      default:
        return [];
    }
  }

  private static async prepareRequestData(
    type: DocumentType,
    formState: DocumentGenerationState,
    existingDocs: Record<DocumentType, GeneratedDocument>
  ): Promise<string> {
    switch (type) {
      case 'overview':
        return JSON.stringify({
          type: 'overview',
          projectName: formState.formData.projectName,
          description: formState.formData.description,
          analysis: formState.analysis,
          followUpQuestions: formState.followUpQuestions,
          followUpResponses: formState.formData.followUpResponses
        });

      case 'prd':
        return JSON.stringify({
          type: 'prd',
          overview: existingDocs.overview.content
        });

      case 'techStack':
        return JSON.stringify({
          type: 'techStack',
          overview: existingDocs.overview.content,
          prd: existingDocs.prd.content
        });

      case 'codeRules':
        return JSON.stringify({
          type: 'codeRules',
          techStack: existingDocs.techStack.content
        });

      case 'developmentPlan':
        return JSON.stringify({
          type: 'developmentPlan',
          overview: existingDocs.overview.content,
          prd: existingDocs.prd.content,
          techStack: existingDocs.techStack.content,
          codeRules: existingDocs.codeRules.content
        });

      default:
        throw new Error(`Unknown document type: ${type}`);
    }
  }

  private static sanitizeMarkdown(content: string): string {
    return content
      .replace(/[^\x20-\x7E\n]/g, '') // Remove non-printable characters
      .replace(/```/g, '~~~'); // Replace code blocks with safe alternative
  }
}

class DependencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DependencyError';
  }
} 