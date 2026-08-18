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
    // Parse the expression as a string to preserve symbols like x
    const res = mathInstance.evaluate(expr, { x: math.symbolicUtils.symbol('x') });
    resultEl.textContent = formatResult(res);
  } catch (err) {
    try {
      // Fallback: wrap the input in quotes if direct evaluation fails
      const res = mathInstance.evaluate(expr.replace(/([a-zA-Z]+)/g, '"$1"'));
      resultEl.textContent = formatResult(res);
    } catch (err2) {
      resultEl.textContent = 'Error: ' + err2.message;
    }
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
