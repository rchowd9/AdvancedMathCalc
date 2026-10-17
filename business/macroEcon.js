function formatMacroEconNumber(value) {
  return Number(value.toPrecision(6));
}

function formatMacroEconSteps(title, formula, steps, result) {
  return [
    `${title}:`,
    `Step 1: Formula: ${formula}`,
    ...steps.map((step, index) => `Step ${index + 2}: ${step}`),
    `Result: ${formatMacroEconNumber(result)}`
  ].join('\n');
}

export function gdp(consumption, investment, government, netExports) {
  return consumption + investment + government + netExports;
}

export function explainGdp(consumption, investment, government, netExports) {
  const output = gdp(consumption, investment, government, netExports);
  return formatMacroEconSteps('GDP', 'Y = C + I + G + NX', [
    `Substitute values: Y = ${consumption} + ${investment} + ${government} + ${netExports}`,
    `Add the components: ${consumption} + ${investment} + ${government} + ${netExports} = ${output}`
  ], output);
}

export function realGdp(nominalGdp, gdpDeflator) {
  return nominalGdp / (gdpDeflator / 100);
}

export function explainRealGdp(nominalGdp, gdpDeflator) {
  const output = realGdp(nominalGdp, gdpDeflator);
  return formatMacroEconSteps('Real GDP', 'GDP_real = nominal GDP / (deflator / 100)', [
    `Substitute values: GDP_real = ${nominalGdp} / (${gdpDeflator} / 100)`,
    `Convert the deflator to a decimal: ${gdpDeflator} / 100 = ${gdpDeflator / 100}`,
    `Divide: ${nominalGdp} / ${gdpDeflator / 100} = ${output}`
  ], output);
}

export function inflationRate(cpiCurrent, cpiPrevious) {
  return ((cpiCurrent - cpiPrevious) / cpiPrevious) * 100;
}

export function explainInflationRate(cpiCurrent, cpiPrevious) {
  const output = inflationRate(cpiCurrent, cpiPrevious);
  return formatMacroEconSteps('Inflation rate', 'π = ((CPI_t - CPI_{t-1}) / CPI_{t-1}) × 100', [
    `Substitute values: π = ((${cpiCurrent} - ${cpiPrevious}) / ${cpiPrevious}) × 100`,
    `Find the change in CPI: ${cpiCurrent} - ${cpiPrevious} = ${cpiCurrent - cpiPrevious}`,
    `Divide by the previous CPI: ${cpiCurrent - cpiPrevious} / ${cpiPrevious} = ${(cpiCurrent - cpiPrevious) / cpiPrevious}`,
    `Convert to a percentage: ${(cpiCurrent - cpiPrevious) / cpiPrevious} × 100 = ${output}`
  ], output);
}

export function unemploymentRate(unemployed, laborForce) {
  return (unemployed / laborForce) * 100;
}

export function explainUnemploymentRate(unemployed, laborForce) {
  const output = unemploymentRate(unemployed, laborForce);
  return formatMacroEconSteps('Unemployment rate', 'U = unemployed / labor force × 100', [
    `Substitute values: U = ${unemployed} / ${laborForce} × 100`,
    `Divide unemployed by the labor force: ${unemployed} / ${laborForce} = ${unemployed / laborForce}`,
    `Convert to a percentage: ${unemployed / laborForce} × 100 = ${output}`
  ], output);
}

export function spendingMultiplier(mpc) {
  return 1 / (1 - mpc);
}

export function explainSpendingMultiplier(mpc) {
  const output = spendingMultiplier(mpc);
  return formatMacroEconSteps('Spending multiplier', 'k = 1 / (1 - MPC)', [
    `Substitute values: k = 1 / (1 - ${mpc})`,
    `Evaluate the denominator: 1 - ${mpc} = ${1 - mpc}`,
    `Divide: 1 / ${1 - mpc} = ${output}`
  ], output);
}

export function taxMultiplier(mpc) {
  return (-mpc) / (1 - mpc);
}

export function explainTaxMultiplier(mpc) {
  const output = taxMultiplier(mpc);
  return formatMacroEconSteps('Tax multiplier', 'k_t = -MPC / (1 - MPC)', [
    `Substitute values: k_t = -${mpc} / (1 - ${mpc})`,
    `Evaluate the denominator: 1 - ${mpc} = ${1 - mpc}`,
    `Divide: -${mpc} / ${1 - mpc} = ${output}`
  ], output);
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
      gdp: () => explainGdp(args[0], args[1], args[2], args[3]),
      realgdp: () => explainRealGdp(args[0], args[1]),
      inflationrate: () => explainInflationRate(args[0], args[1]),
      unemploymentrate: () => explainUnemploymentRate(args[0], args[1]),
      spendingmultiplier: () => explainSpendingMultiplier(args[0]),
      taxmultiplier: () => explainTaxMultiplier(args[0])
    };

    const result = operations[mode];
    if (!result) throw new Error('Unknown macroeconomic formula mode.');
    return `Macroeconomics formula:\n${result()}`;
  };
}
