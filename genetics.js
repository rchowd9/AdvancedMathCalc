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