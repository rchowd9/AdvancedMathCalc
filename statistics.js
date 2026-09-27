const STATISTICS_MODE_NAMES = new Set([
  'stats', 'samplevariance', 'populationvariance', 'quartile', 'percentile', 'iqr', 'outlierfences',
  'zscore', 'zcriticalvalue', 'tcriticalvalue', 'empiricalrule', 'standarderror', 'proportionstandarderror', 'differenceMeanStandardError', 'additionrule', 'multiplicationrule',
  'complementrule', 'conditionalprobability', 'binomialpmf', 'binomialstats', 'poissonpmf',
  'exponentialpdf', 'exponentialstats', 'geometricpmf', 'geometricstats', 'normalpdf', 'normalcdf',
  'meanconfidenceinterval', 'ztest', 'ttest', 'pairedttest', 'twosampleztest', 'twosamplettest',
  'cohensd', 'correlation', 'linearregression', 'chisquaregof', 'chisquareindependence', 'onewayanova'
]);

const format = (value) => Number.isNaN(value) ? 'undefined' : Number.isFinite(value) ? String(Number(value.toPrecision(8))) : String(value);

function solveStatistics(mode, values) {
  const requireArgs = (count, syntax) => {
    if (values.length !== count) throw new Error(`Use ${syntax}.`);
  };
  const requireFinite = (value, name) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
    return value;
  };
  const requirePositive = (value, name) => {
    requireFinite(value, name);
    if (value <= 0) throw new Error(`${name} must be positive.`);
    return value;
  };
  const requireCount = (value, name, minimum = 1) => {
    requireFinite(value, name);
    if (!Number.isInteger(value) || value < minimum) throw new Error(`${name} must be an integer of at least ${minimum}.`);
    return value;
  };
  const requireProbability = (value, name) => {
    requireFinite(value, name);
    if (value < 0 || value > 1) throw new Error(`${name} must be between 0 and 1.`);
    return value;
  };
  const dataList = (value, name = 'Data', minimum = 1) => {
    if (!Array.isArray(value) || value.length < minimum) throw new Error(`${name} must contain at least ${minimum} values.`);
    return value.map((item, index) => requireFinite(item, `${name}[${index}]`));
  };
  const mean = (data) => data.reduce((total, item) => total + item, 0) / data.length;
  const variance = (data, sample) => {
    const center = mean(data);
    return data.reduce((total, item) => total + (item - center) ** 2, 0) / (data.length - (sample ? 1 : 0));
  };
  const sorted = (data) => [...data].sort((left, right) => left - right);
  const choose = (n, k) => {
    if (k < 0 || k > n) return 0;
    const terms = Math.min(k, n - k);
    let result = 1;
    for (let index = 1; index <= terms; index += 1) result = result * (n - terms + index) / index;
    return result;
  };
  const modeName = mode.toLowerCase();

  if (modeName === 'stats') {
    requireArgs(1, 'stats(data)');
    const data = dataList(values[0]);
    const ordered = sorted(data);
    const average = mean(data);
    const sampleVar = data.length > 1 ? variance(data, true) : NaN;
    const populationVar = variance(data, false);
    const median = (items) => {
      const middle = Math.floor(items.length / 2);
      return items.length % 2 ? items[middle] : (items[middle - 1] + items[middle]) / 2;
    };
    const q1 = ordered.length > 1 ? ordered[Math.ceil(ordered.length / 4) - 1] : ordered[0];
    const q3 = ordered[Math.ceil(3 * ordered.length / 4) - 1];
    const frequencies = new Map();
    data.forEach((item) => frequencies.set(item, (frequencies.get(item) || 0) + 1));
    const maxFrequency = Math.max(...frequencies.values());
    const modes = maxFrequency > 1 ? [...frequencies].filter(([, count]) => count === maxFrequency).map(([item]) => item) : [];
    return [
      `Dataset (n = ${data.length}): [${data.join(', ')}]`,
      `Mean = ${format(average)}; median = ${format(median(ordered))}; mode = ${modes.length ? modes.join(', ') : 'none'}.`,
      `Range = ${format(ordered.at(-1) - ordered[0])}; Q1 = ${format(q1)}; Q3 = ${format(q3)}; IQR = ${format(q3 - q1)}.`,
      `Population variance = ${format(populationVar)}; population SD = ${format(Math.sqrt(populationVar))}.`,
      `Sample variance = ${format(sampleVar)}; sample SD = ${format(Math.sqrt(sampleVar))}.`,
      `Outlier fences: [${format(q1 - 1.5 * (q3 - q1))}, ${format(q3 + 1.5 * (q3 - q1))}].`
    ].join('\n');
  }

  if (modeName === 'samplevariance' || modeName === 'populationvariance') {
    requireArgs(1, `${modeName}(data)`);
    const data = dataList(values[0], 'Data', modeName === 'samplevariance' ? 2 : 1);
    const result = variance(data, modeName === 'samplevariance');
    return `${modeName === 'samplevariance' ? 'Sample' : 'Population'} variance = ${format(result)}.`;
  }
  if (modeName === 'quartile' || modeName === 'percentile' || modeName === 'iqr' || modeName === 'outlierfences') {
    const expectedArgs = modeName === 'quartile' || modeName === 'percentile' ? 2 : 1;
    requireArgs(expectedArgs, modeName === 'quartile' ? 'quartile(data, q)' : modeName === 'percentile' ? 'percentile(data, k)' : `${modeName}(data)`);
    const data = sorted(dataList(values[0]));
    const nearestRank = (percent) => data[Math.max(0, Math.ceil(percent * data.length) - 1)];
    const q1 = nearestRank(0.25);
    const q3 = nearestRank(0.75);
    if (modeName === 'quartile') {
      const quartile = requireCount(values[1], 'Quartile', 1);
      if (quartile > 3) throw new Error('Quartile must be 1, 2, or 3.');
      return `Q${quartile} = ${format(nearestRank(quartile / 4))} (nearest-rank quartile).`;
    }
    if (modeName === 'percentile') {
      const percentile = requireFinite(values[1], 'Percentile');
      if (percentile < 0 || percentile > 100) throw new Error('Percentile must be between 0 and 100.');
      return `P${format(percentile)} = ${format(nearestRank(percentile / 100))} (nearest-rank percentile).`;
    }
    const spread = q3 - q1;
    return modeName === 'iqr'
      ? `IQR = Q3 - Q1 = ${format(q3)} - ${format(q1)} = ${format(spread)}.`
      : `Q1 = ${format(q1)}; Q3 = ${format(q3)}; IQR = ${format(spread)}; lower fence = ${format(q1 - 1.5 * spread)}; upper fence = ${format(q3 + 1.5 * spread)}.`;
  }

  if (modeName === 'zscore') {
    requireArgs(3, 'zScore(x, mean, standardDeviation)');
    const [value, center, deviation] = values.map((item, index) => requireFinite(item, ['x', 'Mean', 'Standard deviation'][index]));
    requirePositive(deviation, 'Standard deviation');
    return `Z = (x - μ) / σ = (${format(value)} - ${format(center)}) / ${format(deviation)} = ${format((value - center) / deviation)}.`;
  }
  if (modeName === 'zcriticalvalue') {
    requireArgs(1, 'zCriticalValue(confidenceLevel)');
    const level = requireFinite(values[0], 'Confidence level');
    const confidence = level > 1 ? level / 100 : level;
    const criticalValues = new Map([[0.9, 1.645], [0.95, 1.96], [0.99, 2.576]]);
    if (!criticalValues.has(confidence)) throw new Error('Supported two-sided confidence levels are 90%, 95%, and 99%.');
    return `Two-sided z critical value for ${format(confidence * 100)}% confidence = ${criticalValues.get(confidence)}.`;
  }
  if (modeName === 'tcriticalvalue') {
    requireArgs(2, 'tCriticalValue(degreesOfFreedom, confidenceLevel)');
    const degreesOfFreedom = values[0];
    if (degreesOfFreedom !== Infinity) requireCount(degreesOfFreedom, 'Degrees of freedom');
    const level = requireFinite(values[1], 'Confidence level');
    const confidence = level > 1 ? level / 100 : level;
    const column = new Map([[0.9, 0], [0.95, 1], [0.99, 2]]).get(confidence);
    const table = {
      10: [1.812, 2.228, 3.169],
      20: [1.725, 2.086, 2.845],
      30: [1.697, 2.042, 2.75],
      infinity: [1.645, 1.96, 2.576]
    };
    const row = degreesOfFreedom === Infinity ? 'infinity' : String(degreesOfFreedom);
    if (column === undefined || !table[row]) throw new Error('The formula sheet provides t critical values for df 10, 20, 30, and Infinity at 90%, 95%, and 99% confidence.');
    return `Two-sided t critical value for df = ${row} at ${format(confidence * 100)}% confidence = ${table[row][column]}.`;
  }
  if (modeName === 'empiricalrule') {
    requireArgs(2, 'empiricalRule(mean, standardDeviation)');
    const center = requireFinite(values[0], 'Mean');
    const deviation = requirePositive(values[1], 'Standard deviation');
    return [1, 2, 3].map((multiple, index) => `About ${[68, 95, 99.7][index]}% lies within ${multiple} SD: [${format(center - multiple * deviation)}, ${format(center + multiple * deviation)}].`).join('\n');
  }
  if (modeName === 'standarderror' || modeName === 'proportionstandarderror') {
    requireArgs(2, modeName === 'standarderror' ? 'standardError(standardDeviation, n)' : 'proportionStandardError(p, n)');
    const [measure, sampleSize] = values;
    requireCount(sampleSize, 'Sample size');
    let result;
    if (modeName === 'standarderror') {
      requireFinite(measure, 'Standard deviation');
      if (measure < 0) throw new Error('Standard deviation must be non-negative.');
      result = measure / Math.sqrt(sampleSize);
    } else {
      const proportion = requireProbability(measure, 'Proportion');
      result = Math.sqrt(proportion * (1 - proportion) / sampleSize);
    }
    return `Standard error = ${format(result)}.`;
  }
  if (modeName === 'differencemeanstandarderror') {
    requireArgs(4, 'differenceMeanStandardError(sd1, n1, sd2, n2)');
    const [sd1, n1, sd2, n2] = values;
    requireFinite(sd1, 'Standard deviation 1');
    requireFinite(sd2, 'Standard deviation 2');
    if (sd1 < 0 || sd2 < 0) throw new Error('Standard deviations must be non-negative.');
    requireCount(n1, 'Sample size 1');
    requireCount(n2, 'Sample size 2');
    return `SE(x̄₁-x̄₂) = √(σ₁²/n₁ + σ₂²/n₂) = ${format(Math.sqrt(sd1 ** 2 / n1 + sd2 ** 2 / n2))}.`;
  }

  if (['additionrule', 'multiplicationrule', 'complementrule', 'conditionalprobability'].includes(modeName)) {
    const arities = { additionrule: 3, multiplicationrule: 2, complementrule: 1, conditionalprobability: 2 };
    const syntax = { additionrule: 'additionRule(P(A), P(B), P(A and B))', multiplicationrule: 'multiplicationRule(P(A), P(B|A))', complementrule: 'complementRule(P(A))', conditionalprobability: 'conditionalProbability(P(A and B), P(B))' };
    requireArgs(arities[modeName], syntax[modeName]);
    const probabilities = values.map((item, index) => requireProbability(item, `Probability ${index + 1}`));
    let result;
    if (modeName === 'additionrule') result = probabilities[0] + probabilities[1] - probabilities[2];
    if (modeName === 'multiplicationrule') result = probabilities[0] * probabilities[1];
    if (modeName === 'complementrule') result = 1 - probabilities[0];
    if (modeName === 'conditionalprobability') {
      if (probabilities[1] === 0) throw new Error('P(B) must be greater than zero.');
      result = probabilities[0] / probabilities[1];
    }
    if (result < 0 || result > 1) throw new Error('The supplied probabilities are inconsistent; the result must be between 0 and 1.');
    return `Probability = ${format(result)}.`;
  }

  if (modeName === 'binomialpmf' || modeName === 'binomialstats') {
    requireArgs(modeName === 'binomialpmf' ? 3 : 2, modeName === 'binomialpmf' ? 'binomialPmf(k, n, p)' : 'binomialStats(n, p)');
    const n = requireCount(values[modeName === 'binomialpmf' ? 1 : 0], 'Number of trials', 0);
    const probability = requireProbability(values[modeName === 'binomialpmf' ? 2 : 1], 'Success probability');
    const average = n * probability;
    const spread = n * probability * (1 - probability);
    if (modeName === 'binomialstats') return `Binomial X ~ Bin(${n}, ${format(probability)}): mean = np = ${format(average)}; variance = np(1-p) = ${format(spread)}.`;
    const k = requireCount(values[0], 'Success count', 0);
    const mass = k > n ? 0 : choose(n, k) * probability ** k * (1 - probability) ** (n - k);
    return `P(X = ${k}) = C(${n}, ${k}) p^k (1-p)^(n-k) = ${format(mass)}.`;
  }
  if (modeName === 'poissonpmf') {
    requireArgs(2, 'poissonPmf(k, lambda)');
    const k = requireCount(values[0], 'Count', 0);
    const lambda = requireFinite(values[1], 'Lambda');
    if (lambda < 0) throw new Error('Lambda must be non-negative.');
    let factorial = 1;
    for (let factor = 2; factor <= k; factor += 1) factorial *= factor;
    return `P(X = ${k}) = e^(-λ) λ^k / k! = ${format(Math.exp(-lambda) * lambda ** k / factorial)}; mean = variance = λ = ${format(lambda)}.`;
  }
  if (modeName === 'exponentialpdf' || modeName === 'exponentialstats') {
    requireArgs(modeName === 'exponentialpdf' ? 2 : 1, modeName === 'exponentialpdf' ? 'exponentialPdf(x, lambda)' : 'exponentialStats(lambda)');
    const lambda = requirePositive(values[modeName === 'exponentialpdf' ? 1 : 0], 'Lambda');
    if (modeName === 'exponentialstats') return `Exponential X ~ Exp(λ): mean = 1/λ = ${format(1 / lambda)}; variance = 1/λ² = ${format(1 / lambda ** 2)}.`;
    const x = requireFinite(values[0], 'x');
    const density = x < 0 ? 0 : lambda * Math.exp(-lambda * x);
    return `f(x) = λe^(-λx) for x ≥ 0; f(${format(x)}) = ${format(density)}.`;
  }
  if (modeName === 'geometricpmf' || modeName === 'geometricstats') {
    requireArgs(modeName === 'geometricpmf' ? 2 : 1, modeName === 'geometricpmf' ? 'geometricPmf(k, p)' : 'geometricStats(p)');
    const probability = requirePositive(values[modeName === 'geometricpmf' ? 1 : 0], 'Success probability');
    if (probability > 1) throw new Error('Success probability must be at most 1.');
    if (modeName === 'geometricstats') return `Geometric X ~ Geom(p): mean = 1/p = ${format(1 / probability)}; variance = (1-p)/p² = ${format((1 - probability) / probability ** 2)}.`;
    const k = requireCount(values[0], 'Trial number');
    return `P(X = ${k}) = p(1-p)^(k-1) = ${format(probability * (1 - probability) ** (k - 1))}.`;
  }
  if (modeName === 'normalpdf' || modeName === 'normalcdf') {
    requireArgs(3, `${modeName}(x, mean, standardDeviation)`);
    const [x, center, deviation] = values.map((item, index) => requireFinite(item, ['x', 'Mean', 'Standard deviation'][index]));
    requirePositive(deviation, 'Standard deviation');
    const z = (x - center) / deviation;
    if (modeName === 'normalpdf') return `Normal density: z = (x-μ)/σ = ${format(z)}; f(x) = exp(-z²/2)/(σ√(2π)) = ${format(Math.exp(-0.5 * z ** 2) / (deviation * Math.sqrt(2 * Math.PI)))}.`;
    const erfApprox = (value) => {
      const sign = value < 0 ? -1 : 1;
      const absolute = Math.abs(value);
      const t = 1 / (1 + 0.3275911 * absolute);
      const polynomial = (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t;
      return sign * (1 - polynomial * Math.exp(-(absolute ** 2)));
    };
    return `Normal cumulative probability: z = ${format(z)}; P(X ≤ x) = ${format(0.5 * (1 + erfApprox(z / Math.sqrt(2))))}.`;
  }

  if (modeName === 'meanconfidenceinterval') {
    requireArgs(4, 'meanConfidenceInterval(mean, standardDeviation, n, criticalValue)');
    const [sampleMean, deviation, sampleSize, critical] = values;
    requireFinite(sampleMean, 'Mean');
    requireFinite(deviation, 'Standard deviation');
    if (deviation < 0) throw new Error('Standard deviation must be non-negative.');
    requireCount(sampleSize, 'Sample size');
    requirePositive(critical, 'Critical value');
    const margin = critical * deviation / Math.sqrt(sampleSize);
    return `Mean confidence interval = x̄ ± critical·s/√n = ${format(sampleMean)} ± ${format(margin)} = [${format(sampleMean - margin)}, ${format(sampleMean + margin)}].`;
  }
  if (modeName === 'ztest' || modeName === 'ttest') {
    requireArgs(4, `${modeName}(sampleMean, nullMean, standardDeviation, n)`);
    const [sampleMean, nullMean, deviation, sampleSize] = values;
    [sampleMean, nullMean, deviation].forEach((value, index) => requireFinite(value, ['Sample mean', 'Null mean', 'Standard deviation'][index]));
    requirePositive(deviation, 'Standard deviation');
    requireCount(sampleSize, 'Sample size');
    return `${modeName === 'ztest' ? 'Z' : 't'} = (x̄ - μ₀)/(s/√n) = ${format((sampleMean - nullMean) / (deviation / Math.sqrt(sampleSize)))}.`;
  }
  if (modeName === 'pairedttest') {
    requireArgs(3, 'pairedTTest(meanDifference, differenceStandardDeviation, n)');
    const [differenceMean, deviation, sampleSize] = values;
    requireFinite(differenceMean, 'Mean difference');
    requirePositive(deviation, 'Difference standard deviation');
    requireCount(sampleSize, 'Sample size');
    return `Paired t = d̄/(s_d/√n) = ${format(differenceMean / (deviation / Math.sqrt(sampleSize)))}.`;
  }
  if (modeName === 'twosampleztest' || modeName === 'twosamplettest') {
    requireArgs(7, `${modeName}(mean1, mean2, nullDifference, sd1, n1, sd2, n2)`);
    const [mean1, mean2, nullDifference, sd1, n1, sd2, n2] = values;
    [mean1, mean2, nullDifference].forEach((value, index) => requireFinite(value, ['Mean 1', 'Mean 2', 'Null difference'][index]));
    requirePositive(sd1, 'Standard deviation 1');
    requirePositive(sd2, 'Standard deviation 2');
    requireCount(n1, 'Sample size 1', modeName === 'twosamplettest' ? 2 : 1);
    requireCount(n2, 'Sample size 2', modeName === 'twosamplettest' ? 2 : 1);
    let standardError;
    if (modeName === 'twosampleztest') {
      standardError = Math.sqrt(sd1 ** 2 / n1 + sd2 ** 2 / n2);
    } else {
      const pooled = Math.sqrt(((n1 - 1) * sd1 ** 2 + (n2 - 1) * sd2 ** 2) / (n1 + n2 - 2));
      standardError = pooled * Math.sqrt(1 / n1 + 1 / n2);
    }
    return `${modeName === 'twosampleztest' ? 'Two-sample Z' : 'Pooled two-sample t'} statistic = ${format(((mean1 - mean2) - nullDifference) / standardError)}; standard error = ${format(standardError)}.`;
  }
  if (modeName === 'cohensd') {
    requireArgs(6, 'cohensD(mean1, sd1, n1, mean2, sd2, n2)');
    const [mean1, sd1, n1, mean2, sd2, n2] = values;
    requireFinite(mean1, 'Mean 1');
    requireFinite(mean2, 'Mean 2');
    requireFinite(sd1, 'Standard deviation 1');
    requireFinite(sd2, 'Standard deviation 2');
    if (sd1 < 0 || sd2 < 0) throw new Error('Standard deviations must be non-negative.');
    requireCount(n1, 'Sample size 1', 2);
    requireCount(n2, 'Sample size 2', 2);
    const pooled = Math.sqrt(((n1 - 1) * sd1 ** 2 + (n2 - 1) * sd2 ** 2) / (n1 + n2 - 2));
    if (pooled === 0) throw new Error('Pooled standard deviation must be greater than zero.');
    return `Pooled SD = ${format(pooled)}; Cohen's d = |μ1-μ2|/sp = ${format(Math.abs(mean1 - mean2) / pooled)}.`;
  }

  if (modeName === 'correlation' || modeName === 'linearregression') {
    requireArgs(2, `${modeName}(xValues, yValues)`);
    const x = dataList(values[0], 'x values', 2);
    const y = dataList(values[1], 'y values', 2);
    if (x.length !== y.length) throw new Error('x and y data must have the same number of values.');
    const xMean = mean(x);
    const yMean = mean(y);
    const xx = x.reduce((total, item) => total + (item - xMean) ** 2, 0);
    const yy = y.reduce((total, item) => total + (item - yMean) ** 2, 0);
    const xy = x.reduce((total, item, index) => total + (item - xMean) * (y[index] - yMean), 0);
    if (xx === 0 || yy === 0) throw new Error('Correlation requires variation in both datasets.');
    const correlation = xy / Math.sqrt(xx * yy);
    if (modeName === 'correlation') return `Pearson correlation r = ${format(correlation)}; R² = ${format(correlation ** 2)}.`;
    const slope = xy / xx;
    const intercept = yMean - slope * xMean;
    const residualSumSquares = y.reduce((total, item, index) => total + (item - (intercept + slope * x[index])) ** 2, 0);
    const residualError = x.length > 2 ? Math.sqrt(residualSumSquares / (x.length - 2)) : NaN;
    return `Linear model: ŷ = b₀ + b₁x = ${format(intercept)} + ${format(slope)}x; r = ${format(correlation)}; R² = ${format(correlation ** 2)}; residual standard error = ${format(residualError)}.`;
  }

  if (modeName === 'chisquaregof') {
    requireArgs(2, 'chiSquareGoF(observed, expected)');
    const observed = dataList(values[0], 'Observed counts');
    const expected = dataList(values[1], 'Expected counts');
    if (observed.length !== expected.length) throw new Error('Observed and expected counts must have equal lengths.');
    if (expected.some((item) => item <= 0)) throw new Error('Expected counts must be greater than zero.');
    const statistic = observed.reduce((total, item, index) => total + (item - expected[index]) ** 2 / expected[index], 0);
    return `χ² = Σ(O-E)²/E = ${format(statistic)}; degrees of freedom = ${observed.length - 1}.`;
  }
  if (modeName === 'chisquareindependence') {
    requireArgs(1, 'chiSquareIndependence(contingencyTable)');
    const rows = values[0];
    if (!Array.isArray(rows) || rows.length < 2 || !rows.every((row) => Array.isArray(row) && row.length === rows[0].length && row.length >= 2)) {
      throw new Error('The contingency table must be a rectangular matrix with at least 2 rows and 2 columns.');
    }
    rows.forEach((row, rowIndex) => dataList(row, `Row ${rowIndex + 1}`));
    const rowTotals = rows.map((row) => row.reduce((sum, item) => sum + item, 0));
    const columnTotals = rows[0].map((_, column) => rows.reduce((sum, row) => sum + row[column], 0));
    const total = rowTotals.reduce((sum, item) => sum + item, 0);
    if (total <= 0) throw new Error('The contingency table total must be greater than zero.');
    let statistic = 0;
    rows.forEach((row, rowIndex) => row.forEach((observed, column) => {
      const expected = rowTotals[rowIndex] * columnTotals[column] / total;
      if (expected > 0) statistic += (observed - expected) ** 2 / expected;
    }));
    return `χ² = ΣΣ(O-E)²/E = ${format(statistic)}; degrees of freedom = ${(rows.length - 1) * (rows[0].length - 1)}.`;
  }
  if (modeName === 'onewayanova') {
    requireArgs(1, 'oneWayAnova([group1, group2, ...])');
    const groups = values[0];
    if (!Array.isArray(groups) || groups.length < 2) throw new Error('ANOVA requires at least two groups.');
    const samples = groups.map((group, index) => dataList(group, `Group ${index + 1}`));
    const totalCount = samples.reduce((sum, group) => sum + group.length, 0);
    const grandMean = samples.flat().reduce((sum, item) => sum + item, 0) / totalCount;
    const between = samples.reduce((sum, group) => sum + group.length * (mean(group) - grandMean) ** 2, 0);
    const within = samples.reduce((sum, group) => sum + group.reduce((groupSum, item) => groupSum + (item - mean(group)) ** 2, 0), 0);
    const dfBetween = samples.length - 1;
    const dfWithin = totalCount - samples.length;
    if (dfWithin <= 0 || within === 0) throw new Error('ANOVA needs within-group variation and more observations than groups.');
    const msBetween = between / dfBetween;
    const msWithin = within / dfWithin;
    return `One-way ANOVA: SSbetween = ${format(between)}; SSwithin = ${format(within)}; MSbetween = ${format(msBetween)}; MSwithin = ${format(msWithin)}; F = ${format(msBetween / msWithin)}; df = (${dfBetween}, ${dfWithin}).`;
  }

  throw new Error(`Unknown statistics formula: ${mode}.`);
}

export { STATISTICS_MODE_NAMES, solveStatistics };