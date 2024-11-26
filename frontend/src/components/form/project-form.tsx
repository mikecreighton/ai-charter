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
import { useForm as useFormContext } from '@/hooks/use-form';
import { processInitialInput } from '@/services/llm-service';
import type { ProjectFormData } from "@/types/form";

export const ProjectForm = () => {
  const { updateFormData, setStep, setFollowUps, setProcessing } = useFormContext();
  
  const form = useHookForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      description: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setProcessing(true);
      console.log('Form submitted:', data);
      updateFormData(data);
      
      const result = await processInitialInput(
        data.projectName,
        data.description
      );

      console.log('Result:', result);

      if (result.needsFollowUp && result.followUpQuestions) {
        setFollowUps(result.followUpQuestions);
        setStep('followUp');
      } else {
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