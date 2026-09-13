window.CHEMISTRY_MODE_NAMES = new Set([
  'stoichiometry',
  'molarity',
  'molality',
  'idealGas',
  'vanDerWaals',
  'enthalpy',
  'entropy',
  'gibbs',
  'equilibrium',
  'rateLaw',
  'arrhenius',
  'nernst',
  'electrolysis',
  'ph',
  'buffer',
  'quantumEnergy'
]);

function solveChemistry(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error("Use chemistry modes like stoichiometry(...), molarity(...), idealGas(...).");
  }

  const mode = match[1].toLowerCase();
  const args = splitChemArgs(match[2]);