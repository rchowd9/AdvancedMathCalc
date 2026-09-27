import fs from 'node:fs';
import vm from 'node:vm';
import { describe, it, expect } from 'vitest';
import { all, create } from 'mathjs';
import { solveWordProblem, classifyWordProblem } from './wordProblemSolver';
import { solveStatistics } from '../../statistics.js';

function loadCalculatorScript(fileName) {
  const code = fs.readFileSync(new URL(`../../${fileName}`, import.meta.url), 'utf8');
  const context = {
    window: {},
    console,
    Math,
    Number,
    math: { create: (config) => create(all, config) },
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
    const geometry = loadCalculatorScript('geometryProofs.js');
    const civil = loadCalculatorScript('civil.js');
    const computer = loadCalculatorScript('computer.js');
    const electrical = loadCalculatorScript('electrical.js');
    const mechanical = loadCalculatorScript('mechanical.js');

    expect(chemistry.window.CHEMISTRY_MODE_NAMES.has('dilution')).toBe(true);
    expect(chemistry.solveChemistry('dilution(1.0, 0.5, 2.0)')).toContain('C1V1 = C2V2');
    expect(chemistry.solveChemistry('dilution(1.0, 0.5, 2.0)')).toContain('Output units: mol/L');
    expect(chemistry.window.CHEMISTRY_MODE_NAMES.has('organic')).toBe(true);
    expect(chemistry.solveChemistry('organic(C6H6)')).toContain('C6H6');

    expect(physics.window.PHYSICS_MODE_NAMES.has('wave')).toBe(true);
    expect(physics.solvePhysics('wave(2, 5, 0.5)')).toContain('v = f·λ');
    expect(physics.solvePhysics('kinematics(0, 9.8, 3)')).toContain('Output units: final velocity m/s; displacement m');
    expect(physics.window.PHYSICS_MODE_NAMES.has('weight')).toBe(true);
    expect(physics.solvePhysics('weight(5, 9.8)')).toContain('W = m·g');
    expect(physics.window.PHYSICS_MODE_NAMES.has('torque')).toBe(true);
    expect(physics.solvePhysics('torque(0.5, 20, 90)')).toContain('τ = r·F·sin');
    expect(physics.window.PHYSICS_MODE_NAMES.has('snelllaw')).toBe(true);
    expect(physics.solvePhysics('snellLaw(1.0, 30, 1.5)')).toContain('θ₂');

    expect(engineering.window.ENGINEERING_MODE_NAMES.has('powertransmission')).toBe(true);
    expect(engineering.solveEngineering('powertransmission(1500, 1800, 0.85)')).toContain('P_out');
    expect(engineering.window.ENGINEERING_MODE_NAMES.has('pipeflow')).toBe(true);
    expect(engineering.solveEngineering('pipeFlow(998, 2, 0.05, 0.001, 0.00005)')).toContain('Pressure gradient');
    expect(engineering.solveEngineering('rigidBodyDynamics(12, 48, 0.8, 16)')).toContain('Angular acceleration');
    expect(engineering.solveEngineering('electromagneticInduction(200, 0.03, 4, 12)')).toContain('Induced current');

    expect(geometry.window.GEOMETRY_PROOF_MODE_NAMES.has('lawofcosines')).toBe(true);
    expect(geometry.solveGeometryProof('lawOfCosines(3, 4, 90, 5)')).toContain('supplied side satisfies');

    expect(civil.solveCivil('bendingstress(10, 2, 1)')).toContain('Output units: Pa');
    expect(computer.solveComputer('memorybandwidth(4, 8)')).toContain('Output units: bytes/s');
    expect(electrical.solveElectrical('ohmsLaw(12, 3)')).toContain('Output units: A');
    expect(mechanical.solveMechanical('stress(100, 2)')).toContain('Output units: Pa');
  });

  it('adds engineering explanations with symbols and units', () => {
    const engineering = loadCalculatorScript('engineering.js');
    const result = engineering.solveEngineering('stress(12000, 240)');

    expect(result).toContain('σ');
    expect(result).toContain('MPa');
    expect(result).toContain('Step 1');
    expect(result).toContain('Step 2');
    expect(result).toContain('Output units: MPa');
  });

  it('solves representative Calculus III formulas', () => {
    const calculus = loadCalculatorScript('calculus.js');

    expect(calculus.solveCalculus('directionalDerivative(x^2*y + y^2, [x, y], [1, 2], [3, 4])')).toContain('Dᵤf = ∇f · u = 6.4');
    expect(calculus.solveCalculus('directionalDerivative(x^2*y + y^2, [x, y], [1, 2], [3, 4])')).toContain('Output units: function-output units per coordinate unit');
    expect(calculus.solveCalculus('tangentPlane(x^2 + y^2, 1, 2)')).toContain('Tangent plane: z = 5 + 2(x - 1) + 4(y - 2)');
    const doubleIntegral = calculus.solveCalculus('doubleIntegral(x + y, x, 0, 1, y, 0, 2)');
    expect(Number(doubleIntegral.match(/Approximate value: (.+)/)[1])).toBeCloseTo(3, 10);
    expect(calculus.solveCalculus('divergence([x^2, y^2, z^2], [x, y, z], [1, 2, 3])')).toContain('= 12');
    expect(calculus.solveCalculus('curl([-y, x, 0], [x, y, z], [1, 2, 3])')).toContain('∇ × F = [0, 0, 2]');
  });

  it('computes additional number theory and combinatorics formulas', () => {
    const discreteMath = loadCalculatorScript('discreteMath.js');

    expect(discreteMath.solveDiscreteFormula('isprime', [97])).toContain('97 is prime');
    expect(discreteMath.solveDiscreteFormula('modularpower', [7, 128, 13])).toContain('= 3');
    expect(discreteMath.solveDiscreteFormula('eulerphi', [36])).toContain('φ(36) = 12');
    expect(discreteMath.solveDiscreteFormula('eulerphi', [36])).toContain('Units: coprime-integer count');
    expect(discreteMath.solveDiscreteFormula('divisorcount', [360])).toContain('τ(360) = 24');
    expect(discreteMath.solveDiscreteFormula('starsandbars', [10, 4])).toContain('C(13, 3) = 286');
    expect(discreteMath.solveDiscreteFormula('derangements', [6])).toContain('!6 = 265');
  });
});

