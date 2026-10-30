import { describe, expect, it } from 'vitest';
import { all, create } from 'mathjs';
import {
  MACHINE_LEARNING_MODE_NAMES,
  gainRatio,
  linearRegression,
  solveMachineLearning
} from '../../ml.js';

const math = create(all, { matrix: 'Array' });

describe('machine-learning calculator formulas', () => {
  it('registers machine-learning modes and explains distance calculations', () => {
    expect(MACHINE_LEARNING_MODE_NAMES.has('euclideandistance')).toBe(true);
    const explanation = solveMachineLearning('euclideanDistance', [[1, 2], [4, 6]]);
    expect(explanation).toContain('Step 1: Identify the inputs');
    expect(explanation).toContain('d₂ = √Σ(aᵢ − bᵢ)²');
    expect(explanation).toContain('Result: 5');
  });

  it('fits a linear model with an intercept', () => {
    expect(linearRegression([[1], [2], [3]], [2, 4, 6])).toEqual([0, 2]);
    const explanation = solveMachineLearning('linearRegression', [[[1], [2], [3]], [2, 4, 6]]);
    expect(explanation).toContain('Model: ŷ = 0 + (2)x1.');
    expect(explanation).toContain('Result: [0, 2]');
  });

  it('calculates gain ratio separately for each feature', () => {
    expect(gainRatio([[0, 1], [0, 2], [1, 1], [1, 2]], [0, 0, 1, 1])).toEqual([1, 0]);
    expect(() => gainRatio([[0], [1]], [0])).toThrow('matching the labels');
  });

  it('returns a worked error-metric explanation', () => {
    const explanation = solveMachineLearning('meanSquaredError', [[2, 4, 5], [2, 4, 6]]);
    expect(explanation).toContain('MSE = Σ(yᵢ − ŷᵢ)² / n');
    expect(explanation).toContain('Result: 0.33333333');
  });

  it('shows parameter updates for gradient descent', () => {
    const explanation = solveMachineLearning('gradientDescent', [['2*x'], [3], 0.1, 2], math);
    expect(explanation).toContain('Step 1: gradient = [6]; update parameters to [2.4].');
    expect(explanation).toContain('Result: parameters = [1.92] after 2 iteration(s).');
  });

  it('rejects invalid formula dimensions instead of returning a result', () => {
    expect(() => solveMachineLearning('euclideanDistance', [[1, 2], [1]])).toThrow('same dimension');
    expect(() => solveMachineLearning('meanSquaredError', [[1, 2], [1]])).toThrow('same length');
  });
});
