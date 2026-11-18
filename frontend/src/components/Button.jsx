const styles = {
  primary: "bg-ink text-cream hover:bg-ink-soft",
  secondary: "bg-white text-ink ring-1 ring-ink/15 hover:bg-lilac",
  danger: "bg-sos text-white hover:bg-sos-dark shadow-sos",
  ghost: "text-ink hover:bg-ink/5",
};

export default function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full px-6 font-sans text-[15px] font-semibold transition-colors disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
