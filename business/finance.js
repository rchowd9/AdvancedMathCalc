export function futureValue(presentValue, rate, periods) {
  return presentValue * (1 + rate) ** periods;
}

export function presentValue(futureValue, rate, periods) {
  return futureValue / (1 + rate) ** periods;
}

export function simpleInterest(principal, rate, timeYears) {
  return principal * rate * timeYears;
}

export function compoundInterest(principal, rate, periods) {
  return principal * (1 + rate) ** periods;
}

export function annuityPayment(futureValue, rate, periods) {
  return futureValue * rate / (((1 + rate) ** periods) - 1);
}

export function roi(gain, investment) {
  return (gain / investment) * 100;
}

export function loanPayment(principal, rate, periods) {
  return (principal * rate) / (1 - (1 + rate) ** (-periods));
}

function formatFinanceSolution(title, formula, steps, result) {
  return [
    `Finance formula: ${title}`,
    `Step 1: Formula: ${formula}`,
    ...steps.map((step, index) => `Step ${index + 2}: ${step}`),
    `Result: ${Number(result.toPrecision(6))}`
  ].join('\n');
}

if (typeof window !== 'undefined') {
  window.FINANCE_MODE_NAMES = new Set([
    'futurevalue',
    'presentvalue',
    'simpleinterest',
    'compoundinterest',
    'annuitypayment',
    'roi',
    'loanpayment'
  ]);

  window.solveFinance = (input) => {
    const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
    if (!match) {
      throw new Error('Use finance formulas like futureValue(...), roi(...), or loanPayment(...).');
    }

    const mode = match[1].toLowerCase();
    const args = match[2].split(',').map((value) => Number(value.trim()));
    const operations = {
      futurevalue: () => {
        const [present, rate, periods] = args;
        const factor = (1 + rate) ** periods;
        const result = futureValue(present, rate, periods);
        return formatFinanceSolution('Future Value', 'FV = PV × (1 + r)^n', [
          `Substitute values: FV = ${present} × (1 + ${rate})^${periods}`,
          `Evaluate the growth factor: (1 + ${rate})^${periods} = ${factor}`,
          `Calculate: FV = ${present} × ${factor} = ${result}`
        ], result);
      },
      presentvalue: () => {
        const [future, rate, periods] = args;
        const factor = (1 + rate) ** periods;
        const result = presentValue(future, rate, periods);
        return formatFinanceSolution('Present Value', 'PV = FV / (1 + r)^n', [
          `Substitute values: PV = ${future} / (1 + ${rate})^${periods}`,
          `Evaluate the denominator: (1 + ${rate})^${periods} = ${factor}`,
          `Calculate: PV = ${future} / ${factor} = ${result}`
        ], result);
      },
      simpleinterest: () => {
        const [principal, rate, time] = args;
        const firstProduct = principal * rate;
        const result = simpleInterest(principal, rate, time);
        return formatFinanceSolution('Simple Interest', 'I = P × r × t', [
          `Substitute values: I = ${principal} × ${rate} × ${time}`,
          `Multiply: I = ${firstProduct} × ${time} = ${result}`
        ], result);
      },
      compoundinterest: () => {
        const [principal, rate, periods] = args;
        const factor = (1 + rate) ** periods;
        const result = compoundInterest(principal, rate, periods);
        return formatFinanceSolution('Compound Interest', 'A = P × (1 + r)^n', [
          `Substitute values: A = ${principal} × (1 + ${rate})^${periods}`,
          `Evaluate the growth factor: (1 + ${rate})^${periods} = ${factor}`,
          `Calculate: A = ${principal} × ${factor} = ${result}`
        ], result);
      },
      annuitypayment: () => {
        const [future, rate, periods] = args;
        const denominator = ((1 + rate) ** periods) - 1;
        const result = annuityPayment(future, rate, periods);
        return formatFinanceSolution('Annuity Payment', 'PMT = FV × r / ((1 + r)^n - 1)', [
          `Substitute values: PMT = ${future} × ${rate} / ((1 + ${rate})^${periods} - 1)`,
          `Evaluate the denominator: (1 + ${rate})^${periods} - 1 = ${denominator}`,
          `Calculate: PMT = (${future} × ${rate}) / ${denominator} = ${result}`
        ], result);
      },
      roi: () => {
        const [gain, investment] = args;
        const ratio = gain / investment;
        const result = roi(gain, investment);
        return formatFinanceSolution('Return on Investment', 'ROI = (gain / investment) × 100', [
          `Substitute values: ROI = (${gain} / ${investment}) × 100`,
          `Divide: ${gain} / ${investment} = ${ratio}`,
          `Convert to a percentage: ${ratio} × 100 = ${result}%`
        ], result);
      },
      loanpayment: () => {
        const [principal, rate, periods] = args;
        const denominator = 1 - (1 + rate) ** (-periods);
        const result = loanPayment(principal, rate, periods);
        return formatFinanceSolution('Loan Payment', 'PMT = P × r / (1 - (1 + r)^(-n))', [
          `Substitute values: PMT = (${principal} × ${rate}) / (1 - (1 + ${rate})^(-${periods}))`,
          `Evaluate the denominator: 1 - (1 + ${rate})^(-${periods}) = ${denominator}`,
          `Calculate: PMT = (${principal} × ${rate}) / ${denominator} = ${result}`
        ], result);
      }
    };

    const solve = operations[mode];
    if (!solve) throw new Error('Unknown finance formula mode.');
    return solve();
  };
}
