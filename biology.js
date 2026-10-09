window.BIOLOGY_FORMULAS = new Set([
  'bmi',
  'bmr',
  'populationgrowth',
  'exponentialgrowth',
  'logisticgrowth',
  'doublingtime',
  'genotypefrequency',
  'allelefrequency',
  'hardyweinberg',
  'geneticdistance',
  'selectioncoefficient',
  'enzymevelocity',
  'michaelismenten',
  'hillequation',
  'atpyield',
  'proteinconcentration',
  'dnaweight',
  'meltingtemperature',
  'gccontent',
  'bloodpressure',
  'cardiacoutput',
  'meanarterialpressure',
  'pulserate',
  'renalclearance',
  'oxygendelivery',
  'neuronspeed',
  'infectionrate',
  'basicreproductionnumber',
  'mortalityrate',
  'biodiversityindex'
]);

function splitBiologyArgs(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;

  for (let i = 0; i < statement.length; i++) {
    const ch = statement[i];
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      const value = statement.slice(start, i).trim();
      if (value.length > 0) parts.push(value);
      start = i + 1;
    }
  }

  const finalValue = statement.slice(start).trim();
  if (finalValue.length > 0) parts.push(finalValue);
  return parts;
}

function validateBiologyArgs(args, expectedLength, usage, predicate = () => true) {
  if (args.length !== expectedLength) {
    throw new Error(`Use ${usage}.`);
  }

  const numericArgs = args.map((value) => Number(value));
  if (!numericArgs.every((value) => Number.isFinite(value))) {
    throw new Error(`${usage} requires finite numeric values.`);
  }

  if (!predicate(...numericArgs)) {
    throw new Error(`${usage} has invalid values.`);
  }

  return numericArgs;
}

function solveBiology(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);

  if (!match) {
    throw new Error("Invalid biology formula syntax.");
  }

  const mode = match[1].toLowerCase();
  const args = splitBiologyArgs(match[2]).map((value) => value.trim());

  switch (mode) {
    case 'bmi':
      return solveBMI(args);
    case 'bmr':
      return solveBMR(args);
    case 'populationgrowth':
      return solvePopulationGrowth(args);
    case 'exponentialgrowth':
      return solveExponentialGrowth(args);
    case 'logisticgrowth':
      return solveLogisticGrowth(args);
    case 'doublingtime':
      return solveDoublingTime(args);
    case 'genotypefrequency':
      return solveGenotypeFrequency(args);
    case 'allelefrequency':
      return solveAlleleFrequency(args);
    case 'hardyweinberg':
      return solveHardyWeinberg(args);
    case 'geneticdistance':
      return solveGeneticDistance(args);
    case 'selectioncoefficient':
      return solveSelectionCoefficient(args);
    case 'enzymevelocity':
      return solveEnzymeVelocity(args);
    case 'michaelismenten':
      return solveMichaelisMenten(args);
    case 'hillequation':
      return solveHillEquation(args);
    case 'atpyield':
      return solveATPYield(args);
    case 'proteinconcentration':
      return solveProteinConcentration(args);
    case 'dnaweight':
      return solveDNAWeight(args);
    case 'meltingtemperature':
      return solveMeltingTemperature(args);
    case 'gccontent':
      return solveGCContent(args);
    case 'bloodpressure':
      return solveBloodPressure(args);
    case 'cardiacoutput':
      return solveCardiacOutput(args);
    case 'meanarterialpressure':
      return solveMAP(args);
    case 'pulserate':
      return solvePulseRate(args);
    case 'renalclearance':
      return solveRenalClearance(args);
    case 'oxygendelivery':
      return solveOxygenDelivery(args);
    case 'neuronspeed':
      return solveNeuronSpeed(args);
    case 'infectionrate':
      return solveInfectionRate(args);
    case 'basicreproductionnumber':
      return solveR0(args);
    case 'mortalityrate':
      return solveMortalityRate(args);
    case 'biodiversityindex':
      return solveBiodiversity(args);
    default:
      throw new Error("Unknown biology formula.");
  }
}

// ------------------------------------
// BMI
// bmi(weightKg, heightM)
// ------------------------------------

function solveBMI(args) {
  const [weight, height] = validateBiologyArgs(args, 2, 'bmi(weightKg, heightM)', (w, h) => w > 0 && h > 0);
  return `BMI = ${weight / (height * height)}`;
}

// ------------------------------------
// Basal Metabolic Rate
// bmr(weight,height,age)
// ------------------------------------

function solveBMR(args) {
  const [w, h, a] = validateBiologyArgs(args, 3, 'bmr(weightKg, heightCm, ageYears)', (weight, height, age) => weight > 0 && height > 0 && age >= 0);
  return `BMR = ${(10 * w) + (6.25 * h) - (5 * a) + 5}`;
}

// ------------------------------------
// Population Growth
// ------------------------------------

