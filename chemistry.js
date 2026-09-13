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

function splitChemArgs(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;
  for (let i = 0; i < statement.length; i++) {
    const ch = statement[i];
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(statement.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(statement.slice(start).trim());
  return parts;
}

function solveStoichiometry(args) {
  if (args.length < 2) throw new Error("Use stoichiometry(moles, ratio)");
  const [moles, ratio] = args.map(Number);
  const result = moles * ratio;
  return `Stoichiometry: ${moles} mol × ratio ${ratio} = ${result} mol products`;
}

function solveMolarity(args) {
  if (args.length < 2) throw new Error("Use molarity(moles, volumeL)");
  const [moles, volume] = args.map(Number);
  const M = moles / volume;
  return `Molarity: M = n / V = ${M} mol/L`;
}

function solveMolality(args) {
  if (args.length < 2) throw new Error("Use molality(moles, massSolventKg)");
  const [moles, mass] = args.map(Number);
  const m = moles / mass;
  return `Molality: m = n / kg solvent = ${m} mol/kg`;
}


// pH: ph(Hplus)
function solvePH(args) {
  if (args.length < 1) throw new Error("Use ph([H+])");
  const [H] = args.map(Number);
  const pH = -Math.log10(H);
  return `pH = -log10([H+]) = ${pH}`;
}