import { isAuthenticated } from '@/auth/auth'
import { Header } from '@/components/header'

import Home from './home-components'

export default async function HomePage() {
  if (isAuthenticated()) {
    return (
      <div className="space-y-4 py-5">
        <Header />
        <main className="mx-auto w-full max-w-[1200px] space-y-4">
          <p className="text-sm text-muted-foreground">
            Select an organization
          </p>
        </main>
      </div>
    )
  }
  return <Home />
}