function solvePopulationGrowth(args) {
  const [N0, r, t] = validateBiologyArgs(args, 3, 'populationGrowth(N0, r, t)', (n0, rate, time) => n0 >= 0 && time >= 0);
  return `Population = ${N0 * (1 + r * t)}`;
}

// ------------------------------------
// Exponential Growth
// ------------------------------------

function solveExponentialGrowth(args) {
  const [N0, r, t] = validateBiologyArgs(args, 3, 'exponentialGrowth(N0, r, t)', (n0, rate, time) => n0 >= 0 && time >= 0);
  return `N(t) = ${N0 * Math.exp(r * t)}`;
}

// ------------------------------------
// Logistic Growth
// ------------------------------------

function solveLogisticGrowth(args) {
  const [K, N0, r, t] = validateBiologyArgs(args, 4, 'logisticGrowth(K, N0, r, t)', (carryingCapacity, initialPopulation, rate, time) => carryingCapacity > 0 && initialPopulation >= 0 && time >= 0);
  const pop = K / (1 + (((K - N0) / N0) * Math.exp(-r * t)));
  return `Population = ${pop}`;
}

// ------------------------------------
// Doubling Time
// ------------------------------------

function solveDoublingTime(args) {
  const [r] = validateBiologyArgs(args, 1, 'doublingTime(r)', (rate) => rate > 0);
  return `Doubling Time = ${0.693 / r}`;
}

// ------------------------------------
// Hardy-Weinberg
// hardyWeinberg(p)
// ------------------------------------

function solveHardyWeinberg(args) {
  const [p] = validateBiologyArgs(args, 1, 'hardyWeinberg(p)', (value) => value >= 0 && value <= 1);
  const q = 1 - p;

  return [
    `p² = ${p * p}`,
    `2pq = ${2 * p * q}`,
    `q² = ${q * q}`
  ].join("\n");
}

// ------------------------------------
// Genotype Frequency
// ------------------------------------

function solveGenotypeFrequency(args) {
  const [count, total] = validateBiologyArgs(args, 2, 'genotypeFrequency(count, total)', (n, t) => n >= 0 && t > 0 && n <= t);
  return `Frequency = ${count / total}`;
}

// ------------------------------------
// Allele Frequency
// ------------------------------------

function solveAlleleFrequency(args) {
  const [allele, total] = validateBiologyArgs(args, 2, 'alleleFrequency(alleleCount, total)', (a, t) => a >= 0 && t > 0 && a <= t);
  return `Frequency = ${allele / total}`;
}

// ------------------------------------
// Genetic Distance
// ------------------------------------

function solveGeneticDistance(args) {
  const [differences, total] = validateBiologyArgs(args, 2, 'geneticDistance(differences, total)', (d, t) => d >= 0 && t > 0 && d <= t);
  return `Distance = ${differences / total}`;
}

// ------------------------------------
// Selection Coefficient
// ------------------------------------

function solveSelectionCoefficient(args) {
  const [fitness] = validateBiologyArgs(args, 1, 'selectionCoefficient(fitness)', (value) => value >= 0 && value <= 1);
  return `s = ${1 - fitness}`;
}

// ------------------------------------
// Enzyme Velocity
// ------------------------------------

function solveEnzymeVelocity(args) {
  const [product, time] = validateBiologyArgs(args, 2, 'enzymeVelocity(product, time)', (p, t) => p >= 0 && t > 0);
  return `Velocity = ${product / time}`;
}

// ------------------------------------
// Michaelis-Menten
// michaelisMenten(Vmax,S,Km)
// ------------------------------------

function solveMichaelisMenten(args) {
  const [Vmax, S, Km] = validateBiologyArgs(args, 3, 'michaelisMenten(Vmax, S, Km)', (vmax, s, km) => vmax >= 0 && s >= 0 && km > 0);
  const rate = (Vmax * S) / (Km + S);
  return `v = ${rate}`;
}

// ------------------------------------
// Hill Equation
// ------------------------------------

function solveHillEquation(args) {
  const [L, k, n] = validateBiologyArgs(args, 3, 'hillEquation(L, k, n)', (l, kValue, exponent) => l >= 0 && kValue > 0 && exponent >= 0);
  const y = Math.pow(L, n) / (Math.pow(k, n) + Math.pow(L, n));
  return `Fraction Bound = ${y}`;
}

// ------------------------------------
// ATP Yield
// ------------------------------------

function solveATPYield(args) {
  const [glucose] = validateBiologyArgs(args, 1, 'atpYield(glucoseMoles)', (value) => value >= 0);
  return `ATP = ${glucose * 36}`;
}

// ------------------------------------
// Protein Concentration
// ------------------------------------

function solveProteinConcentration(args) {
  const [mass, volume] = validateBiologyArgs(args, 2, 'proteinConcentration(mass, volume)', (m, v) => m >= 0 && v > 0);
  return `Concentration = ${mass / volume}`;
}

