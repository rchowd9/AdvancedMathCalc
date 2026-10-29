import { describe, expect, it } from 'vitest';
import {
  COMPUTER_SCIENCE_EXPLANATIONS,
  linear_probing,
  master_theorem,
} from '../../computerSci.js';

describe('computer science formula explanations', () => {
  it('explains a master theorem recurrence and identifies the matching case', () => {
    const result = COMPUTER_SCIENCE_EXPLANATIONS.master_theorem(2, 2, 'n^2');

    expect(result).toContain('p = log_2(2) = 1');
    expect(result).toContain('case 3');
    expect(result).toContain(master_theorem(2, 2, 'n^2'));
  });

  it('shows the substitution for hash probing without changing the formula result', () => {
    const result = COMPUTER_SCIENCE_EXPLANATIONS.linear_probing(17, 7, 2);

    expect(result).toContain('(17 + 2) mod 7');
    expect(result).toContain(`Answer: ${linear_probing(17, 7, 2)}`);
  });

  it('provides an explanation for every computer science formula', () => {
    expect(Object.keys(COMPUTER_SCIENCE_EXPLANATIONS)).toEqual([
      'master_theorem',
      'linear_probing',
      'quadratic_probing',
      'double_hashing',
      'load_factor',
      'modulo_division_hash',
      'multiplicative_hash',
    ]);
  });
});
