import { FileSearch } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
          <footer className="border-t border-white/[0.06] py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#C8FF5E] flex items-center justify-center">
              <FileSearch className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="font-bold text-white text-sm">HireBoost</span>
          </div>
          <div className="flex items-center gap-8">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Sign in', href: '/signin' },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs text-white/30 hover:text-white/70 transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <p className="text-xs text-white/20">© {new Date().getFullYear()} HireBoost</p>
        </div>
      </footer>
  )
}

export default Footer