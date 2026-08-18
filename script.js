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
    // Special handling for derivative, integrate, limit
    if (expr.startsWith("derivative(")) {
      // Example: derivative(sin(x), x)
      const parts = expr.match(/derivative\((.*),\s*(\w+)\)/);
      if (parts) {
        const res = mathInstance.derivative(parts[1], parts[2]);
        resultEl.textContent = String(res);
        return;
      }
    }
    if (expr.startsWith("integrate(")) {
      const parts = expr.match(/integrate\((.*),\s*(\w+)\)/);
      if (parts) {
        const res = mathInstance.integrate(parts[1], parts[2]);
        resultEl.textContent = String(res);
        return;
      }
    }
    if (expr.startsWith("limit(")) {
      // Example: limit(sin(x)/x, x, 0)
      const parts = expr.match(/limit\((.*),\s*(\w+),\s*([^)]+)\)/);
      if (parts) {
        const res = mathInstance.limit(parts[1], parts[2], parseFloat(parts[3]));
        resultEl.textContent = String(res);
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
