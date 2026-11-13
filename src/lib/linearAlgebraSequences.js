const MAX_SEQUENCE_TERMS = 1000;

function formatMatrix(value) {
  return JSON.stringify(value);
}

function explainLinearAlgebra(label, steps, result) {
  return [
    `Linear algebra: ${label}`,
    ...steps.map((step, index) => `Step ${index + 1}: ${step}`),
    `Result: ${result}`
  ].join('\n');
}

export function solveLinearAlgebra(name, args, math) {
  const matrix = args[0];
  const normalizedName = name.toLowerCase();

  switch (normalizedName) {
    case 'transpose': {
      const result = math.transpose(matrix);
      return explainLinearAlgebra(
        'Transpose',
        [
          'Swap each element aᵢⱼ with aⱼᵢ so rows become columns.',
          `A = ${formatMatrix(matrix)}`,
          `Aᵀ = ${formatMatrix(result)}`
        ],
        `Aᵀ = ${formatMatrix(result)}`
      );
    }
    case 'rank': {
      const rank = matrixRank(matrix);
      return explainLinearAlgebra(
        'Rank',
        [
          'Reduce the matrix to row-echelon form.',
          'Count the non-zero pivot rows.',
          `A = ${formatMatrix(matrix)}`
        ],
        `Rank(A) = ${rank}`
      );
    }
    case 'trace': {
      const traceValue = math.trace(matrix);
      const diagonal = matrix.map((row, index) => row[index]);
      return explainLinearAlgebra(
        'Trace',
        [
          'Select the diagonal entries.',
          `Diagonal entries: ${diagonal.join(', ')}`,
          `Add them: ${diagonal.join(' + ')} = ${traceValue}`
        ],
        `Trace(A) = Σ diagonal entries = ${traceValue}`
      );
    }
    case 'matrixmultiply': {
      const result = math.multiply(matrix, args[1]);
      return explainLinearAlgebra(
        'Matrix multiplication',
        [
          'Multiply each entry in a row of A by the matching entry in a column of B.',
          `A = ${formatMatrix(matrix)}`,
          `B = ${formatMatrix(args[1])}`,
          'Sum the products for each entry in the result.'
        ],
        `AB = ${formatMatrix(result)}`
      );
    }
    case 'matrixadd': {
      const result = math.add(matrix, args[1]);
      return explainLinearAlgebra(
        'Matrix addition',
        [
          'Add corresponding entries from A and B.',
          `A = ${formatMatrix(matrix)}`,
          `B = ${formatMatrix(args[1])}`
        ],
        `A + B = ${formatMatrix(result)}`
      );
    }
    case 'scalarmultiply': {
      const result = math.multiply(args[1], matrix);
      return explainLinearAlgebra(
        'Scalar multiplication',
        [
          'Multiply each entry of A by the scalar c.',
          `c = ${args[1]}`,
          `A = ${formatMatrix(matrix)}`
        ],
        `cA = ${formatMatrix(result)}`
      );
    }
    case 'det':
    case 'determinant': {
      const det = math.det(matrix);
      if (Array.isArray(matrix) && matrix.length === 2 && matrix[0].length === 2) {
        const [[a, b], [c, d]] = matrix;
        return explainLinearAlgebra(
          'Determinant',
          [
            'For a 2×2 matrix, use det(A) = ad - bc.',
            `A = ${formatMatrix(matrix)}`,
            `det(A) = (${a} × ${d}) - (${b} × ${c}) = ${a * d} - ${b * c}`
          ],
          `det(A) = ${det}`
        );
      }
      return explainLinearAlgebra(
        'Determinant',
        [
          'Apply the cofactor expansion or row-reduction method.',
          `A = ${formatMatrix(matrix)}`,
          'Combine the products of the chosen row/column terms and signs.'
        ],
        `det(A) = ${det}`
      );
    }
    case 'inv':
    case 'inverse': {
      const det = math.det(matrix);
      const inverse = math.inv(matrix);
      if (Array.isArray(matrix) && matrix.length === 2 && matrix[0].length === 2) {
        const [[a, b], [c, d]] = matrix;
        const formula = `1/(${a * d - b * c}) × [[${d}, ${-b}], [${-c}, ${a}]]`;
        return explainLinearAlgebra(
          'Inverse',
          [
            'A matrix is invertible only when det(A) ≠ 0.',
            `det(A) = ${det}`,
            `For a 2×2 matrix: A⁻¹ = 1/(ad - bc) × [[d, -b], [-c, a]]`,
            `A⁻¹ = ${formula}`
          ],
          `A⁻¹ = ${formatMatrix(inverse)}`
        );
      }
      return explainLinearAlgebra(
        'Inverse',
        [
          'Check that det(A) ≠ 0.',
          'Use the adjugate formula or Gauss-Jordan elimination.',
          `A = ${formatMatrix(matrix)}`
        ],
        `A⁻¹ = ${formatMatrix(inverse)}`
      );
    }
    case 'eigenvalues': {
      const eigen = math.eigs(matrix);
      const eigenValues = Array.isArray(eigen.values) ? eigen.values : [eigen.values];
      return explainLinearAlgebra(
        'Eigenvalues',
        [
          'Solve det(A - λI) = 0.',
          'This creates the characteristic polynomial.',
          'The roots of that polynomial are the eigenvalues.'
        ],
        `Eigenvalues: ${formatMatrix(eigenValues)}`
      );
    }
    case 'nullspace': {
      const rref = math.rref(matrix);
      const pivotColumns = [];
      for (let row = 0; row < rref.length; row += 1) {
        for (let col = 0; col < rref[0].length; col += 1) {
          if (Math.abs(rref[row][col]) > 1e-10) {
            pivotColumns.push(col);
            break;
          }
        }
      }
      return explainLinearAlgebra(
        'Null space',
        [
          'Row-reduce the matrix to find pivot columns.',
          'Free variables correspond to non-pivot columns.',
          `Pivot columns: ${pivotColumns.join(', ') || 'none'}`
        ],
        `Nullspace basis is determined by the free variables in RREF(A).`
      );
    }
    case 'basis':
    case 'columnspace':
    case 'rowspace': {
      const description = normalizedName === 'basis'
        ? 'basis vectors' : normalizedName === 'columnspace' ? 'column space' : 'row space';
      return explainLinearAlgebra(
        description,
        [
          'Find the pivot columns or pivot rows in the reduced matrix.',
          'Use the corresponding vectors as a basis for the subspace.',
          `A = ${formatMatrix(matrix)}`
        ],
        `${description.charAt(0).toUpperCase() + description.slice(1)} is spanned by the pivot vectors.`
      );
    }
    case 'orthogonalprojection':
    case 'projection': {
      const vector = args[1];
      const subspaceBasis = args[2] || args[1];
      const projection = math.multiply(
        math.transpose(subspaceBasis),
        math.multiply(
          math.inv(math.multiply(math.transpose(subspaceBasis), subspaceBasis)),
          math.multiply(math.transpose(subspaceBasis), vector)
        )
      );
      return explainLinearAlgebra(
        'Orthogonal projection',
        [
          'Project v onto the span of the subspace basis.',
          'Use proj_W(v) = A(AᵀA)⁻¹Aᵀv.',
          `v = ${formatMatrix(vector)}`
        ],
        `proj_W(v) = ${formatMatrix(projection)}`
      );
    }
    default:
      throw new Error(`Unknown linear algebra formula: ${name}`);
  }
}

function matrixRank(matrix) {
  const rows = matrix.map((row) => row.map(Number));
  const rowCount = rows.length;
  const columnCount = rows[0]?.length ?? 0;
  let rank = 0;

  for (let column = 0; column < columnCount && rank < rowCount; column += 1) {
    let pivot = rank;
    for (let row = rank + 1; row < rowCount; row += 1) {
      if (Math.abs(rows[row][column]) > Math.abs(rows[pivot][column])) pivot = row;
    }
    if (Math.abs(rows[pivot][column]) < 1e-12) continue;
    [rows[rank], rows[pivot]] = [rows[pivot], rows[rank]];

    for (let row = rank + 1; row < rowCount; row += 1) {
      const factor = rows[row][column] / rows[rank][column];
      for (let nextColumn = column; nextColumn < columnCount; nextColumn += 1) {
        rows[row][nextColumn] -= factor * rows[rank][nextColumn];
      }
    }
    rank += 1;
  }

  return rank;
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