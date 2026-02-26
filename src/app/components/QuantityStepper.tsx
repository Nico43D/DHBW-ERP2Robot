import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from './Button';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99 }: QuantityStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-9 w-9 p-0"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center font-medium">{value}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-9 w-9 p-0"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
