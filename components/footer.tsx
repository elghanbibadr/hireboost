import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">HireBoost</h3>
            <p className="text-sm text-foreground/60">
              Optimize your resume with AI and land more interviews.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><Link href="/" className="hover:text-foreground transition">Home</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground transition">Pricing</Link></li>
              <li><a href="#" className="hover:text-foreground transition">Features</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">About</a></li>
              <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground transition">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
          <p>&copy; 2024 HireBoost. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition">Twitter</a>
            <a href="#" className="hover:text-foreground transition">LinkedIn</a>
            <a href="#" className="hover:text-foreground transition">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
