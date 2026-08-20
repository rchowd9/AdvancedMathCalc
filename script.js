// Configure math.js
const mathConfig = { matrix: 'Array' };
const mathInstance = math.create(mathConfig);

const STORAGE_KEY = 'math-quest-save';

const state = loadGameState();

const exprInput = document.getElementById('expr');
const evalBtn = document.getElementById('evalBtn');
const clearBtn = document.getElementById('clearBtn');
const resultEl = document.getElementById('result');
const statusBadgeEl = document.getElementById('statusBadge');
const xpValueEl = document.getElementById('xpValue');
const xpLabelEl = document.getElementById('xpLabel');
const streakValueEl = document.getElementById('streakValue');
const levelBadgeEl = document.getElementById('levelBadge');
const levelValueEl = document.getElementById('levelValue');
const missionProgressEl = document.getElementById('missionProgress');
const plotBtn = document.getElementById('plotBtn');
const randomChallengeBtn = document.getElementById('randomChallengeBtn');
const plotExprInput = document.getElementById('plotExpr');
const plotVariableInput = document.getElementById('plotVariable');
const plotMinInput = document.getElementById('plotMin');
const plotMaxInput = document.getElementById('plotMax');
const plotEl = document.getElementById('plot');
const plotStatusEl = document.getElementById('plotStatus');
const achievementItems = [...document.querySelectorAll('.achievement')];
const challengeButtons = [...document.querySelectorAll('.challenge-chip')];

updateGameHud();

plotBtn.addEventListener('click', plotFunction);
randomChallengeBtn.addEventListener('click', loadRandomChallenge);
clearBtn.addEventListener('click', () => {
  exprInput.value = '';
  resultEl.textContent = 'Fresh board. Pick a challenge and go!';
  setStatus('Ready', 'ready');
});

challengeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    exprInput.value = button.dataset.expression;
    exprInput.focus();
    setStatus('Challenge loaded', 'ready');
  });
});

