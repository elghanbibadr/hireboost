import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Page not found</h2>
          <p className="text-foreground/70">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>

        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Go back home
          </Link>
        </Button>
      </div>
    </div>
  )
}
