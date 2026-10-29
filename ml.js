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

function linearRegression(X, y)
{
    if (X.length !== y.length) {
        throw new Error('Input arrays must have the same length.');
    }
    const n = X.length;
    const meanX = Array(X[0].length).fill(0);
    const meanY = y.reduce((acc, val) => acc + val, 0) / n;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < X[i].length; j++) {
            meanX[j] += X[i][j];
        }
    }
    for (let j = 0; j < meanX.length; j++) {
        meanX[j] /= n;
    }
}

function residualSumOfSquares(X, y, coefficients)
{
    if (X.length !== y.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let rss = 0;
    for (let i = 0; i < X.length; i++) {
        let predicted = 0;
        for (let j = 0; j < X[i].length; j++) {
            predicted += X[i][j] * coefficients[j];
        }
        const residual = y[i] - predicted;
        rss += residual * residual;
    }
    return rss;
}

function absoluteLoss(X, y, coefficients)
{
    if (X.length !== y.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let totalLoss = 0;
    for (let i = 0; i < X.length; i++) {
        let predicted = 0;
        for (let j = 0; j < X[i].length; j++) {
            predicted += X[i][j] * coefficients[j];
        }
        const loss = Math.abs(y[i] - predicted);
        totalLoss += loss;
    }
    return totalLoss;
}

function logLoss(X, y, coefficients)
{
    if (X.length !== y.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let totalLoss = 0;
    for (let i = 0; i < X.length; i++) {
        let predicted = 0;
        for (let j = 0; j < X[i].length; j++) {
            predicted += X[i][j] * coefficients[j];
        }
        const probability = 1 / (1 + Math.exp(-predicted));
        const loss = -y[i] * Math.log(probability) - (1 - y[i]) * Math.log(1 - probability);
        totalLoss += loss;
    }
    return totalLoss;
}

function crossEntropyLoss(X, y, coefficients)
{
    if (X.length !== y.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let totalLoss = 0;
    for (let i = 0; i < X.length; i++) {
        let predicted = 0;
        for (let j = 0; j < X[i].length; j++) {
            predicted += X[i][j] * coefficients[j];
        }
        const probability = 1 / (1 + Math.exp(-predicted));
        const loss = -y[i] * Math.log(probability) - (1 - y[i]) * Math.log(1 - probability);
        totalLoss += loss;
    }
    return totalLoss;
}

function hingeLoss(X, y, coefficients)
{
    if (X.length !== y.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let totalLoss = 0;
    for (let i = 0; i < X.length; i++) {
        let predicted = 0;
        for (let j = 0; j < X[i].length; j++) {
            predicted += X[i][j] * coefficients[j];
        }
        const loss = Math.max(0, 1 - y[i] * predicted);
        totalLoss += loss;
    }
    return totalLoss;
}

function accuracy(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let correctCount = 0;
    for (let i = 0; i < yTrue.length; i++) {
        if (yTrue[i] === yPred[i]) {
            correctCount++;
        }
    }
    return correctCount / yTrue.length;
}

function precision(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let truePositive = 0;
    let falsePositive = 0;
    for (let i = 0; i < yTrue.length; i++) {
        if (yPred[i] === 1) {
            if (yTrue[i] === 1) {
                truePositive++;
            } else {
                falsePositive++;
            }
        }
    }
    return truePositive / (truePositive + falsePositive);
}

function recall(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let truePositive = 0;
    let falseNegative = 0;
    for (let i = 0; i < yTrue.length; i++) {
        if (yTrue[i] === 1) {
            if (yPred[i] === 1) {
                truePositive++;
            } else {
                falseNegative++;
            }
        }
    }
    return truePositive / (truePositive + falseNegative);
}

function f1Score(yTrue, yPred)
{
    const p = precision(yTrue, yPred);
    const r = recall(yTrue, yPred);
    return 2 * (p * r) / (p + r);
}

function accuracyExpected(yTrue, yPred, weights)
{
    if (yTrue.length !== yPred.length || yTrue.length !== weights.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let weightedCorrectCount = 0;
    let totalWeight = 0;
    for (let i = 0; i < yTrue.length; i++) {
        totalWeight += weights[i];
        if (yTrue[i] === yPred[i]) {
            weightedCorrectCount += weights[i];
        }
    }
    return weightedCorrectCount / totalWeight;
}

function cohenKappa(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    const n = yTrue.length;
    const labelSet = new Set([...yTrue, ...yPred]);
    const labelArray = Array.from(labelSet);
    const labelCount = labelArray.length;
    const confusionMatrix = Array.from({ length: labelCount }, () => Array(labelCount).fill(0));
    const labelIndexMap = new Map(labelArray.map((label, index) => [label, index]));
    for (let i = 0; i < n; i++) {
        const trueIndex = labelIndexMap.get(yTrue[i]);
        const predIndex = labelIndexMap.get(yPred[i]);
        confusionMatrix[trueIndex][predIndex]++;
    }
    let observedAgreement = 0;
    for (let i = 0; i < labelCount; i++) {
        observedAgreement += confusionMatrix[i][i];
    }
    observedAgreement /= n;
    const trueLabelCounts = Array(labelCount).fill(0);
    const predLabelCounts = Array(labelCount).fill(0);
    for (let i = 0; i < labelCount; i++) {
        for (let j = 0; j < labelCount; j++) {
            trueLabelCounts[i] += confusionMatrix[i][j];
            predLabelCounts[j] += confusionMatrix[i][j];
        }
    }
    let expectedAgreement = 0;
    for (let i = 0; i < labelCount; i++) {
        expectedAgreement += (trueLabelCounts[i] / n) * (predLabelCounts[i] / n);
    }
    return (observedAgreement - expectedAgreement) / (1 - expectedAgreement);
}

function meanAbsoluteError(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let totalError = 0;
    for (let i = 0; i < yTrue.length; i++) {
        totalError += Math.abs(yTrue[i] - yPred[i]);
    }
    return totalError / yTrue.length;
}

function meanSquaredError(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let totalError = 0;
    for (let i = 0; i < yTrue.length; i++) {
        const error = yTrue[i] - yPred[i];
        totalError += error * error;
    }
    return totalError / yTrue.length;
}

function rootMeanSquaredError(yTrue, yPred)
{
    return Math.sqrt(meanSquaredError(yTrue, yPred));
}