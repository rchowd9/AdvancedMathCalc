export const DIFFERENTIAL_EQUATION_MODE_NAMES = new Set([
  'solveode',
  'solveodesystem'
]);

const MAX_STEPS = 20000;

export function solveDifferentialEquation(input, math) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error('Use solveOde(rhs, x, y, x0, y0, xEnd, steps) or solveOdeSystem([rhs...], [states...], x, x0, [initial...], xEnd, steps).');
  }
  if (!math || typeof math.evaluate !== 'function') throw new Error('A math.js instance is required to solve a differential equation.');

  const mode = match[1].toLowerCase();
  const args = splitArguments(match[2]);
  if (mode === 'solveode') return solveScalarOde(args, math);
  if (mode === 'solveodesystem') return solveOdeSystem(args, math);
  throw new Error(`Unknown differential-equation mode: ${match[1]}.`);
}

function splitArguments(text) {
  const parts = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '(' || character === '[') depth += 1;
    if (character === ')' || character === ']') depth -= 1;
    if (depth < 0) throw new Error('Unbalanced parentheses or brackets in the differential equation.');
    if (character === ',' && depth === 0) {
      parts.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  if (depth !== 0) throw new Error('Unbalanced parentheses or brackets in the differential equation.');
  parts.push(text.slice(start).trim());
  return parts;
}

function parseArray(text, name) {
  if (!text.startsWith('[') || !text.endsWith(']')) throw new Error(`${name} must be written as an array in square brackets.`);
  const entries = splitArguments(text.slice(1, -1));
  if (entries.length === 1 && !entries[0]) return [];
  return entries;
}

function parseFiniteNumber(text, name) {
  const value = Number(text);
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
}

function parseStepCount(text) {
  if (text === undefined) return 100;
  const steps = parseFiniteNumber(text, 'Step count');
  if (!Number.isInteger(steps) || steps < 1 || steps > MAX_STEPS) {
    throw new Error(`Step count must be an integer from 1 to ${MAX_STEPS}.`);
  }
  return steps;
}

function evaluateDerivatives(expressions, independentVariable, independentValue, stateVariables, stateValues, math) {
  const scope = { [independentVariable]: independentValue };
  stateVariables.forEach((variable, index) => {
    scope[variable] = stateValues[index];
  });
  return expressions.map((expression) => {
    const value = Number(math.evaluate(expression, scope));
    if (!Number.isFinite(value)) throw new Error(`The derivative expression "${expression}" produced a non-finite value.`);
    return value;
  });
}

function integrateRungeKutta(expressions, independentVariable, stateVariables, initialValue, initialState, endValue, steps, math) {
  const stepSize = (endValue - initialValue) / steps;
  let x = initialValue;
  let state = [...initialState];
  const samples = new Map([[0, { x, state: [...state] }]]);
  const sampleSteps = new Set([0, Math.round(steps / 4), Math.round(steps / 2), Math.round(3 * steps / 4), steps]);

  for (let index = 0; index < steps; index += 1) {
    const k1 = evaluateDerivatives(expressions, independentVariable, x, stateVariables, state, math);
    const k2 = evaluateDerivatives(
      expressions, independentVariable, x + stepSize / 2, stateVariables,
      state.map((value, component) => value + stepSize * k1[component] / 2), math
    );
    const k3 = evaluateDerivatives(
      expressions, independentVariable, x + stepSize / 2, stateVariables,
      state.map((value, component) => value + stepSize * k2[component] / 2), math
    );
    const k4 = evaluateDerivatives(
      expressions, independentVariable, x + stepSize, stateVariables,
      state.map((value, component) => value + stepSize * k3[component]), math
    );
    state = state.map((value, component) => (
      value + stepSize * (k1[component] + 2 * k2[component] + 2 * k3[component] + k4[component]) / 6
    ));
    if (state.some((value) => !Number.isFinite(value))) throw new Error('The numerical solution diverged to a non-finite value.');
    x = index === steps - 1 ? endValue : initialValue + (index + 1) * stepSize;
    if (sampleSteps.has(index + 1)) samples.set(index + 1, { x, state: [...state] });
  }
  return [...samples.values()];
}

