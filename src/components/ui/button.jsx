
export function Button({ className = '', children, ...props }) {
  return (
    <button
      className={`rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