// ------------------------------------
// DNA Weight
// ------------------------------------

function solveDNAWeight(args) {
  const [bp] = validateBiologyArgs(args, 1, 'dnaWeight(bp)', (value) => value >= 0);
  return `DNA Weight = ${bp * 660} Da`;
}

// ------------------------------------
// Melting Temperature
// ------------------------------------

function solveMeltingTemperature(args) {
  const [A, T, G, C] = validateBiologyArgs(args, 4, 'meltingTemperature(A, T, G, C)', (a, t, g, c) => a >= 0 && t >= 0 && g >= 0 && c >= 0);
  return `Tm = ${2 * (A + T) + 4 * (G + C)} °C`;
}

// ------------------------------------
// GC Content
// ------------------------------------

function solveGCContent(args) {
  const [GC, total] = validateBiologyArgs(args, 2, 'gcContent(GC, total)', (gc, t) => gc >= 0 && t > 0 && gc <= t);
  return `GC% = ${(GC / total) * 100}`;
}

// ------------------------------------
// Blood Pressure
// ------------------------------------

function solveBloodPressure(args) {
  const [force, area] = validateBiologyArgs(args, 2, 'bloodPressure(force, area)', (f, a) => f >= 0 && a > 0);
  return `Pressure = ${force / area} Pa`;
}

// ------------------------------------
// Cardiac Output
// ------------------------------------

function solveCardiacOutput(args) {
  const [HR, SV] = validateBiologyArgs(args, 2, 'cardiacOutput(HR, SV)', (hr, sv) => hr >= 0 && sv >= 0);
  return `CO = ${HR * SV} mL/min`;
}

// ------------------------------------
// Mean Arterial Pressure
// ------------------------------------

function solveMAP(args) {
  const [sys, dia] = validateBiologyArgs(args, 2, 'meanArterialPressure(sys, dia)', (systolic, diastolic) => systolic >= 0 && diastolic >= 0);
  return `Mean arterial pressure = ${(sys + 2 * dia) / 3} mmHg`;
}

// ------------------------------------
// Pulse Rate
// ------------------------------------

function solvePulseRate(args) {
  const [beats, time] = validateBiologyArgs(args, 2, 'pulseRate(beats, time)', (b, t) => b >= 0 && t > 0);
  return `Pulse rate = ${(beats / time) * 60} bpm`;
}

// ------------------------------------
// Renal Clearance
// ------------------------------------

function solveRenalClearance(args) {
  const [U, V, P] = validateBiologyArgs(args, 3, 'renalClearance(U, V, P)', (u, v, p) => u >= 0 && v >= 0 && p > 0);
  return `Renal clearance = ${(U * V) / P} mL/min`;
}

// ------------------------------------
// Oxygen Delivery
// ------------------------------------

function solveOxygenDelivery(args) {
  const [CO, CaO2] = validateBiologyArgs(args, 2, 'oxygenDelivery(CO, CaO2)', (co, cao2) => co >= 0 && cao2 >= 0);
  return `Oxygen delivery = ${CO * CaO2} mL O2/min`;
}

// ------------------------------------
// Neuron Speed
// ------------------------------------

function solveNeuronSpeed(args) {
  const [distance, time] = validateBiologyArgs(args, 2, 'neuronSpeed(distance, time)', (d, t) => d >= 0 && t > 0);
  return `Neuron speed = ${distance / time} m/s`;
}

// ------------------------------------
// Infection Rate
// ------------------------------------

function solveInfectionRate(args) {
  const [cases, population] = validateBiologyArgs(args, 2, 'infectionRate(cases, population)', (c, p) => c >= 0 && p > 0 && c <= p);
  return `Infection rate = ${(cases / population) * 100000} cases per 100000`;
}

// ------------------------------------
// Basic Reproduction Number
// ------------------------------------

function solveR0(args) {
  const [beta, gamma] = validateBiologyArgs(args, 2, 'basicReproductionNumber(beta, gamma)', (b, g) => b >= 0 && g > 0);
  return `Basic reproduction number = ${beta / gamma}`;
}

// ------------------------------------
// Mortality Rate
// ------------------------------------

function solveMortalityRate(args) {
  const [deaths, pop] = validateBiologyArgs(args, 2, 'mortalityRate(deaths, population)', (d, p) => d >= 0 && p > 0 && d <= p);
  return `Mortality rate = ${(deaths / pop) * 1000} deaths per 1000`;
}

// ------------------------------------
// Simpson Biodiversity Index
// ------------------------------------

function solveBiodiversity(args) {
  const [species, total] = validateBiologyArgs(args, 2, 'biodiversityIndex(species, total)', (s, t) => s >= 0 && t > 0 && s <= t);
  return `Simpson biodiversity index = ${1 - (species / total)}`;
}
