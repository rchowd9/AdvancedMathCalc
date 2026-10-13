export function priceElasticity(percentageChangeQuantity, percentageChangePrice) {
  return percentageChangeQuantity / percentageChangePrice;
}

export function totalRevenue(price, quantity) {
  return price * quantity;
}

export function marginalCost(changeInTotalCost, changeInQuantity) {
  return changeInTotalCost / changeInQuantity;
}

export function profit(totalRevenue, totalCost) {
  return totalRevenue - totalCost;
}

export function consumerSurplus(valuation, price) {
  return valuation - price;
}

if (typeof window !== 'undefined') {
  window.MICRO_ECON_MODE_NAMES = new Set([
    'priceelasticity',
    'totalrevenue',
    'marginalcost',
    'profit',
    'consumersurplus'
  ]);

  window.solveMicroEcon = (input) => {
    const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
    if (!match) {
      throw new Error('Use microeconomics formulas like priceElasticity(...), totalRevenue(...), or profit(...).');
    }

    const mode = match[1].toLowerCase();
    const args = match[2].split(',').map((value) => Number(value.trim()));
    const operations = {
      priceelasticity: () => priceElasticity(args[0], args[1]),
      totalrevenue: () => totalRevenue(args[0], args[1]),
      marginalcost: () => marginalCost(args[0], args[1]),
      profit: () => profit(args[0], args[1]),
      consumersurplus: () => consumerSurplus(args[0], args[1])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown microeconomics formula mode.');
    return `Microeconomics formula: ${result()}`;
  };
}
