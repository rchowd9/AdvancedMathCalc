window.GENETICS_FORMULAS = new Set([
  'hardyweinberg',
  'allelefrequency',
  'genotypefrequency',
  'phenotypefrequency',
  'heterozygosity',
  'homozygosity',
  'selectioncoefficient',
  'fitness',
  'mutationrate',
  'migrationrate',
  'geneticdrift',
  'inbreedingcoefficient',
  'effectivepopulationsize',
  'linkagefrequency',
  'recombinationfrequency',
  'lodscore',
  'geneticdistance',
  'mapdistance',
  'chiSquareGenetics',
  'heredity',
  'broadSenseHeritability',
  'narrowSenseHeritability',
  'responseToSelection',
  'breedersEquation',
  'foundereffect',
  'bottleneckeffect',
  'populationgrowthGenetics',
  'genediversity',
  'nucleotidediversity',
  'fst'
]);

function solveGenetics(input) {

  const match = input.match(/^([a-zA-Z]+)\(([\s\S]*)\)$/);

  if (!match) {
    throw new Error("Invalid genetics formula syntax.");
  }

  const mode = match[1].toLowerCase();
  const args = match[2].split(',').map(x => Number(x.trim()));

  switch(mode) {

    case 'hardyweinberg': return solveHardyWeinberg(args);
    case 'allelefrequency': return solveAlleleFrequency(args);
    case 'genotypefrequency': return solveGenotypeFrequency(args);
    case 'phenotypefrequency': return solvePhenotypeFrequency(args);
    case 'heterozygosity': return solveHeterozygosity(args);
    case 'homozygosity': return solveHomozygosity(args);
    case 'selectioncoefficient': return solveSelectionCoefficient(args);
    case 'fitness': return solveFitness(args);
    case 'mutationrate': return solveMutationRate(args);
    case 'migrationrate': return solveMigrationRate(args);
    case 'geneticdrift': return solveGeneticDrift(args);
    case 'inbreedingcoefficient': return solveInbreedingCoefficient(args);
    case 'effectivepopulationsize': return solveEffectivePopulationSize(args);
    case 'linkagefrequency': return solveLinkageFrequency(args);
    case 'recombinationfrequency': return solveRecombinationFrequency(args);
    case 'lodscore': return solveLOD(args);
    case 'geneticdistance': return solveGeneticDistance(args);
    case 'mapdistance': return solveMapDistance(args);
    case 'chisquaregenetics': return solveChiSquare(args);
    case 'heredity': return solveHeredity(args);
    case 'broadsenseheritability': return solveBroadSenseHeritability(args);
    case 'narrowsenseheritability': return solveNarrowSenseHeritability(args);
    case 'responsetoselection': return solveResponseToSelection(args);
    case 'breedersequation': return solveBreedersEquation(args);
    case 'foundereffect': return solveFounderEffect(args);
    case 'bottleneckeffect': return solveBottleneckEffect(args);
    case 'populationgrowthgenetics': return solvePopulationGrowth(args);
    case 'genediversity': return solveGeneDiversity(args);
    case 'nucleotidediversity': return solveNucleotideDiversity(args);
    case 'fst': return solveFST(args);

    default:
      throw new Error("Unknown genetics formula.");
  }
}

/ =====================================
// HARDY WEINBERG
// hardyWeinberg(p)
// =====================================

function solveHardyWeinberg([p]) {

  const q = 1 - p;

  return [
    "Hardy-Weinberg Equilibrium",
    `p = ${p}`,
    `q = ${q}`,
    `AA = p² = ${p*p}`,
    `Aa = 2pq = ${2*p*q}`,
    `aa = q² = ${q*q}`
  ].join("\n");
}

// =====================================
// ALLELE FREQUENCY
// alleleFrequency(copies,total)
// =====================================

function solveAlleleFrequency([copies,total]) {
  return `Allele Frequency = ${copies/total}`;
}

// =====================================
// GENOTYPE FREQUENCY
// =====================================

function solveGenotypeFrequency([genotype,total]) {
  return `Genotype Frequency = ${genotype/total}`;
}

// =====================================
// PHENOTYPE FREQUENCY
// =====================================

function solvePhenotypeFrequency([phenotype,total]) {
  return `Phenotype Frequency = ${phenotype/total}`;
}

/ =====================================
// HETEROZYGOSITY
// H = 2pq
// =====================================

function solveHeterozygosity([p]) {
  const q = 1-p;
  return `Heterozygosity (2pq) = ${2*p*q}`;
}

