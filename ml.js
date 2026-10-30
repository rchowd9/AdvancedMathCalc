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

const machineLearningFunctions = {
    euclideanDistance,
    manhattanDistance,
    minkowskiDistance,
    gradientDescent,
    stochasticGradientDescent,
    discriminantWeighted,
    linearRegression,
    residualSumOfSquares,
    absoluteLoss,
    logLoss,
    crossEntropyLoss,
    hingeLoss,
    accuracy,
    precision,
    recall,
    f1Score,
    accuracyExpected,
    cohenKappa,
    meanAbsoluteError,
    meanSquaredError,
    rootMeanSquaredError,
    rSquared,
    huberLoss,
    minmaxscaling,
    giniCoefficient,
    entropy,
    classificationError,
    gainRatio,
    splitInformation
};

const formatMLValue = (value) => {
    if (typeof value === 'number') {
        if (Number.isNaN(value)) return 'undefined';
        return Number.isFinite(value) ? String(Number(value.toPrecision(8))) : String(value);
    }
    if (Array.isArray(value)) return `[${value.map(formatMLValue).join(', ')}]`;
    if (value && typeof value === 'object') {
        return `{ ${Object.entries(value).map(([key, item]) => `${key}: ${formatMLValue(item)}`).join(', ')} }`;
    }
    return String(value);
};

const formatMLInput = (values) => values.map(formatMLValue).join(', ');
const formatMLName = (name) => name[0].toLowerCase() + name.slice(1);
export const MACHINE_LEARNING_MODE_NAMES = new Set(
    Object.keys(machineLearningFunctions).map(name => name.toLowerCase())
);

function assertFiniteArray(values, name) {
    if (!Array.isArray(values) || values.length === 0 || !values.every(Number.isFinite)) {
        throw new Error(`${name} must be a non-empty array of finite numbers.`);
    }
}

function assertFeatureMatrix(features, targets) {
    if (!Array.isArray(features) || features.length === 0 ||
        !features.every(row => Array.isArray(row) && row.length > 0 && row.every(Number.isFinite))) {
        throw new Error('Features must be a non-empty matrix of finite numbers.');
    }
    if (features.some(row => row.length !== features[0].length)) {
        throw new Error('Feature rows must all have the same number of columns.');
    }
    if (!Array.isArray(targets) || targets.length !== features.length || !targets.every(Number.isFinite)) {
        throw new Error('Targets must be finite numbers with one target per feature row.');
    }
}

function resolveGradientExpressions(expressions, dimension) {
    const components = typeof expressions === 'string' ? [expressions] : expressions;
    if (!Array.isArray(components) || components.length !== dimension ||
        !components.every(expression => typeof expression === 'string' && expression.trim())) {
        throw new Error(`Provide one quoted gradient expression for each of the ${dimension} parameters.`);
    }
    return components;
}

function evaluateGradient(expressions, point, mathInstance) {
    if (!mathInstance || typeof mathInstance.evaluate !== 'function') {
        throw new Error('Gradient descent requires the calculator math engine.');
    }
    const variableNames = ['x', 'y', 'z', 't', 'u', 'v'];
    const scope = {};
    point.forEach((value, index) => {
        scope[variableNames[index] || `x${index}`] = value;
        scope[`x${index}`] = value;
    });
    const gradient = expressions.map(expression => mathInstance.evaluate(expression, scope));
    if (!gradient.every(Number.isFinite)) throw new Error('Gradient expressions must evaluate to finite numbers.');
    return gradient;
}

