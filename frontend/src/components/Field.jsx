import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Labelled input with optional leading icon and show/hide toggle.
// Pass the same props you would pass to <input> (name, value, onChange, ...).
export default function Field({ label, icon: Icon, toggle = false, type = 'text', className = '', ...props }) {
  const id = useId()
  const [show, setShow] = useState(false)
  const inputType = toggle ? (show ? 'text' : type) : type

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className="flex min-h-[48px] items-center gap-3 rounded-2xl bg-white px-4 ring-1 ring-ink/15 focus-within:ring-2 focus-within:ring-ink">
        {Icon && <Icon size={18} className="shrink-0 text-ink-faint" />}
        <input
          id={id}
          type={inputType}
          className="h-12 w-full bg-transparent text-[15px] outline-none placeholder:text-ink-faint"
          {...props}
        />
        {toggle && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            aria-label={show ? 'Hide' : 'Show'}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-faint hover:bg-ink/5"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  )
}
