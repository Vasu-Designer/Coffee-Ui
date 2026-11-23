'use client';

import { Icon } from '@/components/ui/Icon';
import styles from './QuantityStepper.module.css';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 24,
  size = 'md',
  label = 'item',
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  return (
    <div className={styles.stepper} data-size={size} role="group" aria-label={`Quantity for ${label}`}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Icon name="minus" size={14} />
      </button>
      <output aria-live="polite" className="tabular">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Icon name="plus" size={14} />
      </button>
    </div>
  );
}
