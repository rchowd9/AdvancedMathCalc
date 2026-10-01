const MAX_SEQUENCE_TERMS = 1000;

export function solveLinearAlgebra(name, args, math) {
  const matrix = args[0];
  const matrixText = (value) => JSON.stringify(value);

  switch (name.toLowerCase()) {
    case 'transpose':
      return `Transpose Aᵀ = ${matrixText(math.transpose(matrix))}`;
    case 'rank':
      return `Rank(A) = ${math.rank(matrix)}`;
    case 'trace':
      return `Trace(A) = Σ diagonal entries = ${math.trace(matrix)}`;
    case 'matrixmultiply':
      return `AB = ${matrixText(math.multiply(matrix, args[1]))}`;
    case 'matrixadd':
      return `A + B = ${matrixText(math.add(matrix, args[1]))}`;
    case 'scalarmultiply':
      return `cA = ${matrixText(math.multiply(args[1], matrix))}`;
    default:
      throw new Error(`Unknown linear algebra formula: ${name}`);
  }
}

export function solveSequence(name, args) {
  const normalizedName = name.toLowerCase();
  let terms;
  let formula;
  let sumFormula;

  if (normalizedName === 'arithmeticsequence') {
    const [first, difference, count] = args;
    validateCount(count);
    terms = Array.from({ length: count }, (_, index) => first + index * difference);
    formula = `aₙ = a₁ + (n - 1)d = ${first} + (n - 1)(${difference})`;
    sumFormula = `Sₙ = n/2 × (2a₁ + (n - 1)d)`;
  } else if (normalizedName === 'geometricsequence') {
    const [first, ratio, count] = args;
    validateCount(count);
    terms = Array.from({ length: count }, (_, index) => first * ratio ** index);
    formula = `aₙ = a₁rⁿ⁻¹ = ${first} × ${ratio}ⁿ⁻¹`;
    sumFormula = ratio === 1 ? 'Sₙ = na₁' : 'Sₙ = a₁(1 - rⁿ)/(1 - r)';
  } else if (normalizedName === 'harmonicsequence') {
    const [count] = args;
    validateCount(count);
    terms = Array.from({ length: count }, (_, index) => 1 / (index + 1));
    formula = 'aₙ = 1/n';
    sumFormula = 'Hₙ = Σ(1/k), k = 1..n';
  } else if (normalizedName === 'alternatingharmonic') {
    const [count] = args;
    validateCount(count);
    terms = Array.from({ length: count }, (_, index) => (index % 2 ? -1 : 1) / (index + 1));
    formula = 'aₙ = (-1)ⁿ⁺¹/n';
    sumFormula = 'Sₙ = Σ((-1)ᵏ⁺¹/k), k = 1..n';
  } else if (normalizedName === 'pseries') {
    const [power, count] = args;
    validateCount(count);
    if (!Number.isFinite(power) || power <= 0) throw new Error('pSeries requires p > 0.');
    terms = Array.from({ length: count }, (_, index) => 1 / (index + 1) ** power);
    formula = `aₙ = 1/nᵖ, p = ${power}`;
    sumFormula = 'Sₙ = Σ(1/kᵖ), k = 1..n';
  } else if (normalizedName === 'fibonaccisequence') {
    const [count] = args;
    validateCount(count);
    terms = [];
    let previous = 0;
    let current = 1;
    for (let index = 0; index < count; index += 1) {
      terms.push(previous);
      [previous, current] = [current, previous + current];
    }
    formula = 'F₀ = 0, F₁ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂';
    sumFormula = 'Partial sum = ΣFₖ, k = 0..n-1';
  } else {
    throw new Error(`Unknown sequence formula: ${name}`);
  }

  const partialSum = terms.reduce((total, term) => total + term, 0);
  return [
    `Sequence: ${normalizedName}`,
    `Formula: ${formula}`,
    `Terms: ${terms.join(', ')}`,
    `Series: ${sumFormula}`,
    `Partial sum = ${Number(partialSum.toPrecision(10))}`
  ].join('\n');
}

function validateCount(count) {
  if (!Number.isInteger(count) || count < 1 || count > MAX_SEQUENCE_TERMS) {
    throw new Error(`Term count must be an integer from 1 to ${MAX_SEQUENCE_TERMS}.`);
  }
}