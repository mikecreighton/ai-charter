import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectForm } from '@/components/form/project-form'
import { FormProvider } from '@/contexts/form-provider'
import { DocumentProvider } from '@/contexts/DocumentContext'
import './App.css'

export default function App() {
  return (
    <DocumentProvider>
      <FormProvider>
        <MainLayout>
          <div className="w-full mx-auto py-8">
            <ProjectForm />
          </div>
        </MainLayout>
      </FormProvider>
    </DocumentProvider>
  )
}
