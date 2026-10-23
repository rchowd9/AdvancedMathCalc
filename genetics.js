export const GENETICS_FORMULAS = new Set([
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
  'chisquaregenetics',
  'heredity',
  'broadsenseheritability',
  'narrowsenseheritability',
  'responsetoselection',
  'breedersequation',
  'foundereffect',
  'bottleneckeffect',
  'populationgrowthgenetics',
  'genediversity',
  'nucleotidediversity',
  'fst'
]);

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    throw new Error('Calculation produced a non-finite result; check the input values.');
  }
  return String(Number(value.toPrecision(8)));
}

function formatSteps(title, formula, substitution, result, units) {
  const answer = formatNumber(result);
  return [
    `${title}:`,
    `Step 1: Formula: ${formula}`,
    `Step 2: Substitute: ${substitution}`,
    `Step 3: Calculate: ${answer}`,
    `Result: ${answer} ${units}.`
  ].join('\n');
}

function requireArgs(args, count, syntax) {
  if (args.length !== count) {
    throw new Error(`Use ${syntax}.`);
  }
}

function requireNumericArgs(args, count, syntax) {
  requireArgs(args, count, syntax);
  const values = args.map((value) => value.trim() === '' ? NaN : Number(value));
  if (!values.every(Number.isFinite)) {
    throw new Error(`${syntax} requires finite numeric values.`);
  }
  return values;
}

