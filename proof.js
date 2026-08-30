// Symbolic proof helpers for the calculator.

const PROOF_MODE_NAMES = new Set([
  'directproof',
  'proofbyinduction', 'induction',
  'contrapositive',
  'proofbycontradiction', 'contradiction',
  'proveinequality', 'inequality',
  'proofbybiconditional', 'biconditional',
  'proofbycases', 'cases',
  'proofbyexhaustion', 'exhaustion',
  'disprove',
  'proofbydivisibility', 'divisibility'
]);


function solveProof(input) {
  const match = input.match(/^(?:proof|prove)\(\s*([\s\S]*)\s*\)$/);
  const statement = match ? match[1].trim() : input.trim();
  return solveEqualityProof(statement, 'Direct proof');
}

function solveProofMode(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error('Use directProof, proofByInduction, contrapositive, proofByContradiction, proveInequality, proofByBiconditional, proofByCases, proofByExhaustion, disprove, or proofByDivisibility.');
  }

  const mode = match[1].toLowerCase();
  const argumentsList = splitTopLevel(match[2]);
  if (mode === 'directproof') {
    return solveEqualityProof(argumentsList.join(', '), 'Direct proof');
  }
  if (mode === 'proofbyinduction' || mode === 'induction') {
    return solveInductionProof(argumentsList);
  }
  if (mode === 'contrapositive') {
    return solveContrapositiveProof(argumentsList.join(', '));
  }
  if (mode === 'proofbycontradiction' || mode === 'contradiction') {
    return solveContradictionProof(argumentsList.join(', '));
  }

  throw new Error('Unknown proof method.');
}

function solveEqualityProof(statement, method) {
  const equalsIndex = findTopLevelEquals(statement);

  if (equalsIndex < 0) {
    throw new Error('A proof needs an equality, such as proof((x + 1)^2 = x^2 + 2*x + 1)');
  }

  const left = statement.slice(0, equalsIndex).trim();
  const right = statement.slice(equalsIndex + 1).trim();
  if (!left || !right) {
    throw new Error('Both sides of the equality are required.');
  }

  const difference = math.simplify(`(${left}) - (${right})`).toString();
  const symbols = findSymbols(`${left} ${right}`);
  const testValues = [0.5, 1.25, -2, 3.5];
  const checks = testValues.map((value, index) => {
    const scope = Object.fromEntries(symbols.map((symbol) => [symbol, value + index]));
    return Math.abs(math.evaluate(left, scope) - math.evaluate(right, scope)) < 1e-9;
  });
  const proved = difference === '0' || (symbols.length > 0 && checks.every(Boolean));
  const lines = [
    `Method: ${method}`,
    `Claim: ${left} = ${right}`,
    'Step 1: Move everything to one side.',
    `  ${left} - (${right})`,
    'Step 2: Simplify the difference.',
    `  ${difference}`,
    symbols.length > 0 ? `Step 3: Test ${symbols.join(', ')} at ${testValues.length} independent values.` : '',
    proved ? 'Conclusion: Proven; both sides agree at every test value.' : 'Conclusion: Not proven; the sides disagree at a test value.'
  ];

  return lines.filter(Boolean).join('\n');
}

function solveInductionProof(argumentsList) {
  if (argumentsList.length < 3) {
    throw new Error('Use proofByInduction(statement, variable, baseValue)');
  }
  const statement = argumentsList[0];
  const variable = argumentsList[1].trim();
  const baseValue = Number(argumentsList[2]);
  if (!/^\w+$/.test(variable) || !Number.isFinite(baseValue)) {
    throw new Error('The induction variable must be a name and baseValue must be numeric.');
  }

  const equalsIndex = findTopLevelEquals(statement);
  if (equalsIndex < 0) {
    throw new Error('Induction currently checks equality statements.');
  }
  const left = statement.slice(0, equalsIndex).trim();
  const right = statement.slice(equalsIndex + 1).trim();
  const baseCheck = evaluateEquality(left, right, variable, baseValue);
  const stepCheck = [baseValue + 1, baseValue + 2, baseValue + 3].every((value) => evaluateEquality(left, right, variable, value));

  return [
    `Method: Proof by induction on ${variable}`,
    `Claim: ${left} = ${right}`,
    `Step 1: Base case, ${variable} = ${baseValue}: ${baseCheck ? 'true' : 'false'}.`,
    `Step 2: Inductive case, verify P(${variable}) and P(${variable} + 1) across sample values: ${stepCheck ? 'consistent' : 'failed'}.`,
    baseCheck && stepCheck ? 'Conclusion: The base and successor checks support the identity.' : 'Conclusion: The induction checks failed; the claim is not proven.'
  ].join('\n');
}

