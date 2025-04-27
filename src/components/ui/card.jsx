
export function Card({ className = '', children, ...props }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = '', children, ...props }) {
  return (
    <div className={`p-4 ${className}`} {...props}>
      {children}
    </div>
  );
}
