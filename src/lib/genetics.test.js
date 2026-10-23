import { describe, expect, it } from 'vitest';
import { GENETICS_FORMULAS, solveGenetics } from '../../genetics.js';

describe('genetics calculator formulas', () => {
  it('registers normalized formula names for calculator dispatch', () => {
    expect(GENETICS_FORMULAS.has('chisquaregenetics')).toBe(true);
    expect(GENETICS_FORMULAS.has('populationgrowthgenetics')).toBe(true);
  });

  it('returns worked Hardy-Weinberg genotype proportions', () => {
    const result = solveGenetics('hardyWeinberg(0.7)');

    expect(result).toContain('q = 1 - 0.7 = 0.3');
    expect(result).toContain('AA = 0.49, Aa = 0.42, aa = 0.09');
    expect(result).toContain('dimensionless proportions');
  });

  it('explains a LOD score as a linked-to-unlinked likelihood ratio', () => {
    const result = solveGenetics('lodScore(0.0001, 0.000001)');

    expect(result).toContain('log₁₀(0.0001 / 0.000001)');
    expect(result).toContain('Result: 2 dimensionless log₁₀ likelihood-ratio score.');
  });

  it('provides steps and units for every registered formula', () => {
    const expressions = [
      'hardyWeinberg(0.5)',
      'alleleFrequency(5, 10)',
      'genotypeFrequency(5, 10)',
      'phenotypeFrequency(5, 10)',
      'heterozygosity(0.5)',
      'homozygosity(0.5)',
      'selectionCoefficient(0.8)',
      'fitness(8, 10)',
      'mutationRate(2, 10)',
      'migrationRate(2, 10)',
      'geneticDrift(0.5, 100)',
      'inbreedingCoefficient(0.2, 0.4)',
      'effectivePopulationSize(20, 30)',
      'linkageFrequency(5, 10)',
      'recombinationFrequency(2, 10)',
      'lodScore(0.0001, 0.000001)',
      'geneticDistance(1, 10)',
      'mapDistance(10)',
      'chiSquareGenetics(12, 10)',
      'heredity(0.2, 0.8)',
      'broadSenseHeritability(0.2, 0.8)',
      'narrowSenseHeritability(0.2, 0.8)',
      'responseToSelection(0.5, 2)',
      'breedersEquation(0.5, 2)',
      'founderEffect(0.6, 0.4)',
      'bottleneckEffect(0.7, 0.4)',
      'populationGrowthGenetics(100, 0.1, 5)',
      'geneDiversity(0.5, 0.5)',
      'nucleotideDiversity(2, 10)',
      'fst(0.5, 0.3)'
    ];

    for (const expression of expressions) {
      const result = solveGenetics(expression);
      expect(result, expression).toContain('Step 1: Formula:');
      expect(result, expression).toContain('Step 2: Substitute:');
      expect(result, expression).toContain('Step 3: Calculate:');
      expect(result, expression).toContain('Result:');
    }
  });

  it('rejects invalid probabilities, denominators, and argument counts', () => {
    expect(() => solveGenetics('hardyWeinberg(1.2)')).toThrow('between 0 and 1');
    expect(() => solveGenetics('alleleFrequency(2, 0)')).toThrow('at least 1');
    expect(() => solveGenetics('recombinationFrequency(6, 10)')).toThrow('at most 50%');
    expect(() => solveGenetics('fst(0, 0.2)')).toThrow('greater than zero');
    expect(() => solveGenetics('fitness(1)')).toThrow('Use fitness(survivors, totalIndividuals)');
    expect(() => solveGenetics('unknownGenetics(1)')).toThrow('Unknown genetics formula');
  });
});
