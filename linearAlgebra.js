function matrixProduct(A, B) {
    if (A[0].length !== B.length) {
        throw new Error(
            "Matrix dimensions are incompatible."
        );
    }

    const rows = A.length;
    const cols = B[0].length;
    const common = B.length;

    const result = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(0));

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            for (let k = 0; k < common; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }

    return result;
}

function equationtoMatrix(equations) {
    const matrix = [];

    for (const equation of equations) {
        const row = [];

        for (const variable in equation) {
            row.push(equation[variable]);
        }

        matrix.push(row);
    }

    return matrix;
}

function findScalar(matrix, row, col) {
    const scalar = matrix[row][col];

    for (let j = 0; j < matrix[row].length; j++) {
        matrix[row][j] /= scalar;
    }

    return matrix;
}

function rowEchelonForm(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    let lead = 0;

    for (let r = 0; r < rows; r++) {
        if (lead >= cols) return matrix;

        let i = r;

        while (matrix[i][lead] === 0) {
            i++;

            if (i === rows) {
                i = r;
                lead++;

                if (lead === cols) {
                    return matrix;
                }
            }
        }

        [matrix[i], matrix[r]] = [matrix[r], matrix[i]];

        const pivot = matrix[r][lead];

        for (let j = 0; j < cols; j++) {
            matrix[r][j] /= pivot;
        }

        for (let i2 = r + 1; i2 < rows; i2++) {
            const factor = matrix[i2][lead];

            for (let j = 0; j < cols; j++) {
                matrix[i2][j] -= factor * matrix[r][j];
            }
        }

        lead++;
    }

    return matrix;
}

function reducedRowEchelonForm(matrix) {
    matrix = rowEchelonForm(matrix);

    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let r = rows - 1; r >= 0; r--) {
        let pivotCol = -1;

        for (let c = 0; c < cols; c++) {
            if (Math.abs(matrix[r][c] - 1) < 1e-10) {
                pivotCol = c;
                break;
            }
        }

        if (pivotCol === -1) continue;

        for (let i = r - 1; i >= 0; i--) {
            const factor = matrix[i][pivotCol];

            for (let j = pivotCol; j < cols; j++) {
                matrix[i][j] -= factor * matrix[r][j];
            }
        }
    }

    return matrix;
}

function luDecomposition(matrix) {
    // Validate input
    if (!Array.isArray(matrix) || matrix.length === 0) {
        throw new Error("Input must be a non-empty 2D array.");
    }
    const n = matrix.length;
    if (!matrix.every(row => Array.isArray(row) && row.length === n)) {
        throw new Error("Matrix must be square (n x n).");
    }
    if (!matrix.every(row => row.every(val => typeof val === "number"))) {
        throw new Error("Matrix elements must be numbers.");
    }

    // Initialize L and U matrices
    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));

    // Doolittle's algorithm
    for (let i = 0; i < n; i++) {
        // Upper Triangular
        for (let k = i; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) {
                sum += L[i][j] * U[j][k];
            }
            U[i][k] = matrix[i][k] - sum;
        }

        // Lower Triangular
        for (let k = i; k < n; k++) {
            if (i === k) {
                L[i][i] = 1; // Diagonal as 1
            } else {
                let sum = 0;
                for (let j = 0; j < i; j++) {
                    sum += L[k][j] * U[j][i];
                }
                if (U[i][i] === 0) {
                    throw new Error("Zero pivot encountered; consider pivoting.");
                }
                L[k][i] = (matrix[k][i] - sum) / U[i][i];
            }
        }
    }

    return { L, U };
}

import { mad } from 'mathjs';

function solveLinearSystem(A, b) {
    const solution =
        mathInstance.multiply(
            mathInstance.inv(A),
            b
        );

    return solution;
}

function vectorSpace(vectors)
{
    vectors = vectors.map(vec => mad(vec, 1));

}

