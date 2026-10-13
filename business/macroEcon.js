export function gdp(consumption, investment, government, netExports) {
  return consumption + investment + government + netExports;
}

export function realGdp(nominalGdp, gdpDeflator) {
  return nominalGdp / (gdpDeflator / 100);
}

export function inflationRate(cpiCurrent, cpiPrevious) {
  return ((cpiCurrent - cpiPrevious) / cpiPrevious) * 100;
}

export function unemploymentRate(unemployed, laborForce) {
  return (unemployed / laborForce) * 100;
}

export function spendingMultiplier(mpc) {
  return 1 / (1 - mpc);
}

export function taxMultiplier(mpc) {
  return (-mpc) / (1 - mpc);
}

if (typeof window !== 'undefined') {
  window.MACRO_ECON_MODE_NAMES = new Set([
    'gdp',
    'realgdp',
    'inflationrate',
    'unemploymentrate',
    'spendingmultiplier',
    'taxmultiplier'
  ]);

  window.solveMacroEcon = (input) => {
    const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
    if (!match) {
      throw new Error('Use macroeconomic formulas like gdp(...), inflationRate(...), or spendingMultiplier(...).');
    }

    const mode = match[1].toLowerCase();
    const args = match[2].split(',').map((value) => Number(value.trim()));
    const operations = {
      gdp: () => gdp(args[0], args[1], args[2], args[3]),
      realgdp: () => realGdp(args[0], args[1]),
      inflationrate: () => inflationRate(args[0], args[1]),
      unemploymentrate: () => unemploymentRate(args[0], args[1]),
      spendingmultiplier: () => spendingMultiplier(args[0]),
      taxmultiplier: () => taxMultiplier(args[0])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown macroeconomic formula mode.');
    return `Macroeconomics formula: ${result()}`;
  };
}
