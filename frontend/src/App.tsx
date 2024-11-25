import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function App() {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [aiPreferences, setAiPreferences] = useState({
    codeStyle: false,
    testing: false,
    documentation: false,
    security: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      projectName,
      projectDescription,
      aiPreferences,
    })
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Name */}
          <div className="space-y-2">
            <label htmlFor="projectName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Project Name
            </label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter your project name..."
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Project Description
            </label>
            <Textarea
              id="description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project's purpose and goals..."
              className="min-h-[100px]"
            />
          </div>

          {/* AI Preferences Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">AI Assistant Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="codeStyle"
                  checked={aiPreferences.codeStyle}
                  onCheckedChange={(checked) =>
                    setAiPreferences(prev => ({ ...prev, codeStyle: checked as boolean }))
                  }
                />
                <label htmlFor="codeStyle">Code Style Guidelines</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="testing"
                  checked={aiPreferences.testing}
                  onCheckedChange={(checked) =>
                    setAiPreferences(prev => ({ ...prev, testing: checked as boolean }))
                  }
                />
                <label htmlFor="testing">Testing Requirements</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="documentation"
                  checked={aiPreferences.documentation}
                  onCheckedChange={(checked) =>
                    setAiPreferences(prev => ({ ...prev, documentation: checked as boolean }))
                  }
                />
                <label htmlFor="documentation">Documentation Standards</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="security"
                  checked={aiPreferences.security}
                  onCheckedChange={(checked) =>
                    setAiPreferences(prev => ({ ...prev, security: checked as boolean }))
                  }
                />
                <label htmlFor="security">Security Best Practices</label>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Generate Project Documentation
          </Button>
        </form>
      </div>
    </MainLayout>
  )
}
