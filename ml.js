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

function rSquared(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    const meanY = yTrue.reduce((acc, val) => acc + val, 0) / yTrue.length;
    let totalVariance = 0;
    let residualVariance = 0;
    for (let i = 0; i < yTrue.length; i++) {
        totalVariance += (yTrue[i] - meanY) * (yTrue[i] - meanY);
        residualVariance += (yTrue[i] - yPred[i]) * (yTrue[i] - yPred[i]);
    }
    return 1 - (residualVariance / totalVariance);
}

function huberLoss(X, y, coefficients, delta)
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
        const error = y[i] - predicted;
        if (Math.abs(error) <= delta) {
            totalLoss += 0.5 * error * error;
        } else {
            totalLoss += delta * (Math.abs(error) - 0.5 * delta);
        }
    }
    return totalLoss;
}

function minmaxscaling(X)
{
    const n = X.length;
    const m = X[0].length;
    const minValues = Array(m).fill(Infinity);
    const maxValues = Array(m).fill(-Infinity);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (X[i][j] < minValues[j]) {
                minValues[j] = X[i][j];
            }
            if (X[i][j] > maxValues[j]) {
                maxValues[j] = X[i][j];
            }
        }
    }
    const scaledX = Array.from({ length: n }, () => Array(m).fill(0));
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (maxValues[j] - minValues[j] === 0) {
                scaledX[i][j] = 0; // Avoid division by zero
            } else {
                scaledX[i][j] = (X[i][j] - minValues[j]) / (maxValues[j] - minValues[j]);
            }
        }
    }
    return scaledX;
} 

function giniCoefficient(values)
{
    const n = values.length;
    if (n === 0) {
        return 0;
    }
    const sortedValues = values.slice().sort((a, b) => a - b);
    let cumulativeSum = 0;
    let totalSum = sortedValues.reduce((acc, val) => acc + val, 0);
    for (let i = 0; i < n; i++) {
        cumulativeSum += sortedValues[i];
    }
    let gini = 0;
    for (let i = 0; i < n; i++) {
        gini += (i + 1) * sortedValues[i];
    }
    gini = (2 * gini) / (n * totalSum) - (n + 1) / n;
    return gini;
} 

function entropy(values)
{
    const n = values.length;
    if (n === 0) {
        return 0;
    }
    const valueCounts = {};
    for (const value of values) {
        if (valueCounts[value] === undefined) {
            valueCounts[value] = 0;
        }
        valueCounts[value]++;
    }
    let entropyValue = 0;
    for (const count of Object.values(valueCounts)) {
        const probability = count / n;
        entropyValue -= probability * Math.log2(probability);
    }
    return entropyValue;
}

function classificationError(yTrue, yPred)
{
    if (yTrue.length !== yPred.length) {
        throw new Error('Input arrays must have the same length.');
    }
    let errorCount = 0;
    for (let i = 0; i < yTrue.length; i++) {
        if (yTrue[i] !== yPred[i]) {
            errorCount++;
        }
    }
    return errorCount / yTrue.length;
}

function gainRatio(X, y)
{
    const totalEntropy = entropy(y);
    const n = X.length;
    const m = X[0].length;
    let weightedEntropy = 0;
    for (let j = 0; j < m; j++) {
        const featureValues = X.map(row => row[j]);
        const valueCounts = {};
        for (const value of featureValues) {
            if (valueCounts[value] === undefined) {
                valueCounts[value] = 0;
            }
            valueCounts[value]++;
        }
        let featureEntropy = 0;
        for (const count of Object.values(valueCounts)) {
            const probability = count / n;
            featureEntropy -= probability * Math.log2(probability);
        }
        weightedEntropy += (featureValues.length / n) * featureEntropy;
    }
    const informationGain = totalEntropy - weightedEntropy;
    const splitInfo = -Object.values(valueCounts).reduce((acc, count) => {
        const probability = count / n;
        return acc + probability * Math.log2(probability);
    }, 0);
    return informationGain / splitInfo;
}