function requireCount(value, name, minimum = 0) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${name} must be an integer of at least ${minimum}.`);
  }
  return value;
}

function requireProbability(value, name) {
  if (value < 0 || value > 1) {
    throw new Error(`${name} must be between 0 and 1.`);
  }
  return value;
}

function requireNonNegative(value, name) {
  if (value < 0) {
    throw new Error(`${name} must be non-negative.`);
  }
  return value;
}

export function solveGenetics(input) {
  const match = String(input).match(/^\s*([a-zA-Z]+)\s*\(\s*([\s\S]*?)\s*\)\s*$/);
  if (!match) {
    throw new Error('Use a genetics formula such as hardyWeinberg(0.7).');
  }

  const mode = match[1].toLowerCase();
  if (!GENETICS_FORMULAS.has(mode)) {
    throw new Error(`Unknown genetics formula: ${match[1]}.`);
  }
  const args = match[2].trim() === '' ? [] : match[2].split(',').map((value) => value.trim());
  const syntax = {
    hardyweinberg: 'hardyWeinberg(p)',
    allelefrequency: 'alleleFrequency(alleleCopies, totalCopies)',
    genotypefrequency: 'genotypeFrequency(genotypeCount, totalIndividuals)',
    phenotypefrequency: 'phenotypeFrequency(phenotypeCount, totalIndividuals)',
    heterozygosity: 'heterozygosity(p)',
    homozygosity: 'homozygosity(p)',
    selectioncoefficient: 'selectionCoefficient(relativeFitness)',
    fitness: 'fitness(survivors, totalIndividuals)',
    mutationrate: 'mutationRate(mutations, totalOpportunities)',
    migrationrate: 'migrationRate(migrants, totalIndividuals)',
    geneticdrift: 'geneticDrift(p, populationSize)',
    inbreedingcoefficient: 'inbreedingCoefficient(observedHeterozygosity, expectedHeterozygosity)',
    effectivepopulationsize: 'effectivePopulationSize(males, females)',
    linkagefrequency: 'linkageFrequency(linkedCopies, totalCopies)',
    recombinationfrequency: 'recombinationFrequency(recombinants, totalOffspring)',
    lodscore: 'lodScore(linkedLikelihood, unlinkedLikelihood)',
    geneticdistance: 'geneticDistance(differences, sites)',
    mapdistance: 'mapDistance(recombinationPercent)',
    chisquaregenetics: 'chiSquareGenetics(observed, expected)',
    heredity: 'heredity(geneticVariance, phenotypicVariance)',
    broadsenseheritability: 'broadSenseHeritability(geneticVariance, phenotypicVariance)',
    narrowsenseheritability: 'narrowSenseHeritability(additiveVariance, phenotypicVariance)',
    responsetoselection: 'responseToSelection(heritability, selectionDifferential)',
    breedersequation: 'breedersEquation(heritability, selectionDifferential)',
    foundereffect: 'founderEffect(newFrequency, oldFrequency)',
    bottleneckeffect: 'bottleneckEffect(diversityBefore, diversityAfter)',
    populationgrowthgenetics: 'populationGrowthGenetics(initialPopulation, growthRate, time)',
    genediversity: 'geneDiversity(p1, p2, ...)',
    nucleotidediversity: 'nucleotideDiversity(pairwiseDifferences, sites)',
    fst: 'fst(totalDiversity, withinPopulationDiversity)'
  }[mode];

  const values = requireNumericArgs(args, mode === 'genediversity' ? args.length : {
    hardyweinberg: 1, allelefrequency: 2, genotypefrequency: 2, phenotypefrequency: 2,
    heterozygosity: 1, homozygosity: 1, selectioncoefficient: 1, fitness: 2,
    mutationrate: 2, migrationrate: 2, geneticdrift: 2, inbreedingcoefficient: 2,
    effectivepopulationsize: 2, linkagefrequency: 2, recombinationfrequency: 2,
    lodscore: 2, geneticdistance: 2, mapdistance: 1, chisquaregenetics: 2,
    heredity: 2, broadsenseheritability: 2, narrowsenseheritability: 2,
    responsetoselection: 2, breedersequation: 2, foundereffect: 2, bottleneckeffect: 2,
    populationgrowthgenetics: 3, nucleotidediversity: 2, fst: 2
  }[mode], syntax);

  switch (mode) {
    case 'hardyweinberg': {
      const [p] = values;
      requireProbability(p, 'Allele frequency p');
      const q = 1 - p;
      const genotypes = [p * p, 2 * p * q, q * q];
      return [
        'Hardy-Weinberg equilibrium:',
        'Step 1: Formula: q = 1 - p; AA = p²; Aa = 2pq; aa = q²',
        `Step 2: Substitute: p = ${formatNumber(p)}; q = 1 - ${formatNumber(p)} = ${formatNumber(q)}`,
        `Step 3: Calculate: AA = ${formatNumber(genotypes[0])}, Aa = ${formatNumber(genotypes[1])}, aa = ${formatNumber(genotypes[2])}`,
        `Result: AA = ${formatNumber(genotypes[0])}, Aa = ${formatNumber(genotypes[1])}, aa = ${formatNumber(genotypes[2])} (dimensionless proportions; expected population fractions).`
      ].join('\n');
    }
    case 'allelefrequency':
    case 'genotypefrequency':
    case 'phenotypefrequency':
    case 'fitness':
    case 'mutationrate':
    case 'migrationrate':
    case 'linkagefrequency': {
      const [numerator, denominator] = values;
      const numeratorName = {
        allelefrequency: 'Allele copies',
        genotypefrequency: 'Genotype count',
        phenotypefrequency: 'Phenotype count',
        fitness: 'Survivors',
        mutationrate: 'Mutations',
        migrationrate: 'Migrants',
        linkagefrequency: 'Linked copies'
      }[mode];
      const denominatorName = {
        allelefrequency: 'Total allele copies',
        genotypefrequency: 'Total individuals',
        phenotypefrequency: 'Total individuals',
        fitness: 'Total individuals',
        mutationrate: 'Mutation opportunities',
        migrationrate: 'Total individuals',
        linkagefrequency: 'Total copies'
      }[mode];
      requireCount(numerator, numeratorName);
      requireCount(denominator, denominatorName, 1);
      if (numerator > denominator) {
        throw new Error(`${numeratorName} cannot exceed ${denominatorName.toLowerCase()}.`);
      }
      const result = numerator / denominator;
      const title = {
        allelefrequency: 'Allele frequency',
        genotypefrequency: 'Genotype frequency',
        phenotypefrequency: 'Phenotype frequency',
        fitness: 'Survival fitness',
        mutationrate: 'Mutation rate',
        migrationrate: 'Migration rate',
        linkagefrequency: 'Linkage frequency'
      }[mode];
      const units = mode === 'mutationrate'
        ? 'mutations per opportunity (dimensionless rate)'
        : mode === 'migrationrate'
          ? 'migrants per individual (dimensionless proportion)'
          : mode === 'fitness'
            ? 'dimensionless relative survival proportion'
            : 'dimensionless proportion';
      return formatSteps(
        title,
        `${mode === 'fitness' ? 'W' : 'frequency or rate'} = ${numeratorName.toLowerCase()} / ${denominatorName.toLowerCase()}`,
        `${formatNumber(numerator)} / ${formatNumber(denominator)}`,
        result,
        units
      );
    }
    case 'heterozygosity':
    case 'homozygosity': {
      const [p] = values;
      requireProbability(p, 'Allele frequency p');
      const q = 1 - p;
      const heterozygosity = 2 * p * q;
      const result = mode === 'heterozygosity' ? heterozygosity : p * p + q * q;
      return formatSteps(
        mode === 'heterozygosity' ? 'Expected heterozygosity' : 'Expected homozygosity',
        mode === 'heterozygosity' ? 'H = 2pq, where q = 1 - p' : 'H = p² + q², where q = 1 - p',
        mode === 'heterozygosity'
          ? `2 × ${formatNumber(p)} × ${formatNumber(q)}`
          : `${formatNumber(p)}² + ${formatNumber(q)}²`,
        result,
        'dimensionless proportion'
      );
    }
    case 'selectioncoefficient': {
      const [fitness] = values;
      requireProbability(fitness, 'Relative fitness');
      return formatSteps(
        'Selection coefficient',
        's = 1 - w',
        `1 - ${formatNumber(fitness)}`,
        1 - fitness,
        'dimensionless proportion'
      );
    }
    case 'geneticdrift': {
      const [p, populationSize] = values;
      requireProbability(p, 'Allele frequency p');
      requireCount(populationSize, 'Population size', 1);
      const result = p * (1 - p) / (2 * populationSize);
      return formatSteps(
        'Genetic drift sampling variance',
        'Var(p) = p(1 - p) / (2N)',
        `${formatNumber(p)} × (1 - ${formatNumber(p)}) / (2 × ${populationSize})`,
        result,
        'dimensionless allele-frequency variance per generation'
      );
    }
    case 'inbreedingcoefficient': {
      const [observed, expected] = values;
      requireNonNegative(observed, 'Observed heterozygosity');
      if (expected <= 0) throw new Error('Expected heterozygosity must be positive.');
      const result = (expected - observed) / expected;
      return formatSteps(
        'Inbreeding coefficient',
        'F = (Hₑ - Hₒ) / Hₑ',
        `(${formatNumber(expected)} - ${formatNumber(observed)}) / ${formatNumber(expected)}`,
        result,
        'dimensionless coefficient'
      );
    }
    case 'effectivepopulationsize': {
      const [males, females] = values;
      requireCount(males, 'Number of males', 1);
      requireCount(females, 'Number of females', 1);
      const result = 4 * males * females / (males + females);
      return formatSteps(
        'Effective population size',
        'Nₑ = 4NₘNf / (Nₘ + Nf)',
        `4 × ${males} × ${females} / (${males} + ${females})`,
        result,
        'individuals'
      );
    }
    case 'recombinationfrequency': {
      const [recombinants, total] = values;
      requireCount(recombinants, 'Recombinant offspring');
      requireCount(total, 'Total offspring', 1);
      if (recombinants > total / 2) {
        throw new Error('Recombinant offspring cannot exceed half of the total; recombination frequency is at most 50%.');
      }
      const result = 100 * recombinants / total;
      return formatSteps(
        'Recombination frequency',
        'RF = (recombinant offspring / total offspring) × 100%',
        `(${recombinants} / ${total}) × 100%`,
        result,
        '% (recombination is at most 50%)'
      );
    }
    case 'lodscore': {
      const [linkedLikelihood, unlinkedLikelihood] = values;
      if (linkedLikelihood <= 0 || unlinkedLikelihood <= 0) {
        throw new Error('Linked and unlinked likelihoods must both be positive.');
      }
      const result = Math.log10(linkedLikelihood / unlinkedLikelihood);
      return formatSteps(
        'Logarithm of odds (LOD) score',
        'LOD = log₁₀(L(linked) / L(unlinked))',
        `log₁₀(${formatNumber(linkedLikelihood)} / ${formatNumber(unlinkedLikelihood)})`,
        result,
        'dimensionless log₁₀ likelihood-ratio score'
      );
    }
    case 'geneticdistance':
    case 'nucleotidediversity': {
      const [differences, total] = values;
      const isDiversity = mode === 'nucleotidediversity';
      requireCount(differences, isDiversity ? 'Pairwise differences' : 'Genetic differences');
      requireCount(total, isDiversity ? 'Number of sites' : 'Number of sites compared', 1);
      if (differences > total) throw new Error('Differences cannot exceed the number of sites.');
      return formatSteps(
        isDiversity ? 'Nucleotide diversity' : 'Genetic distance (p-distance)',
        isDiversity ? 'π = pairwise differences / sites' : 'd = genetic differences / sites compared',
        `${differences} / ${total}`,
        differences / total,
        'substitutions per site (dimensionless)'
      );
    }
    case 'mapdistance': {
      const [recombinationPercent] = values;
      if (recombinationPercent < 0 || recombinationPercent > 50) {
        throw new Error('Recombination percent must be between 0 and 50.');
      }
      return formatSteps(
        'Approximate genetic map distance',
        'Map distance (cM) ≈ recombination frequency (%)',
        `${formatNumber(recombinationPercent)}%`,
        recombinationPercent,
        'cM (approximation for short intervals)'
      );
    }
    case 'chisquaregenetics': {
      const [observed, expected] = values;
      requireNonNegative(observed, 'Observed count');
      if (expected <= 0) throw new Error('Expected count must be positive.');
      const difference = observed - expected;
      const result = difference * difference / expected;
      return formatSteps(
        'Chi-square contribution',
        'χ² = (O - E)² / E',
        `(${formatNumber(observed)} - ${formatNumber(expected)})² / ${formatNumber(expected)}`,
        result,
        'dimensionless chi-square contribution'
      );
    }
    case 'heredity':
    case 'broadsenseheritability':
    case 'narrowsenseheritability': {
      const [geneticVariance, phenotypicVariance] = values;
      requireNonNegative(geneticVariance, 'Genetic variance');
      if (phenotypicVariance <= 0) throw new Error('Phenotypic variance must be positive.');
      if (geneticVariance > phenotypicVariance) {
        throw new Error('Genetic variance cannot exceed phenotypic variance.');
      }
      const isNarrow = mode === 'narrowsenseheritability';
      const isGeneric = mode === 'heredity';
      const result = geneticVariance / phenotypicVariance;
      return formatSteps(
        isNarrow ? 'Narrow-sense heritability' : isGeneric ? 'Heritability' : 'Broad-sense heritability',
        isNarrow ? 'h² = Vₐ / Vₚ' : 'H² = Vg / Vₚ',
        `${formatNumber(geneticVariance)} / ${formatNumber(phenotypicVariance)}`,
        result,
        'dimensionless proportion'
      );
    }
    case 'responsetoselection':
    case 'breedersequation': {
      const [heritability, selectionDifferential] = values;
      requireProbability(heritability, 'Heritability');
      const result = heritability * selectionDifferential;
      return formatSteps(
        mode === 'breedersequation' ? 'Breeder’s equation' : 'Response to selection',
        'R = h² × S',
        `${formatNumber(heritability)} × ${formatNumber(selectionDifferential)}`,
        result,
        'same units as the selection differential'
      );
    }
    case 'foundereffect': {
      const [newFrequency, oldFrequency] = values;
      requireProbability(newFrequency, 'New allele frequency');
      requireProbability(oldFrequency, 'Old allele frequency');
      return formatSteps(
        'Founder-effect frequency change',
        'Δp = p(new) - p(old)',
        `${formatNumber(newFrequency)} - ${formatNumber(oldFrequency)}`,
        newFrequency - oldFrequency,
        'dimensionless frequency change'
      );
    }
    case 'bottleneckeffect': {
      const [before, after] = values;
      requireProbability(before, 'Diversity before bottleneck');
      requireProbability(after, 'Diversity after bottleneck');
      return formatSteps(
        'Change in genetic diversity after bottleneck',
        'ΔH = H(before) - H(after)',
        `${formatNumber(before)} - ${formatNumber(after)}`,
        before - after,
        'dimensionless diversity change (positive means diversity was lost)'
      );
    }
    case 'populationgrowthgenetics': {
      const [initialPopulation, growthRate, time] = values;
      if (initialPopulation <= 0) throw new Error('Initial population must be positive.');
      if (time < 0) throw new Error('Time must be non-negative.');
      const result = initialPopulation * Math.exp(growthRate * time);
      return formatSteps(
        'Exponential population growth',
        'N(t) = N₀e^(rt)',
        `${formatNumber(initialPopulation)} × e^(${formatNumber(growthRate)} × ${formatNumber(time)})`,
        result,
        'individuals (r and t must use reciprocal, matching time units)'
      );
    }
    case 'genediversity': {
      if (values.length < 2) {
        throw new Error('Use geneDiversity(p1, p2, ...) with at least two allele frequencies.');
      }
      const frequencies = values.map((value, index) => requireProbability(value, `Allele frequency p${index + 1}`));
      const sum = frequencies.reduce((total, value) => total + value, 0);
      if (sum > 1 + Number.EPSILON * frequencies.length) {
        throw new Error('Allele frequencies must sum to no more than 1.');
      }
      const squaredSum = frequencies.reduce((total, value) => total + value * value, 0);
      return formatSteps(
        'Gene diversity (expected heterozygosity)',
        'H = 1 - Σpᵢ²',
        `1 - (${frequencies.map((value) => `${formatNumber(value)}²`).join(' + ')})`,
        1 - squaredSum,
        'dimensionless proportion'
      );
    }
    case 'fst': {
      const [totalDiversity, withinDiversity] = values;
      requireProbability(totalDiversity, 'Total diversity');
      requireProbability(withinDiversity, 'Within-population diversity');
      if (totalDiversity === 0) throw new Error('Total diversity must be greater than zero.');
      return formatSteps(
        'Fixation index (FST)',
        'FST = (Hₜ - Hₛ) / Hₜ',
        `(${formatNumber(totalDiversity)} - ${formatNumber(withinDiversity)}) / ${formatNumber(totalDiversity)}`,
        (totalDiversity - withinDiversity) / totalDiversity,
        'dimensionless population-differentiation coefficient'
      );
    }
    default:
      throw new Error(`Unknown genetics formula: ${match[1]}.`);
  }
}
