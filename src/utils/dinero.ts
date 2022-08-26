import { NGN } from '@dinero.js/currencies';
import { Dinero, dinero, Transformer } from 'dinero.js';

export function integerFromFloatString(float: string): number {
  return parseInt(float.replace(/[^-\d]/g, ''), 10);
}

export function Kobo(value: string): Dinero<number> {
  try {
    const amount = integerFromFloatString(value);
    return dinero({ amount, currency: NGN });
  } catch {
    return dinero({ amount: 0, currency: NGN });
  }
}

export const currencyTransformer: Transformer<number> = ({ amount, currency }) =>
  amount.toLocaleString('en-US', {
    style: 'currency',
    currency: currency.code,
    useGrouping: true,
  });

export const decimalStringTransformer: Transformer<number> = ({ amount }) => amount.toFixed(2);
