window.BUSINESS_MODE_NAMES = new Set([
  'grossprofit',
  'netincome',
  'currentratio',
  'quickratio',
  'debtratio',
  'contributionmargin',
  'breakevenpoint',
  'workingcapital',
  'inventoryturnover',
  'returnonassets',
  'futurevalue',
  'presentvalue',
  'simpleinterest',
  'compoundinterest',
  'annuitypayment',
  'roi',
  'loanpayment',
  'gdp',
  'realgdp',
  'inflationrate',
  'unemploymentrate',
  'spendingmultiplier',
  'taxmultiplier',
  'conversionrate',
  'customeracquisitioncost',
  'clv',
  'roas',
  'ctr',
  'breakevencustomers',
  'priceelasticity',
  'totalrevenue',
  'marginalcost',
  'profit',
  'consumersurplus'
]);

function splitBusinessArgs(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;

  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (character === '(' || character === '[') depth += 1;
    if (character === ')' || character === ']') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(statement.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(statement.slice(start).trim());
  return parts.filter((part) => part !== '');
}

function requireBusinessArgs(args, count, syntax) {
  if (args.length < count || args.slice(0, count).some((value) => !Number.isFinite(value))) {
    throw new Error(`Use ${syntax} with numeric values.`);
  }
}

function formatBusinessNumber(value) {
  return Number(value.toPrecision(6));
}

function solveGrossProfit(args) {
  requireBusinessArgs(args, 2, 'grossProfit(revenue, cogs)');
  const [revenue, cogs] = args;
  const grossProfit = revenue - cogs;
  return `Gross profit: GP = revenue - COGS = ${formatBusinessNumber(grossProfit)} currency units`;
}

function solveNetIncome(args) {
  requireBusinessArgs(args, 2, 'netIncome(revenue, expenses)');
  const [revenue, expenses] = args;
  const netIncome = revenue - expenses;
  return `Net income: NI = revenue - expenses = ${formatBusinessNumber(netIncome)} currency units`;
}

function solveCurrentRatio(args) {
  requireBusinessArgs(args, 2, 'currentRatio(currentAssets, currentLiabilities)');
  const [assets, liabilities] = args;
  const ratio = assets / liabilities;
  return `Current ratio: CR = current assets / current liabilities = ${formatBusinessNumber(ratio)}`;
}

function solveQuickRatio(args) {
  requireBusinessArgs(args, 2, 'quickRatio(quickAssets, currentLiabilities)');
  const [quickAssets, liabilities] = args;
  const ratio = quickAssets / liabilities;
  return `Quick ratio: QR = quick assets / current liabilities = ${formatBusinessNumber(ratio)}`;
}

function solveDebtRatio(args) {
  requireBusinessArgs(args, 2, 'debtRatio(totalLiabilities, totalAssets)');
  const [liabilities, assets] = args;
  const ratio = liabilities / assets;
  return `Debt ratio: D/A = total liabilities / total assets = ${formatBusinessNumber(ratio)}`;
}

function solveContributionMargin(args) {
  requireBusinessArgs(args, 2, 'contributionMargin(price, variableCost)');
  const [price, variableCost] = args;
  const contributionMargin = price - variableCost;
  return `Contribution margin: CM = price - variable cost = ${formatBusinessNumber(contributionMargin)} currency units`;
}

function solveBreakEvenPoint(args) {
  requireBusinessArgs(args, 2, 'breakEvenPoint(fixedCosts, contributionMarginPerUnit)');
  const [fixedCosts, contributionMarginPerUnit] = args;
  const breakEvenUnits = fixedCosts / contributionMarginPerUnit;
  return `Break-even point: Q = fixed costs / unit contribution margin = ${formatBusinessNumber(breakEvenUnits)} units`;
}

function solveWorkingCapital(args) {
  requireBusinessArgs(args, 2, 'workingCapital(currentAssets, currentLiabilities)');
  const [assets, liabilities] = args;
  const workingCapital = assets - liabilities;
  return `Working capital: WC = current assets - current liabilities = ${formatBusinessNumber(workingCapital)} currency units`;
}

function solveInventoryTurnover(args) {
  requireBusinessArgs(args, 2, 'inventoryTurnover(cogs, averageInventory)');
  const [cogs, inventory] = args;
  const turnover = cogs / inventory;
  return `Inventory turnover: IT = COGS / average inventory = ${formatBusinessNumber(turnover)} turns`;
}

function solveReturnOnAssets(args) {
  requireBusinessArgs(args, 2, 'returnOnAssets(netIncome, averageAssets)');
  const [netIncome, assets] = args;
  const roa = netIncome / assets;
  return `Return on assets: ROA = net income / average assets = ${formatBusinessNumber(roa)} = ${formatBusinessNumber(roa * 100)}%`;
}

function solveFutureValue(args) {
  requireBusinessArgs(args, 3, 'futureValue(presentValue, rate, periods)');
  const [presentValue, rate, periods] = args;
  const futureValue = presentValue * (1 + rate) ** periods;
  return `Future value: FV = PV(1 + r)^n = ${formatBusinessNumber(futureValue)} currency units`;
}

function solvePresentValue(args) {
  requireBusinessArgs(args, 3, 'presentValue(futureValue, rate, periods)');
  const [futureValue, rate, periods] = args;
  const presentValue = futureValue / (1 + rate) ** periods;
  return `Present value: PV = FV / (1 + r)^n = ${formatBusinessNumber(presentValue)} currency units`;
}

function solveSimpleInterest(args) {
  requireBusinessArgs(args, 3, 'simpleInterest(principal, rate, timeYears)');
  const [principal, rate, time] = args;
  const interest = principal * rate * time;
  return `Simple interest: I = Prt = ${formatBusinessNumber(interest)} currency units`;
}

function solveCompoundInterest(args) {
  requireBusinessArgs(args, 3, 'compoundInterest(principal, rate, periods)');
  const [principal, rate, periods] = args;
  const amount = principal * (1 + rate) ** periods;
  return `Compound interest: A = P(1 + r)^n = ${formatBusinessNumber(amount)} currency units`;
}

function solveAnnuityPayment(args) {
  requireBusinessArgs(args, 3, 'annuityPayment(futureValue, rate, periods)');
  const [futureValue, rate, periods] = args;
  const payment = futureValue * rate / (((1 + rate) ** periods) - 1);
  return `Annuity payment: PMT = FV × r / ((1 + r)^n - 1) = ${formatBusinessNumber(payment)} currency units`;
}

function solveRoi(args) {
  requireBusinessArgs(args, 2, 'roi(gain, investment)');
  const [gain, investment] = args;
  const roi = (gain / investment) * 100;
  return `ROI: ROI = (gain / investment) × 100 = ${formatBusinessNumber(roi)}%`;
}

function solveLoanPayment(args) {
  requireBusinessArgs(args, 3, 'loanPayment(principal, rate, periods)');
  const [principal, rate, periods] = args;
  const payment = (principal * rate) / (1 - (1 + rate) ** (-periods));
  return `Loan payment: PMT = P·r / (1 - (1 + r)^-n) = ${formatBusinessNumber(payment)} currency units`;
}

function solveGdp(args) {
  requireBusinessArgs(args, 4, 'gdp(consumption, investment, government, netExports)');
  const [consumption, investment, government, netExports] = args;
  const output = consumption + investment + government + netExports;
  return `GDP: Y = C + I + G + NX = ${formatBusinessNumber(output)} currency units`;
}

function solveRealGdp(args) {
  requireBusinessArgs(args, 2, 'realGdp(nominalGdp, gdpDeflator)');
  const [nominalGdp, gdpDeflator] = args;
  const realGdp = nominalGdp / (gdpDeflator / 100);
  return `Real GDP: GDP_real = nominal GDP / (deflator / 100) = ${formatBusinessNumber(realGdp)} currency units`;
}

function solveInflationRate(args) {
  requireBusinessArgs(args, 2, 'inflationRate(cpiCurrent, cpiPrevious)');
  const [cpiCurrent, cpiPrevious] = args;
  const inflationRate = ((cpiCurrent - cpiPrevious) / cpiPrevious) * 100;
  return `Inflation rate: π = ((CPI_t - CPI_{t-1}) / CPI_{t-1}) × 100 = ${formatBusinessNumber(inflationRate)}%`;
}

function solveUnemploymentRate(args) {
  requireBusinessArgs(args, 2, 'unemploymentRate(unemployed, laborForce)');
  const [unemployed, laborForce] = args;
  const unemploymentRate = (unemployed / laborForce) * 100;
  return `Unemployment rate: U = unemployed / labor force × 100 = ${formatBusinessNumber(unemploymentRate)}%`;
}

function solveSpendingMultiplier(args) {
  requireBusinessArgs(args, 1, 'spendingMultiplier(mpc)');
  const [mpc] = args;
  const multiplier = 1 / (1 - mpc);
  return `Spending multiplier: k = 1 / (1 - MPC) = ${formatBusinessNumber(multiplier)}`;
}

function solveTaxMultiplier(args) {
  requireBusinessArgs(args, 1, 'taxMultiplier(mpc)');
  const [mpc] = args;
  const multiplier = -mpc / (1 - mpc);
  return `Tax multiplier: k_t = -MPC / (1 - MPC) = ${formatBusinessNumber(multiplier)}`;
}

function solveConversionRate(args) {
  requireBusinessArgs(args, 2, 'conversionRate(conversions, visitors)');
  const [conversions, visitors] = args;
  const rate = (conversions / visitors) * 100;
  return `Conversion rate: CR = conversions / visitors × 100 = ${formatBusinessNumber(rate)}%`;
}

function solveCustomerAcquisitionCost(args) {
  requireBusinessArgs(args, 2, 'customerAcquisitionCost(marketingSpend, customersAcquired)');
  const [marketingSpend, customersAcquired] = args;
  const cac = marketingSpend / customersAcquired;
  return `Customer acquisition cost: CAC = marketing spend / customers acquired = ${formatBusinessNumber(cac)} currency units per customer`;
}

function solveClv(args) {
  requireBusinessArgs(args, 4, 'clv(averageRevenuePerCustomer, grossMargin, retentionRate, discountRate)');
  const [averageRevenuePerCustomer, grossMargin, retentionRate, discountRate] = args;
  const clv = (averageRevenuePerCustomer * grossMargin * retentionRate) / (1 - retentionRate + discountRate);
  return `Customer lifetime value: CLV = (ARPC × GM × retention) / (1 - retention + discount) = ${formatBusinessNumber(clv)} currency units`;
}

function solveRoas(args) {
  requireBusinessArgs(args, 2, 'roas(revenue, adSpend)');
  const [revenue, adSpend] = args;
  const roas = (revenue / adSpend) * 100;
  return `ROAS: ROAS = revenue / ad spend × 100 = ${formatBusinessNumber(roas)}%`;
}

function solveCtr(args) {
  requireBusinessArgs(args, 2, 'ctr(clicks, impressions)');
  const [clicks, impressions] = args;
  const ctr = (clicks / impressions) * 100;
  return `Click-through rate: CTR = clicks / impressions × 100 = ${formatBusinessNumber(ctr)}%`;
}

function solveBreakEvenCustomers(args) {
  requireBusinessArgs(args, 2, 'breakEvenCustomers(fixedCosts, contributionMarginPerCustomer)');
  const [fixedCosts, contributionMarginPerCustomer] = args;
  const breakEvenCustomers = fixedCosts / contributionMarginPerCustomer;
  return `Break-even customers: Q = fixed costs / contribution margin per customer = ${formatBusinessNumber(breakEvenCustomers)} customers`;
}

function solvePriceElasticity(args) {
  requireBusinessArgs(args, 2, 'priceElasticity(percentageChangeQuantity, percentageChangePrice)');
  const [percentageChangeQuantity, percentageChangePrice] = args;
  const elasticity = percentageChangeQuantity / percentageChangePrice;
  return `Price elasticity: E = %ΔQ / %ΔP = ${formatBusinessNumber(elasticity)}`;
}

function solveTotalRevenue(args) {
  requireBusinessArgs(args, 2, 'totalRevenue(price, quantity)');
  const [price, quantity] = args;
  const totalRevenue = price * quantity;
  return `Total revenue: TR = P × Q = ${formatBusinessNumber(totalRevenue)} currency units`;
}

function solveMarginalCost(args) {
  requireBusinessArgs(args, 2, 'marginalCost(changeInTotalCost, changeInQuantity)');
  const [changeInTotalCost, changeInQuantity] = args;
  const marginalCost = changeInTotalCost / changeInQuantity;
  return `Marginal cost: MC = ΔTC / ΔQ = ${formatBusinessNumber(marginalCost)} currency units per unit`;
}

function solveProfit(args) {
  requireBusinessArgs(args, 2, 'profit(totalRevenue, totalCost)');
  const [totalRevenue, totalCost] = args;
  const profit = totalRevenue - totalCost;
  return `Profit: π = total revenue - total cost = ${formatBusinessNumber(profit)} currency units`;
}

function solveConsumerSurplus(args) {
  requireBusinessArgs(args, 2, 'consumerSurplus(valuation, price)');
  const [valuation, price] = args;
  const consumerSurplus = valuation - price;
  return `Consumer surplus: CS = willingness to pay - price = ${formatBusinessNumber(consumerSurplus)} currency units`;
}

function solveBusiness(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error('Use business formulas like grossProfit(...), futureValue(...), or roi(...).');
  }

  const mode = match[1].toLowerCase();
  const args = splitBusinessArgs(match[2]).map((value) => Number(value));

  const result = (() => {
    switch (mode) {
    case 'grossprofit': return solveGrossProfit(args);
    case 'netincome': return solveNetIncome(args);
    case 'currentratio': return solveCurrentRatio(args);
    case 'quickratio': return solveQuickRatio(args);
    case 'debtratio': return solveDebtRatio(args);
    case 'contributionmargin': return solveContributionMargin(args);
    case 'breakevenpoint': return solveBreakEvenPoint(args);
    case 'workingcapital': return solveWorkingCapital(args);
    case 'inventoryturnover': return solveInventoryTurnover(args);
    case 'returnonassets': return solveReturnOnAssets(args);
    case 'futurevalue': return solveFutureValue(args);
    case 'presentvalue': return solvePresentValue(args);
    case 'simpleinterest': return solveSimpleInterest(args);
    case 'compoundinterest': return solveCompoundInterest(args);
    case 'annuitypayment': return solveAnnuityPayment(args);
    case 'roi': return solveRoi(args);
    case 'loanpayment': return solveLoanPayment(args);
    case 'gdp': return solveGdp(args);
    case 'realgdp': return solveRealGdp(args);
    case 'inflationrate': return solveInflationRate(args);
    case 'unemploymentrate': return solveUnemploymentRate(args);
    case 'spendingmultiplier': return solveSpendingMultiplier(args);
    case 'taxmultiplier': return solveTaxMultiplier(args);
    case 'conversionrate': return solveConversionRate(args);
    case 'customeracquisitioncost': return solveCustomerAcquisitionCost(args);
    case 'clv': return solveClv(args);
    case 'roas': return solveRoas(args);
    case 'ctr': return solveCtr(args);
    case 'breakevencustomers': return solveBreakEvenCustomers(args);
    case 'priceelasticity': return solvePriceElasticity(args);
    case 'totalrevenue': return solveTotalRevenue(args);
    case 'marginalcost': return solveMarginalCost(args);
    case 'profit': return solveProfit(args);
    case 'consumersurplus': return solveConsumerSurplus(args);
    default: throw new Error('Unknown business formula mode.');
    }
  })();

  const outputUnits = {
    grossprofit: 'currency units',
    netincome: 'currency units',
    currentratio: 'dimensionless',
    quickratio: 'dimensionless',
    debtratio: 'dimensionless',
    contributionmargin: 'currency units',
    breakevenpoint: 'units',
    workingcapital: 'currency units',
    inventoryturnover: 'turns',
    returnonassets: 'ratio',
    futurevalue: 'currency units',
    presentvalue: 'currency units',
    simpleinterest: 'currency units',
    compoundinterest: 'currency units',
    annuitypayment: 'currency units',
    roi: '%',
    loanpayment: 'currency units',
    gdp: 'currency units',
    realgdp: 'currency units',
    inflationrate: '%',
    unemploymentrate: '%',
    spendingmultiplier: 'dimensionless',
    taxmultiplier: 'dimensionless',
    conversionrate: '%',
    customeracquisitioncost: 'currency units/customer',
    clv: 'currency units',
    roas: '%',
    ctr: '%',
    breakevencustomers: 'customers',
    priceelasticity: 'dimensionless',
    totalrevenue: 'currency units',
    marginalcost: 'currency units/unit',
    profit: 'currency units',
    consumersurplus: 'currency units'
  };

  return `${result}\nOutput units: ${outputUnits[mode]}.`;
}

if (typeof window !== 'undefined') {
  window.solveBusiness = solveBusiness;
}
