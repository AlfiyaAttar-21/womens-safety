export default function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-soft ${className}`} {...props}>
      {children}
    </div>
  );
}
