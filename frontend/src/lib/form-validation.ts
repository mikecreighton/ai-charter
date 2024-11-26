import { z } from "zod";

export const projectFormSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Please provide a more detailed description"),
  techStack: z.array(z.string()).optional(),
  architecture: z.string().optional(),
  developmentGuidelines: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>; 