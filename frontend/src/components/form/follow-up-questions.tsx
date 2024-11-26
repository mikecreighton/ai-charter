import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm as useFormContext } from '@/hooks/use-form';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { generateOverview } from '@/services/llm-service';
import { mockFollowUpFormData } from '@/mock/form-data';

// Create a dynamic schema based on the questions
const createFollowUpSchema = (questions: Array<{ id: string }>) => {
  const shape = questions.reduce((acc, { id }) => {
    acc[id] = z.string().optional();
    return acc;
  }, {} as Record<string, z.ZodType>);
  
  return z.object(shape);
};

export const FollowUpQuestions = () => {
  const { 
    followUpQuestions, 
    updateFollowUpResponse, 
    setStep,
    isProcessing,
    setProcessing,
    formData,
    analysis,
    setOverview,
  } = useFormContext();

  const form = useHookForm({
    resolver: zodResolver(createFollowUpSchema(followUpQuestions)),
    defaultValues: followUpQuestions.reduce((acc, { id, suggestedAnswer }) => {
      acc[id] = suggestedAnswer || '';
      return acc;
    }, {} as Record<string, string>),
  });

  if (!formData.projectName || !analysis) {
    setStep('initial');
    return null;
  }

  const onSubmit = async (data: Record<string, string>) => {
    try {
      setProcessing(true);

      let localData: Record<string, string>;

      const USE_MOCK_DATA = true;

      if (USE_MOCK_DATA) {
        localData = mockFollowUpFormData.followUpResponses || {};
      } else {
        // Update responses in context
        localData = JSON.parse(JSON.stringify(data));
      }

      Object.entries(localData).forEach(([id, response]) => {
        if (response) {
          updateFollowUpResponse(id, response);
        }
      });
      
      const overviewResult = await generateOverview({
        projectName: formData.projectName,
        description: formData.description,
        analysis: analysis!,
        followUpQuestions,
        followUpResponses: localData,
      });
      console.log('Overview generated:', overviewResult);
      
      setOverview(overviewResult.overview);
      setStep('preview');
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Follow-up Questions</h2>
          <p className="text-sm text-muted-foreground">
            Please review and optionally modify the suggested answers below.
          </p>
        </div>

        {followUpQuestions.map(({ id, question, suggestedAnswer }) => (
          <FormField
            key={id}
            control={form.control}
            name={id}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question}</FormLabel>
                <FormControl>
                  <Textarea {...field} className="min-h-[100px]" />
                </FormControl>
                <FormDescription>
                  Suggested answer: {suggestedAnswer || 'No suggestion available'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        {form.formState.errors.root && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('initial')}
            disabled={isProcessing}
          >
            Back
          </Button>
          <Button 
            type="submit"
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing && <LoadingSpinner />}
            {isProcessing ? "Processing..." : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
}; 