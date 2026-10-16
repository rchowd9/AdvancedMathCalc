import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import vm from 'node:vm';

let solveFinance;
let solveMarketing;

beforeAll(async () => {
  globalThis.window = {};
  await import('../../business/finance.js');
  await import('../../business/marketing.js');
  solveFinance = globalThis.window.solveFinance;
  solveMarketing = globalThis.window.solveMarketing;
  delete globalThis.window;
});

function loadBusinessSolver() {
  const code = fs.readFileSync(new URL('../../business.js', import.meta.url), 'utf8');
  const context = { window: {}, Number, Math, Error, Set };
  context.window = context;
  vm.runInNewContext(code, context);
  return context.solveBusiness;
}

describe('finance formula step-by-step explanations', () => {
  it.each([
    ['futureValue(1000, 0.05, 3)', 'FV = PV × (1 + r)^n', 'Result: 1157.63'],
    ['presentValue(1000, 0.05, 3)', 'PV = FV / (1 + r)^n', 'Result: 863.838'],
    ['simpleInterest(1000, 0.05, 3)', 'I = P × r × t', 'Result: 150'],
    ['compoundInterest(1000, 0.05, 3)', 'A = P × (1 + r)^n', 'Result: 1157.63'],
    ['annuityPayment(1000, 0.05, 3)', 'PMT = FV × r / ((1 + r)^n - 1)', 'Result: 317.209'],
    ['roi(150, 1000)', 'ROI = (gain / investment) × 100', 'Result: 15'],
    ['loanPayment(1000, 0.05, 3)', 'PMT = P × r / (1 - (1 + r)^(-n))', 'Result: 367.209']
  ])('explains %s with formula steps and a result', (input, formula, result) => {
    const explanation = solveFinance(input);
    expect(explanation).toContain(`Step 1: Formula: ${formula}`);
    expect(explanation).toContain('Step 2: Substitute values:');
    expect(explanation).toContain('Step 3:');
    expect(explanation).toContain(result);
  });
});

describe('marketing formula step-by-step explanations', () => {
  it.each([
    ['conversionRate(25, 500)', 'CR = (conversions / visitors) × 100', 'Result: 5'],
    ['customerAcquisitionCost(1000, 20)', 'CAC = marketing spend / customers acquired', 'Result: 50'],
    ['clv(100, 0.6, 0.8, 0.1)', 'CLV = (ARPC × GM × retention) / (1 - retention + discount)', 'Result: 160'],
    ['roas(5000, 1000)', 'ROAS = (revenue / ad spend) × 100', 'Result: 500'],
    ['ctr(50, 2000)', 'CTR = (clicks / impressions) × 100', 'Result: 2.5'],
    ['breakEvenCustomers(1000, 25)', 'Q = fixed costs / contribution margin per customer', 'Result: 40']
  ])('explains %s with formula steps and a result', (input, formula, result) => {
    const explanation = solveMarketing(input);
    expect(explanation).toContain(`Step 1: Formula: ${formula}`);
    expect(explanation).toContain('Step 2: Substitute values:');
    expect(explanation).toContain('Step 3:');
    expect(explanation).toContain(result);
  });
});

describe('calculator business formula explanations', () => {
  const solveBusiness = loadBusinessSolver();

  it.each([
    ['presentValue(1000, 0.05, 3)', 'Present value:', 'Output units: currency units.'],
    ['conversionRate(25, 500)', 'Conversion rate:', 'Output units: %.'],
    ['clv(100, 0.6, 0.8, 0.1)', 'Customer lifetime value:', 'Output units: currency units.']
  ])('shows worked steps for calculator input %s', (input, title, units) => {
    const explanation = solveBusiness(input);
    expect(explanation).toContain(title);
    expect(explanation).toContain('Step 1: Formula:');
    expect(explanation).toContain('Step 2: Substitute values:');
    expect(explanation).toContain('Step 3:');
    expect(explanation).toContain('Result:');
    expect(explanation).toContain(units);
  });
});
