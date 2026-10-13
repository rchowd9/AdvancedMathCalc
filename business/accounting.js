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
      grossprofit: () => grossProfit(args[0], args[1]),
      netincome: () => netIncome(args[0], args[1]),
      currentratio: () => currentRatio(args[0], args[1]),
      quickratio: () => quickRatio(args[0], args[1]),
      debtratio: () => debtRatio(args[0], args[1]),
      contributionmargin: () => contributionMargin(args[0], args[1]),
      breakevenpoint: () => breakEvenPoint(args[0], args[1]),
      workingcapital: () => workingCapital(args[0], args[1]),
      inventoryturnover: () => inventoryTurnover(args[0], args[1]),
      returnonassets: () => returnOnAssets(args[0], args[1])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown accounting formula mode.');
    return `Accounting formula: ${result()}`;
  };
}