// =====================================
// HOMOZYGOSITY
// =====================================

function solveHomozygosity([p]) {
  const q = 1-p;
  return `Homozygosity = ${p*p + q*q}`;
}

// =====================================
// FITNESS
// =====================================

function solveFitness([survivors,total]) {
  return `Fitness = ${survivors/total}`;
}

// =====================================
// SELECTION COEFFICIENT
// s = 1-W
// =====================================

function solveSelectionCoefficient([fitness]) {
  return `Selection Coefficient = ${1-fitness}`;
}

// =====================================
// MUTATION RATE
// =====================================

function solveMutationRate([mutations,total]) {
  return `Mutation Rate = ${mutations/total}`;
}

// =====================================
// MIGRATION RATE
// =====================================

function solveMigrationRate([migrants,total]) {
  return `Migration Rate = ${migrants/total}`;
}

// =====================================
// GENETIC DRIFT
// =====================================

function solveGeneticDrift([p,N]) {
  return `Genetic Drift Variance = ${(p*(1-p))/(2*N)}`;
}

// =====================================
// INBREEDING COEFFICIENT
// =====================================

function solveInbreedingCoefficient([observed, expected]) {
  return `F = ${(expected-observed)/expected}`;
}

// =====================================
// EFFECTIVE POPULATION SIZE
// =====================================

function solveEffectivePopulationSize([Nm,Nf]) {
  return `Ne = ${(4*Nm*Nf)/(Nm+Nf)}`;
}

// =====================================
// LINKAGE FREQUENCY
// =====================================

function solveLinkageFrequency([linked,total]) {
  return `Linkage Frequency = ${linked/total}`;
}

// =====================================
// RECOMBINATION FREQUENCY
// =====================================

function solveRecombinationFrequency([recombinants,total]) {
  return `RF = ${(recombinants/total)*100}%`;
}

// =====================================
// MAP DISTANCE
// =====================================

function solveMapDistance([rf]) {
  return `${rf} cM`;
}

// =====================================
// LOD SCORE
// =====================================

function solveLOD([theta,likelihood]) {
  return `LOD = log10(${likelihood}/${theta}) = ${Math.log10(likelihood/theta)}`;
}

// =====================================
// GENETIC DISTANCE
// =====================================

function solveGeneticDistance([differences,total]) {
  return `Distance = ${differences/total}`;
}

// =====================================
// CHI SQUARE TEST
// =====================================

function solveChiSquare([observed,expected]) {
  return `χ² = ${Math.pow(observed-expected,2)/expected}`;
}

// =====================================
// HEREDITY
// =====================================

function solveHeredity([genetic,total]) {
  return `Heritability = ${genetic/total}`;
}

// =====================================
// BROAD SENSE HERITABILITY
// H² = VG / VP
// =====================================

function solveBroadSenseHeritability([VG,VP]) {
  return `H² = ${VG/VP}`;
}

// =====================================
// NARROW SENSE HERITABILITY
// h² = VA / VP
// =====================================

function solveNarrowSenseHeritability([VA,VP]) {
  return `h² = ${VA/VP}`;
}

// =====================================
// RESPONSE TO SELECTION
// =====================================

function solveResponseToSelection([h2,S]) {
  return `R = ${h2*S}`;
}

// =====================================
// BREEDERS EQUATION
// =====================================

function solveBreedersEquation([h2,S]) {
  return `R = h²S = ${h2*S}`;
}

// =====================================
// FOUNDER EFFECT
// =====================================

function solveFounderEffect([newFreq,oldFreq]) {
  return `Founder Effect Change = ${newFreq-oldFreq}`;
}

// =====================================
// BOTTLENECK EFFECT
// =====================================

function solveBottleneckEffect([before,after]) {
  return `Loss of Diversity = ${before-after}`;
}

// =====================================
// POPULATION GROWTH
// =====================================

function solvePopulationGrowth([N0,r,t]) {
  return `N(t) = ${N0*Math.exp(r*t)}`;
}

// =====================================
// GENE DIVERSITY
// H = 1-Σpi²
// =====================================

function solveGeneDiversity(args) {

  let sum=0;

  for(const p of args){
    sum += p*p;
  }

  return `Gene Diversity = ${1-sum}`;
}

// =====================================
// NUCLEOTIDE DIVERSITY
// =====================================

function solveNucleotideDiversity([differences,sites]) {
  return `π = ${differences/sites}`;
}

// =====================================
// FST
// =====================================

function solveFST([HT,HS]) {
  return `FST = ${(HT-HS)/HT}`;
}