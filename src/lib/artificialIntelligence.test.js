import { describe, expect, it } from 'vitest';
import {
  ARTIFICIAL_INTELLIGENCE_MODE_NAMES,
  DeMorgan,
  funcRelation,
  solveArtificialIntelligence
} from '../../artificialIntelligence.js';

describe('artificial-intelligence calculator formulas', () => {
  it('registers relation and De Morgan modes', () => {
    expect(ARTIFICIAL_INTELLIGENCE_MODE_NAMES.has('demorgan')).toBe(true);
    expect(ARTIFICIAL_INTELLIGENCE_MODE_NAMES.has('funcrelation')).toBe(true);
  });

  it('applies De Morgan simplification', () => {
    expect(DeMorgan('~(A&B)')).toBe('(~A|~B)');
  });

  it('tests whether a relation is a function', () => {
    expect(funcRelation([[1, 'a'], [2, 'b']])).toEqual({ isFunction: true });
    expect(funcRelation([[1, 'a'], [1, 'b']])).toEqual({ isFunction: false });
  });

  it('returns a worked AI formula explanation', () => {
    const explanation = solveArtificialIntelligence(
      'generalizedDeMorgan',
      ['AND', ['A', 'B', 'C']]
    );
    expect(explanation).toContain('Artificial intelligence');
    expect(explanation).toContain('~(A AND B AND C)');
  });
});
