import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectForm } from '@/components/form/ProjectForm'
import { FormProvider } from '@/contexts/FormProvider'
import { DocumentProvider } from '@/contexts/document'
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
