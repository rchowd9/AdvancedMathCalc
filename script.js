// Configure math.js
const mathConfig = { matrix: 'Array' };
const mathInstance = math.create(mathConfig);

const exprInput = document.getElementById('expr');
const evalBtn = document.getElementById('evalBtn');
const resultEl = document.getElementById('result');

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
    }

    // Handle limit (numeric approximation)
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
        resultEl.textContent = "≈ " + approx;
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
    resultEl.textContent = formatResult(res);

  } catch (err) {
    resultEl.textContent = 'Error: ' + err.message;
  }
});

function formatResult(res) {
  if (Array.isArray(res)) {
    return JSON.stringify(res, null, 2);
  }
  if (typeof res === 'object') {
    return JSON.stringify(res, null, 2);
  }
  return String(res);
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

