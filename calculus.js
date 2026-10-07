window.CALCULUS_MODE_NAMES = new Set([
  'directionalderivative',
  'tangentplane',
  'doubleintegral',
  'tripleintegral',
  'divergence',
  'curl',
  'jacobian',
  'laplacian'
]);

function solveCalculus(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) throw new Error('Use a Calculus III mode such as directionalDerivative(...), tangentPlane(...), doubleIntegral(...), divergence(...), or curl(...).');

  const mode = match[1].toLowerCase();
  const args = splitCalculusArgs(match[2]);
  const math = window.math.create({ matrix: 'Array' });

  switch (mode) {
    case 'directionalderivative': return solveDirectionalDerivative(args, math);
    case 'tangentplane': return solveTangentPlane(args, math);
    case 'doubleintegral': return solveMultipleIntegral(args, math, 2);
    case 'tripleintegral': return solveMultipleIntegral(args, math, 3);
    case 'divergence': return solveVectorFieldDerivative(args, math, 'divergence');
    case 'curl': return solveVectorFieldDerivative(args, math, 'curl');
    case 'jacobian': return solveJacobian(args, math);
    case 'laplacian': return solveLaplacian(args, math);
    default: throw new Error('Unknown Calculus III mode.');
  }
}

function splitCalculusArgs(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (character === '(' || character === '[') depth += 1;
    if (character === ')' || character === ']') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(statement.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(statement.slice(start).trim());
  return parts;
}

function parseCalculusArray(value, math, evaluateEntries = true) {
  if (!value.startsWith('[') || !value.endsWith(']')) throw new Error('Expected an array of finite numbers or expressions.');
  const entries = splitCalculusArgs(value.slice(1, -1));
  return entries.map((entry) => evaluateEntries ? math.evaluate(entry) : entry);
}

function evaluateCalculusExpression(expression, variables, values, math) {
  return Number(math.evaluate(expression, Object.fromEntries(variables.map((variable, index) => [variable, values[index]]))));
}

function derivativeAt(expression, variable, variables, values, math) {
  const derivative = math.derivative(expression, variable).toString();
  return evaluateCalculusExpression(derivative, variables, values, math);
}

function parseDifferentialPoint(variableText, pointText, math) {
  const variables = parseCalculusArray(variableText, math, false);
  const point = parseCalculusArray(pointText, math).map(Number);
  if (
    !variables.length ||
    variables.length !== point.length ||
    new Set(variables).size !== variables.length ||
    variables.some((variable) => !/^[a-zA-Z]\w*$/.test(variable)) ||
    point.some((value) => !Number.isFinite(value))
  ) {
    throw new Error('Use distinct variable names and a matching point of finite numbers.');
  }
  return { variables, point };
}

function solveJacobian(args, math) {
  if (args.length !== 3) throw new Error('Use jacobian([f1, f2], [x, y], [x0, y0]).');
  const fields = parseCalculusArray(args[0], math, false);
  if (!fields.length) throw new Error('Jacobian requires at least one vector-field component.');
  const { variables, point } = parseDifferentialPoint(args[1], args[2], math);
  const rows = fields.map((field) => variables.map((variable) => derivativeAt(field, variable, variables, point, math)));
  return [
    `Vector function: F = [${fields.join(', ')}]`,
    `Jacobian at [${point.join(', ')}]: J = [${rows.map((row) => `[${row.join(', ')}]`).join(', ')}]`,
    'Each entry is a partial derivative of one output component with respect to one input variable.'
  ].join('\n');
}

function solveLaplacian(args, math) {
  if (args.length !== 3) throw new Error('Use laplacian(expression, [x, y], [x0, y0]).');
  const { variables, point } = parseDifferentialPoint(args[1], args[2], math);
  const secondPartials = variables.map((variable) => {
    const firstDerivative = math.derivative(args[0], variable).toString();
    const secondDerivative = math.derivative(firstDerivative, variable).toString();
    return evaluateCalculusExpression(secondDerivative, variables, point, math);
  });
  const value = secondPartials.reduce((sum, term) => sum + term, 0);
  return [
    `Scalar field: f = ${args[0]}`,
    `Second partial derivatives at [${point.join(', ')}]: [${secondPartials.join(', ')}]`,
    `Laplacian: ∇²f = ${secondPartials.join(' + ')} = ${value}`
  ].join('\n');
}

function solveDirectionalDerivative(args, math) {
  if (args.length !== 4) throw new Error('Use directionalDerivative(expression, [x, y], [x0, y0], [a, b]).');
  const variables = parseCalculusArray(args[1], math, false);
  const point = parseCalculusArray(args[2], math).map(Number);
  const direction = parseCalculusArray(args[3], math).map(Number);
  if (variables.length !== point.length || point.length !== direction.length || !variables.length) throw new Error('Variables, point, and direction must have the same non-zero length.');
  const norm = Math.hypot(...direction);
  if (norm === 0) throw new Error('Direction vector must be non-zero.');
  const gradient = variables.map((variable) => derivativeAt(args[0], variable, variables, point, math));
  const unitDirection = direction.map((component) => component / norm);
  const result = gradient.reduce((sum, component, index) => sum + component * unitDirection[index], 0);
  return [`Directional derivative of f = ${args[0]}`, `Gradient at the point: ∇f = [${gradient.join(', ')}]`, `Unit direction: u = [${unitDirection.join(', ')}]`, `Dᵤf = ∇f · u = ${result}`, 'Output units: function-output units per coordinate unit (depends on input variables).'].join('\n');
}

function solveTangentPlane(args, math) {
  if (args.length !== 3) throw new Error('Use tangentPlane(expression, x0, y0).');
  const point = args.slice(1).map(Number);
  if (point.some((value) => !Number.isFinite(value))) throw new Error('Tangent-plane coordinates must be finite numbers.');
  const [x0, y0] = point;
  const z0 = evaluateCalculusExpression(args[0], ['x', 'y'], point, math);
  const fx = derivativeAt(args[0], 'x', ['x', 'y'], point, math);
  const fy = derivativeAt(args[0], 'y', ['x', 'y'], point, math);
  return [`Surface: z = ${args[0]}`, `Point: (${x0}, ${y0}, ${z0})`, `Partial derivatives: fₓ = ${fx}, fᵧ = ${fy}`, `Tangent plane: z = ${z0} + ${fx}(x - ${x0}) + ${fy}(y - ${y0})`, 'Output units: z uses function-output units; partial derivatives use function-output units per coordinate unit.'].join('\n');
}

function solveMultipleIntegral(args, math, dimensions) {
  const expectedLength = 1 + dimensions * 3;
  const syntax = dimensions === 2
    ? 'doubleIntegral(expression, x, a, b, y, c, d)'
    : 'tripleIntegral(expression, x, a, b, y, c, d, z, e, f)';
  if (args.length !== expectedLength) throw new Error(`Use ${syntax}.`);
  const variables = [];
  const bounds = [];
  for (let index = 1; index < args.length; index += 3) {
    const variable = args[index];
    const lower = Number(args[index + 1]);
    const upper = Number(args[index + 2]);
    if (!/^[a-zA-Z]+$/.test(variable) || !Number.isFinite(lower) || !Number.isFinite(upper)) throw new Error('Integral variables and bounds must be valid.');
    variables.push(variable);
    bounds.push([lower, upper]);
  }
  const steps = 30;
  const widths = bounds.map(([lower, upper]) => (upper - lower) / steps);
  let sum = 0;
  const visit = (dimension, values) => {
    if (dimension === dimensions) {
      sum += evaluateCalculusExpression(args[0], variables, values, math);
      return;
    }
    for (let index = 0; index < steps; index += 1) {
      visit(dimension + 1, [...values, bounds[dimension][0] + (index + 0.5) * widths[dimension]]);
    }
  };
  visit(0, []);
  const result = sum * widths.reduce((product, width) => product * width, 1);
  return [`${dimensions === 2 ? 'Double' : 'Triple'} integral of ${args[0]}`, `Midpoint rule with ${steps} subdivisions per variable`, `Approximate value: ${result}`, 'Output units: integrand units multiplied by each integration-variable unit.'].join('\n');
}

function solveVectorFieldDerivative(args, math, mode) {
  if (args.length !== 3) throw new Error(`Use ${mode}([P, Q${mode === 'curl' ? ', R' : ''}], [variables], [point]).`);
  const fields = parseCalculusArray(args[0], math, false);
  const variables = parseCalculusArray(args[1], math, false);
  const point = parseCalculusArray(args[2], math).map(Number);
  const dimension = mode === 'curl' ? 3 : fields.length;
  if (fields.length !== dimension || variables.length !== dimension || point.length !== dimension) throw new Error(`${mode} requires ${dimension} field components, variables, and point coordinates.`);
  if (mode === 'divergence') {
    const terms = fields.map((field, index) => derivativeAt(field, variables[index], variables, point, math));
    return [`Vector field: F = [${fields.join(', ')}]`, `Divergence: ∇ · F = ${terms.join(' + ')} = ${terms.reduce((sum, value) => sum + value, 0)}`, 'Output units: field-component units per coordinate unit.'].join('\n');
  }
  const [p, q, r] = fields;
  const [x, y, z] = variables;
  const components = [
    derivativeAt(r, y, variables, point, math) - derivativeAt(q, z, variables, point, math),
    derivativeAt(p, z, variables, point, math) - derivativeAt(r, x, variables, point, math),
    derivativeAt(q, x, variables, point, math) - derivativeAt(p, y, variables, point, math)
  ];
  return [`Vector field: F = [${fields.join(', ')}]`, `Curl: ∇ × F = [${components.join(', ')}]`, 'Output units: field-component units per coordinate unit.'].join('\n');
}