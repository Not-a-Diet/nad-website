'use client';

interface FoodCalculatorProps {
  className?: string;
}

const FoodCalculator = ({ className = '' }: FoodCalculatorProps) => {
  const units = [
    { value: 'grams', label: 'Grams (g)' },
    { value: 'lb', label: 'Pounds (lb)' },
    { value: 'oz', label: 'Ounces (oz)' },
  ];

  const foodTypes = [
    { value: 'meat', label: 'Meat' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
  ];

  return (
    <div className={`flex relative flex-col p-2 mb-20 items-end p-6 shadow-lg rounded-2xl bg-anti-flash_white-700 text-night lg:w-auto ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center text-kelly_green ">Food Weight Calculator</h2>
      <div className="flex flex-col lg:flex-row gap-4 items-end justify-between">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            defaultValue={1}
            min="0"
            step="0.1"
            className="w-full lg:w-[100px] px-3 py-2 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            readOnly
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium mb-1">
            Unit
          </label>
          <select
            id="unit"
            defaultValue="grams"
            className="w-full lg:w-[100px] px-3 py-2.5 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            disabled
          >
            {units.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="foodType" className="block text-sm font-medium mb-1">
            Food Type
          </label>
          <select
            id="foodType"
            defaultValue=""
            className="w-full lg:w-[150px] px-3 py-2.5 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            disabled
          >
            <option value="">Select a food type</option>
            {foodTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>

          <label htmlFor="result" className="block text-sm font-medium mb-1">Result</label>
          <input
            type="text"
            id="result"
            className="w-full lg:w-[100px] px-3 py-2 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary 
            cursor-not-allowed"
            disabled
            />
        </div>
      </div>
    </div>
  );
};

export default FoodCalculator;
