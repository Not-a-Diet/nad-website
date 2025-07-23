'use client';

import { useState } from 'react';
import { renderButtonStyle } from '../utils/render-button-style';

interface FoodCalculatorProps {
  className?: string;
}

const getFoodTypes = async () => {
  const response = await fetch('/api/food-types');
  const data = await response.json();
  return data;
}

const FoodCalculator = ({ className = '' }: FoodCalculatorProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('grams');
  const [foodType, setFoodType] = useState<string>('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log({ quantity, unit, foodType });
  };

  return (
    <div className={`flex relative flex-col p-2 mb-20 items-right p-6 shadow-lg rounded-2xl bg-anti-flash_white-700 text-night lg:w-auto ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-center text-kelly_green ">Food Weight Calculator</h2>
      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4 items-right justify-between">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="0"
            step="0.1"
            className="w-full lg:w-[100px] px-3 py-2 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium mb-1">
            Unit
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full lg:w-[100px] px-3 py-2.5 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
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
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            className="w-full lg:w-[150px] px-3 py-2.5 border border-night text-night rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            required
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
      </form>
        <button
          type="submit"
          className={`${renderButtonStyle("primary")} py-2 mt-4 w-full text-center`}
        >
          Calculate
        </button>
    </div>
  );
};

export default FoodCalculator; 