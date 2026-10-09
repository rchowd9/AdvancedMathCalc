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

     const pop =
    K/(1+((K-N0)/N0)*Math.exp(-r*t));

  return `Population = ${pop}`;
}

// ------------------------------------
// Doubling Time
// ------------------------------------

function solveDoublingTime([r]) {
  return `Doubling Time = ${0.693/r}`;
}

// ------------------------------------
// Hardy-Weinberg
// hardyWeinberg(p)
// ------------------------------------

function solveHardyWeinberg([p]) {

  const q = 1-p;

  return [
    `p² = ${p*p}`,
    `2pq = ${2*p*q}`,
    `q² = ${q*q}`
  ].join("\n");
}

// ------------------------------------
// Genotype Frequency
// ------------------------------------

function solveGenotypeFrequency([count,total]) {
  return `Frequency = ${count/total}`;
}

// ------------------------------------
// Allele Frequency
// ------------------------------------

function solveAlleleFrequency([allele,total]) {
  return `Frequency = ${allele/total}`;
}

// ------------------------------------
// Genetic Distance
// ------------------------------------

function solveGeneticDistance([differences,total]) {
  return `Distance = ${differences/total}`;
}

// ------------------------------------
// Selection Coefficient
// ------------------------------------

function solveSelectionCoefficient([fitness]) {
  return `s = ${1-fitness}`;
}

// ------------------------------------
// Enzyme Velocity
// ------------------------------------

function solveEnzymeVelocity([product,time]) {
  return `Velocity = ${product/time}`;
}

// ------------------------------------
// Michaelis-Menten
// michaelisMenten(Vmax,S,Km)
// ------------------------------------

function solveMichaelisMenten([Vmax,S,Km]) {

  const rate =
    (Vmax*S)/(Km+S);

  return `v = ${rate}`;
}

// ------------------------------------
// Hill Equation
// ------------------------------------

function solveHillEquation([L,k,n]) {

  const y =
    Math.pow(L,n)/
    (Math.pow(k,n)+Math.pow(L,n));

  return `Fraction Bound = ${y}`;
}

// ------------------------------------
// ATP Yield
// ------------------------------------

function solveATPYield([glucose]) {
  return `ATP = ${glucose*36}`;
}

// ------------------------------------
// Protein Concentration
// ------------------------------------

function solveProteinConcentration([mass,volume]) {
  return `Concentration = ${mass/volume}`;
}

// ------------------------------------
// DNA Weight
// ------------------------------------

function solveDNAWeight([bp]) {
  return `DNA Weight = ${bp*660} Da`;
}

// ------------------------------------
// Melting Temperature
// ------------------------------------

function solveMeltingTemperature([A,T,G,C]) {
  return `Tm = ${2*(A+T)+4*(G+C)} °C`;
}

// ------------------------------------
// GC Content
// ------------------------------------

function solveGCContent([GC,total]) {
  return `GC% = ${(GC/total)*100}`;
}

// ------------------------------------
// Blood Pressure
// ------------------------------------

function solveBloodPressure([force,area]) {
  return `Pressure = ${force/area} Pa`;
}

// ------------------------------------
// Cardiac Output
// ------------------------------------

function solveCardiacOutput([HR,SV]) {
  return `CO = ${HR*SV} mL/min`;
}

// ------------------------------------
// Mean Arterial Pressure
// ------------------------------------

function solveMAP([sys,dia]) {
  return (sys+2*dia)/3;
}

// ------------------------------------
// Pulse Rate
// ------------------------------------

function solvePulseRate([beats,time]) {
  return (beats/time)*60;
}

// ------------------------------------
// Renal Clearance
// ------------------------------------

function solveRenalClearance([U,V,P]) {
  return (U*V)/P;
}

// ------------------------------------
// Oxygen Delivery
// ------------------------------------

function solveOxygenDelivery([CO,CaO2]) {
  return CO*CaO2;
}

// ------------------------------------
// Neuron Speed
// ------------------------------------

function solveNeuronSpeed([distance,time]) {
  return distance/time;
}

// ------------------------------------
// Infection Rate
// ------------------------------------

function solveInfectionRate([cases,population]) {
  return (cases/population)*100000;
}

// ------------------------------------
// Basic Reproduction Number
// ------------------------------------

function solveR0([beta,gamma]) {
  return beta/gamma;
}

// ------------------------------------
// Mortality Rate
// ------------------------------------

function solveMortalityRate([deaths,pop]) {
  return (deaths/pop)*1000;
}

// ------------------------------------
// Simpson Biodiversity Index
// ------------------------------------

function solveBiodiversity([species,total]) {
  return 1-(species/total);
}
