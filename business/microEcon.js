function formatMicroEconNumber(value) {
  return Number(value.toPrecision(6));
}

function formatMicroEconSteps(title, formula, steps, result) {
  return [
    `${title}:`,
    `Step 1: Formula: ${formula}`,
    ...steps.map((step, index) => `Step ${index + 2}: ${step}`),
    `Result: ${formatMicroEconNumber(result)}`
  ].join('\n');
}

export function priceElasticity(percentageChangeQuantity, percentageChangePrice) {
  return percentageChangeQuantity / percentageChangePrice;
}

export function explainPriceElasticity(percentageChangeQuantity, percentageChangePrice) {
  const output = priceElasticity(percentageChangeQuantity, percentageChangePrice);
  return formatMicroEconSteps('Price elasticity', 'E = %ΔQ / %ΔP', [
    `Substitute values: E = ${percentageChangeQuantity} / ${percentageChangePrice}`,
    `Divide the percentage changes: ${percentageChangeQuantity} / ${percentageChangePrice} = ${output}`
  ], output);
}

export function totalRevenue(price, quantity) {
  return price * quantity;
}

export function explainTotalRevenue(price, quantity) {
  const output = totalRevenue(price, quantity);
  return formatMicroEconSteps('Total revenue', 'TR = P × Q', [
    `Substitute values: TR = ${price} × ${quantity}`,
    `Multiply: ${price} × ${quantity} = ${output}`
  ], output);
}

export function marginalCost(changeInTotalCost, changeInQuantity) {
  return changeInTotalCost / changeInQuantity;
}

export function explainMarginalCost(changeInTotalCost, changeInQuantity) {
  const output = marginalCost(changeInTotalCost, changeInQuantity);
  return formatMicroEconSteps('Marginal cost', 'MC = ΔTC / ΔQ', [
    `Substitute values: MC = ${changeInTotalCost} / ${changeInQuantity}`,
    `Divide the change in cost by the change in quantity: ${changeInTotalCost} / ${changeInQuantity} = ${output}`
  ], output);
}

export function profit(totalRevenue, totalCost) {
  return totalRevenue - totalCost;
}

export function explainProfit(totalRevenue, totalCost) {
  const output = profit(totalRevenue, totalCost);
  return formatMicroEconSteps('Profit', 'π = total revenue - total cost', [
    `Substitute values: π = ${totalRevenue} - ${totalCost}`,
    `Subtract: ${totalRevenue} - ${totalCost} = ${output}`
  ], output);
}

export function consumerSurplus(valuation, price) {
  return valuation - price;
}

export function explainConsumerSurplus(valuation, price) {
  const output = consumerSurplus(valuation, price);
  return formatMicroEconSteps('Consumer surplus', 'CS = willingness to pay - price', [
    `Substitute values: CS = ${valuation} - ${price}`,
    `Subtract: ${valuation} - ${price} = ${output}`
  ], output);
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
      priceelasticity: () => explainPriceElasticity(args[0], args[1]),
      totalrevenue: () => explainTotalRevenue(args[0], args[1]),
      marginalcost: () => explainMarginalCost(args[0], args[1]),
      profit: () => explainProfit(args[0], args[1]),
      consumersurplus: () => explainConsumerSurplus(args[0], args[1])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown microeconomics formula mode.');
    return `Microeconomics formula:\n${result()}`;
  };
}
