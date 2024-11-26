import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema } from "@/lib/form-validation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { llmService } from '@/services/LLMService';
import type { InitialAnalysisResponse, ProjectFormData } from "@/types/form";
import { useForm as useFormContext } from '@/hooks/use-form';
import { useDocuments } from '@/contexts/DocumentContext';
import { DocumentGenerator } from '@/services/DocumentGenerator';
import { useState } from 'react';
import { mockComplexInitialAnalysisResponse, mockInitialFormData } from "@/mock/form-data";

export const InitialForm = () => {
  const { 
    updateFormData, 
    setStep, 
    setFollowUps, 
    setAnalysisAndResponse,
    formData,
  } = useFormContext();

  const { startGeneration, completeGeneration, state: documentState } = useDocuments();
  const [isLoading, setIsLoading] = useState(false);

  const form = useHookForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: formData.projectName || "",
      description: formData.description || "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    const USE_MOCK_DATA = true;

    try {
      let result: InitialAnalysisResponse;

      if (USE_MOCK_DATA) {
        data = mockInitialFormData;
        result = mockComplexInitialAnalysisResponse;
      } else {
        result = await llmService.processInitialInput(
          data.projectName,
          data.description
        );
      }
      
      if (!result?.analysis) {
        throw new Error('Invalid response from analysis');
      }

      updateFormData(data);
      setAnalysisAndResponse(result.analysis, result);

      if (result.needsFollowUp && result.followUpQuestions) {
        setFollowUps(result.followUpQuestions);
      } else {
        startGeneration('overview');
        const generationResult = await DocumentGenerator.generateDocument(
          'overview',
          {
            formData: {
              ...data,
              followUpResponses: {},
            },
            analysis: result.analysis,
            followUpQuestions: [],
          },
          documentState.documents
        );

        if (generationResult.success && generationResult.content) {
          completeGeneration('overview', generationResult.content);
          setStep('preview');
        } else {
          throw new Error(generationResult.error || 'Failed to generate overview');
        }
      }
    } catch (error) {
      form.setError("root", { 
        message: error instanceof Error ? error.message : "Something went wrong" 
      });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter project name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project in detail. What are you building? What problems does it solve? What are the key features?" 
                  className="min-h-[200px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              <span className="ml-2">Processing...</span>
            </>
          ) : (
            "Submit Description"
          )}
        </Button>
      </form>
    </Form>
  );
};