function columnSpace(matrix) {
    const rref = reducedRowEchelonForm(
        matrix.map(row => [...row])
    );

    const pivotColumns = [];

    for (let i = 0; i < rref.length; i++) {
        const pivot = rref[i].findIndex(
            value => Math.abs(value) > 1e-10
        );

        if (pivot !== -1) {
            pivotColumns.push(pivot);
        }
    }

    return pivotColumns.map(col =>
        matrix.map(row => row[col])
    );
}

function basis(matrix) {
    return columnSpace(matrix);
}

function nullSpace(matrix) {
    const rref = reducedRowEchelonForm(
        matrix.map(row => [...row])
    );

    const rows = rref.length;
    const cols = rref[0].length;

    const pivotCols = new Set();

    for (let i = 0; i < rows; i++) {
        const pivot = rref[i].findIndex(
            value => Math.abs(value) > 1e-10
        );

        if (pivot !== -1) {
            pivotCols.add(pivot);
        }
    }

    const freeCols = [];

    for (let j = 0; j < cols; j++) {
        if (!pivotCols.has(j)) {
            freeCols.push(j);
        }
    }

    const basis = [];

    for (const free of freeCols) {
        const vector = Array(cols).fill(0);
        vector[free] = 1;

        let rowIndex = 0;

        for (const pivot of pivotCols) {
            vector[pivot] = -rref[rowIndex][free];
            rowIndex++;
        }

        basis.push(vector);
    }

    return basis;
}

function rankNullityTheorem(matrix) {
    const rank = matrixRank(matrix);
    const columns = matrix[0].length;
    const nullity = columns - rank;

    return {
        rank,
        nullity,
        columns,
        theoremSatisfied:
            rank + nullity === columns
    };
}

function identityMatrix(size) {
    const identity = [];

    for (let i = 0; i < size; i++) {
        const row = [];

        for (let j = 0; j < size; j++) {
            row.push(i === j ? 1 : 0);
        }

        identity.push(row);
    }

    return identity;
}

function matrixRank(matrix) {
    const rref = reducedRowEchelonForm(
        matrix.map(row => [...row])
    );

    let rank = 0;

    for (const row of rref) {
        if (row.some(value => Math.abs(value) > 1e-10)) {
            rank++;
        }
    }

    return rank;
}

function linearIndependence(vectors) {
    if (!Array.isArray(vectors) || vectors.length === 0) {
        throw new Error("A non-empty array of vectors is required.");
    }

    const matrix = math.transpose(vectors);
    const rank = matrixRank(matrix);

    return {
        vectors,
        rank,
        numberOfVectors: vectors.length,
        linearlyIndependent: rank === vectors.length
    };
}

function span(vectors) {
    return {
        vectors,
        basis: basis(math.transpose(vectors)),
        dimension: matrixRank(math.transpose(vectors))
    };
}

function rowSpace(matrix) {
    const rref = reducedRowEchelonForm(
        matrix.map(row => [...row])
    );

    return rref.filter(row =>
        row.some(value => Math.abs(value) > 1e-10)
    );
}

function orthogonalComplement(matrix) {
    return {
        orthogonalComplement: nullSpace(matrix)
    };
}

function rank1Matrices(matrix) {
    const rank = matrixRank(matrix);

    return {
        matrix,
        rank,
        isRank1: rank === 1
    };
}


function incidenceMatrices(graph) {
    const vertices = graph.vertices;
    const edges = graph.edges;

    const matrix = Array(vertices.length)
        .fill(null)
        .map(() =>
            Array(edges.length).fill(0)
        );

    edges.forEach((edge, edgeIndex) => {
        const [u, v] = edge;

        const uIndex = vertices.indexOf(u);
        const vIndex = vertices.indexOf(v);

        if (uIndex === -1 || vIndex === -1) {
            throw new Error("Edge contains unknown vertex.");
        }

        matrix[uIndex][edgeIndex] = -1;
        matrix[vIndex][edgeIndex] = 1;
    });

    return {
        vertices,
        edges,
        incidenceMatrix: matrix
    };
}

