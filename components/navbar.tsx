import { FileSearch } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ── Auth-aware navbar ─────────────────────────────────────────────────────────
export default function Navbar({ user }: { user: { email: string; name: string } | null }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? ''

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06]' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-[#C8FF5E] flex items-center justify-center">
            <FileSearch className="h-4 w-4 text-black" />
          </div>
          <span className="font-bold text-white text-[15px] tracking-tight">HireBoost</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Pricing'].map(label => (
            <a
              key={label}
              href={`#${label.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-[#C8FF5E] flex items-center justify-center">
                  <span className="text-xs font-bold text-black">{initials}</span>
                </div>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold bg-[#C8FF5E] text-black px-4 py-2 rounded-lg hover:bg-[#d4ff75] transition-colors"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}