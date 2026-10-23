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