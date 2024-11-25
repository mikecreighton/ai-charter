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
import type { ProjectFormData } from "@/types/form";

export const ProjectForm = () => {
  const { updateFormData, nextStep } = useFormContext();
  
  const form = useHookForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      description: "",
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      console.log('Form submitted:', data);
      updateFormData(data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      nextStep();
    } catch (err) {
      form.setError("root", { 
        message: err instanceof Error ? err.message : "Something went wrong" 
      });
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your project's purpose and goals..." 
                  className="min-h-[100px]"
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
          {form.formState.isSubmitting ? "Submitting..." : "Next Step"}
        </Button>
      </form>
    </Form>
  );
}; 