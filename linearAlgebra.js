function matrixProduct(A, B)
{
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < A[0].length; k++) {
                sum += A[i][k] * B[k][j];
            }
            A[i][j] = sum;
        }  
    }
}

function equationtoMatrix(equations)
{
    const matrix = [];
    for (const equation of equations)
    {
        const row = [];
        for (const variable in equation)
        {
            row.push(equation[variable]);
        }
    }
}

function findScalar(matrix, row, col)
{
    const scalar = matrix[row][col];
    for (let j = 0; j < matrix[row])
    {
        matrix[row][j] /= scalar;
        
    }
}