import { useId } from 'react'

const box = 'w-full rounded-2xl bg-white px-4 text-[15px] ring-1 ring-ink/15 outline-none placeholder:text-ink-faint focus:ring-2 focus:ring-ink'

export function SelectField({ label, children, className = '', ...props }) {
  const id = useId()
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <select id={id} className={`${box} h-12`} {...props}>{children}</select>
    </div>
  )
}

export function TextAreaField({ label, hint, className = '', ...props }) {
  const id = useId()
  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <textarea id={id} className={`${box} py-3`} {...props} />
      {hint && <p className="mt-1 text-right text-xs text-ink-faint">{hint}</p>}
    </div>
  )
}

export function PageTitle({ title, subtitle, children }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 max-w-xl text-ink-soft">{subtitle}</p>}
      </div>
      {children}
    </header>
  )
}
