# ai-charter Development Plan


## Phase 0: .gitignore Setup

- [x] Create a project-level .gitignore file to exclude node_modules and other unnecessary files relevant to the project's tech stack

## Phase 1: Project Setup and Core Infrastructure

### 1.1 Frontend Setup
- [x] Initialize new Vite + React + TypeScript project in frontend directory
- [x] Configure ESLint and Prettier
- [x] Set up Tailwind CSS and shadcn/ui
- [x] Create initial project structure following code guidelines
- [x] Set up environment variable handling
- [x] Configure basic routing structure
- [x] Create MainLayout component for consistent page structure
- [x] Set up initial form with basic fields
- [x] Implement form validation
- [x] Add loading states and error handling

### 1.2 Backend Setup
- [x] Set up Python virtual environment
- [x] Install required dependencies
- [x] Initialize FastAPI project structure
- [x] Configure environment variable handling
- [x] Set up basic API endpoint structure
- [x] Implement CORS handling for local development

### 1.3 LLM Integration Foundation
- [x] Set up OpenAI API client wrapper
- [x] Create basic retry mechanism
- [x] Implement API key validation
- [x] Create test endpoints for basic LLM interaction

## Phase 2: Core Form Interface

### 2.1 Project Description Form
- [x] Create form component structure
- [x] Implement initial project description input
- [x] Create context store for form data
- [x] Add basic validation
- [x] Style form components using Tailwind

### 2.2 Dynamic Question Generation
- [x] Create prompt template for follow-up questions
- [x] Implement question generation API endpoint
- [x] Build UI components for dynamic questions
- [x] Add state management for question responses
- [x] Implement response validation

### 2.3 Form State Management
- [x] Implement form progression tracking
  - Step 1: Project Description input
  - Step 2: Follow-up Questions review/edit
  - Step 3: Document Generation & Preview
- [x] Implement local storage persistence
  - Save form state on key state changes
  - Restore state on page refresh/reload
- [x] Add navigation controls (Back/Continue)
  - Implement step transitions
  - Validate required fields before progression

## Phase 3: Document Generation Core

### 3.1 Base Generation System
- [x] Create document type definitions
- [x] Implement base document generator class
- [x] Add markdown sanitization
- [x] Implement retry logic for generation failures

### 3.2 Preview System
- [ ] Create preview layout components
- [ ] Implement markdown preview
  - Add toggle between raw/rendered markdown
  - Implement live preview updates
- [ ] Implement document editing
  - Add Shadcn/ui Textarea for raw markdown editing
  - Implement save functionality for edited content

### 3.3 Individual Document Generators
- [x] Project Overview generator
- [ ] PRD generator
- [ ] UX Flow diagram generator
- [ ] Tech Stack specification generator
- [ ] Code Rules generator

## Phase 4: Export System and Polish

### 4.1 Export Functionality
- [ ] Implement document selection interface
- [ ] Create file system operations
  - Implement file writing
  - Add basic error handling for file operations
- [ ] Add download handling (create zip file of documents and allow user to download it in the browser)
- [ ] Add export progress indicators

### 4.2 Error Handling
- [ ] Implement error boundaries for UI components
- [ ] Add retry logic for failed LLM generations
- [ ] Create user-friendly error messages
- [ ] Implement markdown validation

### 4.3 UI Polish
- [ ] Add loading states and animations
- [ ] Add success/error notifications

### 4.4 Documentation
- [ ] Update project README.md
  - Add project overview
  - Document tech stack
  - Include setup instructions

## Developer Notes

### Key Considerations
- Use TypeScript interfaces shared between frontend and backend
- Implement proper error handling from the start
- Focus on user feedback and progressive enhancement

### Critical Path Dependencies
1. Basic form must be functional before starting document generation
2. Document preview system needed before implementing edit capabilities
3. Export system requires all document types to be implemented
4. Error handling should be implemented alongside each feature

### Quality Checkpoints
- TypeScript compilation passes
- ESLint shows no errors
- Responsive design working