describe('statistics formula sheet', () => {
  it('calculates descriptive and sampling statistics', () => {
    expect(solveStatistics('stats', [[1, 2, 3, 4, 5]])).toContain('Sample variance = 2.5');
    expect(solveStatistics('quartile', [[1, 2, 3, 4, 5, 6, 7, 8], 3])).toContain('Q3 = 6');
    expect(solveStatistics('standardError', [12, 36])).toContain('Standard error = 2');
    expect(solveStatistics('proportionStandardError', [0.5, 100])).toContain('0.05');
    expect(solveStatistics('differenceMeanStandardError', [2, 25, 3, 36])).toContain('= 0.5');
    expect(solveStatistics('zCriticalValue', [95])).toContain('= 1.96');
    expect(solveStatistics('empiricalRule', [100, 10])).toContain('[70, 130]');
  });

  it('calculates probability distributions and probability rules', () => {
    expect(solveStatistics('additionRule', [0.4, 0.5, 0.2])).toContain('Probability = 0.7');
    expect(solveStatistics('binomialPmf', [2, 5, 0.5])).toContain('0.3125');
    expect(solveStatistics('poissonPmf', [2, 3])).toContain('0.22404181');
    expect(solveStatistics('exponentialStats', [2])).toContain('variance = 1/λ² = 0.25');
    expect(solveStatistics('geometricPmf', [3, 0.5])).toContain('0.125');
  });

  it('calculates confidence intervals, tests, regression, and effects', () => {
    expect(solveStatistics('meanConfidenceInterval', [50, 12, 36, 1.96])).toContain('[46.08, 53.92]');
    expect(solveStatistics('zTest', [52, 50, 12, 36])).toContain('Z = (x̄ - μ₀)/(s/√n) = 1');
    expect(solveStatistics('linearRegression', [[1, 2, 3], [2, 4, 6]])).toContain('0 + 2x');
    expect(solveStatistics('cohensD', [5, 2, 10, 3, 2, 10])).toContain("Cohen's d");
  });

  it('calculates chi-square tests and one-way ANOVA', () => {
    expect(solveStatistics('chiSquareGoF', [[10, 20], [15, 15]])).toContain('χ² = Σ(O-E)²/E = 3.3333333');
    expect(solveStatistics('chiSquareIndependence', [[[20, 30], [30, 20]]])).toContain('degrees of freedom = 1');
    expect(solveStatistics('oneWayAnova', [[[1, 2, 3], [4, 5, 6]]])).toContain('F = 13.5');
    expect(() => solveStatistics('binomialPmf', [2, 5, 1.2])).toThrow('between 0 and 1');
  });
});