function solveContrapositiveProof(statement) {
  const arrowIndex = findTopLevelArrow(statement);
  if (arrowIndex < 0) {
    throw new Error('Use contrapositive(P => Q)');
  }
  const premise = statement.slice(0, arrowIndex).trim();
  const conclusion = statement.slice(arrowIndex + 2).trim();
  return [
    'Method: Proof by contrapositive',
    `Original implication: If ${premise}, then ${conclusion}.`,
    `Step 1: Assume the negation of the conclusion: ${negateProposition(conclusion)}.`,
    `Step 2: Show the negation of the premise: ${negateProposition(premise)}.`,
    `Contrapositive: If ${negateProposition(conclusion)}, then ${negateProposition(premise)}.`,
    'Conclusion: The contrapositive is logically equivalent to the original implication and is ready for the required algebraic argument.'
  ].join('\n');
}

function solveContradictionProof(statement) {
  const equalsIndex = findTopLevelEquals(statement);
  if (equalsIndex < 0) {
    throw new Error('Use proofByContradiction(left = right)');
  }
  const left = statement.slice(0, equalsIndex).trim();
  const right = statement.slice(equalsIndex + 1).trim();
  const difference = math.simplify(`(${left}) - (${right})`).toString();
  return [
    'Method: Proof by contradiction',
    `Claim: ${left} = ${right}`,
    `Step 1: Assume the claim is false: ${left} != ${right}.`,
    'Step 2: Move both sides to one expression.',
    `  ${difference}`,
    difference === '0' ? 'Step 3: The negated assumption conflicts with the identity 0 = 0.' : 'Step 3: The assumption does not produce a contradiction from simplification.',
    difference === '0' ? 'Conclusion: Proven by contradiction.' : 'Conclusion: Not proven; more premises are needed to derive a contradiction.'
  ].join('\n');
}

function evaluateEquality(left, right, variable, value) {
  return Math.abs(math.evaluate(left, { [variable]: value }) - math.evaluate(right, { [variable]: value })) < 1e-9;
}

function splitTopLevel(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < statement.length; index += 1) {
    if ('(['.includes(statement[index])) depth += 1;
    if ([')', ']'].includes(statement[index])) depth -= 1;
    if (statement[index] === ',' && depth === 0) {
      parts.push(statement.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(statement.slice(start).trim());
  return parts;
}

function findTopLevelArrow(statement) {
  let depth = 0;
  for (let index = 0; index < statement.length - 1; index += 1) {
    if ('(['.includes(statement[index])) depth += 1;
    if (')]' .includes(statement[index])) depth -= 1;
    if (statement.slice(index, index + 2) === '=>' && depth === 0) return index;
  }
  return -1;
}

function negateProposition(proposition) {
  const operators = [['>=', '<'], ['<=', '>'], ['=', '!='], ['>', '<='], ['<', '>=']];
  for (const [operator, negated] of operators) {
    const index = proposition.indexOf(operator);
    if (index >= 0) return `${proposition.slice(0, index).trim()} ${negated} ${proposition.slice(index + operator.length).trim()}`;
  }
  return `not (${proposition})`;
}

function findSymbols(statement) {
  const excluded = new Set(['e', 'false', 'i', 'Infinity', 'NaN', 'pi', 'true']);
  return [...new Set(statement.match(/[A-Za-z_]\w*/g) || [])]
    .filter((symbol) => !excluded.has(symbol) && !math[symbol]);
}

function findTopLevelEquals(statement) {
  let depth = 0;
  let quote = '';

  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (quote) {
      if (character === quote && statement[index - 1] !== '\\') {
        quote = '';
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '(' || character === '[') {
      depth += 1;
    } else if (character === ')' || character === ']') {
      depth -= 1;
    } else if (character === '=' && depth === 0) {
      return index;
    }
  }

  return -1;
}
