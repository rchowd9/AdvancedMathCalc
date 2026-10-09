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

function solveBiology(input) {

  const match = input.match(/^([a-zA-Z]+)\(([\s\S]*)\)$/);

  if (!match) {
    throw new Error("Invalid biology formula syntax.");
  }

  const mode = match[1].toLowerCase();
  const args = match[2].split(',').map(x => Number(x.trim()));

  switch(mode) {

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

function solveBMI([weight, height]) {
  return `BMI = ${weight / (height * height)}`;
}

// ------------------------------------
// Basal Metabolic Rate
// bmr(weight,height,age)
// ------------------------------------

function solveBMR([w,h,a]) {
  return `BMR = ${(10*w)+(6.25*h)-(5*a)+5}`;
}

// ------------------------------------
// Population Growth
// ------------------------------------

function solvePopulationGrowth([N0,r,t]) {
  return `Population = ${N0*(1+r*t)}`;
}

// ------------------------------------
// Exponential Growth
// ------------------------------------

function solveExponentialGrowth([N0,r,t]) {
  return `N(t) = ${N0*Math.exp(r*t)}`;
}

// ------------------------------------
// Logistic Growth
// ------------------------------------

function solveLogisticGrowth([K,N0,r,t]) {

