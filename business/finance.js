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
      futurevalue: () => futureValue(args[0], args[1], args[2]),
      presentvalue: () => presentValue(args[0], args[1], args[2]),
      simpleinterest: () => simpleInterest(args[0], args[1], args[2]),
      compoundinterest: () => compoundInterest(args[0], args[1], args[2]),
      annuitypayment: () => annuityPayment(args[0], args[1], args[2]),
      roi: () => roi(args[0], args[1]),
      loanpayment: () => loanPayment(args[0], args[1], args[2])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown finance formula mode.');
    return `Finance formula: ${result()}`;
  };
}