function orthogonalSubspace(matrix) {
    return {
        orthogonalSubspace: nullSpace(matrix),
        dimension: nullSpace(matrix).length
    };
}

function orthogonalProjection(vector, subspaceBasis) {
    const A = math.transpose(subspaceBasis);

    const At = math.transpose(A);

    const projection =
        math.multiply(
            A,
            math.multiply(
                math.inv(
                    math.multiply(At, A)
                ),
                math.multiply(At, vector)
            )
        );

    return projection;
}

function linetoSubspace(line, subspaceBasis) {

    const proj =
        orthogonalProjection(
            line,
            subspaceBasis
        );

    const error =
        math.subtract(line, proj);

    const distance =
        math.norm(error);

    return {
        projection: proj,
        errorVector: error,
        distance
    };
}


function projectionMatrix(subspaceBasis) {

    const A =
        math.transpose(subspaceBasis);

    const At =
        math.transpose(A);

    return math.multiply(
        A,
        math.multiply(
            math.inv(
                math.multiply(At, A)
            ),
            At
        )
    );
}

function errorVector(vector, subspaceBasis) {

    const projection =
        orthogonalProjection(
            vector,
            subspaceBasis
        );

    return math.subtract(
        vector,
        projection
    );
}

function gramSchmidt(vectors, normalize = false) {

    const basis = [];

    for (const v of vectors) {

        let u = [...v];

        for (const b of basis) {

            const projectionScalar =
                math.dot(u, b) /
                math.dot(b, b);

            const projection =
                math.multiply(
                    projectionScalar,
                    b
                );

            u = math.subtract(
                u,
                projection
            );
        }

        if (math.norm(u) > 1e-10) {

            if (normalize) {
                u = math.divide(
                    u,
                    math.norm(u)
                );
            }

            basis.push(u);
        }
    }

    return basis;
}

function QRFactorization(matrix) {

    const columns =
        math.transpose(matrix);

    const orthonormalBasis =
        gramSchmidt(
            columns,
            true
        );

    const Q =
        math.transpose(
            orthonormalBasis
        );

    const R =
        math.multiply(
            math.transpose(Q),
            matrix
        );

    return {
        Q,
        R
    };
}

function projectionOntoSubspace(
    vector,
    subspaceBasis
) {
    return orthogonalProjection(
        vector,
        subspaceBasis
    );
}

function determinantofScalarmultiple(matrix, scalar) {

    const n = matrix.length;

    const det = math.det(matrix);

    return {
        determinantOriginal: det,
        scalar,
        size: n,
        determinantScaled:
            Math.pow(scalar, n) * det
    };
}

function cofactorMatrix(matrix) {

    const n = matrix.length;

    const cofactors =
        Array(n)
            .fill(null)
            .map(() =>
                Array(n).fill(0)
            );

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {

            const minor =
                minorMatrix(
                    matrix,
                    i,
                    j
                );

            cofactors[i][j] =
                Math.pow(-1, i + j) *
                minor;
        }
    }

    return cofactors;
}

function minorMatrix(matrix, row, col) {

    const subMatrix =
        matrix
            .filter((_, i) => i !== row)
            .map(r =>
                r.filter((_, j) => j !== col)
            );

    return math.det(subMatrix);
}

