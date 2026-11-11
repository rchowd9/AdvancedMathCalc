function normalizeLogicalText(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim().replace(/\s+/g, ' ');
}

function parseImplication(premise) {
  const text = normalizeLogicalText(premise);
  const match = text.match(/^if\s+(.+?)\s+then\s+(.+)$/i) || text.match(/^(.+?)\s*->\s*(.+)$/i);
  if (!match) return null;
  return [normalizeLogicalText(match[1]), normalizeLogicalText(match[2])];
}

function normalizeLiteral(literal) {
  let text = normalizeLogicalText(literal);
  text = text.replace(/^not\s+/i, '').replace(/^¬|~/, '').trim();
  return text;
}

function isNegationOf(literal, target) {
  const left = normalizeLogicalText(literal);
  const right = normalizeLogicalText(target);
  if (left === right) return false;
  const patterns = [
    /^not\s+/i,
    /^¬/,
    /^~/
  ];
  for (const pattern of patterns) {
    if (pattern.test(left) && normalizeLiteral(left) === right) return true;
    if (pattern.test(right) && normalizeLiteral(right) === left) return true;
  }
  return false;
}

function parseConjunction(premise) {
  const text = normalizeLogicalText(premise);
  const match = text.match(/^(.*?)(?:\s+(?:and|∧|&|&&)\s+)(.*)$/i);
  if (!match) return null;
  return [normalizeLogicalText(match[1]), normalizeLogicalText(match[2])];
}

function parseDisjunction(clause) {
  const text = normalizeLogicalText(clause);
  const pieces = text.split(/\s+(?:or|∨|\|)\s+/i).map(part => normalizeLogicalText(part));
  return pieces.length > 1 ? pieces : [text];
}

function modusPonens(premise1, premise2) {
  const implication = parseImplication(premise1);
  if (!implication) {
    throw new Error('Invalid premises for modus ponens.');
  }
  const [antecedent, consequent] = implication;
  if (normalizeLiteral(premise2) === normalizeLiteral(antecedent)) {
    return consequent;
  }
  throw new Error('Invalid premises for modus ponens.');
}

function modusTollens(premise1, premise2) {
  const implication = parseImplication(premise1);
  if (!implication) {
    throw new Error('Invalid premises for modus tollens.');
  }
  const [antecedent, consequent] = implication;
  const negatedConsequent = normalizeLogicalText(premise2);
  const hasNegatedConsequent = negatedConsequent === `Not ${consequent}` || negatedConsequent === `¬${consequent}` || negatedConsequent === `~${consequent}` || isNegationOf(negatedConsequent, consequent);
  if (hasNegatedConsequent) {
    return `Not ${antecedent}`;
  }
  throw new Error('Invalid premises for modus tollens.');
}

function unitResolution(clause1, clause2) {
  const left = parseDisjunction(clause1);
  const right = parseDisjunction(clause2);
  const resolved = [...left, ...right];

  for (let i = 0; i < resolved.length; i += 1) {
    for (let j = i + 1; j < resolved.length; j += 1) {
      const first = normalizeLogicalText(resolved[i]);
      const second = normalizeLogicalText(resolved[j]);
      if (isNegationOf(first, second)) {
        const remaining = resolved.filter((_, index) => index !== i && index !== j);
        if (remaining.length === 0) return 'Contradiction';
        return remaining.join(' or ');
      }
    }
  }

  throw new Error('No unit resolution possible from the provided clauses.');
}

function andElimination(premise, side = 'left') {
  const conjunction = parseConjunction(premise);
  if (!conjunction) {
    throw new Error('Invalid premise for and elimination.');
  }
  const [left, right] = conjunction;
  const normalizedSide = normalizeLogicalText(side).toLowerCase();
  if (normalizedSide === 'left' || normalizedSide === '1' || normalizedSide === 'first') return left;
  if (normalizedSide === 'right' || normalizedSide === '2' || normalizedSide === 'second') return right;
  throw new Error('Side must be "left" or "right".');
}

function andIntroduction(premise1, premise2) {
  return `${normalizeLogicalText(premise1)} and ${normalizeLogicalText(premise2)}`;
}

