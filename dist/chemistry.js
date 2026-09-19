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
  'quantumEnergy',
  'dilution',
  'titration',
  'solubility',
  'organic'
]);

const CHEM_SUBSCRIPT = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
const CHEM_SUPERSCRIPT = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻' };

function formatChemicalFormula(value) {
  return String(value)
    .replace(/\+/g, '⁺')
    .replace(/-/g, '⁻')
    .replace(/([A-Za-z]+)(\d+)/g, (_, letters, digits) => {
      const subscript = [...digits].map((char) => CHEM_SUBSCRIPT[char] ?? char).join('');
      return `${letters}${subscript}`;
    })
    .replace(/\[([A-Za-z]+)\+\]/g, (_, letters) => `[${letters}⁺]`)
    .replace(/\[([A-Za-z]+)\-\]/g, (_, letters) => `[${letters}⁻]`);
}

function formatChemEquation(value) {
  return formatChemicalFormula(value).replace(/\*/g, '·').replace(/\//g, '÷');
}

function describeOrganicCompound(formula) {
  const normalized = formula.replace(/\s+/g, '').toUpperCase();
  const known = {
    C6H6: 'benzene (aromatic hydrocarbon)',
    C2H5OH: 'ethanol (alcohol)',
    CH3COOH: 'acetic acid (carboxylic acid)',
    C6H12O6: 'glucose (carbohydrate)',
    C2H4: 'ethene (alkene)',
    C2H6: 'ethane (alkane)',
    CH4: 'methane (alkane)',
    C3H8: 'propane (alkane)',
    C2H2: 'ethyne (alkyne)',
    CH3OH: 'methanol (alcohol)',
    C6H5OH: 'phenol (aromatic alcohol)',
    CH3COCH3: 'acetone (ketone)',
    NH3: 'ammonia (base)',
    H2O: 'water',
    CO2: 'carbon dioxide'
  };

  if (known[normalized]) return known[normalized];

  if (/^C[0-9]*H[0-9]*$/.test(normalized)) return 'hydrocarbon family compound';
  if (/^C[0-9]*H[0-9]*O[0-9]*$/.test(normalized)) return 'oxygen-containing organic compound';
  if (/^C[0-9]*H[0-9]*N[0-9]*$/.test(normalized)) return 'nitrogen-containing organic compound';
  return 'organic compound';
}

function solveOrganic(args) {
  if (args.length < 1) throw new Error('Use organic(formula)');
  const formula = args[0].trim();
  const normalized = formula.replace(/\s+/g, '');
  const described = describeOrganicCompound(normalized);
  const formatted = formatChemicalFormula(normalized);
  return `Organic chemistry: ${normalized} (${formatted}) → ${described}. Common functional pattern: ${normalized.includes('OH') ? 'alcohol/phenol' : normalized.includes('COOH') ? 'carboxylic acid' : normalized.includes('C=') ? 'unsaturated hydrocarbon' : 'organic structure'}.`;
}

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
    case 'dilution': return solveDilution(args);
    case 'titration': return solveTitration(args);
    case 'solubility': return solveSolubility(args);
    case 'organic': return solveOrganic(args);
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

// Ideal Gas Law: idealGas(P, V, n, T)
function solveIdealGas(args) {
  const [P, V, n, T] = args.map(Number);
  const R = 0.0821;
  return `Ideal Gas Law: PV = nRT → ${P * V} vs ${n * R * T}`;
}

// Van der Waals: vanDerWaals(P, V, n, T, a, b)
function solveVanDerWaals(args) {
  const [P, V, n, T, a, b] = args.map(Number);
  const R = 0.0821;
  const lhs = (P + (a * n * n) / (V * V)) * (V - n * b);
  const rhs = n * R * T;
  return `Van der Waals: [P + a(n/V)²][V - nb] = nRT → ${lhs} vs ${rhs}`;
}

// Enthalpy: enthalpy(q, n)
function solveEnthalpy(args) {
  const [q, n] = args.map(Number);
  return `Enthalpy change per mole: ΔH = q/n = ${q / n} kJ/mol`;
}

// Entropy: entropy(q, T)
function solveEntropy(args) {
  const [q, T] = args.map(Number);
  return `Entropy change: ΔS = q/T = ${q / T} J/K`;
}

function solveGibbs(args) {
  const [H, T, S] = args.map(Number);
  return `Gibbs free energy: ΔG = ΔH - TΔS = ${H - T * S} kJ`;
}

// Equilibrium constant: equilibrium(products, reactants)
function solveEquilibrium(args) {
  const [products, reactants] = args.map(Number);
  return `Equilibrium constant: K = [products]/[reactants] = ${products / reactants}`;
}


// Rate Law: rateLaw(k, [A], order)
function solveRateLaw(args) {
  const [k, A, order] = args.map(Number);
  return `Rate law: rate = k[A]^n = ${k * Math.pow(A, order)}`;
}

// Arrhenius Equation: arrhenius(A, Ea, T)
function solveArrhenius(args) {
  const [A, Ea, T] = args.map(Number);
  const R = 8.314;
  return `Arrhenius equation: k = Ae^(-Ea/RT) = ${A * Math.exp(-Ea / (R * T))}`;
}

// Nernst Equation: nernst(E0, T, n, Q)
function solveNernst(args) {
  const [E0, T, n, Q] = args.map(Number);
  const R = 8.314;
  const F = 96485;
  return `Nernst equation: E = E0 - (RT/nF)lnQ = ${E0 - (R * T) / (n * F) * Math.log(Q)} V`;
}

// Electrolysis: electrolysis(I, t, n)
function solveElectrolysis(args) {
  const [I, t, n] = args.map(Number);
  const F = 96485;
  const Q = I * t;
  return `Electrolysis: Q = I·t = ${Q} C, moles = Q/(nF) = ${Q / (n * F)}`;
}

// pH: ph(Hplus)
function solvePH(args) {
  if (args.length < 1) throw new Error("Use ph([H+])");
  const [H] = args.map(Number);
  const pH = -Math.log10(H);
  return `pH = -log10(${formatChemicalFormula('[H+]')}) = ${pH}`;
}

// Buffer solution: buffer(pKa, [HA], [A-])
function solveBuffer(args) {
  const [pKa, HA, A] = args.map(Number);
  return `Buffer pH = pKa + log(${formatChemicalFormula('[A-]/[HA]')}) = ${pKa + Math.log10(A / HA)}`;
}

// Quantum Energy: quantumEnergy(n, Z)
function solveQuantumEnergy(args) {
  const [n, Z] = args.map(Number);
  const Rydberg = 2.18e-18;
  return `Quantum energy level: E = -R·Z²/n² = ${-Rydberg * Z * Z / (n * n)} J`;
}

// Dilution: dilution(C1, V1, V2)
function solveDilution(args) {
  if (args.length < 3) throw new Error('Use dilution(C1, V1, V2)');
  const [C1, V1, V2] = args.map(Number);
  const C2 = (C1 * V1) / V2;
  return `Dilution: C1V1 = C2V2 → C2 = C1·V1 / V2 = ${C2} M`;
}

// Acid-base titration: titration(Macid, Vacid, nH, Mbase, Vbase, nOH)
function solveTitration(args) {
  if (args.length < 6) throw new Error('Use titration(Macid, Vacid, nH, Mbase, Vbase, nOH)');
  const [Macid, Vacid, nH, Mbase, Vbase, nOH] = args.map(Number);
  const acidEq = Macid * Vacid * nH;
  const baseEq = Mbase * Vbase * nOH;
  return `Titration equivalence: acid equivalents = ${acidEq}, base equivalents = ${baseEq}. Balance check: ${acidEq} vs ${baseEq}`;
}

// Solubility product: solubility(Ksp, cationCoeff, anionCoeff)
function solveSolubility(args) {
  if (args.length < 3) throw new Error('Use solubility(Ksp, cationCoeff, anionCoeff)');
  const [Ksp, cationCoeff, anionCoeff] = args.map(Number);
  const molarSolubility = Math.pow(Ksp / (Math.pow(cationCoeff, cationCoeff) * Math.pow(anionCoeff, anionCoeff)), 1 / (cationCoeff + anionCoeff));
  return `Solubility product: Ksp = [M]^a [X]^b = ${Ksp}; estimated molar solubility ≈ ${molarSolubility} M`;
}
