// app/account/shared.tsx
import { CheckCircle, AlertCircle } from 'lucide-react'

export function SectionHeader({ icon: Icon, title, description }: {
  icon: React.ElementType; title: string; description: string
}) {
  return (
    <div className="flex items-start gap-4 mb-8">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 shadow-inner">
        <Icon className="h-5 w-5 text-white/40" />
      </div>
      <div>
        <h3 className="font-bold text-white text-base tracking-tight">{title}</h3>
        <p className="text-sm text-white/30 mt-0.5">{description}</p>
      </div>
    </div>
  )
}

export function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border text-sm mb-6 animate-in fade-in slide-in-from-top-2 ${
      type === 'success'
        ? 'bg-[#C8FF5E]/10 border-[#C8FF5E]/20 text-[#C8FF5E]'
        : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      {type === 'success' ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      <span className="font-medium">{message}</span>
    </div>
  )
}