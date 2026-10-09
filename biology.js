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
