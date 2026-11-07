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