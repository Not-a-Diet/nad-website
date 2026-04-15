'use client';
import ErrorComponent from './components/Error';

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
