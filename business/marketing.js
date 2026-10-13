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
      conversionrate: () => conversionRate(args[0], args[1]),
      customeracquisitioncost: () => customerAcquisitionCost(args[0], args[1]),
      clv: () => clv(args[0], args[1], args[2], args[3]),
      roas: () => roas(args[0], args[1]),
      ctr: () => ctr(args[0], args[1]),
      breakevencustomers: () => breakEvenCustomers(args[0], args[1])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown marketing formula mode.');
    return `Marketing formula: ${result()}`;
  };
}
