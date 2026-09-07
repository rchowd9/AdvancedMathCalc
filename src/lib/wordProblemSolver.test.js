import { describe, it, expect } from 'vitest';
import { solveWordProblem, classifyWordProblem } from './wordProblemSolver';

describe('word problem solver', () => {
  it('classifies a motion problem correctly', () => {
    expect(classifyWordProblem('A train travels 120 miles in 3 hours.')).toBe('motion');
  });

  it('solves a multi-step mixture problem', () => {
    const result = solveWordProblem('A chemist mixes 18 liters of 20% salt solution with 12 liters of 50% salt solution. How much salt is in the final mixture?');
    expect(result.summary).toContain('salt');
    expect(result.answer).toBe(9.6);
  });

  it('solves a combined rate problem', () => {
    const result = solveWordProblem('Machine A can complete a job in 6 hours and machine B can complete the same job in 4 hours. How long will they take together?');
    expect(result.category).toBe('work');
    expect(result.answer).toBeCloseTo(2.4, 5);
  });
});
