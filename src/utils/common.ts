import currency from 'currency.js';

export const currencyFormat = (value: string | number): string =>
  currency(value, { symbol: '₦', pattern: '! #' }).format();

export type TableCellStyle = {
  minWidth?: number;
  width?: number;
  maxWidth?: number;
};

export const NAIRA = {
  exponent: 2,
  code: 'NGN',
  symbol: '₦',
  decimal_separator: '.',
  thousands_separator: ',',
};
export const isNairaCurrency = {
  allow_negatives: false,
  symbol: NAIRA.symbol,
  require_symbol: false,
  allow_space_after_symbol: true,
  symbol_after_digits: false,
  allow_decimal: true,
  require_decimal: false,
  digits_after_decimal: [1, 2],
  decimal_separator: NAIRA.decimal_separator,
  thousands_separator: NAIRA.thousands_separator,
};