function orIntroduction(premise, additionalPremise) {
  return `${normalizeLogicalText(premise)} or ${normalizeLogicalText(additionalPremise)}`;
}

function disjunctiveNormalForm(clause) 
{
}

window.DISCRETE_LOGIC_MODE_NAMES = new Set([
  'modusponens',
  'modustollens',
  'unitresolution',
  'andelimination',
  'andintroduction',
  'orintroduction'
]);

function solveDiscreteLogic(mode, argumentsList) {
  const cleanArgument = (value) => {
    const text = normalizeLogicalText(value);
    return text.length >= 2 && (
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) ? text.slice(1, -1) : text;
  };
  const [first, second] = argumentsList.map(cleanArgument);

  if (mode === 'modusponens') {
    if (argumentsList.length !== 2) throw new Error('Use modusPonens("P -> Q", "P").');
    const implication = parseImplication(first);
    if (!implication) throw new Error('The first premise must be an implication, such as P -> Q.');
    const [antecedent, consequent] = implication;
    const conclusion = modusPonens(first, second);
    return [
      'Method: Modus ponens',
      `Premises: ${first}; ${second}`,
      `Step 1: Identify the implication's antecedent and consequent: ${antecedent} -> ${consequent}.`,
      `Step 2: Match the second premise to the antecedent: ${second} = ${antecedent}.`,
      `Step 3: Infer the consequent: ${conclusion}.`,
      `Conclusion: ${conclusion}.`
    ].join('\n');
  }

  if (mode === 'modustollens') {
    if (argumentsList.length !== 2) throw new Error('Use modusTollens("P -> Q", "not Q").');
    const implication = parseImplication(first);
    if (!implication) throw new Error('The first premise must be an implication, such as P -> Q.');
    const [antecedent, consequent] = implication;
    const conclusion = modusTollens(first, second);
    return [
      'Method: Modus tollens',
      `Premises: ${first}; ${second}`,
      `Step 1: Identify the implication: if ${antecedent}, then ${consequent}.`,
      `Step 2: The second premise denies the consequent: ${second}.`,
      `Step 3: Infer the negation of the antecedent: ${conclusion}.`,
      `Conclusion: ${conclusion}.`
    ].join('\n');
  }

  if (mode === 'unitresolution') {
    if (argumentsList.length !== 2) throw new Error('Use unitResolution("P or Q", "not P or R").');
    const left = parseDisjunction(first);
    const right = parseDisjunction(second);
    const complementary = left.flatMap((literal) =>
      right.filter((other) => isNegationOf(literal, other)).map((other) => [literal, other])
    )[0];
    if (!complementary) throw new Error('No unit resolution possible from the provided clauses.');
    const conclusion = unitResolution(first, second);
    return [
      'Method: Unit resolution',
      `Clauses: (${left.join(' or ')}) and (${right.join(' or ')})`,
      `Step 1: Find complementary literals: ${complementary[0]} and ${complementary[1]}.`,
      'Step 2: Remove the complementary pair from the combined clauses.',
      `Step 3: Join the remaining literals: ${conclusion}.`,
      `Conclusion: ${conclusion}.`
    ].join('\n');
  }

  if (mode === 'andelimination') {
    if (argumentsList.length < 1 || argumentsList.length > 2) throw new Error('Use andElimination("P and Q", "left").');
    const conjunction = parseConjunction(first);
    if (!conjunction) throw new Error('Invalid premise for and elimination.');
    const side = second || 'left';
    const conclusion = andElimination(first, side);
    return [
      'Method: Conjunction elimination',
      `Premise: ${first}`,
      `Step 1: Split the conjunction into its parts: ${conjunction[0]} and ${conjunction[1]}.`,
      `Step 2: Select the ${side} part.`,
      `Conclusion: ${conclusion}.`
    ].join('\n');
  }

  if (mode === 'andintroduction') {
    if (argumentsList.length !== 2) throw new Error('Use andIntroduction("P", "Q").');
    const conclusion = andIntroduction(first, second);
    return [
      'Method: Conjunction introduction',
      `Premise 1: ${first}`,
      `Premise 2: ${second}`,
      'Step 1: Both propositions are given as premises.',
      'Step 2: Join them with "and".',
      `Conclusion: ${conclusion}.`
    ].join('\n');
  }

  if (mode === 'orintroduction') {
    if (argumentsList.length !== 2) throw new Error('Use orIntroduction("P", "Q").');
    const conclusion = orIntroduction(first, second);
    return [
      'Method: Disjunction introduction',
      `Premise: ${first}`,
      `Step 1: Retain the given proposition ${first}.`,
      `Step 2: Add the allowed alternative ${second} using "or".`,
      `Conclusion: ${conclusion}.`
    ].join('\n');
  }

  throw new Error('Unknown discrete logic rule.');
}