function formatNumber(value) {
  return String(Number(value.toPrecision(8)));
}

function formatSamples(samples, stateVariables) {
  return samples.map(({ x, state }) => (
    `x = ${formatNumber(x)}: ${stateVariables.map((name, index) => `${name} = ${formatNumber(state[index])}`).join(', ')}`
  ));
}

function solveScalarOde(args, math) {
  if (args.length !== 6 && args.length !== 7) {
    throw new Error('Use solveOde(rhs, x, y, x0, y0, xEnd, steps), where dy/dx = rhs and y(x0) = y0.');
  }
  const [expression, independentVariable, dependentVariable] = args;
  if (!/^[a-zA-Z]\w*$/.test(independentVariable) || !/^[a-zA-Z]\w*$/.test(dependentVariable) || independentVariable === dependentVariable) {
    throw new Error('Independent and dependent variables must be distinct variable names.');
  }
  const initialValue = parseFiniteNumber(args[3], 'Initial independent-variable value');
  const initialState = parseFiniteNumber(args[4], 'Initial dependent-variable value');
  const endValue = parseFiniteNumber(args[5], 'Final independent-variable value');
  const steps = parseStepCount(args[6]);
  const samples = integrateRungeKutta(
    [expression], independentVariable, [dependentVariable], initialValue, [initialState], endValue, steps, math
  );
  const final = samples[samples.length - 1];
  return [
    `Initial-value problem: d${dependentVariable}/d${independentVariable} = ${expression}, ${dependentVariable}(${initialValue}) = ${initialState}`,
    `Fourth-order Runge-Kutta integration with ${steps} steps`,
    `Approximate solution at ${independentVariable} = ${endValue}: ${dependentVariable} = ${formatNumber(final.state[0])}`,
    'Selected trajectory points:',
    ...formatSamples(samples, [dependentVariable])
  ].join('\n');
}

function solveOdeSystem(args, math) {
  if (args.length !== 6 && args.length !== 7) {
    throw new Error('Use solveOdeSystem([rhs1, rhs2], [y1, y2], x, x0, [y10, y20], xEnd, steps).');
  }
  const expressions = parseArray(args[0], 'Derivative expressions');
  const stateVariables = parseArray(args[1], 'State variables');
  const independentVariable = args[2];
  const initialValue = parseFiniteNumber(args[3], 'Initial independent-variable value');
  const initialState = parseArray(args[4], 'Initial state').map((value, index) => parseFiniteNumber(value, `Initial state ${index + 1}`));
  const endValue = parseFiniteNumber(args[5], 'Final independent-variable value');
  const steps = parseStepCount(args[6]);
  if (
    !expressions.length ||
    expressions.length !== stateVariables.length ||
    expressions.length !== initialState.length ||
    !/^[a-zA-Z]\w*$/.test(independentVariable) ||
    stateVariables.some((variable) => !/^[a-zA-Z]\w*$/.test(variable)) ||
    new Set(stateVariables).size !== stateVariables.length ||
    stateVariables.includes(independentVariable)
  ) {
    throw new Error('Each system equation needs one distinct state variable and one matching initial value; the independent variable must be separate.');
  }
  const samples = integrateRungeKutta(
    expressions, independentVariable, stateVariables, initialValue, initialState, endValue, steps, math
  );
  const final = samples[samples.length - 1];
  return [
    `First-order system with states [${stateVariables.join(', ')}]`,
    `Fourth-order Runge-Kutta integration with ${steps} steps`,
    `Approximate final state at ${independentVariable} = ${endValue}: [${final.state.map(formatNumber).join(', ')}]`,
    'Selected trajectory points:',
    ...formatSamples(samples, stateVariables)
  ].join('\n');
}
