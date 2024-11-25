import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface TechStack {
  frontend: string[]
  backend: string[]
  database: string[]
}

function App() {
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [techStack, setTechStack] = useState<TechStack>({
    frontend: [],
    backend: [],
    database: []
  })
  const [aiPreferences, setAiPreferences] = useState({
    codeStyle: false,
    testing: false,
    documentation: false,
    security: false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle form submission
    console.log({
      projectName,
      description,
      techStack,
      aiPreferences
    })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Project Overview Generator
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create a comprehensive overview document for your project that AI tools can understand.
          </p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-2">
              <label htmlFor="projectName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Project Name
              </label>
              <Input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g., AI Charter"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Project Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project's purpose and goals..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Assistant Preferences</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="codeStyle"
                    checked={aiPreferences.codeStyle}
                    onCheckedChange={(checked) => 
                      setAiPreferences(prev => ({...prev, codeStyle: checked as boolean}))
                    }
                  />
                  <label
                    htmlFor="codeStyle"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enforce specific code style guidelines
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="testing"
                    checked={aiPreferences.testing}
                    onCheckedChange={(checked) => 
                      setAiPreferences(prev => ({...prev, testing: checked as boolean}))
                    }
                  />
                  <label
                    htmlFor="testing"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include testing requirements
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documentation"
                    checked={aiPreferences.documentation}
                    onCheckedChange={(checked) => 
                      setAiPreferences(prev => ({...prev, documentation: checked as boolean}))
                    }
                  />
                  <label
                    htmlFor="documentation"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Enforce documentation standards
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="security"
                    checked={aiPreferences.security}
                    onCheckedChange={(checked) => 
                      setAiPreferences(prev => ({...prev, security: checked as boolean}))
                    }
                  />
                  <label
                    htmlFor="security"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include security best practices
                  </label>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Generate Overview
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
