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
    const history = [];
    for (let i = 0; i < iterations; i++) {
        const gradient = Array(point.length).fill(0);
        for (let j = 0; j < batchSize; j++) {
            const sampleGradient = gradientFunc();
            if (sampleGradient.length !== point.length) {
                throw new Error('Gradient dimensions must match the initial point.');
            }
            for (let k = 0; k < point.length; k++) {
                gradient[k] += sampleGradient[k] / batchSize;
            }
        }
        for (let j = 0; j < point.length; j++) {
            point[j] -= learningRate * gradient[j];
        }
        history.push({ iteration: i + 1, point: point.slice(), gradient });
    }
    return { point, history };
}

function discriminantWeighted(X, y, weights)
{
    if (X.length !== y.length || X.length !== weights.length) {
        throw new Error('Input arrays must have the same length.');
    }
    if (X.length === 0 || !X.every(row => Array.isArray(row) && row.length === X[0].length)) {
        throw new Error('Features must be a non-empty rectangular matrix.');
    }
    const n = X.length;
    const meanX = Array(X[0].length).fill(0);
    let totalWeight = 0;
    for (let i = 0; i < n; i++) {
        if (!Number.isFinite(weights[i]) || weights[i] < 0) {
            throw new Error('Weights must be finite and non-negative.');
        }
        totalWeight += weights[i];
        for (let j = 0; j < X[i].length; j++) {
            meanX[j] += weights[i] * X[i][j];
        }
    }
    if (totalWeight === 0) {
        throw new Error('The sum of weights must be greater than zero.');
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
    if (X.length === 0 || !X.every(row => Array.isArray(row) && row.length === X[0].length)) {
        throw new Error('Features must be a non-empty rectangular matrix.');
    }
    if (!y.every(Number.isFinite) || !X.every(row => row.every(Number.isFinite))) {
        throw new Error('Features and targets must contain finite numbers.');
    }
    const featureCount = X[0].length + 1;
    const normalMatrix = Array.from({ length: featureCount }, () => Array(featureCount).fill(0));
    const rightHandSide = Array(featureCount).fill(0);

    for (let rowIndex = 0; rowIndex < X.length; rowIndex++) {
        const row = [1, ...X[rowIndex]];
        for (let i = 0; i < featureCount; i++) {
            rightHandSide[i] += row[i] * y[rowIndex];
            for (let j = 0; j < featureCount; j++) {
                normalMatrix[i][j] += row[i] * row[j];
            }
        }
    }

    const augmented = normalMatrix.map((row, index) => [...row, rightHandSide[index]]);
    for (let pivot = 0; pivot < featureCount; pivot++) {
        let bestRow = pivot;
        for (let row = pivot + 1; row < featureCount; row++) {
            if (Math.abs(augmented[row][pivot]) > Math.abs(augmented[bestRow][pivot])) bestRow = row;
        }
        if (Math.abs(augmented[bestRow][pivot]) < 1e-12) {
            throw new Error('Linear regression requires independent features and at least one more observation than feature.');
        }
        [augmented[pivot], augmented[bestRow]] = [augmented[bestRow], augmented[pivot]];
        const divisor = augmented[pivot][pivot];
        for (let column = pivot; column <= featureCount; column++) {
            augmented[pivot][column] /= divisor;
        }
        for (let row = 0; row < featureCount; row++) {
            if (row === pivot) continue;
            const factor = augmented[row][pivot];
            for (let column = pivot; column <= featureCount; column++) {
                augmented[row][column] -= factor * augmented[pivot][column];
            }
        }
    }
    return augmented.map(row => row[featureCount]);
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
    const predictedPositive = truePositive + falsePositive;
    return predictedPositive === 0 ? 0 : truePositive / predictedPositive;
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
    const actualPositive = truePositive + falseNegative;
    return actualPositive === 0 ? 0 : truePositive / actualPositive;
}

function f1Score(yTrue, yPred)
{
    const p = precision(yTrue, yPred);
    const r = recall(yTrue, yPred);
    return p + r === 0 ? 0 : 2 * (p * r) / (p + r);
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
    if (sortedValues.some(value => value < 0)) {
        throw new Error('Gini coefficient values must be non-negative.');
    }
    const totalSum = sortedValues.reduce((acc, val) => acc + val, 0);
    if (totalSum === 0) return 0;
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
    if (X.length !== y.length || X.length === 0 || !X.every(row => Array.isArray(row) && row.length === X[0].length)) {
        throw new Error('Features must be a non-empty rectangular matrix matching the labels.');
    }
    const totalEntropy = entropy(y);
    const n = X.length;
    const m = X[0].length;
    const ratios = [];
    for (let j = 0; j < m; j++) {
        const featureValues = X.map(row => row[j]);
        const valueCounts = {};
        const labelGroups = new Map();
        for (let i = 0; i < n; i++) {
            const key = featureValues[i];
            valueCounts[key] = (valueCounts[key] || 0) + 1;
            if (!labelGroups.has(key)) labelGroups.set(key, []);
            labelGroups.get(key).push(y[i]);
        }
        let weightedEntropy = 0;
        let splitInfo = 0;
        for (const [value, labels] of labelGroups) {
            const probability = labels.length / n;
            weightedEntropy += probability * entropy(labels);
            splitInfo -= probability * Math.log2(probability);
        }
        const informationGain = totalEntropy - weightedEntropy;
        ratios.push(splitInfo === 0 ? 0 : informationGain / splitInfo);
    }
    return ratios.length === 1 ? ratios[0] : ratios;
}

function splitInformation(X)
{
    if (X.length === 0 || !X.every(row => Array.isArray(row) && row.length === X[0].length)) {
        throw new Error('Features must be a non-empty rectangular matrix.');
    }
    const n = X.length;
    const m = X[0].length;
    const splitInfo = Array(m).fill(0);
    for (let j = 0; j < m; j++) {
        const featureValues = X.map(row => row[j]);
        const valueCounts = {};
        for (const value of featureValues) {
            if (valueCounts[value] === undefined) {
                valueCounts[value] = 0;
            }
            valueCounts[value]++;
        }
        for (const count of Object.values(valueCounts)) {
            const probability = count / n;
            splitInfo[j] -= probability * Math.log2(probability);
        }
    }
    return splitInfo;
}