function solveDescent(modeName, values, mathInstance) {
    const stochastic = modeName === 'stochasticGradientDescent';
    const expectedArgs = stochastic ? 5 : 4;
    if (values.length !== expectedArgs) {
        throw new Error(stochastic
            ? 'Use stochasticGradientDescent(sampleGradients, initialPoint, learningRate, iterations, batchSize).'
            : 'Use gradientDescent(gradientExpressions, initialPoint, learningRate, iterations).');
    }

    const [gradientInput, initialPoint, learningRate, iterations, batchSize] = values;
    assertFiniteArray(initialPoint, 'Initial point');
    if (typeof learningRate !== 'number' || !Number.isFinite(learningRate) || learningRate <= 0) {
        throw new Error('Learning rate must be a finite positive number.');
    }
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > 1000) {
        throw new Error('Iterations must be an integer from 1 to 1000.');
    }

    const gradientSamples = stochastic ? gradientInput : [gradientInput];
    if (!Array.isArray(gradientSamples) || gradientSamples.length === 0) {
        throw new Error('Provide at least one sample gradient expression.');
    }
    const expressions = gradientSamples.map(sample =>
        resolveGradientExpressions(sample, initialPoint.length)
    );
    if (stochastic && (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 500)) {
        throw new Error('Batch size must be an integer from 1 to 500.');
    }

    const sampleGradient = () => {
        const selected = stochastic
            ? expressions[Math.floor(Math.random() * expressions.length)]
            : expressions[0];
        return evaluateGradient(selected, currentPoint, mathInstance);
    };

    let currentPoint = initialPoint.slice();
    const history = [];
    for (let iteration = 0; iteration < iterations; iteration++) {
        if (stochastic) {
            const result = stochasticGradientDescent(sampleGradient, currentPoint, learningRate, 1, batchSize);
            currentPoint = result.point;
            history.push(result.history[0]);
        } else {
            const gradient = evaluateGradient(expressions[0], currentPoint, mathInstance);
            currentPoint = gradientDescent(() => gradient, currentPoint, learningRate, 1);
            history.push({ iteration: iteration + 1, point: currentPoint.slice(), gradient });
        }
    }

    const displayedIterations = history.length <= 6
        ? history
        : [...history.slice(0, 3), history[history.length - 1]];
    const steps = displayedIterations.map(({ iteration, point, gradient }) =>
        `Step ${iteration}: gradient = ${formatMLValue(gradient)}; update parameters to ${formatMLValue(point)}.`
    );
    if (displayedIterations.length < history.length) {
        steps.splice(3, 0, `... ${history.length - 4} intermediate updates omitted ...`);
    }
    return [
        `Machine learning — ${modeName}`,
        `Step 1: Start at parameters ${formatMLValue(initialPoint)} with learning rate ${formatMLValue(learningRate)}.`,
        `Step 2: ${stochastic
            ? `Sample ${formatMLValue(batchSize)} gradient${batchSize === 1 ? '' : 's'} per update from ${expressions.length} training-gradient expression(s).`
            : `Evaluate the gradient expression(s) ${formatMLValue(expressions[0])}.`}`,
        ...steps,
        `Result: parameters = ${formatMLValue(currentPoint)} after ${iterations} iteration(s).`
    ].join('\n');
}

