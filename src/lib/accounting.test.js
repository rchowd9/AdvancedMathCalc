import { beforeAll, describe, expect, it } from 'vitest';

let solveAccounting;

beforeAll(async () => {
  globalThis.window = {};
  await import('../../business/accounting.js');
  solveAccounting = globalThis.window.solveAccounting;
  delete globalThis.window;
});

describe('accounting formula explanations', () => {
  it.each([
    ['grossProfit(1000, 600)', 'Gross profit = 1000 - 600', '1000 - 600 = 400'],
    ['netIncome(1000, 600)', 'Net income = 1000 - 600', '1000 - 600 = 400'],
    ['currentRatio(500, 250)', 'Current ratio = 500 / 250', '500 / 250 = 2'],
    ['quickRatio(500, 250)', 'Quick ratio = 500 / 250', '500 / 250 = 2'],
    ['debtRatio(250, 500)', 'Debt ratio = 250 / 500', '250 / 500 = 0.5'],
    ['contributionMargin(20, 8)', 'Contribution margin = 20 - 8', '20 - 8 = 12'],
    ['breakEvenPoint(1200, 12)', 'Break-even point = 1200 / 12', '1200 / 12 = 100'],
    ['workingCapital(500, 250)', 'Working capital = 500 - 250', '500 - 250 = 250'],
    ['inventoryTurnover(600, 200)', 'Inventory turnover = 600 / 200', '600 / 200 = 3'],
    ['returnOnAssets(100, 500)', 'Return on assets = 100 / 500', '100 / 500 = 0.2']
  ])('explains %s with formula, substitution, and calculation', (input, substitution, calculation) => {
    const explanation = solveAccounting(input);
    expect(explanation).toContain('Step 1: Write the formula:');
    expect(explanation).toContain(`Step 2: Substitute the values: ${substitution}`);
    expect(explanation).toContain(`Step 3: Calculate: ${calculation}`);
  });
});
