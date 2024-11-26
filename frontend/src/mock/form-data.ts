import type { ProjectFormData, InitialAnalysisResponse } from "@/types/form";

export const mockInitialFormData: ProjectFormData = {
  projectName: "AI Charter",
  description: "Okay, so I'm creating sort of an app that is to be used by developers when they're working with IDEs that are powered by AI language models. When working with AI language models in your IDE, developers often skip a very important step, which is to give the language model a sufficient context about the project. This is sort of the information that you're going to need to get the project. This is the information that will help the LLM understand things like what is this project about? What are you trying to accomplish? What is maybe the tech stack associated with this? Where do you like to keep your files stored? What is the best coding practices that you want to adhere to? What are the libraries that you want to include? Things like that. And so I want to create an app that is sort of a procedural step-by-step form almost that allows users to, at a very high level, describe their app, what they want to make, have the model intelligently examine it, and understand that it needs to maybe fill in the blanks. So maybe ask some follow-up questions about their app. And then about intention in terms of preferences around things like in the tech stack, are we using React? Are we using Vue? Are we using vanilla HTML, JavaScript, CSS? Or what kind of backend do you prefer to use? Do you want authentication, etc.? Anything that would impact the actual development of the app because the large language model will actually end up building the app. So I want this thing to be very simple. I want it to be sort of be built with React on the front end and a simple Python fast API backend. There should be no authorization, there should be no databases or anything like that. It's really just like trying to understand the user's product idea or project idea and then outputting this sort of high level overview of what the project's about. Just the thing that would help a human understand what the developer is trying to accomplish. And then separately, maybe it is also going to create a more formal PRD. Separately it would create a more formal description of the tech stack. Separately it would create sort of a rules set when it comes to how the LLM should actually approach the code. And this would be things like style and documentation. And ideally it would also include separately a little bit of a feature roadmap, kind of like a to-do list of how to incrementally go about building this thing step by step by step. And all of these would end up being separate documents in the end within this app so that a user could download as they desired. Or rather than it being just like one giant document. So we would on the back end of our app probably break up the calls to our own LLM into separate calls for generating these individual documents. But the first one would be this high level document about the app."
};

export const mockFollowUpFormData: ProjectFormData = {
  ...mockInitialFormData,
  followUpResponses: {
    "ui_flow": "Wizard-style interface to keep it organized and not overwhelming",
    "export_format": "Markdown files for easy version control and readability",
    "llm_integration": "OpenAI's GPT-4 API",
    "state_management": "Yes, using React context or Redux for temporary state management"
  }
};

export const mockSimpleInitialAnalysisResponse: InitialAnalysisResponse = {
  needsFollowUp: false,
  analysis: "The project is well-described in terms of its primary purpose: creating a tool to help developers better contextualize their projects for AI-powered IDEs. The core functionality, basic tech stack (React frontend, FastAPI backend), and desired outputs are clearly stated. The app will be a form-based interface that generates multiple documentation types, with no need for authentication or persistent storage. The main technical requirements are straightforward. I feel good about proceeding with generating an overview."
};

export const mockComplexInitialAnalysisResponse: InitialAnalysisResponse = {
  needsFollowUp: true,
  analysis: "The project is well-described in terms of its primary purpose: creating a tool to help developers better contextualize their projects for AI-powered IDEs. The core functionality, basic tech stack (React frontend, FastAPI backend), and desired outputs are clearly stated. The app will be a form-based interface that generates multiple documentation types, with no need for authentication or persistent storage. The main technical requirements are straightforward, though some implementation details could use clarification.",
  followUpQuestions: [
    {
      "id": "ui_flow",
      "question": "Should the form be a single page with all questions, or a wizard-style interface with steps?",
      "suggestedAnswer": "Wizard-style interface to keep it organized and not overwhelming"
    },
    {
      "id": "export_format",
      "question": "What format should the generated documents be exported in (MD, PDF, JSON, etc.)?",
      "suggestedAnswer": "Markdown files for easy version control and readability"
    },
    {
      "id": "llm_integration",
      "question": "Which LLM provider/API do you plan to use for the backend (OpenAI, Anthropic, etc.)?",
      "suggestedAnswer": "OpenAI's GPT-4 API"
    },
    {
      "id": "state_management",
      "question": "Since there's no database, should the app maintain any temporary session state between steps?",
      "suggestedAnswer": "Yes, using React context or Redux for temporary state management"
    }
  ]
}