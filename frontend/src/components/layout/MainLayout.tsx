import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-8 mx-8">
        <h1>AI Charter</h1>
      </header>
      <main className="py-8">
        <div className="mx-auto px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
