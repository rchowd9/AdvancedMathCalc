export function conversionRate(conversions, visitors) {
  return (conversions / visitors) * 100;
}

export function customerAcquisitionCost(marketingSpend, customersAcquired) {
  return marketingSpend / customersAcquired;
}

export function clv(averageRevenuePerCustomer, grossMargin, retentionRate, discountRate) {
  return (averageRevenuePerCustomer * grossMargin * retentionRate) / (1 - retentionRate + discountRate);
}

export function roas(revenue, adSpend) {
  return (revenue / adSpend) * 100;
}

export function ctr(clicks, impressions) {
  return (clicks / impressions) * 100;
}

export function breakEvenCustomers(fixedCosts, contributionMarginPerCustomer) {
  return fixedCosts / contributionMarginPerCustomer;
}

function formatMarketingSolution(title, formula, steps, result) {
  return [
    `Marketing formula: ${title}`,
    `Step 1: Formula: ${formula}`,
    ...steps.map((step, index) => `Step ${index + 2}: ${step}`),
    `Result: ${Number(result.toPrecision(6))}`
  ].join('\n');
}

if (typeof window !== 'undefined') {
  window.MARKETING_MODE_NAMES = new Set([
    'conversionrate',
    'customeracquisitioncost',
    'clv',
    'roas',
    'ctr',
    'breakevencustomers'
  ]);

  window.solveMarketing = (input) => {
    const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
    if (!match) {
      throw new Error('Use marketing formulas like conversionRate(...), roas(...), or clv(...).');
    }

    const mode = match[1].toLowerCase();
    const args = match[2].split(',').map((value) => Number(value.trim()));
    const operations = {
      conversionrate: () => {
        const [conversions, visitors] = args;
        const ratio = conversions / visitors;
        const result = conversionRate(conversions, visitors);
        return formatMarketingSolution('Conversion Rate', 'CR = (conversions / visitors) × 100', [
          `Substitute values: CR = (${conversions} / ${visitors}) × 100`,
          `Divide: ${conversions} / ${visitors} = ${ratio}`,
          `Convert to a percentage: ${ratio} × 100 = ${result}%`
        ], result);
      },
      customeracquisitioncost: () => {
        const [spend, customers] = args;
        const result = customerAcquisitionCost(spend, customers);
        return formatMarketingSolution('Customer Acquisition Cost', 'CAC = marketing spend / customers acquired', [
          `Substitute values: CAC = ${spend} / ${customers}`,
          `Divide: CAC = ${spend} / ${customers} = ${result}`
        ], result);
      },
      clv: () => {
        const [averageRevenue, grossMargin, retention, discount] = args;
        const numerator = averageRevenue * grossMargin * retention;
        const denominator = 1 - retention + discount;
        const result = clv(averageRevenue, grossMargin, retention, discount);
        return formatMarketingSolution('Customer Lifetime Value', 'CLV = (ARPC × GM × retention) / (1 - retention + discount)', [
          `Substitute values: CLV = (${averageRevenue} × ${grossMargin} × ${retention}) / (1 - ${retention} + ${discount})`,
          `Evaluate the numerator and denominator: ${numerator} / ${denominator}`,
          `Divide: CLV = ${numerator} / ${denominator} = ${result}`
        ], result);
      },
      roas: () => {
        const [revenue, spend] = args;
        const ratio = revenue / spend;
        const result = roas(revenue, spend);
        return formatMarketingSolution('Return on Ad Spend', 'ROAS = (revenue / ad spend) × 100', [
          `Substitute values: ROAS = (${revenue} / ${spend}) × 100`,
          `Divide: ${revenue} / ${spend} = ${ratio}`,
          `Convert to a percentage: ${ratio} × 100 = ${result}%`
        ], result);
      },
      ctr: () => {
        const [clicks, impressions] = args;
        const ratio = clicks / impressions;
        const result = ctr(clicks, impressions);
        return formatMarketingSolution('Click-Through Rate', 'CTR = (clicks / impressions) × 100', [
          `Substitute values: CTR = (${clicks} / ${impressions}) × 100`,
          `Divide: ${clicks} / ${impressions} = ${ratio}`,
          `Convert to a percentage: ${ratio} × 100 = ${result}%`
        ], result);
      },
      breakevencustomers: () => {
        const [fixedCosts, margin] = args;
        const result = breakEvenCustomers(fixedCosts, margin);
        return formatMarketingSolution('Break-Even Customers', 'Q = fixed costs / contribution margin per customer', [
          `Substitute values: Q = ${fixedCosts} / ${margin}`,
          `Divide: Q = ${fixedCosts} / ${margin} = ${result}`
        ], result);
      }
    };

    const solve = operations[mode];
    if (!solve) throw new Error('Unknown marketing formula mode.');
    return solve();
  };
}
