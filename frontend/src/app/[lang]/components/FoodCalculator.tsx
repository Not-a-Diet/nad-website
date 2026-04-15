interface FoodCalculatorProps {
  className?: string;
}

const FoodCalculator = ({ className = '' }: FoodCalculatorProps) => {
  return (
    <div className={`flex relative flex-col p-6 mb-20 items-center justify-center shadow-lg rounded-2xl bg-anti-flash_white-700 text-night lg:w-auto ${className}`}>
      <h2 className="text-2xl font-bold mb-4 text-center text-kelly_green">Food Weight Calculator</h2>
      <p className="text-center text-crema-500 mb-6">Coming soon — we&apos;re building a smarter way to calculate food weights after cooking.</p>
      <div className="flex items-center justify-center gap-2 text-secondary">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Stay tuned!</span>
      </div>
    </div>
  );
};

export default FoodCalculator;