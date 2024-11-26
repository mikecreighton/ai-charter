# ai-charter - System Overview

## Application Summary
The application is a specialized tool designed to help developers create comprehensive context documentation for AI-powered IDE interactions. It functions as an interactive form-based system that guides developers through describing their project requirements, technical preferences, and development guidelines. The app processes this information to generate structured documentation that can be used to provide better context to AI language models within IDEs, ultimately improving the AI's ability to assist in development tasks.

## Key Features
- Interactive, step-by-step project definition form
- Intelligent follow-up question generation based on initial project description
- Multiple document generation capabilities:
  * High-level project overview
  * Formal PRD (Product Requirements Document)
  * Technical stack specification
  * Code style and documentation guidelines
  * Feature roadmap and development plan
- Individual document download functionality
- Context-aware project analysis
- Tech stack preference capture
- Development practices documentation
- Project structure and organization guidelines

## Technical Stack

### Frontend
- React.js
- Modern CSS (assumed: Tailwind CSS or styled-components)
- JavaScript/TypeScript

### Backend
- Python
- FastAPI
- OpenAI API or similar LLM integration

### Database
- No persistent storage (as specified)

### Additional Services
- LLM API service (assumed: OpenAI GPT or similar)

## User Roles
- Developers (primary users)
- Technical leads (potential users for setting project standards)

## Integrations
- Large Language Model APIs (e.g., OpenAI, Anthropic, OpenRouter, Gemini, etc.)
- Document export functionality (PDF, Markdown, or similar formats)

## Additional Notes
- The application is designed to be stateless, with no authentication requirements
- All generated documents are session-based and not persisted
- The system is intended to be lightweight and focused solely on document generation
- The app makes multiple separate API calls to the LLM for different document types
- The interface should be simple and intuitive, focusing on gathering information efficiently
- The system should be capable of inferring additional context from initial user input