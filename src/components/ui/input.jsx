
export function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
      {...props}
    />
  );
}
