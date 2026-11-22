import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  label = 'Quantity',
}) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className={`stepper stepper--${size}`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 14 : 16} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 14 : 16} />
      </button>
    </div>
  );
}