function cramersRule(A, B) {
    const n = A.length;

    // Validate matrix dimensions
    if (!Array.isArray(A) || !Array.isArray(B) || B.length !== n) {
        throw new Error("Invalid input: A must be n x n matrix and B must be length n.");
    }
    for (let row of A) {
        if (!Array.isArray(row) || row.length !== n) {
            throw new Error("Invalid input: A must be n x n matrix.");
        }
    }

    // Helper: Calculate determinant using recursion (Laplace expansion)
    function determinant(matrix) {
        const size = matrix.length;
        if (size === 1) return matrix[0][0];
        if (size === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let col = 0; col < size; col++) {
            const subMatrix = matrix.slice(1).map(row => row.filter((_, idx) => idx !== col));
            det += (col % 2 === 0 ? 1 : -1) * matrix[0][col] * determinant(subMatrix);
        }
        return det;
    }

    // Main determinant
    const detA = determinant(A);
    if (detA === 0) {
        return null; // No unique solution
    }

    // Calculate each variable's determinant
    const solutions = [];
    for (let i = 0; i < n; i++) {
        const Ai = A.map((row, rowIndex) => {
            const newRow = [...row];
            newRow[i] = B[rowIndex];
            return newRow;
        });
        const detAi = determinant(Ai);
        solutions.push(detAi / detA);
    }

    return solutions;
}


function trace(matrix) {

    if (
        !Array.isArray(matrix) ||
        matrix.length === 0
    ) {
        throw new Error(
            "Matrix must be non-empty."
        );
    }

    const rows = matrix.length;
    const cols = matrix[0].length;

    if (rows !== cols) {
        throw new Error(
            "Trace requires a square matrix."
        );
    }

    let sum = 0;

    for (let i = 0; i < rows; i++) {
        sum += matrix[i][i];
    }

    return sum;
}

function diagonalization(matrix) {
    try {
        const eig = math.eigs(matrix);

        const eigenvalues = eig.values;
        const eigenvectors = eig.eigenvectors;

        if (!eigenvectors || eigenvectors.length !== matrix.length) {
            return {
                diagonalizable: false,
                reason: "Not enough independent eigenvectors."
            };
        }

        const P = eigenvectors.map(v => v.vector);
        const Pmatrix = math.transpose(P);

        const D = eigenvalues.map((value, i) =>
            eigenvalues.map((_, j) => i === j ? value : 0)
        );

        return {
            diagonalizable: true,
            P: Pmatrix,
            D,
            PInverse: math.inv(Pmatrix)
        };

    } catch (error) {

        return {
            diagonalizable: false,
            error: error.message
        };
    }
}

function markovMatrix(matrix) {

    const tolerance = 1e-10;

    for (let i = 0; i < matrix.length; i++) {

        let rowSum = 0;

        for (let j = 0; j < matrix[i].length; j++) {

            if (matrix[i][j] < 0) {
                return {
                    isMarkov: false,
                    reason: "Negative probabilities detected."
                };
            }

            rowSum += matrix[i][j];
        }

        if (Math.abs(rowSum - 1) > tolerance) {
            return {
                isMarkov: false,
                reason: `Row ${i + 1} does not sum to 1.`
            };
        }
    }

    return {
        isMarkov: true,
        states: matrix.length
    };
}


function symmetricMatrix(matrix) {

    const rows = matrix.length;
    const cols = matrix[0].length;

    if (rows !== cols) {
        return false;
    }

    for (let i = 0; i < rows; i++) {
        for (let j = i + 1; j < cols; j++) {

            if (
                Math.abs(matrix[i][j] - matrix[j][i])
                > 1e-10
            ) {
                return false;
            }
        }
    }

    return true;
}


function positiveDefiniteMatrix(matrix) {

    if (!symmetricMatrix(matrix)) {

        return {
            positiveDefinite: false,
            reason: "Matrix is not symmetric."
        };
    }

    for (let k = 1; k <= matrix.length; k++) {

        const principalMinor =
            matrix
            .slice(0, k)
            .map(row => row.slice(0, k));

        const det = math.det(principalMinor);

        if (det <= 0) {

            return {
                positiveDefinite: false,
                failingMinor: k,
                determinant: det
            };
        }
    }

    return {
        positiveDefinite: true
    };
}

function fourierMatrix(n) {

    const F = [];

    for (let j = 0; j < n; j++) {

        const row = [];

        for (let k = 0; k < n; k++) {

            const angle =
                (-2 * Math.PI * j * k) / n;

            row.push(
                math.complex({
                    re: Math.cos(angle) / Math.sqrt(n),
                    im: Math.sin(angle) / Math.sqrt(n)
                })
            );
        }

        F.push(row);
    }

    return F;
}

