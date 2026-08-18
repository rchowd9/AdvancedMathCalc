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
