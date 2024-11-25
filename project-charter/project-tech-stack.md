# ai-charter Technical Stack Specification

## Frontend Architecture

### Core Framework
- React.js (latest stable version)
- TypeScript for type safety and better IDE integration
- Vite as build tool for faster development experience

### UI Framework & Styling
- Tailwind CSS for utility-first styling
- shadcn/ui for pre-built component library integration

### State Management
- React Context API for global state (managing form data and generation state)

### Form Handling
- Native HTML form controls
- Basic required field validation
- Simple form state management with React useState/useContext

## LLM Integration

### API Integration
- Direct OpenAI API integration with GPT-4
- Simple retry mechanism for API failures
- Environment variables for API key management

## Local Development

### Development Environment
- Basic ESLint + Prettier setup for code formatting
- Simple npm scripts for development and building

## Application Structure

### Core Components
- Form components for collecting project information
- Document generation components
- Document preview/export functionality
- Basic error handling for API calls

### Data Flow
- All data stored in memory during session
- No persistence layer
- Direct API calls to OpenAI
- Document generation happens client-side

## Configuration
- Environment variables for API keys
- Basic configuration options stored in constants
- Simple project settings management

This simplified stack focuses on the essential components needed for a local development tool while maintaining the core functionality of generating project documentation through LLM integration.