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
    // Handle derivative with step-by-step explanation
    if (expr.startsWith("derivative(")) {
      const parts = expr.match(/derivative\((.*),\s*(\w+)\)/);
      if (parts) {
        resultEl.textContent = explainDerivative(parts[1], parts[2]);
        return;
      }
    }

    // Handle integrate (numeric definite integral)
    if (expr.startsWith("integrate(")) {
      // Example: integrate(x^2, x, 0, 1)
      const parts = expr.match(/integrate\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseFloat(parts[3]);
        const upper = parseFloat(parts[4]);
        const steps = 1000; // adjust for accuracy

        const res = numericIntegral(fn, variable, lower, upper, steps);
        resultEl.textContent = `Function: f(${variable}) = ${fn}\nStep 1: Approximate definite integral from ${lower} to ${upper}\nResult: ≈ ${res}`;
        return;
      }

      resultEl.textContent = 'Use definite integral syntax: integrate(expression, variable, lower, upper)';
      return;
    }

    // Handle limit (numeric approximation)
    // Handle limit with step-by-step explanation
    // Handle limit with step-by-step explanation
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



    // Handle eigenvalues
    if (expr.startsWith("eigenvalues(")) {
      const parts = expr.match(/eigenvalues\((.*)\)/);
      if (parts) {
        const matrix = mathInstance.evaluate(parts[1]);
        const eig = mathInstance.eigs(matrix);
        resultEl.textContent = formatResult(eig.values || eig);
        return;
      }
    }

    // Handle triple integral
    if (expr.startsWith("tripleIntegral(")) {
      // Example: tripleIntegral(x*y*z, x=0..1, y=0..1, z=0..1, steps=100)
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
      connectgaps: false,
      line: { color: '#60a5fa', width: 3 },
      hovertemplate: `${variable} = %{x:.4g}<br>f(${variable}) = %{y:.4g}<extra></extra>`
    }], {
      title: `f(${variable}) = ${expression}`,
      paper_bgcolor: 'transparent',
      plot_bgcolor: '#020617',
      font: { color: '#e5e7eb' },
      margin: { t: 48, r: 24, b: 52, l: 58 },
      xaxis: { title: variable, gridcolor: '#1f2937', zerolinecolor: '#64748b' },
      yaxis: { title: `f(${variable})`, gridcolor: '#1f2937', zerolinecolor: '#64748b' },
      hovermode: 'x unified',
      showlegend: false
    }, { responsive: true, displaylogo: false });

    setPlotStatus(`Showing ${pointCount} samples from ${lower} to ${upper}.`);
  } catch (error) {
    setPlotStatus(`Unable to plot function: ${error.message}`);
    clearPlot();
  }
}

function clearPlot() {
  Plotly.purge(plotEl);
  plotEl.replaceChildren();
}

function setPlotStatus(message) {
  plotStatusEl.textContent = message;
}

function formatResult(res) {
  if (Array.isArray(res)) {
    return JSON.stringify(res, null, 2);
  }
  if (typeof res === 'object') {
    return JSON.stringify(res, null, 2);
  }
  return String(res);
}

function buildExpressionExplanation(expr, result) {
  const parsed = mathInstance.parse(expr);
  const steps = [`Expression: ${expr}`];

  function walk(node, depth = 1) {
    if (!node) return;

    if (node.type === 'OperatorNode') {
      const left = node.args[0];
      const right = node.args[1];
      walk(left, depth + 1);
      walk(right, depth + 1);
      const value = mathInstance.evaluate(node.toString());
      steps.push(`Step ${steps.length}: Evaluate ${left.toString()} ${node.op} ${right.toString()} = ${formatResult(value)}`);
      return;
    }

    if (node.type === 'FunctionNode') {
      const arg = node.args[0];
      walk(arg, depth + 1);
      const value = mathInstance.evaluate(node.toString());
      steps.push(`Step ${steps.length}: Apply ${node.name}(${arg.toString()}) = ${formatResult(value)}`);
      return;
    }

    if (node.type === 'ConstantNode') {
      steps.push(`Step ${steps.length}: Constant ${node.value}`);
      return;
    }

    if (node.type === 'SymbolNode') {
      steps.push(`Step ${steps.length}: Variable ${node.name}`);
      return;
    }
  }

  walk(parsed);
  steps.push(`Final result: ${formatResult(result)}`);
  return steps.join("\n");
}


// Numeric definite integral (midpoint rule)
function numericIntegral(fnStr, variable, lower, upper, steps) {
  const dx = (upper - lower) / steps;
  let sum = 0;

  for (let i = 0; i < steps; i++) {
    const x = lower + (i + 0.5) * dx;
    const value = mathInstance.evaluate(fnStr, { [variable]: x });
    sum += value * dx;
  }

  return sum;
}

// Triple integral (numeric approximation)
function tripleIntegral(f, xRange, yRange, zRange, steps) {
  let sum = 0;
  const dx = (xRange[1] - xRange[0]) / steps;
  const dy = (yRange[1] - yRange[0]) / steps;
  const dz = (zRange[1] - zRange[0]) / steps;

  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      for (let k = 0; k < steps; k++) {
        const x = xRange[0] + i * dx;
        const y = yRange[0] + j * dy;
        const z = zRange[0] + k * dz;
        sum += f(x, y, z) * dx * dy * dz;
      }
    }
  }
  return sum;
}

// Step-by-step derivative explanation
function explainDerivative(expr, variable) {
  let steps = [`Function: f(${variable}) = ${expr}`];
  const derivative = mathInstance.derivative(expr, variable);
  steps.push(`Step 1: Differentiate with respect to ${variable}`);
  steps.push(`Result: f'(${variable}) = ${derivative}`);
  return steps.join("\n");
}

