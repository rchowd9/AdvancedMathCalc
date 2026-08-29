// Configure math.js
const mathConfig = { matrix: 'Array' };
const mathInstance = math.create(mathConfig);
mathInstance.import({
  arcsin: (value) => mathInstance.asin(value),
  arccos: (value) => mathInstance.acos(value),
  arctan: (value) => mathInstance.atan(value)
});

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
const plotExpr2Input = document.getElementById('plotExpr2');
const plotVariableInput = document.getElementById('plotVariable');
const plotMinInput = document.getElementById('plotMin');
const plotMaxInput = document.getElementById('plotMax');
const showDerivativeToggle = document.getElementById('showDerivativeToggle');
const showGridToggle = document.getElementById('showGridToggle');
const clearPlotBtn = document.getElementById('clearPlotBtn');
const plotEl = document.getElementById('plot');
const plotStatusEl = document.getElementById('plotStatus');
const achievementItems = [...document.querySelectorAll('.achievement')];
const challengeButtons = [...document.querySelectorAll('.challenge-chip')];

updateGameHud();

plotBtn.addEventListener('click', plotFunction);
clearPlotBtn.addEventListener('click', () => {
  clearPlot();
  setPlotStatus('Graph cleared.');
});
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

    if (expr.startsWith('proof(') || expr.startsWith('prove(')) {
      solvedMessage = solveProof(expr);
      awardProgress(40, 'Proof verified!', 'proofs');
      resultEl.textContent = solvedMessage;
      return;
    }

    if (/^(directProof|proofByInduction|induction|contrapositive|proofByContradiction|contradiction)\(/i.test(expr)) {
      solvedMessage = solveProofMode(expr);
      awardProgress(45, 'Proof method applied!', 'proofs');
      resultEl.textContent = solvedMessage;
      return;
    }

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

    if (expr.startsWith("doubleIntegral(")) {
      const parts = expr.match(/^doubleIntegral\((.*),\s*x=(.+?)\.\.(.+?),\s*y=(.+?)\.\.(.+?),\s*steps=(\d+)\)$/s);
      if (parts) {
        const fn = parts[1].trim();
        const xLower = parseFloat(parts[2]);
        const xUpper = parseFloat(parts[3]);
        const yLower = parseFloat(parts[4]);
        const yUpper = parseFloat(parts[5]);
        const steps = parseInt(parts[6], 10);
        const result = numericDoubleIntegral(fn, 'x', xLower, xUpper, 'y', yLower, yUpper, steps);
        solvedMessage = `Double integral: ∬ f(x,y) dA over x ∈ [${xLower}, ${xUpper}] and y ∈ [${yLower}, ${yUpper}]\nFunction: f(x,y) = ${fn}\nResult: ≈ ${formatResult(result)}`;
        awardProgress(50, 'Double integral solved!');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: doubleIntegral(expression, x=lower..upper, y=lower..upper, steps=n)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("stokesTheorem(")) {
      const parts = expr.match(/^stokesTheorem\(\s*(\[[\s\S]*?\])\s*,\s*(\[[\s\S]*?\])\s*,\s*(\w+)\s*,\s*(\w+)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*(?:,\s*steps=(\d+))?\s*\)$/s);
      if (parts) {
        const field = parseVectorExpressions(parts[1]);
        const normal = mathInstance.evaluate(parts[2]);
        const xVar = parts[3];
        const yVar = parts[4];
        const xLower = parseFloat(parts[5]);
        const xUpper = parseFloat(parts[6]);
        const yLower = parseFloat(parts[7]);
        const yUpper = parseFloat(parts[8]);
        const steps = parseInt(parts[9] || '40', 10);
        const result = stokesSurfaceIntegral(field, normal, xVar, yVar, xLower, xUpper, yLower, yUpper, steps);
        solvedMessage = `Stokes' theorem: ∮ F·dr = ∬ (curl F)·n dS\nField F = ${formatResult(field)}\nNormal n = ${formatResult(normal)}\nRegion: ${xVar} ∈ [${xLower}, ${xUpper}], ${yVar} ∈ [${yLower}, ${yUpper}]\nResult: ≈ ${formatResult(result)}`;
        awardProgress(60, 'Stokes theorem unlocked!');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: stokesTheorem([P, Q, R], [nx, ny, nz], x, y, xMin, xMax, yMin, yMax, steps=40)';
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

    if (expr.startsWith("findRoots(")) {
  // Syntax: findRoots(f(x), x, lower, upper)
  const parts = expr.match(/findRoots\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)/);
  if (parts) {
    const fnStr = parts[1];
    const variable = parts[2];
    const lower = parseFloat(parts[3]);
    const upper = parseFloat(parts[4]);
    const roots = findRootsInInterval(fnStr, variable, lower, upper);
    const solvedMessage = `Roots in [${lower}, ${upper}]: ${formatResult(roots)}`;
    awardProgress(45, 'Multiple roots found!');
    resultEl.textContent = solvedMessage;
    return;
  }
}

if (expr.startsWith("solveSystemNL(")) {
  // Syntax: solveSystemNL([eq1, eq2, ...], [x, y, ...], [x0, y0, ...])
  const parts = expr.match(/^solveSystemNL\(\s*(\[[\s\S]*\])\s*,\s*(\[[\s\S]*\])\s*,\s*(\[[\s\S]*\])\s*\)$/);
  if (parts) {
    const equations = mathInstance.evaluate(parts[1]);   // array of strings
    const variables = mathInstance.evaluate(parts[2]);   // array of variable names
    const initialGuess = mathInstance.evaluate(parts[3]); // array of numbers

    const solution = solveNonlinearSystem(equations, variables, initialGuess);
    const solvedMessage = `Nonlinear system solution:\n${variables.map((v, i) => `${v} ≈ ${solution[i]}`).join('\n')}`;
    awardProgress(55, 'Nonlinear system solved!');
    resultEl.textContent = solvedMessage;
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

    if (expr.startsWith("washerVolume(")) {
      const parts = expr.match(/^washerVolume\((.*),\s*(.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)$/s);
      if (parts) {
        const outer = parts[1];
        const inner = parts[2];
        const variable = parts[3];
        const lower = parseFloat(parts[4]);
        const upper = parseFloat(parts[5]);
        solvedMessage = explainWasherVolume(outer, inner, variable, lower, upper);
        awardProgress(45, 'Washer method solved!', 'geometry');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: washerVolume(outer, inner, variable, lower, upper)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("volumeOfRevolution(")) {
      const parts = expr.match(/^volumeOfRevolution\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)$/s);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseFloat(parts[3]);
        const upper = parseFloat(parts[4]);
        solvedMessage = explainVolumeOfRevolution(fn, variable, lower, upper);
        awardProgress(45, 'Volume of revolution solved!', 'geometry');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: volumeOfRevolution(expression, variable, lower, upper)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("surfaceOfRevolution(")) {
      const parts = expr.match(/^surfaceOfRevolution\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)$/s);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseFloat(parts[3]);
        const upper = parseFloat(parts[4]);
        solvedMessage = explainSurfaceOfRevolution(fn, variable, lower, upper);
        awardProgress(50, 'Surface of revolution solved!', 'geometry');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: surfaceOfRevolution(expression, variable, lower, upper)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("arcLength(")) {
      const parts = expr.match(/^arcLength\((.*),\s*(\w+),\s*([-\d.]+),\s*([-\d.]+)\)$/s);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseFloat(parts[3]);
        const upper = parseFloat(parts[4]);
        solvedMessage = explainArcLength(fn, variable, lower, upper);
        awardProgress(40, 'Boundary length found!', 'geometry');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: arcLength(expression, variable, lower, upper)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("partial(")) {
      const parts = expr.match(/^partial\((.*),\s*(\w+)\)$/s);
      if (parts) {
        solvedMessage = explainPartialDerivative(parts[1], parts[2]);
        awardProgress(35, 'Partial derivative unlocked!', 'calculus2');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("gradient(")) {
      const parts = expr.match(/^gradient\((.+),\s*(\[[^\]]*\])\)$/s);
      if (parts) {
        const variables = parts[2].replace(/[[\]]/g, '').split(',').map((v) => v.trim());
        solvedMessage = explainGradient(parts[1], variables);
        awardProgress(45, 'Gradient calculated!', 'calculus2');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("taylor(")) {
      const parts = expr.match(/^taylor\((.*),\s*(\w+),\s*([-\d.]+),\s*(\d+)\)$/s);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const point = parseFloat(parts[3]);
        const order = parseInt(parts[4], 10);
        solvedMessage = explainTaylorSeries(fn, variable, point, order);
        awardProgress(50, 'Taylor series unlocked!', 'calculus2');
        resultEl.textContent = solvedMessage;
        return;
      }
      resultEl.textContent = 'Use syntax: taylor(expression, variable, point, order)';
      setStatus('Syntax check', 'warning');
      return;
    }

    if (expr.startsWith("simplify(")) {
      const parts = expr.match(/^simplify\((.*)\)$/s);
      if (parts) {
        solvedMessage = explainSimplify(parts[1]);
        awardProgress(30, 'Simplified!', 'algebra');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("sum(")) {
      const parts = expr.match(/^sum\((.*),\s*(\w+),\s*(-?\d+),\s*(-?\d+)\)$/s);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseInt(parts[3], 10);
        const upper = parseInt(parts[4], 10);
        solvedMessage = explainSeries(fn, variable, lower, upper, 'sum');
        awardProgress(35, 'Summation solved!', 'sequences');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("product(")) {
      const parts = expr.match(/^product\((.*),\s*(\w+),\s*(-?\d+),\s*(-?\d+)\)$/s);
      if (parts) {
        const fn = parts[1];
        const variable = parts[2];
        const lower = parseInt(parts[3], 10);
        const upper = parseInt(parts[4], 10);
        solvedMessage = explainSeries(fn, variable, lower, upper, 'product');
        awardProgress(35, 'Product solved!', 'sequences');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("stats(")) {
      const parts = expr.match(/^stats\((\[[\s\S]*\])\)$/);
      if (parts) {
        const data = mathInstance.evaluate(parts[1]);
        solvedMessage = explainStats(data);
        awardProgress(40, 'Data analyzed!', 'statistics');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("factorial(")) {
      const parts = expr.match(/^factorial\((\d+)\)$/);
      if (parts) {
        solvedMessage = explainFactorial(parseInt(parts[1], 10));
        awardProgress(20, 'Factorial found!', 'combinatorics');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("permutations(")) {
      const parts = expr.match(/^permutations\((\d+),\s*(\d+)\)$/);
      if (parts) {
        solvedMessage = explainPermutations(parseInt(parts[1], 10), parseInt(parts[2], 10));
        awardProgress(30, 'Permutations counted!', 'combinatorics');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("combinations(")) {
      const parts = expr.match(/^combinations\((\d+),\s*(\d+)\)$/);
      if (parts) {
        solvedMessage = explainCombinations(parseInt(parts[1], 10), parseInt(parts[2], 10));
        awardProgress(30, 'Combinations counted!', 'combinatorics');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("primeFactors(")) {
      const parts = expr.match(/^primeFactors\((\d+)\)$/);
      if (parts) {
        solvedMessage = explainPrimeFactors(parseInt(parts[1], 10));
        awardProgress(25, 'Factored into primes!', 'numbertheory');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("gcd(")) {
      const parts = expr.match(/^gcd\((-?\d+),\s*(-?\d+)\)$/);
      if (parts) {
        solvedMessage = explainGcdLcm(parseInt(parts[1], 10), parseInt(parts[2], 10), 'gcd');
        awardProgress(20, 'GCD found!', 'numbertheory');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("lcm(")) {
      const parts = expr.match(/^lcm\((-?\d+),\s*(-?\d+)\)$/);
      if (parts) {
        solvedMessage = explainGcdLcm(parseInt(parts[1], 10), parseInt(parts[2], 10), 'lcm');
        awardProgress(20, 'LCM found!', 'numbertheory');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("dot(")) {
      const parts = expr.match(/^dot\((\[[^\]]*\]),\s*(\[[^\]]*\])\)$/);
      if (parts) {
        const v1 = mathInstance.evaluate(parts[1]);
        const v2 = mathInstance.evaluate(parts[2]);
        solvedMessage = explainVectorOp(v1, v2, 'dot');
        awardProgress(30, 'Dot product mastered!', 'vectors');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("cross(")) {
      const parts = expr.match(/^cross\((\[[^\]]*\]),\s*(\[[^\]]*\])\)$/);
      if (parts) {
        const v1 = mathInstance.evaluate(parts[1]);
        const v2 = mathInstance.evaluate(parts[2]);
        solvedMessage = explainVectorOp(v1, v2, 'cross');
        awardProgress(35, 'Cross product mastered!', 'vectors');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("magnitude(")) {
      const parts = expr.match(/^magnitude\((\[[^\]]*\])\)$/);
      if (parts) {
        const v = mathInstance.evaluate(parts[1]);
        solvedMessage = explainMagnitude(v);
        awardProgress(25, 'Magnitude measured!', 'vectors');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    if (expr.startsWith("convert(")) {
      const parts = expr.match(/^convert\((.*),\s*([a-zA-Z°]+)\)$/);
      if (parts) {
        solvedMessage = explainConversion(parts[1].trim(), parts[2].trim());
        awardProgress(20, 'Units converted!', 'units');
        resultEl.textContent = solvedMessage;
        return;
      }
    }

    const res = mathInstance.evaluate(expr);
    const explanation = buildExpressionExplanation(expr, res);
    solvedMessage = `Result: ${formatResult(res)}\n\nStep-by-step explanation:\n${explanation}`;
    awardProgress(25, 'Nice work!', 'arithmetic');
    resultEl.textContent = solvedMessage;

  } catch (err) {
    resultEl.textContent = 'Error: ' + err.message;
    setStatus('Oops', 'warning');
  }
});

function awardProgress(points, statusMessage, category = 'general') {
  state.xp += points;
  state.streak += 1;
  state.completedQuests += 1;
  state.categoriesUsed[category] = true;

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
    'solveEquation(x^2 - 4 = 0, x)',
    'partial(x^2*y + y^3, x)',
    'gradient(x^2*y + y^3, [x, y])',
    'taylor(sin(x), x, 0, 4)',
    'simplify((x+1)^2 - (x^2+2x+1))',
    'sum(i^2, i, 1, 10)',
    'product(i, i, 1, 6)',
    'stats([4, 8, 15, 16, 23, 42])',
    'permutations(6, 3)',
    'combinations(6, 3)',
    'primeFactors(360)',
    'gcd(48, 18)',
    'lcm(4, 6)',
    'dot([1,2,3], [4,5,6])',
    'cross([1,0,0], [0,1,0])',
    'magnitude([3,4])',
    'convert(5 km, mi)',
    'volumeOfRevolution(x^2, x, 0, 2)',
    'washerVolume(x + 2, x, x, 0, 2)',
    'surfaceOfRevolution(x^2, x, 0, 2)',
    'arcLength(x^2, x, 0, 2)'
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
  const categoryCount = Object.keys(state.categoriesUsed).length;
  const earned = {
    Starter: state.xp >= 25,
    'Graph Explorer': state.xp >= 50,
    'Derivative Pro': state.xp >= 100,
    'Math Master': state.xp >= 250 || level >= 3,
    'Renaissance Solver': categoryCount >= 6
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
      completedQuests: Number(saved.completedQuests) || 0,
      categoriesUsed: (saved.categoriesUsed && typeof saved.categoriesUsed === 'object')
        ? saved.categoriesUsed
        : {}
    };
  } catch (error) {
    return { xp: 0, streak: 1, completedQuests: 0, categoriesUsed: {} };
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
  const secondExpression = plotExpr2Input.value.trim();
  const variable = plotVariableInput.value.trim();
  const lower = Number(plotMinInput.value);
  const upper = Number(plotMaxInput.value);
  const showDerivative = showDerivativeToggle.checked;
  const showGrid = showGridToggle.checked;

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
    const traces = [];
    const pointCount = 500;
    const step = (upper - lower) / (pointCount - 1);

    function buildTrace(fnText, color, lineDash = 'solid', name = fnText) {
      const compiled = mathInstance.compile(fnText);
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

      const validPoints = yValues.some((value) => value !== null);
      if (!validPoints) {
        throw new Error(`No real values were found for ${fnText} in this range.`);
      }

      return {
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines',
        name,
        line: { color, width: 2.5, dash: lineDash }
      };
    }

    traces.push(buildTrace(expression, '#38bdf8', 'solid', expression));

    if (secondExpression) {
      traces.push(buildTrace(secondExpression, '#a78bfa', 'solid', secondExpression));
    }

    if (showDerivative) {
      try {
        const derivativeExpr = mathInstance.derivative(expression, variable).toString();
        traces.push(buildTrace(derivativeExpr, '#fbbf24', 'dash', `d/d${variable} (${expression})`));
      } catch (error) {
        setPlotStatus(`Derivative overlay skipped: ${error.message}`);
      }
    }

    Plotly.react(plotEl, traces, {
      margin: { top: 24, right: 24, bottom: 48, left: 56 },
      paper_bgcolor: 'transparent',
      plot_bgcolor: '#020617',
      font: { color: '#cbd5e1' },
      xaxis: {
        title: variable,
        gridcolor: showGrid ? '#334155' : 'rgba(148, 163, 184, 0.15)',
        zerolinecolor: '#64748b',
        showgrid: showGrid
      },
      yaxis: {
        title: 'y',
        gridcolor: showGrid ? '#334155' : 'rgba(148, 163, 184, 0.15)',
        zerolinecolor: '#64748b',
        showgrid: showGrid
      },
      legend: { orientation: 'h', y: 1.2 },
      responsive: true
    }, { responsive: true, displaylogo: false });

    const plotted = secondExpression ? `${expression} and ${secondExpression}` : expression;
    setPlotStatus(`Plotted ${plotted} over [${lower}, ${upper}]${showDerivative ? ' with derivative overlay' : ''}.`);
    state.xp += 20;
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

function numericDoubleIntegral(expression, xVar, xLower, xUpper, yVar, yLower, yUpper, steps) {
  const xStep = (xUpper - xLower) / steps;
  const yStep = (yUpper - yLower) / steps;
  let total = 0;

  for (let xIndex = 0; xIndex < steps; xIndex += 1) {
    const x = xLower + (xIndex + 0.5) * xStep;
    for (let yIndex = 0; yIndex < steps; yIndex += 1) {
      const y = yLower + (yIndex + 0.5) * yStep;
      total += mathInstance.evaluate(expression, { [xVar]: x, [yVar]: y });
    }
  }

  return total * xStep * yStep;
}

function parseVectorExpressions(vectorText) {
  const node = mathInstance.parse(vectorText);
  return node.items.map((item) => item.toString());
}

function stokesSurfaceIntegral(field, normal, xVar, yVar, xLower, xUpper, yLower, yUpper, steps) {
  const [P, Q, R] = field;
  const [nx, ny, nz] = normal;
  const xStep = (xUpper - xLower) / steps;
  const yStep = (yUpper - yLower) / steps;
  let total = 0;

  for (let xIndex = 0; xIndex < steps; xIndex += 1) {
    const x = xLower + (xIndex + 0.5) * xStep;
    for (let yIndex = 0; yIndex < steps; yIndex += 1) {
      const y = yLower + (yIndex + 0.5) * yStep;
      const scope = { [xVar]: x, [yVar]: y, x, y, z: 0 };
      const dRdx = mathInstance.derivative(R, xVar).evaluate(scope);
      const dRdy = mathInstance.derivative(R, yVar).evaluate(scope);
      const dQdx = mathInstance.derivative(Q, xVar).evaluate(scope);
      const dQdy = mathInstance.derivative(Q, yVar).evaluate(scope);
      const dPdx = mathInstance.derivative(P, xVar).evaluate(scope);
      const dPdy = mathInstance.derivative(P, yVar).evaluate(scope);
      const curlX = dRdy - mathInstance.derivative(Q, 'z').evaluate({ ...scope, z: 0 });
      const curlY = mathInstance.derivative(P, 'z').evaluate({ ...scope, z: 0 }) - dRdx;
      const curlZ = dQdx - dPdy;
      const flux = curlX * nx + curlY * ny + curlZ * nz;
      total += flux;
    }
  }

  return total * xStep * yStep;
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

function findRootsInInterval(fnStr, variable, lower, upper, samples = 200) {
  const f = (x) => mathInstance.evaluate(fnStr, { [variable]: x });
  const roots = [];
  const step = (upper - lower) / samples;
  let prevX = lower;
  let prevY = f(prevX);

  for (let i = 1; i <= samples; i++) {
    const x = lower + i * step;
    const y = f(x);

    if (prevY === 0) {
      roots.push(prevX);
    } else if (y === 0) {
      roots.push(x);
    } else if (prevY * y < 0) {
      const mid = (prevX + x) / 2;
      const root = newtonSolve(fnStr, variable, mid);
      if (!Number.isNaN(root)) {
        if (!roots.some((r) => Math.abs(r - root) < 1e-4)) {
          roots.push(root);
        }
      }
    }

    prevX = x;
    prevY = y;
  }

  return roots;
}

function solveNonlinearSystem(equations, variables, initialGuess) {
  const maxIter = 20;
  const eps = 1e-6;
  let x = [...initialGuess];

  const F = (vec) => equations.map((eq) => {
    const [left, right] = eq.split('=');
    const fnStr = `(${left}) - (${right})`;
    const scope = {};
    variables.forEach((v, i) => { scope[v] = vec[i]; });
    return mathInstance.evaluate(fnStr, scope);
  });

  const jacobian = (vec) => {
    const n = variables.length;
    const m = equations.length;
    const J = Array.from({ length: m }, () => Array(n).fill(0));
    const f0 = F(vec);

    for (let j = 0; j < n; j++) {
      const vecPerturbed = [...vec];
      vecPerturbed[j] += eps;
      const fPerturbed = F(vecPerturbed);
      for (let i = 0; i < m; i++) {
        J[i][j] = (fPerturbed[i] - f0[i]) / eps;
      }
    }

    return J;
  };

  for (let iter = 0; iter < maxIter; iter++) {
    const fVal = F(x);
    const J = jacobian(x);
    const delta = mathInstance.multiply(
      mathInstance.inv(J),
      fVal.map((v) => -v)
    );
    x = x.map((xi, i) => xi + delta[i]);
    if (Math.max(...delta.map((d) => Math.abs(d))) < 1e-8) break;
  }

  return x;
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

// ---------- Volume, surface area, and boundary (solids/curves of revolution) ----------

function explainVolumeOfRevolution(fn, variable, lower, upper) {
  const integrand = `(${fn})^2`;
  const integralValue = numericIntegral(integrand, variable, lower, upper, 1000);

  if (!Number.isFinite(integralValue)) {
    return singularityMessage(fn, variable, lower, upper);
  }

  const volume = Math.PI * integralValue;

  return [
    `Function: f(${variable}) = ${fn}, revolved around the ${variable}-axis from ${variable} = ${lower} to ${upper}`,
    `Formula (disk method): V = π ∫ [f(${variable})]² d${variable}`,
    `Step 1: Square the function → [f(${variable})]² = (${fn})²`,
    `Step 2: Integrate numerically from ${lower} to ${upper} → ∫ ≈ ${formatResult(integralValue)}`,
    `Step 3: Multiply by π`,
    `Result: V ≈ ${formatResult(volume)}`
  ].join('\n');
}

function explainWasherVolume(outer, inner, variable, lower, upper) {
  const integrand = `(${outer})^2 - (${inner})^2`;
  const integralValue = numericIntegral(integrand, variable, lower, upper, 1000);

  if (!Number.isFinite(integralValue)) {
    return singularityMessage(`${outer} and ${inner}`, variable, lower, upper);
  }

  const volume = Math.PI * integralValue;

  return [
    `Outer radius: R(${variable}) = ${outer}`,
    `Inner radius: r(${variable}) = ${inner}, from ${variable} = ${lower} to ${upper}`,
    `Formula (washer method): V = π ∫ [R(${variable})² - r(${variable})²] d${variable}`,
    `Step 1: Build the washer integrand → (${outer})² - (${inner})²`,
    `Step 2: Integrate numerically from ${lower} to ${upper} → ∫ ≈ ${formatResult(integralValue)}`,
    'Step 3: Multiply by π',
    `Result: V ≈ ${formatResult(volume)}`
  ].join('\n');
}

function explainSurfaceOfRevolution(fn, variable, lower, upper) {
  const derivative = mathInstance.derivative(fn, variable).toString();
  const integrand = `(${fn}) * sqrt(1 + (${derivative})^2)`;
  const integralValue = numericIntegral(integrand, variable, lower, upper, 1000);

  if (!Number.isFinite(integralValue)) {
    return singularityMessage(fn, variable, lower, upper);
  }

  const area = 2 * Math.PI * integralValue;

  return [
    `Function: f(${variable}) = ${fn}, revolved around the ${variable}-axis from ${variable} = ${lower} to ${upper}`,
    `Formula: SA = 2π ∫ f(${variable}) · √(1 + [f'(${variable})]²) d${variable}`,
    `Step 1: Differentiate → f'(${variable}) = ${derivative}`,
    `Step 2: Build the integrand f(${variable}) · √(1 + f'(${variable})²)`,
    `Step 3: Integrate numerically from ${lower} to ${upper} → ∫ ≈ ${formatResult(integralValue)}`,
    `Step 4: Multiply by 2π`,
    `Result: SA ≈ ${formatResult(area)}`
  ].join('\n');
}

function explainArcLength(fn, variable, lower, upper) {
  const derivative = mathInstance.derivative(fn, variable).toString();
  const integrand = `sqrt(1 + (${derivative})^2)`;
  const length = numericIntegral(integrand, variable, lower, upper, 1000);

  if (!Number.isFinite(length)) {
    return singularityMessage(fn, variable, lower, upper);
  }

  return [
    `Function: f(${variable}) = ${fn}, boundary traced from ${variable} = ${lower} to ${upper}`,
    `Formula: L = ∫ √(1 + [f'(${variable})]²) d${variable}`,
    `Step 1: Differentiate → f'(${variable}) = ${derivative}`,
    `Step 2: Build the integrand √(1 + f'(${variable})²)`,
    `Step 3: Integrate numerically from ${lower} to ${upper}`,
    `Result: L ≈ ${formatResult(length)}`
  ].join('\n');
}

function singularityMessage(fn, variable, lower, upper) {
  return [
    `Function: f(${variable}) = ${fn} on [${lower}, ${upper}]`,
    `This function or its derivative is undefined or unbounded somewhere in that interval`,
    '(e.g. a vertical tangent or division by zero at an endpoint).',
    'Try a slightly narrower interval, or a function that stays smooth across the whole range.'
  ].join('\n');
}

// ---------- Multivariable calculus ----------

function explainPartialDerivative(expression, variable) {
  const derivative = mathInstance.derivative(expression, variable).toString();
  return [
    `Function: f(...) = ${expression}`,
    `Step 1: Treat every variable except "${variable}" as a constant`,
    `Step 2: Differentiate with respect to ${variable}`,
    `Result: ∂f/∂${variable} = ${derivative}`
  ].join('\n');
}

function explainGradient(expression, variables) {
  const steps = [`Function: f(${variables.join(', ')}) = ${expression}`, 'Step 1: Differentiate with respect to each variable in turn'];
  const components = variables.map((variable) => {
    const derivative = mathInstance.derivative(expression, variable).toString();
    steps.push(`  ∂f/∂${variable} = ${derivative}`);
    return derivative;
  });
  steps.push(`Result: ∇f = [ ${components.join(', ')} ]`);
  return steps.join('\n');
}

function explainTaylorSeries(expression, variable, point, order) {
  const terms = computeTaylorSeries(expression, variable, point, order);
  const steps = [`Function: f(${variable}) = ${expression}`, `Expansion point: ${variable} = ${point}`];

  terms.forEach((term) => {
    steps.push(`Step ${term.order + 1}: f${'′'.repeat(Math.min(term.order, 3))}${term.order > 3 ? `^(${term.order})` : ''}(${point}) = ${formatResult(term.derivativeAtPoint)}`);
  });

  const polynomial = buildTaylorPolynomialString(terms, variable, point);
  steps.push(`Step ${terms.length + 1}: Combine terms as Σ [ f⁽ⁿ⁾(${point}) / n! ] × (${variable} - ${point})ⁿ`);
  steps.push(`Result: T(${variable}) ≈ ${polynomial}`);
  return steps.join('\n');
}

function computeTaylorSeries(expression, variable, point, order) {
  const terms = [];
  let derivativeNode = mathInstance.parse(expression);

  for (let k = 0; k <= order; k += 1) {
    if (k > 0) {
      derivativeNode = mathInstance.derivative(derivativeNode, variable);
    }
    const derivativeAtPoint = derivativeNode.evaluate({ [variable]: point });
    const coefficient = derivativeAtPoint / mathInstance.factorial(k);
    terms.push({ order: k, derivativeAtPoint, coefficient });
  }

  return terms;
}

function buildTaylorPolynomialString(terms, variable, point) {
  const pieces = terms
    .filter((term) => Math.abs(term.coefficient) > 1e-10)
    .map((term) => {
      const coeff = Number(term.coefficient.toFixed(6));
      if (term.order === 0) {
        return `${coeff}`;
      }
      const base = point === 0 ? `${variable}` : `(${variable} - ${point})`;
      const power = term.order === 1 ? base : `${base}^${term.order}`;
      return `${coeff}·${power}`;
    });

  return pieces.length ? pieces.join(' + ').replace(/\+ -/g, '- ') : '0';
}

// ---------- Symbolic simplification ----------

function explainSimplify(expression) {
  const simplified = mathInstance.simplify(expression).toString();
  return [
    `Original expression: ${expression}`,
    'Step 1: Apply algebraic simplification rules (combine like terms, reduce powers, cancel factors)',
    `Result: ${simplified}`
  ].join('\n');
}

// ---------- Sequences and series ----------

function explainSeries(expression, variable, lower, upper, mode) {
  const isSum = mode === 'sum';
  const terms = [];
  let total = isSum ? 0 : 1;

  for (let i = lower; i <= upper; i += 1) {
    const value = mathInstance.evaluate(expression, { [variable]: i });
    terms.push(value);
    total = isSum ? total + value : total * value;
  }

  const symbol = isSum ? 'Σ' : '∏';
  const label = isSum ? 'Sum' : 'Product';
  const displayTerms = terms.length > 10
    ? [...terms.slice(0, 4).map(formatResult), '...', ...terms.slice(-2).map(formatResult)]
    : terms.map(formatResult);

  return [
    `${symbol} [${variable}=${lower} to ${upper}] (${expression})`,
    `Step 1: Evaluate the expression for each ${variable} from ${lower} to ${upper}`,
    `Terms: ${displayTerms.join(', ')}`,
    `Step 2: ${isSum ? 'Add' : 'Multiply'} all ${terms.length} term(s) together`,
    `Result: ${label} = ${formatResult(total)}`
  ].join('\n');
}

// ---------- Statistics ----------

function explainStats(data) {
  const n = data.length;
  const mean = mathInstance.mean(data);
  const median = mathInstance.median(data);
  const variance = mathInstance.variance(data);
  const stdDev = mathInstance.std(data);
  const min = mathInstance.min(data);
  const max = mathInstance.max(data);
  const mode = computeMode(data);

  return [
    `Dataset (n = ${n}): [${data.join(', ')}]`,
    `Step 1: Mean = (Σx) / n = ${formatResult(mean)}`,
    `Step 2: Sort and find the middle value(s) → Median = ${formatResult(median)}`,
    `Step 3: Variance = Σ(x - mean)² / n = ${formatResult(variance)}`,
    `Step 4: Standard deviation = √variance = ${formatResult(stdDev)}`,
    `Step 5: Range = max - min = ${formatResult(max)} - ${formatResult(min)} = ${formatResult(max - min)}`,
    `Mode: ${mode ? mode.join(', ') : 'No repeated values'}`,
    `Result: mean ≈ ${formatResult(mean)}, median = ${formatResult(median)}, std dev ≈ ${formatResult(stdDev)}`
  ].join('\n');
}

function computeMode(data) {
  const frequency = {};
  let maxFrequency = 0;

  data.forEach((value) => {
    frequency[value] = (frequency[value] || 0) + 1;
    maxFrequency = Math.max(maxFrequency, frequency[value]);
  });

  if (maxFrequency <= 1) return null;
  return Object.keys(frequency)
    .filter((key) => frequency[key] === maxFrequency)
    .map(Number);
}

// ---------- Combinatorics ----------

function explainFactorial(n) {
  const result = mathInstance.factorial(n);
  const chain = n <= 12
    ? Array.from({ length: n }, (_, i) => n - i).join(' × ') || '1'
    : `${n} × (${n - 1})! `;
  return [
    `Compute: ${n}!`,
    `Step 1: ${n}! = ${chain}`,
    `Result: ${n}! = ${formatResult(result)}`
  ].join('\n');
}

function explainPermutations(n, r) {
  const result = mathInstance.permutations(n, r);
  return [
    `Compute: P(${n}, ${r}) — number of ordered arrangements of ${r} items from ${n}`,
    `Formula: P(n, r) = n! / (n - r)!`,
    `Step 1: ${n}! / ${n - r}!`,
    `Result: P(${n}, ${r}) = ${formatResult(result)}`
  ].join('\n');
}

function explainCombinations(n, r) {
  const result = mathInstance.combinations(n, r);
  return [
    `Compute: C(${n}, ${r}) — number of unordered groups of ${r} items from ${n}`,
    `Formula: C(n, r) = n! / (r! × (n - r)!)`,
    `Step 1: ${n}! / (${r}! × ${n - r}!)`,
    `Result: C(${n}, ${r}) = ${formatResult(result)}`
  ].join('\n');
}

// ---------- Number theory ----------

function explainPrimeFactors(n) {
  const factors = primeFactorize(n);
  const grouped = groupFactors(factors);
  return [
    `Factor: ${n}`,
    'Step 1: Divide repeatedly by the smallest possible prime',
    `Step 2: Continue until the remaining factor is 1`,
    `Prime factors: ${factors.join(' × ')}`,
    `Result: ${n} = ${grouped}`
  ].join('\n');
}

function primeFactorize(n) {
  const factors = [];
  let num = Math.abs(Math.trunc(n));
  let divisor = 2;

  while (num > 1) {
    while (num % divisor === 0) {
      factors.push(divisor);
      num /= divisor;
    }
    divisor += 1;
    if (divisor * divisor > num && num > 1) {
      factors.push(num);
      break;
    }
  }

  return factors.length ? factors : [n];
}

function groupFactors(factors) {
  const counts = {};
  factors.forEach((f) => { counts[f] = (counts[f] || 0) + 1; });
  return Object.entries(counts)
    .map(([base, exp]) => (exp > 1 ? `${base}^${exp}` : `${base}`))
    .join(' × ');
}

function explainGcdLcm(a, b, mode) {
  const isGcd = mode === 'gcd';
  const result = isGcd ? mathInstance.gcd(a, b) : mathInstance.lcm(a, b);
  const factorsA = primeFactorize(a);
  const factorsB = primeFactorize(b);
  return [
    `Compute: ${isGcd ? 'GCD' : 'LCM'}(${a}, ${b})`,
    `Step 1: Prime factorize ${a} → ${factorsA.join(' × ')}`,
    `Step 2: Prime factorize ${b} → ${factorsB.join(' × ')}`,
    `Step 3: ${isGcd ? 'Take the shared prime factors at their lowest powers' : 'Take all prime factors at their highest powers'}`,
    `Result: ${isGcd ? 'GCD' : 'LCM'}(${a}, ${b}) = ${formatResult(result)}`
  ].join('\n');
}

// ---------- Vectors ----------

function explainVectorOp(v1, v2, mode) {
  if (mode === 'dot') {
    const result = mathInstance.dot(v1, v2);
    return [
      `Vectors: a = [${v1.join(', ')}], b = [${v2.join(', ')}]`,
      'Formula: a · b = Σ (aᵢ × bᵢ)',
      `Step 1: ${v1.map((val, i) => `(${val} × ${v2[i]})`).join(' + ')}`,
      `Result: a · b = ${formatResult(result)}`
    ].join('\n');
  }

  const result = mathInstance.cross(v1, v2);
  return [
    `Vectors: a = [${v1.join(', ')}], b = [${v2.join(', ')}]`,
    'Formula: a × b uses the 3×3 determinant expansion of the standard basis vectors',
    'Step 1: Expand along the top row of the basis/vector matrix',
    `Result: a × b = ${formatResult(result)}`
  ].join('\n');
}

function explainMagnitude(v) {
  const result = mathInstance.norm(v);
  const squares = v.map((val) => `${val}²`).join(' + ');
  return [
    `Vector: v = [${v.join(', ')}]`,
    'Formula: |v| = √(v₁² + v₂² + ... + vₙ²)',
    `Step 1: √(${squares})`,
    `Result: |v| = ${formatResult(result)}`
  ].join('\n');
}

// ---------- Unit conversion ----------

function explainConversion(sourceExpression, targetUnit) {
  const sourceValue = mathInstance.evaluate(sourceExpression);
  const converted = mathInstance.evaluate(`${sourceExpression} to ${targetUnit}`);
  return [
    `Convert: ${sourceExpression} → ${targetUnit}`,
    `Step 1: Start with ${formatResult(sourceValue)}`,
    `Step 2: Apply the conversion factor to ${targetUnit}`,
    `Result: ${formatResult(converted)}`
  ].join('\n');
}