function hermitianMatrix(matrix) {

    if (!Array.isArray(matrix) || matrix.length === 0) {
        throw new Error("Matrix must be a non-empty square matrix.");
    }

    const n = matrix.length;

    if (!matrix.every(row => row.length === n)) {
        throw new Error("Hermitian matrices must be square.");
    }

    const tolerance = 1e-10;

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < n; j++) {

            const aij = matrix[i][j];
            const aji = matrix[j][i];

            const conjugate =
                math.typeOf(aji) === "Complex"
                    ? math.conj(aji)
                    : aji;

            const difference =
                math.abs(
                    math.subtract(aij, conjugate)
                );

            if (difference > tolerance) {
                return {
                    isHermitian: false,
                    failingEntry: [i, j]
                };
            }
        }
    }

    return {
        isHermitian: true,
        size: n
    };
}

function fastFourierTransform(vector) {

    const N = vector.length;

    if (N <= 1) {
        return vector;
    }

    const even =
        fastFourierTransform(
            vector.filter((_, i) => i % 2 === 0)
        );

    const odd =
        fastFourierTransform(
            vector.filter((_, i) => i % 2 !== 0)
        );

    const result = Array(N);

    for (let k = 0; k < N / 2; k++) {

        const twiddle =
            math.exp(
                math.complex(
                    0,
                    (-2 * Math.PI * k) / N
                )
            );

        const t =
            math.multiply(
                twiddle,
                odd[k]
            );

        result[k] =
            math.add(even[k], t);

        result[k + N / 2] =
            math.subtract(even[k], t);
    }

    return result;
}

function complexMatrix(matrix) {

    for (const row of matrix) {

        for (const value of row) {

            if (
                math.typeOf(value) ===
                "Complex"
            ) {
                return true;
            }
        }
    }

    return false;
}

function principalAxisTheorem(matrix) {

    if (!symmetricMatrix(matrix)) {

        throw new Error(
            "Matrix must be symmetric."
        );
    }

    const eig =
        math.eigs(matrix);

    const Q =
        eig.eigenvectors.map(
            v => v.vector
        );

    const D =
        eig.values.map(
            (value, i) =>
                eig.values.map(
                    (_, j) =>
                        i === j ? value : 0
                )
        );

    return {
        orthogonalMatrix:
            math.transpose(Q),
        diagonalMatrix: D
    };
}

function similarityMatrix(A, B) {

    const eigA =
        math.eigs(A).values
            .slice()
            .sort();

    const eigB =
        math.eigs(B).values
            .slice()
            .sort();

    let similar = true;

    for (let i = 0; i < eigA.length; i++) {

        if (
            Math.abs(
                eigA[i] - eigB[i]
            ) > 1e-10
        ) {
            similar = false;
            break;
        }
    }

    return {
        similar,
        eigenvaluesA: eigA,
        eigenvaluesB: eigB
    };
}

function jordanBlockForm(matrix) {

    const eig =
        math.eigs(matrix);

    const jordan = [];

    for (let i = 0; i < eig.values.length; i++) {

        jordan.push(
            eig.values.map(
                (_, j) =>
                    i === j
                        ? eig.values[i]
                        : 0
            )
        );
    }

    return {
        note:
            "Diagonal Jordan form approximation. Full Jordan chains not implemented.",
        jordanForm: jordan,
        eigenvalues: eig.values
    };
}

function singularValueDecomposition(matrix) {

    const At =
        math.transpose(matrix);

    const AtA =
        math.multiply(
            At,
            matrix
        );

    const eig =
        math.eigs(AtA);

    const singularValues =
        eig.values.map(
            v =>
                Math.sqrt(
                    Math.abs(v)
                )
        );

    return {
        singularValues,
        V: eig.eigenvectors.map(
            v => v.vector
        )
    };
}