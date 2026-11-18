const tones = {
  safe: "bg-safe-soft text-[#136B5D]",
  pending: "bg-[#FCEFD2] text-[#8A5A00]",
  danger: "bg-[#FBDDE2] text-[#A11D31]",
  neutral: "bg-lilac text-ink-soft",
};

export default function Badge({ tone = "neutral", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
