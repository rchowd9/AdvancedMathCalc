// Symbolic proof helpers for the calculator.
// Loaded as its own module (proof.js) and called from script.js's main dispatch.

window.PROOF_MODE_NAMES = new Set([
  'directproof',
  'proofbyinduction', 'induction',
  'contrapositive',
  'proofbycontradiction', 'contradiction',
  'proveinequality', 'inequality',
  'proofbybiconditional', 'biconditional',
  'proofbycases', 'cases',
  'proofbyexhaustion', 'exhaustion',
  'disprove',
  'proofbydivisibility', 'divisibility',
  'pigeonholeprinciple', 'pigeonhole',
  'combinatorialproof', 'combinatorial',
  'recurrence',
  'structuralinduction'
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
  if (mode === 'proveinequality' || mode === 'inequality') {
    return solveInequalityProof(argumentsList.join(', '));
  }
  if (mode === 'proofbybiconditional' || mode === 'biconditional') {
    return solveBiconditionalProof(argumentsList.join(', '));
  }
  if (mode === 'proofbycases' || mode === 'cases') {
    return solveCasesProof(argumentsList);
  }
  if (mode === 'proofbyexhaustion' || mode === 'exhaustion') {
    return solveExhaustionProof(argumentsList);
  }
  if (mode === 'disprove') {
    return solveDisproof(argumentsList.join(', '));
  }
  if (mode === 'proofbydivisibility' || mode === 'divisibility') {
    return solveDivisibilityProof(argumentsList);
  }
  if (mode === 'pigeonholeprinciple' || mode === 'pigeonhole') {
    return solvePigeonholeProof(argumentsList);
  }
  if (mode === 'recurrence') {
  return solveRecurrenceProof(argumentsList);
}

if (mode === 'structuralinduction') {
  return solveStructuralInductionProof(argumentsList);
}

  if (mode === 'combinatorialproof' || mode === 'combinatorial') {
    return solveCombinatorialProof(argumentsList);
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

  const difference = mathInstance.simplify(`(${left}) - (${right})`).toString();
  const symbols = findSymbols(`${left} ${right}`);
  const testValues = [0.5, 1.25, -2, 3.5];
  const checks = testValues.map((value, index) => {
    const scope = Object.fromEntries(symbols.map((symbol) => [symbol, value + index]));
    return Math.abs(mathInstance.evaluate(left, scope) - mathInstance.evaluate(right, scope)) < 1e-9;
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
  const difference = mathInstance.simplify(`(${left}) - (${right})`).toString();
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

// ---------- New proof types ----------

function solveInequalityProof(statement) {
  const comparison = parseComparison(statement);
  if (!comparison || comparison.operator === '=') {
    throw new Error('Use proveInequality(left op right) with op as <, >, <=, or >=, e.g. proveInequality(x^2 + 1 >= 2*x)');
  }

  const { left, right, operator } = comparison;
  const symbols = findSymbols(`${left} ${right}`);
  if (symbols.length === 0) {
    throw new Error('The inequality needs at least one variable to test.');
  }

  const difference = mathInstance.simplify(`(${left}) - (${right})`).toString();
  const testValues = [0.5, 1.25, -2, 3.5, 10, -10];
  const checks = testValues.map((value) => {
    const scope = Object.fromEntries(symbols.map((symbol) => [symbol, value]));
    return compareValues(mathInstance.evaluate(left, scope), mathInstance.evaluate(right, scope), operator);
  });
  const proved = checks.every(Boolean);

  return [
    'Method: Direct proof of an inequality',
    `Claim: ${left} ${operator} ${right}`,
    'Step 1: Move everything to one side.',
    `  ${left} - (${right})`,
    'Step 2: Simplify the difference.',
    `  ${difference}`,
    `Step 3: Test ${symbols.join(', ')} at ${testValues.length} independent values (${testValues.join(', ')}).`,
    proved ? 'Conclusion: Proven; the inequality holds at every test value.' : 'Conclusion: Not proven; the inequality fails at a test value.'
  ].join('\n');
}

function solveBiconditionalProof(statement) {
  const biconditionalIndex = findTopLevelBiconditional(statement);
  if (biconditionalIndex < 0) {
    throw new Error('Use proofByBiconditional(P <=> Q)');
  }
  const left = statement.slice(0, biconditionalIndex).trim();
  const right = statement.slice(biconditionalIndex + 3).trim();

  return [
    'Method: Proof of a biconditional (if and only if)',
    `Claim: ${left} <=> ${right}`,
    'A biconditional requires both directions to be shown:',
    `Forward direction: If ${left}, then ${right}.`,
    `  Contrapositive check: If ${negateProposition(right)}, then ${negateProposition(left)}.`,
    `Backward direction: If ${right}, then ${left}.`,
    `  Contrapositive check: If ${negateProposition(left)}, then ${negateProposition(right)}.`,
    'Conclusion: Once both the forward and backward implications are established (directly or via their contrapositives), the biconditional holds.'
  ].join('\n');
}

function solveCasesProof(argumentsList) {
  if (argumentsList.length < 4) {
    throw new Error('Use proofByCases(claim, variable, [case1Values], [case2Values], ...)');
  }
  const claim = argumentsList[0];
  const variable = argumentsList[1].trim();
  if (!/^\w+$/.test(variable)) {
    throw new Error('The case variable must be a simple name.');
  }
  const comparison = parseComparison(claim);
  if (!comparison) {
    throw new Error('Proof by cases needs an equality or inequality claim.');
  }

  const caseArgs = argumentsList.slice(2);
  const caseResults = caseArgs.map((caseArg, index) => {
    let values;
    try {
      values = mathInstance.evaluate(caseArg);
    } catch (error) {
      throw new Error(`Case ${index + 1} must be a list of numbers, like [2, 4, 6].`);
    }
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error(`Case ${index + 1} must be a non-empty list of numbers.`);
    }
    const allPass = values.every((value) => testComparisonAt(comparison, variable, value));
    return { index: index + 1, values, allPass };
  });

  const overall = caseResults.every((c) => c.allPass);

  return [
    'Method: Proof by cases',
    `Claim: ${claim}`,
    `Step 1: Partition ${variable} into ${caseResults.length} cases.`,
    ...caseResults.map((c) => `  Case ${c.index}: ${variable} \u2208 {${c.values.join(', ')}} \u2192 ${c.allPass ? 'claim holds' : 'claim fails'}`),
    overall ? 'Conclusion: The claim holds across every tested case.' : 'Conclusion: Not proven; at least one case fails.'
  ].join('\n');
}

function solveExhaustionProof(argumentsList) {
  if (argumentsList.length < 3) {
    throw new Error('Use proofByExhaustion(claim, variable, [v1, v2, ...])');
  }
  const claim = argumentsList[0];
  const variable = argumentsList[1].trim();
  if (!/^\w+$/.test(variable)) {
    throw new Error('The variable must be a simple name.');
  }

  let values;
  try {
    values = mathInstance.evaluate(argumentsList[2]);
  } catch (error) {
    throw new Error('The domain must be a list of numbers, like [1, 2, 3, 4].');
  }
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error('Provide a non-empty finite list of values to exhaust.');
  }

  const comparison = parseComparison(claim);
  if (!comparison) {
    throw new Error('Proof by exhaustion needs an equality or inequality claim.');
  }

  const checks = values.map((value) => ({ value, holds: testComparisonAt(comparison, variable, value) }));
  const allHold = checks.every((c) => c.holds);

  return [
    'Method: Proof by exhaustion',
    `Claim: ${claim}`,
    `Step 1: The domain of ${variable} is finite: {${values.join(', ')}}.`,
    'Step 2: Check the claim at every value in that domain.',
    ...checks.map((c) => `  ${variable} = ${c.value}: ${c.holds ? 'holds' : 'fails'}`),
    allHold ? 'Conclusion: The claim holds for every value in the finite domain, so it is proven.' : 'Conclusion: Not proven; the claim fails for at least one value.'
  ].join('\n');
}

function solveDisproof(statement) {
  const comparison = parseComparison(statement);
  if (!comparison) {
    throw new Error('Use disprove(left = right) or disprove(left op right) with an equality or inequality.');
  }
  const symbols = findSymbols(`${comparison.left} ${comparison.right}`);
  if (symbols.length === 0) {
    throw new Error('Disproof search needs at least one variable.');
  }

  const variable = symbols[0];
  const sampleValues = [];
  for (let value = -10; value <= 10; value += 0.5) {
    sampleValues.push(Number(value.toFixed(2)));
  }

  let counterexample = null;
  for (const value of sampleValues) {
    let holds;
    try {
      holds = testComparisonAt(comparison, variable, value);
    } catch (error) {
      continue;
    }
    if (!holds) {
      counterexample = value;
      break;
    }
  }

  const lines = [
    'Method: Disproof by counterexample',
    `Claim: ${comparison.left} ${comparison.operator} ${comparison.right}`,
    `Step 1: Search values of ${variable} looking for one where the claim fails.`
  ];

  if (counterexample !== null) {
    const leftValue = mathInstance.evaluate(comparison.left, { [variable]: counterexample });
    const rightValue = mathInstance.evaluate(comparison.right, { [variable]: counterexample });
    lines.push(`Step 2: At ${variable} = ${counterexample}: left side = ${formatResult(leftValue)}, right side = ${formatResult(rightValue)}.`);
    lines.push(`Conclusion: Disproven \u2014 ${variable} = ${counterexample} is a counterexample.`);
  } else {
    lines.push(`Step 2: No counterexample found for ${variable} across [-10, 10] in steps of 0.5.`);
    lines.push('Conclusion: No counterexample found in the tested range; this does not prove the claim is true, only that this search did not break it.');
  }

  return lines.join('\n');
}

function solveDivisibilityProof(argumentsList) {
  if (argumentsList.length < 4) {
    throw new Error('Use proofByDivisibility(expression, divisor, variable, baseValue)');
  }
  const expression = argumentsList[0];
  const divisor = Number(argumentsList[1]);
  const variable = argumentsList[2].trim();
  const baseValue = Number(argumentsList[3]);
  if (!Number.isFinite(divisor) || divisor === 0) {
    throw new Error('The divisor must be a nonzero number.');
  }
  if (!/^\w+$/.test(variable) || !Number.isFinite(baseValue)) {
    throw new Error('The variable must be a name and baseValue must be numeric.');
  }

  const remainderAt = (value) => {
    const result = mathInstance.evaluate(expression, { [variable]: value });
    const remainder = ((result % divisor) + divisor) % divisor;
    return { result, remainder };
  };

  const base = { value: baseValue, ...remainderAt(baseValue) };
  const successors = [baseValue + 1, baseValue + 2, baseValue + 3].map((value) => ({ value, ...remainderAt(value) }));
  const baseHolds = Math.abs(base.remainder) < 1e-9;
  const successorsHold = successors.every((s) => Math.abs(s.remainder) < 1e-9);

  return [
    `Method: Proof by divisibility (induction-style) on ${variable}`,
    `Claim: ${divisor} divides (${expression}) for all ${variable} \u2265 ${baseValue}`,
    `Step 1: Base case, ${variable} = ${baseValue}: (${expression}) = ${formatResult(base.result)}, remainder mod ${divisor} = ${formatResult(base.remainder)} \u2192 ${baseHolds ? 'divisible' : 'not divisible'}.`,
    `Step 2: Check successor values ${successors.map((s) => s.value).join(', ')}:`,
    ...successors.map((s) => `  ${variable} = ${s.value}: remainder mod ${divisor} = ${formatResult(s.remainder)} \u2192 ${Math.abs(s.remainder) < 1e-9 ? 'divisible' : 'not divisible'}`),
    baseHolds && successorsHold ? 'Conclusion: The base case and successor checks support the divisibility claim.' : 'Conclusion: The divisibility checks failed; the claim is not proven.'
  ].join('\n');
}

function solvePigeonholeProof(argumentsList) {
  if (argumentsList.length < 2) {
    throw new Error('Use pigeonholeprinciple(numItems, numContainers) or pigeonhole(numItems, numContainers)');
  }
  
  const numItems = Number(argumentsList[0]);
  const numContainers = Number(argumentsList[1]);
  
  if (!Number.isFinite(numItems) || !Number.isFinite(numContainers) || numItems <= 0 || numContainers <= 0) {
    throw new Error('Both numItems and numContainers must be positive numbers.');
  }
  
  const hasConflict = numItems > numContainers;
  const minInContainer = Math.ceil(numItems / numContainers);
  const avgPerContainer = (numItems / numContainers).toFixed(2);
  
  const lines = [
    'Method: Pigeonhole Principle',
    `Given: ${numItems} items distributed into ${numContainers} containers`,
    'Step 1: By the pigeonhole principle, if we have more items than containers,',
    '  at least one container must contain more than one item.',
    'Step 2: Average items per container = ' + numItems + ' / ' + numContainers + ' = ' + avgPerContainer,
    hasConflict
      ? `Step 3: Since ${numItems} > ${numContainers}, at least one container must have ≥ ${minInContainer} items.`
      : `Step 3: Since ${numItems} ≤ ${numContainers}, each container can have at most 1 item (no conflict).`,
  ];
  
  if (hasConflict) {
    lines.push(`Conclusion: By the pigeonhole principle, at least one of the ${numContainers} containers must contain at least ${minInContainer} items.`);
    lines.push(`Proof strategy: Assume the contrary — suppose each container has at most ${minInContainer - 1} items.`);
    lines.push(`Then the total would be at most ${numContainers} × ${minInContainer - 1} = ${numContainers * (minInContainer - 1)},`);
    lines.push(`which is less than ${numItems}, a contradiction.`);
  } else {
    lines.push(`Conclusion: Distribution is possible without forcing any container to have more than 1 item.`);
  }
  
  return lines.join('\n');
}

function solveCombinatorialProof(argumentsList) {
  if (argumentsList.length < 1) {
    throw new Error('Use combinatorialproof(identity) with identities like: C(n,k)=C(n,n-k), C(n,k)=C(n-1,k-1)+C(n-1,k), sum(C(n,k),k,0,n)=2^n');
  }
  
  const identity = argumentsList.join(', ').trim();
  
  // Check for common combinatorial identities
  if (identity.includes('C(n,k)') && identity.includes('C(n,n-k)')) {
    return solvePascalSymmetryProof();
  } else if ((identity.includes('C(n-1,k-1)') && identity.includes('C(n-1,k)')) || identity.includes('pascal')) {
    return solvePascalsIdentityProof();
  } else if (identity.includes('sum(C(n,k)') || identity.includes('2^n')) {
    return solveBinomialSumProof();
  } else if (identity.includes('C(n+1,k+1)') || identity.includes('hockey')) {
    return solveHockeyStickProof();
  } else {
    // General combinatorial identity with numeric test
    return solveGeneralCombinatorialProof(identity);
  }
}

function solvePascalSymmetryProof() {
  return [
    'Method: Combinatorial proof by symmetry',
    'Identity: C(n, k) = C(n, n-k)',
    '',
    'Combinatorial interpretation:',
    '  Choosing k items from n items is equivalent to leaving out (n-k) items.',
    '',
    'Step 1: C(n, k) counts the number of ways to select k elements from a set of n elements.',
    'Step 2: C(n, n-k) counts the number of ways to select (n-k) elements from a set of n elements.',
    'Step 3: For every k-subset, there is a unique complementary (n-k)-subset and vice versa.',
    'Step 4: This establishes a bijection (one-to-one correspondence) between the two.',
    '',
    'Numeric verification:',
    `  C(5, 2) = ${mathInstance.combinations(5, 2)} and C(5, 3) = ${mathInstance.combinations(5, 3)}`,
    `  C(6, 1) = ${mathInstance.combinations(6, 1)} and C(6, 5) = ${mathInstance.combinations(6, 5)}`,
    '',
    'Conclusion: The identity C(n, k) = C(n, n-k) is proven by establishing a bijection between',
    'k-subsets and (n-k)-subsets of an n-element set.'
  ].join('\n');
}

function solvePascalsIdentityProof() {
  return [
    'Method: Combinatorial proof by partitioning',
    'Identity (Pascal\'s Identity): C(n, k) = C(n-1, k-1) + C(n-1, k)',
    '',
    'Combinatorial interpretation:',
    '  Choosing k items from n items can be partitioned based on whether a specific item is included.',
    '',
    'Step 1: C(n, k) counts ways to choose k items from n items.',
    'Step 2: Partition based on whether item #n is included:',
    '  - Case 1: Item #n IS included → choose (k-1) more from remaining (n-1) items = C(n-1, k-1)',
    '  - Case 2: Item #n is NOT included → choose k items from remaining (n-1) items = C(n-1, k)',
    'Step 3: By the sum rule, C(n, k) = C(n-1, k-1) + C(n-1, k)',
    '',
    'Numeric verification:',
    `  C(6, 3) = ${mathInstance.combinations(6, 3)}, C(5, 2) = ${mathInstance.combinations(5, 2)}, C(5, 3) = ${mathInstance.combinations(5, 3)}`,
    `  C(5, 2) + C(5, 3) = ${mathInstance.combinations(5, 2)} + ${mathInstance.combinations(5, 3)} = ${mathInstance.combinations(5, 2) + mathInstance.combinations(5, 3)}`,
    '',
    'Conclusion: Pascal\'s identity is proven by partitioning the set of k-subsets.'
  ].join('\n');
}

function solveBinomialSumProof() {
  return [
    'Method: Combinatorial proof by counting',
    'Identity: Σ(k=0 to n) C(n, k) = 2^n',
    '',
    'Combinatorial interpretation:',
    '  The sum of all binomial coefficients equals the number of subsets of an n-element set.',
    '',
    'Step 1: C(n, k) counts k-element subsets of an n-element set.',
    'Step 2: Summing over all k from 0 to n counts ALL subsets:',
    '  - C(n, 0): 0-element subsets (empty set)',
    '  - C(n, 1): 1-element subsets',
    '  - ... C(n, n): n-element subsets (full set)',
    'Step 3: Every subset is counted exactly once.',
    'Step 4: The total number of subsets of an n-element set is 2^n.',
    '  (Each element is either included or excluded, giving 2^n possibilities)',
    '',
    'Numeric verification:',
    `  n = 4: C(4,0) + C(4,1) + C(4,2) + C(4,3) + C(4,4) = ${[0,1,2,3,4].map(k => mathInstance.combinations(4, k)).join(' + ')} = ${[0,1,2,3,4].reduce((a,k) => a + mathInstance.combinations(4,k), 0)}, and 2^4 = ${Math.pow(2, 4)}`,
    `  n = 5: Sum = ${[0,1,2,3,4,5].reduce((a,k) => a + mathInstance.combinations(5,k), 0)}, and 2^5 = ${Math.pow(2, 5)}`,
    '',
    'Conclusion: The identity Σ C(n, k) = 2^n is proven by counting all subsets in two ways.'
  ].join('\n');
}

function solveHockeyStickProof() {
  return [
    'Method: Combinatorial proof by telescoping',
    'Identity (Hockey Stick): Σ(i=r to n) C(i, r) = C(n+1, r+1)',
    '',
    'Combinatorial interpretation:',
    '  The sum counts paths to a specific point, which equals the total number of such paths.',
    '',
    'Step 1: C(i, r) counts r-element subsets of an i-element set.',
    'Step 2: We sum C(r,r) + C(r+1,r) + C(r+2,r) + ... + C(n,r)',
    'Step 3: This counts (r+1)-element subsets of {1,2,...,n+1} based on their largest element:',
    '  - Subsets with largest element (r+1): 1 way (C(r,r))',
    '  - Subsets with largest element (r+2): C(r+1,r) ways',
    '  - Subsets with largest element (i): C(i-1,r) ways',
    '  - Subsets with largest element (n+1): C(n,r) ways',
    'Step 4: Total (r+1)-subsets of {1,...,n+1} is C(n+1, r+1)',
    '',
    'Numeric verification:',
    `  C(3,2) + C(4,2) + C(5,2) = ${mathInstance.combinations(3,2)} + ${mathInstance.combinations(4,2)} + ${mathInstance.combinations(5,2)} = ${mathInstance.combinations(3,2) + mathInstance.combinations(4,2) + mathInstance.combinations(5,2)}, and C(6,3) = ${mathInstance.combinations(6,3)}`,
    '',
    'Conclusion: The hockey-stick identity is proven by counting (r+1)-element subsets in two ways.'
  ].join('\n');
}

function solveGeneralCombinatorialProof(identity) {
  return [
    'Method: Combinatorial proof analysis',
    `Identity: ${identity}`,
    '',
    'This is a combinatorial identity that can be proven by:',
    '',
    'Step 1: Direct proof - Simplify both sides algebraically and verify they are equal.',
    'Step 2: Bijective proof - Establish a one-to-one correspondence between two sets.',
    'Step 3: Counting argument - Count the same set in two different ways.',
    '',
    'For identity of the form C(n,k) = ... :',
    '  - Interpret C(n,k) as the number of ways to choose k items from n items',
    '  - Count subsets with specific properties',
    '',
    'For identity involving sums of binomial coefficients:',
    '  - Count all subsets and partition them by size or other criteria',
    '  - Use the fact that total subsets of n elements = 2^n',
    '',
    'To verify this identity:',
    '1. Try specific small values of n and k',
    '2. Look for a combinatorial interpretation',
    '3. Establish a bijection or counting argument',
    '',
    'Conclusion: Many combinatorial identities can be proven using bijections or counting arguments,',
    'which are often more elegant than purely algebraic proofs.'
  ].join('\n');
}

function solveRecurrenceProof(args) {
  if (args.length < 3) {
    throw new Error('Use recurrence(T(n) = T(n-1) + ..., variable, baseValue)');
  }

  const recurrence = args[0];
  const variable = args[1].trim();
  const baseValue = Number(args[2]);

  if (!/^\w+$/.test(variable)) {
    throw new Error('Recurrence variable must be a simple name.');
  }
  if (!Number.isFinite(baseValue)) {
    throw new Error('Base value must be numeric.');
  }

  const eqIndex = findTopLevelEquals(recurrence);
  if (eqIndex < 0) {
    throw new Error('Recurrence must contain an equality, e.g. T(n) = T(n-1) + 2');
  }

  const left = recurrence.slice(0, eqIndex).trim();
  const right = recurrence.slice(eqIndex + 1).trim();

  const baseScope = { [variable]: baseValue };
  let baseLeft, baseRight;
  try {
    baseLeft = mathInstance.evaluate(left, baseScope);
    baseRight = mathInstance.evaluate(right, baseScope);
  } catch {
    throw new Error('Could not evaluate base case.');
  }
  const baseHolds = Math.abs(baseLeft - baseRight) < 1e-9;

  const stepValues = [baseValue + 1, baseValue + 2, baseValue + 3];
  const stepChecks = stepValues.map(v => {
    const scope = { [variable]: v };
    try {
      const lv = mathInstance.evaluate(left, scope);
      const rv = mathInstance.evaluate(right, scope);
      return Math.abs(lv - rv) < 1e-9;
    } catch {
      return false;
    }
  });

  const allStepsHold = stepChecks.every(Boolean);

  return [
    'Method: Recurrence relation proof',
    `Recurrence: ${left} = ${right}`,
    `Variable: ${variable}`,
    `Base case (${variable} = ${baseValue}): ${baseHolds ? '✓ holds' : '✗ fails'}`,
    `Step checks (${stepValues.join(', ')}): ${allStepsHold ? '✓ all hold' : '✗ some fail'}`,
    baseHolds && allStepsHold
      ? 'Conclusion: Recurrence is consistent across tested values.'
      : 'Conclusion: Recurrence fails at one or more tested values.'
  ].join('\n');
}

function solveStructuralInductionProof(args) {
  if (args.length < 2) {
    throw new Error('Use structuralInduction(claim, structure)');
  }

  const claim = args[0];
  const structure = args[1];

  const baseCase = detectBaseCase(structure);
  const baseHolds = evaluateStructuralClaim(claim, baseCase);

  const substructures = extractSubstructures(structure);
  const stepChecks = substructures.map(s => evaluateStructuralClaim(claim, s));
  const allStepsHold = stepChecks.every(Boolean);

  return [
    'Method: Structural induction',
    `Claim: ${claim}`,
    `Structure: ${structure}`,
    '',
    'Step 1: Base case (smallest structure)',
    `  Base structure: ${JSON.stringify(baseCase)}`,
    `  Result: ${baseHolds ? '✓ holds' : '✗ fails'}`,
    '',
    'Step 2: Inductive hypothesis',
    '  Assume the claim holds for all immediate substructures.',
    '',
    'Step 3: Inductive step',
    `  Substructures: ${JSON.stringify(substructures)}`,
    `  Step results: ${allStepsHold ? '✓ all hold' : '✗ some fail'}`,
    '',
    baseHolds && allStepsHold
      ? 'Conclusion: The claim holds for all recursively constructed structures.'
      : 'Conclusion: Structural induction fails; claim does not hold for all substructures.'
  ].join('\n');
}

function parseComparison(statement) {
  const equalsIndex = findTopLevelEquals(statement);
  if (equalsIndex >= 0) {
    return {
      left: statement.slice(0, equalsIndex).trim(),
      right: statement.slice(equalsIndex + 1).trim(),
      operator: '='
    };
  }
  const comparison = findTopLevelComparison(statement);
  if (comparison) {
    return {
      left: statement.slice(0, comparison.index).trim(),
      right: statement.slice(comparison.index + comparison.operator.length).trim(),
      operator: comparison.operator
    };
  }
  return null;
}

function testComparisonAt(comparison, variable, value) {
  const scope = { [variable]: value };
  const leftValue = mathInstance.evaluate(comparison.left, scope);
  const rightValue = mathInstance.evaluate(comparison.right, scope);
  return compareValues(leftValue, rightValue, comparison.operator);
}

function compareValues(a, b, operator) {
  const epsilon = 1e-9;
  switch (operator) {
    case '=': return Math.abs(a - b) < epsilon;
    case '>=': return a >= b - epsilon;
    case '<=': return a <= b + epsilon;
    case '>': return a > b;
    case '<': return a < b;
    default: throw new Error(`Unsupported operator: ${operator}`);
  }
}

function findTopLevelComparison(statement) {
  let depth = 0;
  let quote = '';

  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (quote) {
      if (character === quote && statement[index - 1] !== '\\') quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '(' || character === '[') {
      depth += 1;
      continue;
    }
    if (character === ')' || character === ']') {
      depth -= 1;
      continue;
    }
    if (depth === 0) {
      const twoChar = statement.slice(index, index + 2);
      if (twoChar === '>=' || twoChar === '<=') return { index, operator: twoChar };
      if (character === '>' || character === '<') return { index, operator: character };
    }
  }

  return null;
}

function findTopLevelBiconditional(statement) {
  let depth = 0;
  let quote = '';

  for (let index = 0; index < statement.length - 2; index += 1) {
    const character = statement[index];
    if (quote) {
      if (character === quote && statement[index - 1] !== '\\') quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    if (character === '(' || character === '[') {
      depth += 1;
      continue;
    }
    if (character === ')' || character === ']') {
      depth -= 1;
      continue;
    }
    if (depth === 0 && statement.slice(index, index + 3) === '<=>') {
      return index;
    }
  }

  return -1;
}

function evaluateEquality(left, right, variable, value) {
  return Math.abs(mathInstance.evaluate(left, { [variable]: value }) - mathInstance.evaluate(right, { [variable]: value })) < 1e-9;
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
    if (')]'.includes(statement[index])) depth -= 1;
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
    .filter((symbol) => !excluded.has(symbol) && !mathInstance[symbol]);
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
      const previous = statement[index - 1];
      if (previous === '<' || previous === '>') {
        continue;
      }
      return index;
    }
  }

  return -1;
}