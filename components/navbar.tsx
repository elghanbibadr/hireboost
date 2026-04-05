import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-primary">
            HireBoost
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-foreground/70 hover:text-foreground transition">
              Home
            </Link>
            <Link href="/pricing" className="text-sm text-foreground/70 hover:text-foreground transition">
              Pricing
            </Link>
            <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-foreground transition">
              How it Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
