# AICharter Code Style & Documentation Guidelines

## Repository Structure
```
aicharter/
├── frontend/           # React application
└── backend/           # Python API integration
└── project-charter/    # All the information about the project that you are working on
```

## Frontend Guidelines

### Directory Structure
```
frontend/
├── src/
│   ├── components/    # React components
│   │   ├── form/     # Form-related components
│   │   ├── documents/ # Document generation components
│   │   └── ui/       # Reusable UI components
│   ├── contexts/     # React Context definitions
│   ├── types/        # TypeScript type definitions
│   ├── utils/        # Utility functions
│   ├── services/     # OpenAI API integration
│   └── constants/    # Project constants
├── public/           # Static assets
└── package.json
```

### Frontend Code Style

#### Component Structure
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ProjectFormProps {
  onSubmit: (data: ProjectData) => void;
}

export const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
  // State declarations
  // Hook declarations
  // Helper functions
  // Return JSX
};
```

#### Frontend Naming Conventions
- Components: PascalCase (e.g., ProjectForm)
- Functions: camelCase (e.g., handleSubmit)
- Files: kebab-case (e.g., project-form.tsx)
- Constants: UPPER_SNAKE_CASE (e.g., MAX_RETRIES)
- Boolean variables: start with is/has/should (e.g., isLoading)

#### Frontend Documentation
```typescript
/**
 * Form component for collecting project information.
 * 
 * @param onSubmit - Callback function called when form is submitted
 * @example
 * <ProjectForm onSubmit={handleFormSubmit} />
 */
```

## Backend Guidelines

### Directory Structure
```
backend/
├── src/
│   ├── llm/          # LLM integration
│   │   ├── prompts/  # Prompt templates
│   │   └── utils/    # LLM utility functions
│   ├── types/        # Type definitions
│   └── constants/    # Project constants
└── requirements.txt
```

### Python Code Style

#### Function Structure
```python
from typing import Dict, Optional

def generate_document(
    project_data: Dict[str, any],
    doc_type: str,
    *,
    max_retries: Optional[int] = 3
) -> str:
    """
    Generate project documentation using OpenAI API.
    
    Args:
        project_data: Dictionary containing project information
        doc_type: Type of document to generate
        max_retries: Maximum number of API retry attempts
        
    Returns:
        Generated document content as string
        
    Raises:
        OpenAIError: If API call fails after retries
    """
    # Function implementation
```

#### Python Naming Conventions
- Functions: snake_case (e.g., generate_document)
- Classes: PascalCase (e.g., DocumentGenerator)
- Variables: snake_case (e.g., project_data)
- Constants: UPPER_SNAKE_CASE (e.g., MAX_RETRIES)
- Private methods/variables: _leading_underscore

#### Python Documentation
- Use Google-style docstrings
- Include type hints for all functions
- Document raised exceptions
- Provide usage examples in docstrings

## Shared Guidelines

### Error Handling
- Log errors with appropriate detail
- Use typed/structured error responses
- Implement retry logic for external services
- Provide user-friendly error messages

### Code Organization
- Group related functionality together
- Keep files focused and single-purpose
- Maximum file length: ~300 lines
- Use clear, descriptive names

### Environment Variables
```
# Frontend (.env)
VITE_API_URL=xxx

# Backend (.env)
OPENAI_API_KEY=xxx
OPENROUTER_API_KEY=xxx
GEMINI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
```

### Type Safety
- Use TypeScript in frontend
- Use type hints in Python
- Define shared types/interfaces for data structures
- Export type definitions for reuse

### Documentation Requirements
- README.md in each directory
- Setup instructions in root README.md
- API documentation for all public functions
- Inline comments for complex logic
- Use consistent style and formatting
- Include usage examples in code
- IMPORTANT: Update the `/project-charter/project-development-plan.md` file as features are implemented, checking off the corresponding tasks.