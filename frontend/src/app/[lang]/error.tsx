'use client';
import ErrorComponent from './components/Error';

interface RootErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootErrorBoundary({
  error,
  reset,
}: RootErrorBoundaryProps) {
  console.error(error);

  return (
    <div>
      <ErrorComponent />
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-500 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}