function solveDiscreteFormula(mode, values) {
  const requireArgs = (count, syntax) => {
    if (values.length !== count) throw new Error(`Use ${syntax}.`);
  };
  const requireNonnegative = (value, name) => {
    if (value < 0) throw new Error(`${name} must be a non-negative integer.`);
  };
  const factorialBigInt = (value) => {
    let result = 1n;
    for (let factor = 2n; factor <= BigInt(value); factor += 1n) result *= factor;
    return result;
  };
  const chooseBigInt = (n, r) => {
    if (r < 0 || r > n) return 0n;
    const count = Math.min(r, n - r);
    let result = 1n;
    for (let index = 1; index <= count; index += 1) result = result * BigInt(n - count + index) / BigInt(index);
    return result;
  };

  if (mode === 'isprime') {
    requireArgs(1, 'isPrime(n)');
    const [n] = values;
    if (n < 2) return `Step 1: A prime must be an integer greater than 1.\nConclusion: ${n} is not prime. Units: integer classification (dimensionless).`;
    for (let divisor = 2; divisor * divisor <= n; divisor += 1) {
      if (n % divisor === 0) {
        return `Step 1: Test possible divisors up to √${n} ≈ ${Math.floor(Math.sqrt(n))}.\nStep 2: ${n} ÷ ${divisor} = ${n / divisor}, so ${divisor} is a divisor.\nConclusion: ${n} is composite; ${divisor} is a divisor. Units: integer classification (dimensionless).`;
      }
    }
    return `Step 1: Test possible divisors up to √${n} ≈ ${Math.floor(Math.sqrt(n))}.\nStep 2: No integer divisor from 2 through ${Math.floor(Math.sqrt(n))} divides ${n}.\nConclusion: ${n} is prime. Units: integer classification (dimensionless).`;
  }
  if (mode === 'modularpower') {
    requireArgs(3, 'modularPower(base, exponent, modulus)');
    const [base, exponent, modulus] = values;
    requireNonnegative(exponent, 'Exponent');
    if (modulus < 1) throw new Error('Modulus must be a positive integer.');
    let result = 1n;
    let factor = BigInt(((base % modulus) + modulus) % modulus);
    let power = BigInt(exponent);
    const mod = BigInt(modulus);
    const squaringSteps = [];
    while (power > 0n) {
      if (power % 2n === 1n) {
        result = (result * factor) % mod;
        squaringSteps.push(`multiply by ${factor} → ${result}`);
      }
      factor = (factor * factor) % mod;
      power /= 2n;
    }
    return `Step 1: Reduce the base modulo ${modulus}: ${base} ≡ ${((base % modulus) + modulus) % modulus}.\nStep 2: Apply repeated squaring${squaringSteps.length ? ` (${squaringSteps.join('; ')})` : ''}.\nConclusion: Repeated squaring gives ${base}^${exponent} mod ${modulus} = ${result}. Units: dimensionless residue.`;
  }
  if (mode === 'eulerphi') {
    requireArgs(1, 'eulerPhi(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    let remaining = n;
    let result = n;
    const primeDivisors = [];
    for (let prime = 2; prime * prime <= remaining; prime += 1) {
      if (remaining % prime !== 0) continue;
      while (remaining % prime === 0) remaining /= prime;
      primeDivisors.push(prime);
      result -= result / prime;
    }
    if (remaining > 1) {
      primeDivisors.push(remaining);
      result -= result / remaining;
    }
    const factors = primeDivisors.length ? primeDivisors.join(', ') : 'none';
    return `Step 1: Find the distinct prime divisors of ${n}: ${factors}.\nStep 2: Apply φ(n) = n ∏(1 - 1/p) over those prime divisors.\nConclusion: Euler's totient: φ(${n}) = ${result}. Units: coprime-integer count.`;
  }
  if (mode === 'divisorcount') {
    requireArgs(1, 'divisorCount(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    let remaining = n;
    let count = 1;
    const factorization = [];
    for (let prime = 2; prime * prime <= remaining; prime += 1) {
      let exponent = 0;
      while (remaining % prime === 0) {
        remaining /= prime;
        exponent += 1;
      }
      if (exponent > 0) {
        factorization.push(`${prime}^${exponent}`);
        count *= exponent + 1;
      }
    }
    if (remaining > 1) {
      factorization.push(`${remaining}^1`);
      count *= 2;
    }
    return `Step 1: Prime-factorize ${n}: ${factorization.join(' × ')}.\nStep 2: For n = ∏pᵢ^aᵢ, use τ(n) = ∏(aᵢ + 1).\nStep 3: Multiply the exponent choices: ${factorization.map((factor) => `(${factor.split('^')[1]} + 1)`).join(' × ')} = ${count}.\nConclusion: τ(${n}) = ${count}. Units: divisor count.`;
  }
  if (mode === 'multisetcombinations') {
    requireArgs(2, 'multisetCombinations(n, r)');
    const [n, r] = values;
    requireNonnegative(n, 'n');
    requireNonnegative(r, 'r');
    const result = chooseBigInt(n + r - 1, r);
    return `Step 1: Use the combinations-with-repetition formula C(n + r - 1, r).\nStep 2: Substitute n = ${n} and r = ${r}: C(${n + r - 1}, ${r}).\nConclusion: Combinations with repetition = ${result}. Units: number of combinations.`;
  }
  if (mode === 'starsandbars') {
    requireArgs(2, 'starsAndBars(total, parts)');
    const [total, parts] = values;
    requireNonnegative(total, 'Total');
    if (parts < 1) throw new Error('Parts must be a positive integer.');
    const result = chooseBigInt(total + parts - 1, parts - 1);
    return `Step 1: Use stars and bars: C(total + parts - 1, parts - 1).\nStep 2: Substitute total = ${total} and parts = ${parts}: C(${total + parts - 1}, ${parts - 1}).\nConclusion: Non-negative integer solutions = ${result}. Units: number of solutions.`;
  }
  if (mode === 'circularpermutations') {
    requireArgs(1, 'circularPermutations(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    return `Step 1: Fix one object to remove rotations that represent the same arrangement.\nStep 2: Arrange the remaining ${n - 1} objects in (${n} - 1)! = ${n - 1}! ways.\nConclusion: Distinct circular arrangements = ${factorialBigInt(n - 1)}. Units: number of arrangements.`;
  }
  if (mode === 'derangements') {
    requireArgs(1, 'derangements(n)');
    const [n] = values;
    requireNonnegative(n, 'n');
    let previous = 1n;
    if (n === 0) return 'Step 1: The empty arrangement has one derangement.\nConclusion: Derangements: !0 = 1. Units: number of arrangements.';
    let current = 0n;
    const recurrenceSteps = ['!0 = 1', '!1 = 0'];
    for (let index = 2; index <= n; index += 1) {
      [previous, current] = [current, BigInt(index - 1) * (current + previous)];
      recurrenceSteps.push(`!${index} = ${index - 1} × (!${index - 1} + !${index - 2}) = ${current}`);
    }
    return `Step 1: Start with ${recurrenceSteps.slice(0, 2).join(' and ')}.\nStep 2: Apply !n = (n - 1)(!(n - 1) + !(n - 2)): ${recurrenceSteps.slice(2).join('; ')}.\nConclusion: !${n} = ${current}. Units: number of arrangements.`;
  }
  throw new Error('Unknown number theory or combinatorics formula.');
}