import { describe, expect, it } from 'vitest';
import { all, create } from 'mathjs';
import { solveDifferentialEquation } from '../../differentialEquations.js';

const math = create(all, { matrix: 'Array' });

describe('differential-equation solver', () => {
  it('approximates a scalar initial-value problem with fourth-order Runge-Kutta', () => {
    const result = solveDifferentialEquation('solveOde(y, x, y, 0, 1, 1, 100)', math);
    expect(result).toContain('Fourth-order Runge-Kutta integration with 100 steps');
    expect(result).toContain('Approximate solution at x = 1: y = 2.7182818');
  });

  it('solves a coupled oscillator system', () => {
    const result = solveDifferentialEquation(
      'solveOdeSystem([v, -x], [x, v], t, 0, [1, 0], 1.57079632679, 100)',
      math
    );
    const finalState = result.match(/Approximate final state .*: \[([^\]]+)\]/);
    expect(finalState).not.toBeNull();
    const [position, velocity] = finalState[1].split(', ').map(Number);
    expect(position).toBeCloseTo(0, 7);
    expect(velocity).toBeCloseTo(-1, 7);
  });

  it('supports backward integration and default step counts', () => {
    const result = solveDifferentialEquation('solveOde(1, x, y, 1, 2, 0)', math);
    expect(result).toContain('Fourth-order Runge-Kutta integration with 100 steps');
    expect(result).toContain('Approximate solution at x = 0: y = 1');
  });

  it('rejects invalid step counts and mismatched systems', () => {
    expect(() => solveDifferentialEquation('solveOde(y, x, y, 0, 1, 1, 0)', math))
      .toThrow('Step count must be an integer');
    expect(() => solveDifferentialEquation('solveOdeSystem([v, -x], [x], t, 0, [1], 1)', math))
      .toThrow('Each system equation needs one distinct state variable');
  });
});
