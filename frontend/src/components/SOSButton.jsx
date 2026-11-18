// Presentational only: pass your existing SOS handler as onClick.
export default function SOSButton({ onClick, size = 160, label = "SOS", disabled = false }) {
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <span aria-hidden className="absolute inset-0 animate-ring rounded-full bg-sos" />
      <span aria-hidden className="absolute inset-0 animate-ring rounded-full bg-sos [animation-delay:1.4s]" />
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label="Send emergency SOS alert"
        className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-sos font-display text-4xl font-extrabold text-white shadow-sos transition-transform active:scale-95 disabled:opacity-60"
      >
        {label}
      </button>
    </div>
  );
}
