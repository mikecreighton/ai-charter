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
import { processInitialInput, generateOverview } from '@/services/llm-service';
import type { InitialAnalysisResponse, ProjectFormData } from "@/types/form";
import { useForm as useFormContext } from '@/hooks/use-form';
import { mockInitialFormData, mockComplexInitialAnalysisResponse, mockSimpleInitialAnalysisResponse } from '@/mock/form-data';

export const InitialForm = () => {
  const { 
    updateFormData, 
    setStep, 
    setFollowUps, 
    setProcessing, 
    setAnalysis, 
    formData,
    setInitialResponse,
    setOverview
  } = useFormContext();

  const form = useHookForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: formData.projectName || "",
      description: formData.description || "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setProcessing(true);

      const USE_MOCK_DATA = true;
      // For testing cases where the LLM does not come back with follow-up questions
      // Simple = no follow-up questions
      const USE_SIMPLE_MOCK_DATA = false;
      let result: InitialAnalysisResponse;

      if (USE_MOCK_DATA) {
        updateFormData(mockInitialFormData);
        // Need to manually update it here since React state updates are async.
        data.projectName = mockInitialFormData.projectName;
        data.description = mockInitialFormData.description;
        if (USE_SIMPLE_MOCK_DATA) {
          result = mockSimpleInitialAnalysisResponse;
        } else {
          result = mockComplexInitialAnalysisResponse;
        }

      } else {
        updateFormData(data);
        // Get initial analysis
        result = await processInitialInput(
          data.projectName,
          data.description
        );
        console.log('Initial analysis result:', result);
      }
      
      if (result.analysis) {
        setAnalysis(result.analysis);
        setInitialResponse(result);
      }

      if (result.needsFollowUp && result.followUpQuestions) {
        setFollowUps(result.followUpQuestions);
        setStep('followUp');
      } else {
        // No follow-ups needed, generate overview directly
        console.log('No follow-ups needed, generating overview...');
        const overviewResult = await generateOverview({
          projectName: data.projectName,
          description: data.description,
          analysis: result.analysis,
        });
        
        console.log('Overview generated:', overviewResult);
        setOverview(overviewResult.overview);
        setStep('preview');
      }
      
    } catch (err) {
      form.setError("root", { 
        message: err instanceof Error ? err.message : "Something went wrong" 
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <div className="text-red-500 text-sm">{form.formState.errors.root.message}</div>
        )}

        <Button 
          type="submit" 
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          {form.formState.isSubmitting && <LoadingSpinner />}
          {form.formState.isSubmitting ? "Processing..." : "Submit Description"}
        </Button>
      </form>
    </Form>
  );
};