export function solveMachineLearning(mode, values, mathInstance) {
    const canonicalName = Object.keys(machineLearningFunctions)
        .find(name => name.toLowerCase() === mode.toLowerCase());
    if (!canonicalName) throw new Error(`Unknown machine-learning formula: ${mode}.`);
    const modeName = canonicalName.toLowerCase();
    if (modeName === 'gradientdescent' || modeName === 'stochasticgradientdescent') {
        return solveDescent(canonicalName, values, mathInstance);
    }

    let result;
    let formula;
    let interpretation;
    const requireArgs = count => {
        if (values.length !== count) throw new Error(`Use ${canonicalName} with ${count} argument(s).`);
    };
    const requireEqualArrays = (left, right, leftName, rightName) => {
        assertFiniteArray(left, leftName);
        assertFiniteArray(right, rightName);
        if (left.length !== right.length) throw new Error(`${leftName} and ${rightName} must have the same length.`);
    };

    if (modeName === 'euclideandistance' || modeName === 'manhattandistance' || modeName === 'minkowskidistance') {
        requireArgs(modeName === 'minkowskidistance' ? 3 : 2);
        const [left, right, p] = values;
        assertFiniteArray(left, 'First point');
        assertFiniteArray(right, 'Second point');
        if (left.length !== right.length) throw new Error('Points must have the same dimension.');
        result = machineLearningFunctions[canonicalName](...values);
        formula = modeName === 'euclideandistance'
            ? 'd₂ = √Σ(aᵢ − bᵢ)²'
            : modeName === 'manhattandistance'
                ? 'd₁ = Σ|aᵢ − bᵢ|'
                : 'dₚ = (Σ|aᵢ − bᵢ|ᵖ)^(1/p)';
        interpretation = `Coordinate differences: ${formatMLValue(left.map((value, index) => value - right[index]))}.`;
    } else if (modeName === 'linearregression') {
        requireArgs(2);
        const [features, targets] = values;
        assertFeatureMatrix(features, targets);
        result = linearRegression(features, targets);
        formula = 'β = (XᵀX)⁻¹Xᵀy, with an intercept column in X';
        interpretation = `Model: ŷ = ${formatMLValue(result[0])}${result.slice(1).map((coefficient, index) =>
            ` + (${formatMLValue(coefficient)})x${index + 1}`
        ).join('')}.`;
    } else if (['residualsumsquares', 'absoluteloss', 'logloss', 'crossentropyloss', 'hingeloss', 'huberloss'].includes(modeName)) {
        requireArgs(modeName === 'huberloss' ? 4 : 3);
        const [features, targets, coefficients, delta] = values;
        assertFeatureMatrix(features, targets);
        assertFiniteArray(coefficients, 'Coefficients');
        if (coefficients.length !== features[0].length) {
            throw new Error('Provide one coefficient per feature column (include an intercept column in the features if needed).');
        }
        if (modeName === 'huberloss' && (typeof delta !== 'number' || !Number.isFinite(delta) || delta <= 0)) {
            throw new Error('Huber delta must be a finite positive number.');
        }
        if (['logloss', 'crossentropyloss'].includes(modeName) &&
            targets.some(target => target !== 0 && target !== 1)) {
            throw new Error('Log-loss targets must be 0 or 1.');
        }
        if (modeName === 'hingeloss' && targets.some(target => target !== -1 && target !== 1)) {
            throw new Error('Hinge-loss targets must be -1 or 1.');
        }
        result = machineLearningFunctions[canonicalName](...values);
        const prediction = features.map(row => row.reduce((sum, item, index) => sum + item * coefficients[index], 0));
        interpretation = `Predictions: ${formatMLValue(prediction)}; residuals: ${formatMLValue(targets.map((target, index) => target - prediction[index]))}.`;
        formula = {
            residualsumsquares: 'RSS = Σ(yᵢ − ŷᵢ)²',
            absoluteloss: 'L₁ loss = Σ|yᵢ − ŷᵢ|',
            logloss: 'Log loss = −Σ[yᵢ ln(pᵢ) + (1−yᵢ)ln(1−pᵢ)]',
            crossentropyloss: 'Binary cross-entropy = −Σ[yᵢ ln(pᵢ) + (1−yᵢ)ln(1−pᵢ)]',
            hingeloss: 'Hinge loss = Σ max(0, 1 − yᵢŷᵢ)',
            huberloss: 'Huber loss uses ½e² when |e| ≤ δ, otherwise δ(|e| − ½δ)'
        }[modeName];
    } else if (['accuracy', 'precision', 'recall', 'f1score', 'accuracyexpected', 'cohenkappa', 'classificationerror'].includes(modeName)) {
        const expectedArgs = modeName === 'accuracyexpected' ? 3 : 2;
        requireArgs(expectedArgs);
        const [actual, predicted, weights] = values;
        requireEqualArrays(actual, predicted, 'Actual labels', 'Predicted labels');
        if (modeName === 'accuracyexpected') {
            assertFiniteArray(weights, 'Weights');
            if (weights.length !== actual.length || weights.some(weight => weight < 0) || weights.reduce((sum, weight) => sum + weight, 0) === 0) {
                throw new Error('Weights must be non-negative, match the labels, and have a positive sum.');
            }
        }
        result = machineLearningFunctions[canonicalName](...values);
        formula = {
            accuracy: 'Accuracy = correct predictions / all predictions',
            precision: 'Precision = TP / (TP + FP)',
            recall: 'Recall = TP / (TP + FN)',
            f1score: 'F₁ = 2 · precision · recall / (precision + recall)',
            accuracyexpected: 'Weighted accuracy = Σ(weightᵢ · correctᵢ) / Σweightᵢ',
            cohenkappa: 'κ = (observed agreement − expected agreement) / (1 − expected agreement)',
            classificationerror: 'Classification error = incorrect predictions / all predictions'
        }[modeName];
        interpretation = `Correct predictions: ${actual.filter((label, index) => label === predicted[index]).length} of ${actual.length}.`;
    } else if (['meanabsoluteerror', 'meansquarederror', 'rootmeansquarederror', 'rsquared'].includes(modeName)) {
        requireArgs(2);
        const [actual, predicted] = values;
        requireEqualArrays(actual, predicted, 'Actual values', 'Predicted values');
        result = machineLearningFunctions[canonicalName](...values);
        formula = {
            meanabsoluteerror: 'MAE = Σ|yᵢ − ŷᵢ| / n',
            meansquarederror: 'MSE = Σ(yᵢ − ŷᵢ)² / n',
            rootmeansquarederror: 'RMSE = √MSE',
            rsquared: 'R² = 1 − Σ(yᵢ − ŷᵢ)² / Σ(yᵢ − ȳ)²'
        }[modeName];
        interpretation = `Actual values: ${formatMLValue(actual)}; predictions: ${formatMLValue(predicted)}.`;
    } else if (modeName === 'discriminantweighted') {
        requireArgs(3);
        const [features, labels, weights] = values;
        if (!Array.isArray(labels) || !Array.isArray(weights) || labels.length !== features.length || weights.length !== features.length) {
            throw new Error('Features, labels, and weights must have the same number of rows.');
        }
        result = discriminantWeighted(features, labels, weights);
        formula = 'Weighted mean = Σ(weightᵢ · valueᵢ) / Σweightᵢ';
        interpretation = `Weighted feature mean: ${formatMLValue(result.meanX)}; weighted label mean: ${formatMLValue(result.meanYWeighted)}.`;
    } else if (modeName === 'minmaxscaling') {
        requireArgs(1);
        const features = values[0];
        if (!Array.isArray(features) || features.length === 0 || !features.every(row => Array.isArray(row) && row.length > 0 && row.every(Number.isFinite))) {
            throw new Error('Features must be a non-empty matrix of finite numbers.');
        }
        result = minmaxscaling(features);
        formula = 'x′ = (x − min) / (max − min), computed independently for each feature';
        interpretation = `Scaled data: ${formatMLValue(result)}. Constant-valued columns map to 0.`;
    } else if (modeName === 'gainratio' || modeName === 'splitinformation') {
        requireArgs(modeName === 'gainratio' ? 2 : 1);
        const [features, labels] = values;
        if (modeName === 'gainratio') {
            if (!Array.isArray(labels)) throw new Error('Labels must be an array.');
            result = gainRatio(features, labels);
            formula = 'Gain ratio = information gain / split information';
        } else {
            result = splitInformation(features);
            formula = 'Split information = −Σpᵢlog₂(pᵢ) for each feature';
        }
        interpretation = Array.isArray(result)
            ? `Scores by feature: ${formatMLValue(result)}.`
            : `Score: ${formatMLValue(result)}.`;
    } else if (['giniCoefficient', 'entropy', 'giniCoefficient'.toLowerCase()].includes(canonicalName)) {
        requireArgs(1);
        const data = values[0];
        if (!Array.isArray(data) || data.length === 0) throw new Error('Values must be a non-empty array.');
        result = machineLearningFunctions[canonicalName](data);
        formula = modeName === 'entropy'
            ? 'Entropy = −Σpᵢlog₂(pᵢ)'
            : 'Gini coefficient = (2Σi·xᵢ)/(nΣxᵢ) − (n+1)/n for sorted non-negative values';
        interpretation = `Input values: ${formatMLValue(data)}.`;
    } else {
        throw new Error(`${canonicalName} is not available in the calculator yet.`);
    }

    return [
        `Machine learning — ${canonicalName}`,
        `Step 1: Identify the inputs: ${formatMLInput(values)}.`,
        `Step 2: Apply the formula: ${formula}.`,
        `Step 3: ${interpretation}`,
        `Result: ${formatMLValue(result)}`
    ].join('\n');
}

export {
    euclideanDistance,
    manhattanDistance,
    minkowskiDistance,
    gradientDescent,
    stochasticGradientDescent,
    discriminantWeighted,
    linearRegression,
    residualSumOfSquares,
    absoluteLoss,
    logLoss,
    crossEntropyLoss,
    hingeLoss,
    accuracy,
    precision,
    recall,
    f1Score,
    accuracyExpected,
    cohenKappa,
    meanAbsoluteError,
    meanSquaredError,
    rootMeanSquaredError,
    rSquared,
    huberLoss,
    minmaxscaling,
    giniCoefficient,
    entropy,
    classificationError,
    gainRatio,
    splitInformation
};