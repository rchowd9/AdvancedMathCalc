function matrixProduct(A, B) {
    const rows = A.length;
    const cols = B[0].length;
    const common = B.length;

    const result = Array(rows)
        .fill()
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

const math = require('mathjs');

function solveSystem(equations, variables) {
    try {
        // Parse equations into math.js format
        const parsedEquations = equations.map(eq => math.parse(eq));

        // Create an array of expressions
        const exprs = parsedEquations.map(eq => eq.toString());

        // Solve the system
        const solution = math.lusolve(
            math.matrix(parsedEquations.map(eq => {
                // Extract coefficients for each variable
                return variables.map(v => eq.coefficients(v)[0]);
            })),
            math.matrix(parsedEquations.map(eq => eq.constants()[0]))
        );

        // Map solution to variable names
        const result = {};
        variables.forEach((v, i) => {
            result[v] = solution[i][0];
        });

        return result;
    } catch (error) {
        console.error("Error solving system:", error.message);
        return null;
    }
}

function vectorSpace(vectors)
{
    vectors = vectors.map(vec => math.mad(vec, 1));

}

function columnSpace(matrix)
{
    
}