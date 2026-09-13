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

  const mode = match[1].toLowerCase();
  const args = splitChemArgs(match[2]);

  switch (mode) {
    case 'stoichiometry': return solveStoichiometry(args);
    case 'molarity': return solveMolarity(args);
    case 'molality': return solveMolality(args);
    case 'idealgas': return solveIdealGas(args);
    case 'vanderwaals': return solveVanDerWaals(args);
    case 'enthalpy': return solveEnthalpy(args);
    case 'entropy': return solveEntropy(args);
    case 'gibbs': return solveGibbs(args);
    case 'equilibrium': return solveEquilibrium(args);
    case 'ratelaw': return solveRateLaw(args);
    case 'arrhenius': return solveArrhenius(args);
    case 'nernst': return solveNernst(args);
    case 'electrolysis': return solveElectrolysis(args);
    case 'ph': return solvePH(args);
    case 'buffer': return solveBuffer(args);
    case 'quantumenergy': return solveQuantumEnergy(args);
    default:
      throw new Error("Unknown chemistry mode.");
  }
}