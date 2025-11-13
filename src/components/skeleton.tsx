// Simple Skeleton component if you don't have one
export function Skeleton({ className }: { className?: string }) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} />
    );
  }