import fs from 'node:fs';
import vm from 'node:vm';
import { describe, it, expect } from 'vitest';
import { solveWordProblem, classifyWordProblem } from './wordProblemSolver';

function loadCalculatorScript(fileName) {
  const code = fs.readFileSync(new URL(`../../${fileName}`, import.meta.url), 'utf8');
  const context = {
    window: {},
    console,
    Math,
    Number,
    Array,
    Object,
    String,
    Boolean,
    Date,
    RegExp,
    Error,
    isNaN,
    parseFloat,
    parseInt
  };
  context.window = context;
  vm.runInNewContext(code, context);
  return context;
}

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

  it('supports advanced chemistry, physics, and engineering formula modes', () => {
    const chemistry = loadCalculatorScript('chemistry.js');
    const physics = loadCalculatorScript('physics.js');
    const engineering = loadCalculatorScript('engineering.js');

    expect(chemistry.window.CHEMISTRY_MODE_NAMES.has('dilution')).toBe(true);
    expect(chemistry.solveChemistry('dilution(1.0, 0.5, 2.0)')).toContain('C1V1 = C2V2');

    expect(physics.window.PHYSICS_MODE_NAMES.has('wave')).toBe(true);
    expect(physics.solvePhysics('wave(2, 5, 0.5)')).toContain('v = f·λ');

    expect(engineering.window.ENGINEERING_MODE_NAMES.has('powertransmission')).toBe(true);
    expect(engineering.solveEngineering('powertransmission(1500, 1800, 0.85)')).toContain('P_out');
  });
});
