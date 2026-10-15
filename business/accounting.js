export function grossProfit(revenue, cogs) {
  return revenue - cogs;
}

export function netIncome(revenue, expenses) {
  return revenue - expenses;
}

export function currentRatio(currentAssets, currentLiabilities) {
  return currentAssets / currentLiabilities;
}

export function quickRatio(quickAssets, currentLiabilities) {
  return quickAssets / currentLiabilities;
}

export function debtRatio(totalLiabilities, totalAssets) {
  return totalLiabilities / totalAssets;
}

export function contributionMargin(price, variableCost) {
  return price - variableCost;
}

export function breakEvenPoint(fixedCosts, contributionMarginPerUnit) {
  return fixedCosts / contributionMarginPerUnit;
}

export function workingCapital(currentAssets, currentLiabilities) {
  return currentAssets - currentLiabilities;
}

export function inventoryTurnover(cogs, averageInventory) {
  return cogs / averageInventory;
}

export function returnOnAssets(netIncome, averageAssets) {
  return netIncome / averageAssets;
}

function formatAccountingSolution(title, formula, substitution, calculation, result) {
  return [
    `Accounting formula: ${title}`,
    `Step 1: Write the formula: ${formula}`,
    `Step 2: Substitute the values: ${substitution}`,
    `Step 3: Calculate: ${calculation} = ${result}`
  ].join('\n');
}

if (typeof window !== 'undefined') {
  window.ACCOUNTING_MODE_NAMES = new Set([
    'grossprofit',
    'netincome',
    'currentratio',
    'quickratio',
    'debtratio',
    'contributionmargin',
    'breakevenpoint',
    'workingcapital',
    'inventoryturnover',
    'returnonassets'
  ]);

  window.solveAccounting = (input) => {
    const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
    if (!match) {
      throw new Error('Use accounting formulas like grossProfit(...), currentRatio(...), or breakEvenPoint(...).');
    }

    const mode = match[1].toLowerCase();
    const args = match[2].split(',').map((value) => Number(value.trim()));
    const operations = {
      grossprofit: {
        title: 'Gross Profit',
        formula: 'Gross profit = revenue - cost of goods sold (COGS)',
        substitution: `Gross profit = ${args[0]} - ${args[1]}`,
        calculation: `${args[0]} - ${args[1]}`,
        calculate: () => grossProfit(args[0], args[1])
      },
      netincome: {
        title: 'Net Income',
        formula: 'Net income = revenue - expenses',
        substitution: `Net income = ${args[0]} - ${args[1]}`,
        calculation: `${args[0]} - ${args[1]}`,
        calculate: () => netIncome(args[0], args[1])
      },
      currentratio: {
        title: 'Current Ratio',
        formula: 'Current ratio = current assets / current liabilities',
        substitution: `Current ratio = ${args[0]} / ${args[1]}`,
        calculation: `${args[0]} / ${args[1]}`,
        calculate: () => currentRatio(args[0], args[1])
      },
      quickratio: {
        title: 'Quick Ratio',
        formula: 'Quick ratio = quick assets / current liabilities',
        substitution: `Quick ratio = ${args[0]} / ${args[1]}`,
        calculation: `${args[0]} / ${args[1]}`,
        calculate: () => quickRatio(args[0], args[1])
      },
      debtratio: {
        title: 'Debt Ratio',
        formula: 'Debt ratio = total liabilities / total assets',
        substitution: `Debt ratio = ${args[0]} / ${args[1]}`,
        calculation: `${args[0]} / ${args[1]}`,
        calculate: () => debtRatio(args[0], args[1])
      },
      contributionmargin: {
        title: 'Contribution Margin',
        formula: 'Contribution margin = selling price - variable cost per unit',
        substitution: `Contribution margin = ${args[0]} - ${args[1]}`,
        calculation: `${args[0]} - ${args[1]}`,
        calculate: () => contributionMargin(args[0], args[1])
      },
      breakevenpoint: {
        title: 'Break-Even Point',
        formula: 'Break-even point = fixed costs / contribution margin per unit',
        substitution: `Break-even point = ${args[0]} / ${args[1]}`,
        calculation: `${args[0]} / ${args[1]}`,
        calculate: () => breakEvenPoint(args[0], args[1])
      },
      workingcapital: {
        title: 'Working Capital',
        formula: 'Working capital = current assets - current liabilities',
        substitution: `Working capital = ${args[0]} - ${args[1]}`,
        calculation: `${args[0]} - ${args[1]}`,
        calculate: () => workingCapital(args[0], args[1])
      },
      inventoryturnover: {
        title: 'Inventory Turnover',
        formula: 'Inventory turnover = cost of goods sold (COGS) / average inventory',
        substitution: `Inventory turnover = ${args[0]} / ${args[1]}`,
        calculation: `${args[0]} / ${args[1]}`,
        calculate: () => inventoryTurnover(args[0], args[1])
      },
      returnonassets: {
        title: 'Return on Assets',
        formula: 'Return on assets = net income / average total assets',
        substitution: `Return on assets = ${args[0]} / ${args[1]}`,
        calculation: `${args[0]} / ${args[1]}`,
        calculate: () => returnOnAssets(args[0], args[1])
      }
    };

    const operation = operations[mode];
    if (!operation) throw new Error('Unknown accounting formula mode.');
    return formatAccountingSolution(
      operation.title,
      operation.formula,
      operation.substitution,
      operation.calculation,
      operation.calculate()
    );
  };
}
