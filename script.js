// Configure math.js
const mathConfig = { matrix: 'Array' };
const mathInstance = math.create(mathConfig);

const exprInput = document.getElementById('expr');
const evalBtn = document.getElementById('evalBtn');
const resultEl = document.getElementById('result');
const plotBtn = document.getElementById('plotBtn');
const plotExprInput = document.getElementById('plotExpr');
const plotVariableInput = document.getElementById('plotVariable');
const plotMinInput = document.getElementById('plotMin');
const plotMaxInput = document.getElementById('plotMax');
const plotEl = document.getElementById('plot');
const plotStatusEl = document.getElementById('plotStatus');

plotBtn.addEventListener('click', plotFunction);

evalBtn.addEventListener('click', () => {
  const expr = exprInput.value.trim();
  if (!expr) {
    resultEl.textContent = 'Please enter an expression.';
    return;
  }

  try {
    // Derivative
    if (expr.startsWith("derivative(")) {
      const parts = expr.match(/derivative\((.*),\s*(\w+)\)/);
      if (parts) {
        resultEl.textContent = explainDerivative(parts[1], parts[2]);
        return;
      }
    }

    // Definite integral
    if (expr.startsWith("integrate(")) {
      const parts = expr.match(/integrate\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseFloat(parts[3]);
        const upper = parseFloat(parts[4]);
        const steps = 1000;
        const res = numericIntegral(fn, variable, lower, upper, steps);
        resultEl.textContent = `Function: f(${variable}) = ${fn}\nStep 1: Approximate definite integral from ${lower} to ${upper}\nResult: ≈ ${res}`;
        return;
      }
      resultEl.textContent = 'Use syntax: integrate(expression, variable, lower, upper)';
      return;
    }

    // Limit
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
        resultEl.textContent = steps.join("\n");
        return;
      }
    }

    // Eigenvalues
    if (expr.startsWith("eigenvalues(")) {
      const parts = expr.match(/eigenvalues\((.*)\)/);
      if (parts) {
        const matrix = mathInstance.evaluate(parts[1]);
        const eig = mathInstance.eigs(matrix);
        resultEl.textContent = formatResult(eig.values || eig);
        return;
      }
    }

    // Linear system solver
    if (expr.startsWith("solveSystem(")) {
      const parts = expr.match(/^solveSystem\(\s*(\[[\s\S]*\])\s*,\s*(\[[\s\S]*\])\s*\)$/);
      if (parts) {
        const A = mathInstance.evaluate(parts[1]);
        const b = mathInstance.evaluate(parts[2]);
        const x = mathInstance.multiply(mathInstance.inv(A), b);
        resultEl.textContent = `Solution: ${JSON.stringify(x)}`;
        return;
      }
    }

    // Quadratic solver
    if (expr.startsWith("solveEquation(")) {
      const parts = expr.match(/solveEquation\((.*)=0,\s*(\w+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const coeffs = mathInstance.evaluate(`coefficients(${fn})`);
        if (coeffs.length === 3) {
          const [a, b, c] = coeffs;
          const disc = b*b - 4*a*c;
          const root1 = (-b + Math.sqrt(disc)) / (2*a);
          const root2 = (-b - Math.sqrt(disc)) / (2*a);
          resultEl.textContent = `Roots: ${root1}, ${root2}`;
          return;
        } else {
          resultEl.textContent = "Only quadratic equations are supported here.";
          return;
        }
      }
    }

    // General solver (Newton’s method)
    if (expr.startsWith("solve(")) {
      const parts = expr.match(/solve\((.*)=([^,]+),\s*(\w+)\)/);
      if (parts) {
        const left = parts[1];
        const right = parts[2];
        const variable = parts[3];
        const fnStr = `(${left}) - (${right})`;
        const root = newtonSolve(fnStr, variable);
        resultEl.textContent = `Solution: ${root}`;
        return;
      }
    }

    // Triple integral
    if (expr.startsWith("tripleIntegral(")) {
      const parts = expr.match(/tripleIntegral\((.*),\s*x=(\d+)\.\.(\d+),\s*y=(\d+)\.\.(\d+),\s*z=(\d+)\.\.(\d+),\s*steps=(\d+)\)/);
      if (parts) {
        const fnStr = parts[1];
        const xRange = [parseFloat(parts[2]), parseFloat(parts[3])];
        const yRange = [parseFloat(parts[4]), parseFloat(parts[5])];
        const zRange = [parseFloat(parts[6]), parseFloat(parts[7])];
        const steps = parseInt(parts[8]);
        const f = (x, y, z) => mathInstance.evaluate(fnStr, { x, y, z });
        const res = tripleIntegral(f, xRange, yRange, zRange, steps);
        resultEl.textContent = "≈ " + res;
        return;
      }
    }

    // Default evaluation
    const res = mathInstance.evaluate(expr);
    const explanation = buildExpressionExplanation(expr, res);
    resultEl.textContent = `Result: ${formatResult(res)}\n\nStep-by-step explanation:\n${explanation}`;

  } catch (err) {
    resultEl.textContent = 'Error: ' + err.message;
  }
});

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
  } catch (error) {
    clearPlot();
    setPlotStatus(`Unable to plot function: ${error.message}`);
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