evalBtn.addEventListener('click', () => {
  const expr = exprInput.value.trim();
  if (!expr) {
    resultEl.textContent = 'Please enter an expression.';
    setStatus('Need input', 'warning');
    return;
  }

  try {
    let solvedMessage = '';

    if (expr.startsWith("derivative(")) {
      const parts = expr.match(/derivative\((.*),\s*(\w+)\)/);
      if (parts) {
        solvedMessage = explainDerivative(parts[1], parts[2]);
        const reward = 35;
        awardProgress(reward, 'Derivative win!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("integrate(")) {
      const parts = expr.match(/integrate\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseFloat(parts[3]);
        const upper = parseFloat(parts[4]);
        const steps = 1000;
        const res = numericIntegral(fn, variable, lower, upper, steps);
        solvedMessage = `Function: f(${variable}) = ${fn}\nStep 1: Approximate definite integral from ${lower} to ${upper}\nResult: ≈ ${res}`;
        awardProgress(40, 'Integral unlocked!');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: integrate(expression, variable, lower, upper)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("limit(")) {
      const parts = expr.match(/limit\((.*),\s*(\w+),\s*([^)]+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const point = parseFloat(parts[3]);
        const delta = 1e-6;
        const left = mathInstance.evaluate(fn, { [variable]: point - delta });
        const right = mathInstance.evaluate(fn, { [variable]: point + delta });
        const approx = (left + right) / 2;
        const steps = [
          `Function: f(${variable}) = ${fn}`,
          `Step 1: Approach ${variable} → ${point}`,
          `Step 2: Evaluate f(${point - delta}) = ${left}`,
          `Step 3: Evaluate f(${point + delta}) = ${right}`,
          `Step 4: Average both sides → (${left} + ${right}) / 2`,
          `Result: ≈ ${approx}`
        ];
        solvedMessage = steps.join("\n");
        awardProgress(30, 'Limit mastered!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("det(")) {
      const parts = expr.match(/^det\((.*)\)$/s);
      if (parts) {
        const matrix = mathInstance.evaluate(parts[1]);
        solvedMessage = explainDeterminant(matrix);
        awardProgress(35, 'Matrix genius!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("eigenvalues(")) {
      const parts = expr.match(/eigenvalues\((.*)\)/);
      if (parts) {
        const matrix = mathInstance.evaluate(parts[1]);
        solvedMessage = explainEigenvalues(matrix);
        awardProgress(35, 'Matrix genius!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("inv(")) {
      const parts = expr.match(/^inv\((.*)\)$/s);
      if (parts) {
        const matrix = mathInstance.evaluate(parts[1]);
        solvedMessage = explainInverse(matrix);
        awardProgress(35, 'Matrix genius!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("solveSystem(")) {
      const parts = expr.match(/^solveSystem\(\s*(\[[\s\S]*\])\s*,\s*(\[[\s\S]*\])\s*\)$/);
      if (parts) {
        const A = mathInstance.evaluate(parts[1]);
        const b = mathInstance.evaluate(parts[2]);
        const x = mathInstance.multiply(mathInstance.inv(A), b);
        solvedMessage = `Solution: ${JSON.stringify(x)}`;
        awardProgress(45, 'System solved!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("solveEquation(")) {
      const parts = expr.match(/solveEquation\((.*)=0,\s*(\w+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const coeffs = mathInstance.evaluate(`coefficients(${fn})`);
        if (coeffs.length === 3) {
          const [a, b, c] = coeffs;
          const disc = b * b - 4 * a * c;
          const root1 = (-b + Math.sqrt(disc)) / (2 * a);
          const root2 = (-b - Math.sqrt(disc)) / (2 * a);
          solvedMessage = `Roots: ${root1}, ${root2}`;
          awardProgress(40, 'Equation cracked!');
          resultEl.textContent = solvedMessage;
          return;
        }
        resultEl.textContent = 'Only quadratic equations are supported here.';
        setStatus('Quadratic only', 'warning');
        return;
      }
    }

    if (expr.startsWith("solve(")) {
      const parts = expr.match(/solve\((.*)=([^,]+),\s*(\w+)\)/);
      if (parts) {
        const left = parts[1];
        const right = parts[2];
        const variable = parts[3];
        const fnStr = `(${left}) - (${right})`;
        const root = newtonSolve(fnStr, variable);
        solvedMessage = `Solution: ${root}`;
        awardProgress(40, 'Root found!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("tripleIntegral(")) {
      const parts = expr.match(/tripleIntegral\((.*),\s*x=(\d+)\.\.(\d+),\s*y=(\d+)\.\.(\d+),\s*z=(\d+)\.\.(\d+),\s*steps=(\d+)\)/);
      if (parts) {
        const fnStr = parts[1];
        const xRange = [parseFloat(parts[2]), parseFloat(parts[3])];
        const yRange = [parseFloat(parts[4]), parseFloat(parts[5])];
        const zRange = [parseFloat(parts[6]), parseFloat(parts[7])];
        const steps = parseInt(parts[8], 10);
        const f = (x, y, z) => mathInstance.evaluate(fnStr, { x, y, z });
        const res = tripleIntegral(f, xRange, yRange, zRange, steps);
        solvedMessage = '≈ ' + res;
        awardProgress(50, 'Triple integral mastered!');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    const res = mathInstance.evaluate(expr);
    const explanation = buildExpressionExplanation(expr, res);
    solvedMessage = `Result: ${formatResult(res)}\n\nStep-by-step explanation:\n${explanation}`;
    awardProgress(25, 'Nice work!');
    resultEl.textContent = solvedMessage;

  } catch (err) {
    resultEl.textContent = 'Error: ' + err.message;
    setStatus('Oops', 'warning');
  }
});

function awardProgress(points, statusMessage) {
  state.xp += points;
  state.streak += 1;
  state.completedQuests += 1;

  if (state.completedQuests >= 3) {
    state.xp += 25;
    state.completedQuests = 0;
    state.streak += 1;
  }

  saveGameState();
  updateGameHud();
  setStatus(statusMessage, 'success');
}

function loadRandomChallenge() {
  const options = [
    'derivative(sin(x), x)',
    'integrate(x^2, x, 0, 1)',
    'limit(sin(x)/x, x, 0)',
    'det([[1,2],[3,4]])',
    'eigenvalues([[2,1],[1,2]])',
    'solveEquation(x^2 - 4 = 0, x)'
  ];
  const randomExpression = options[Math.floor(Math.random() * options.length)];
  exprInput.value = randomExpression;
  setStatus('New quest', 'ready');
}

function setStatus(label, tone) {
  statusBadgeEl.textContent = label;
  statusBadgeEl.className = `status-badge ${tone}`;
}

function updateGameHud() {
  const level = Math.floor(state.xp / 100) + 1;
  xpValueEl.textContent = String(state.xp);
  xpLabelEl.textContent = `${state.xp} XP`;
  levelValueEl.textContent = String(level);
  levelBadgeEl.textContent = `Lvl ${level}`;
  streakValueEl.textContent = String(state.streak);
  missionProgressEl.textContent = `${state.completedQuests}/3`;
  renderAchievements();
}

function renderAchievements() {
  const level = Math.floor(state.xp / 100) + 1;
  const earned = {
    Starter: state.xp >= 25,
    'Graph Explorer': state.xp >= 50,
    'Derivative Pro': state.xp >= 100,
    'Math Master': state.xp >= 250 || level >= 3
  };

  achievementItems.forEach((item) => {
    const title = item.querySelector('strong')?.textContent || '';
    item.classList.toggle('earned', Boolean(earned[title]));
  });
}

function loadGameState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      xp: Number(saved.xp) || 0,
      streak: Number(saved.streak) || 1,
      completedQuests: Number(saved.completedQuests) || 0
    };
  } catch (error) {
    return { xp: 0, streak: 1, completedQuests: 0 };
  }
}

function saveGameState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Newton’s method solver
function newtonSolve(fnStr, variable, guess = 1) {
  const f = (x) => mathInstance.evaluate(fnStr, { [variable]: x });
  const df = (x) => mathInstance.derivative(fnStr, variable).evaluate({ [variable]: x });
  let x = guess;
  for (let i = 0; i < 20; i++) {
    x = x - f(x) / df(x);
  }
  return x;
}

// Plotting
function plotFunction() {
  const expression = plotExprInput.value.trim();
  const variable = plotVariableInput.value.trim();
  const lower = Number(plotMinInput.value);
  const upper = Number(plotMaxInput.value);

  if (!expression || !/^\w+$/.test(variable)) {
    clearPlot();
    setPlotStatus('Enter a function and a valid variable name.');
    return;
  }

  if (!Number.isFinite(lower) || !Number.isFinite(upper) || lower >= upper) {
    clearPlot();
    setPlotStatus('The start of the range must be less than its end.');
    return;
  }

  try {
    const compiled = mathInstance.compile(expression);
    const pointCount = 500;
    const step = (upper - lower) / (pointCount - 1);
    const xValues = [];
    const yValues = [];

    for (let index = 0; index < pointCount; index += 1) {
      const x = lower + index * step;
      let y;
      try {
        y = compiled.evaluate({ [variable]: x });
      } catch (error) {
        y = NaN;
      }
      xValues.push(x);
      yValues.push(typeof y === 'number' && Number.isFinite(y) ? y : null);
    }

    if (!yValues.some((value) => value !== null)) {
      throw new Error('No real values were found in this range.');
    }

    Plotly.react(plotEl, [{
      x: xValues,
      y: yValues,
      type: 'scatter',
      mode: 'lines',
      line: { color: '#38bdf8', width: 2 }
    }], {
      margin: { top: 24, right: 24, bottom: 48, left: 56 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: '#020617',
      font: { color: '#cbd5e1' },
      xaxis: { title: variable, gridcolor: '#334155', zerolinecolor: '#64748b' },
      yaxis: { title: expression, gridcolor: '#334155', zerolinecolor: '#64748b' },
      responsive: true
    }, { responsive: true, displaylogo: false });
    setPlotStatus(`Plotted ${expression} over [${lower}, ${upper}].`);
    state.xp += 15;
    saveGameState();
    updateGameHud();
    setStatus('Graph unlocked', 'success');
  } catch (error) {
    clearPlot();
    setPlotStatus(`Unable to plot function: ${error.message}`);
    setStatus('Plot error', 'warning');
  }
}

function clearPlot() {
  if (plotEl && plotEl.data) {
    Plotly.purge(plotEl);
  }
}

function setPlotStatus(message) {
  plotStatusEl.textContent = message;
}

function explainDerivative(expression, variable) {
  const derivative = mathInstance.derivative(expression, variable).toString();
  return `Function: f(${variable}) = ${expression}\nDerivative: f'(${variable}) = ${derivative}`;
}

function explainDeterminant(matrix) {
  const det = mathInstance.det(matrix);
  const matrixText = formatMatrix(matrix);
  const steps = [
    `Matrix A = ${matrixText}`,
    'Step 1: Compute det(A)',
    'Step 2: Use the determinant rule for the matrix size',
    'Step 3: Simplify the product terms'
  ];

  if (Array.isArray(matrix) && matrix.length === 2 && matrix[0].length === 2) {
    const [[a, b], [c, d]] = matrix;
    steps.push(`Formula: det(A) = ad - bc`);
    steps.push(`= (${a} × ${d}) - (${b} × ${c})`);
    steps.push(`= ${a * d} - ${b * c}`);
  }

  steps.push(`Result: det(A) = ${formatResult(det)}`);
  return steps.join('\n');
}

function explainEigenvalues(matrix) {
  const eigen = mathInstance.eigs(matrix);
  const eigenValues = Array.isArray(eigen.values) ? eigen.values : [eigen.values];
  const matrixText = formatMatrix(matrix);
  const stepList = [
    `Matrix A = ${matrixText}`,
    'Step 1: Solve det(A - λI) = 0',
    'Step 2: Find the characteristic equation',
    `Step 3: Solve for λ values`
  ];

  stepList.push(`Eigenvalues: ${formatResult(eigenValues)}`);
  return stepList.join('\n');
}

function explainInverse(matrix) {
  const det = mathInstance.det(matrix);
  const inverse = mathInstance.inv(matrix);
  const matrixText = formatMatrix(matrix);
  const steps = [
    `Matrix A = ${matrixText}`,
    `Step 1: Compute det(A) = ${formatResult(det)}`,
    'Step 2: Check whether det(A) ≠ 0',
    'Step 3: Form the inverse using the matrix inverse rule',
    `A⁻¹ = ${formatMatrix(inverse)}`
  ];

  if (Array.isArray(matrix) && matrix.length === 2 && matrix[0].length === 2) {
    const [[a, b], [c, d]] = matrix;
    steps.splice(2, 0, `For a 2×2 matrix: A⁻¹ = 1/(ad - bc) × [[d, -b], [-c, a]]`);
    steps.push(`= 1/(${a * d - b * c}) × [[${d}, ${-b}], [${-c}, ${a}]]`);
  }

  steps.push(`Result: A⁻¹ = ${formatMatrix(inverse)}`);
  return steps.join('\n');
}

function formatMatrix(matrix) {
  return JSON.stringify(matrix);
}

function numericIntegral(expression, variable, lower, upper, steps) {
  const width = (upper - lower) / steps;
  let total = 0;

  for (let index = 0; index <= steps; index += 1) {
    const x = lower + index * width;
    const value = mathInstance.evaluate(expression, { [variable]: x });
    const weight = index === 0 || index === steps ? 1 : index % 2 === 0 ? 2 : 4;
    total += weight * value;
  }

  return (total * width) / 3;
}

function tripleIntegral(fn, xRange, yRange, zRange, steps) {
  const xStep = (xRange[1] - xRange[0]) / steps;
  const yStep = (yRange[1] - yRange[0]) / steps;
  const zStep = (zRange[1] - zRange[0]) / steps;
  let total = 0;

  for (let xIndex = 0; xIndex < steps; xIndex += 1) {
    for (let yIndex = 0; yIndex < steps; yIndex += 1) {
      for (let zIndex = 0; zIndex < steps; zIndex += 1) {
        total += fn(
          xRange[0] + (xIndex + 0.5) * xStep,
          yRange[0] + (yIndex + 0.5) * yStep,
          zRange[0] + (zIndex + 0.5) * zStep
        );
      }
    }
  }

  return total * xStep * yStep * zStep;
}

function formatResult(value) {
  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (value && typeof value.toString === 'function') {
    return value.toString();
  }
  return String(value);
}

function buildExpressionExplanation(expression, result) {
  return `Evaluate ${expression} using standard mathematical precedence.\nResult: ${formatResult(result)}`;
}