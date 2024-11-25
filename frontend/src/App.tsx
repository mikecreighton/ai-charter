import { MainLayout } from '@/components/layout/MainLayout'
import { ProjectForm } from '@/components/form/project-form'
import { FormProvider } from '@/contexts/form-provider'
import './App.css'

export default function App() {
  return (
    <FormProvider>
      <MainLayout>
        <div className="w-full mx-auto py-8">
          <ProjectForm />
        </div>
      </MainLayout>
    </FormProvider>
  )
}
