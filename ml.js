function euclideanDistance(point1, point2) 
{
    if (point1.length !== point2.length) {
        throw new Error('Points must have the same dimension.');
    }
    let sumOfSquares = 0;
    for (let i = 0; i < point1.length; i++) {
        const difference = point1[i] - point2[i];
        sumOfSquares += difference * difference;
    }
    return Math.sqrt(sumOfSquares);
}

function manhattanDistance(point1, point2)
{
    if (point1.length !== point2.length) {
        throw new Error('Points must have the same dimension.');
    }
    let sumOfAbsoluteDifferences = 0;
    for (let i = 0; i < point1.length; i++) {
        sumOfAbsoluteDifferences += Math.abs(point1[i] - point2[i]);
    }
    return sumOfAbsoluteDifferences;
}

function minkowskiDistance(point1, point2, p)
{
    if (point1.length !== point2.length) {
        throw new Error('Points must have the same dimension.');
    }
    if (p <= 0) {
        throw new Error('p must be a positive number.');
    }
    let sumOfPowers = 0;
    for (let i = 0; i < point1.length; i++) {
        sumOfPowers += Math.pow(Math.abs(point1[i] - point2[i]), p);
    }
    return Math.pow(sumOfPowers, 1 / p);
}

function gradientDescent(gradientFunc, initialPoint, learningRate, iterations)
{
    let point = initialPoint.slice();
    for (let i = 0; i < iterations; i++) {
        const gradient = gradientFunc(point);
        for (let j = 0; j < point.length; j++) {
            point[j] -= learningRate * gradient[j];
        }
    }
    return point;
}

function stochasticGradientDescent(gradientFunc, initialPoint, learningRate, iterations, batchSize)
{
    let point = initialPoint.slice();
    for (let i = 0; i < iterations; i++) {
        const batch = [];
        for (let j = 0; j < batchSize; j++) {
            const randomIndex = Math.floor(Math.random() * point.length);
            batch.push(point[randomIndex]);
        }
        const gradient = gradientFunc(batch);
        for (let j = 0; j < point.length; j++) {
            point[j] -= learningRate * gradient[j];
        }
    }
    return point;
}

function discriminantWeighted(X, y, weights)
{
    if (X.length !== y.length || X.length !== weights.length) {
        throw new Error('Input arrays must have the same length.');
    }
    const n = X.length;
    const meanX = Array(X[0].length).fill(0);
    const meanY = 0;
    let totalWeight = 0;
    for (let i = 0; i < n; i++) {
        totalWeight += weights[i];
        for (let j = 0; j < X[i].length; j++) {
            meanX[j] += weights[i] * X[i][j];
        }
    }
    for (let j = 0; j < meanX.length; j++) {
        meanX[j] /= totalWeight;
    }
    const meanYWeighted = y.reduce((acc, val, idx) => acc + weights[idx] * val, 0) / totalWeight;
    return { meanX, meanYWeighted };
}
