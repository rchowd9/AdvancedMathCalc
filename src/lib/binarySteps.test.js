import { describe, expect, it } from 'vitest';
import {
  BINARY_EXPLANATIONS,
  binary_division,
  binary_to_decimal,
  decimal_to_floating_point,
  fraction_to_floating_point,
  negate_twos_complement,
  sign_extension,
  twos_complement,
} from '../../binary.js';

describe('binary formula explanations', () => {
  it('shows place-value conversion steps', () => {
    const result = BINARY_EXPLANATIONS.binary_to_decimal('1011');

    expect(result).toContain('1 × 2^3 = 8');
    expect(result).toContain(`Answer: ${binary_to_decimal('1011')}`);
  });

  it('computes two’s complement at the input bit width', () => {
    expect(twos_complement('0101')).toBe('1011');
    expect(negate_twos_complement('1111')).toBe('0001');
    expect(BINARY_EXPLANATIONS.twos_complement('0101')).toContain('Answer: 1011');
  });

  it('preserves the sign when extending and encoding negative floating-point values', () => {
    expect(sign_extension('101', 5)).toBe('11101');
    expect(decimal_to_floating_point(-5, 4, 5)).toMatch(/^1/);
    expect(fraction_to_floating_point(-0.5, 4, 5)).toMatch(/^1/);
  });

  it('uses the integer quotient for binary division and rejects division by zero', () => {
    expect(binary_division('1001', '10')).toBe('100');
    expect(() => BINARY_EXPLANATIONS.binary_division('1', '0')).toThrow('Cannot divide by zero');
  });

  it('provides an explanation for every binary formula', () => {
    expect(Object.keys(BINARY_EXPLANATIONS)).toEqual([
      'binary_to_decimal',
      'decimal_to_binary',
      'hexadecimal_to_octal',
      'hexadecimal_to_binary',
      'decimal_to_octal',
      'decimal_to_hexadecimal',
      'binary_addition',
      'twos_complement',
      'negate_twos_complement',
      'hamming_distance',
      'sign_magnitude',
      'sign_extension',
      'decimal_to_floating_point',
      'fraction_to_floating_point',
      'binary_multiplication',
      'binary_division',
    ]);
  });
});
