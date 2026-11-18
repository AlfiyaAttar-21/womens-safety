import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Alert({ type = 'error', children }) {
  if (!children) return null
  const error = type === 'error'
  return (
    <p
      role={error ? 'alert' : 'status'}
      className={`mb-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
        error ? 'bg-[#FBDDE2] text-[#A11D31]' : 'bg-safe-soft text-[#136B5D]'
      }`}
    >
      {error ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
      <span>{children}</span>
    </p>
  )
}
