// Configure math.js
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
    // Handle derivative
    if (expr.startsWith("derivative(")) {
      const parts = expr.match(/derivative\((.*),\s*(\w+)\)/);
      if (parts) {
        const res = mathInstance.derivative(parts[1], parts[2]);
        resultEl.textContent = String(res);
        return;
      }
    }

    // Handle integrate
    if (expr.startsWith("integrate(")) {
      const parts = expr.match(/integrate\((.*),\s*(\w+)\)/);
      if (parts) {
        const res = mathInstance.integrate(parts[1], parts[2]);
        resultEl.textContent = String(res);
        return;
      }
    }

    // Handle limit (numeric approximation)
    if (expr.startsWith("limit(")) {
      // Example: limit(sin(x)/x, x, 0)
      const parts = expr.match(/limit\((.*),\s*(\w+),\s*([^)]+)\)/);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const point = parseFloat(parts[3]);

        // Evaluate near the point
        const delta = 1e-6;
        const left = mathInstance.evaluate(fn, { [variable]: point - delta });
        const right = mathInstance.evaluate(fn, { [variable]: point + delta });

        const approx = (left + right) / 2;
        resultEl.textContent = "≈ " + approx;
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
