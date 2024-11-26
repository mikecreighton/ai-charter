import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useForm } from '@/hooks/use-form'
import { useDocuments } from '@/contexts/document';

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { resetForm } = useForm();
  const { resetDocuments } = useDocuments();

  const handleReset = () => {
    resetForm();
    resetDocuments();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-8 mx-8">
        <div className="flex justify-between items-center">
          <h1>AI Charter</h1>
          <Button 
            variant="outline" 
            onClick={handleReset}
            size="sm"
          >
            Start Over
          </Button>
        </div>
      </header>
      <main className="py-8">
        <div className="mx-auto px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
