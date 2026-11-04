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
    if (n < 2) return `${n} is not prime. Units: integer classification (dimensionless).`;
    for (let divisor = 2; divisor * divisor <= n; divisor += 1) if (n % divisor === 0) return `${n} is composite; ${divisor} is a divisor. Units: integer classification (dimensionless).`;
    return `${n} is prime. Units: integer classification (dimensionless).`;
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
    while (power > 0n) {
      if (power % 2n === 1n) result = (result * factor) % mod;
      factor = (factor * factor) % mod;
      power /= 2n;
    }
    return `Repeated squaring gives ${base}^${exponent} mod ${modulus} = ${result}. Units: dimensionless residue.`;
  }
  if (mode === 'eulerphi') {
    requireArgs(1, 'eulerPhi(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    let remaining = n;
    let result = n;
    for (let prime = 2; prime * prime <= remaining; prime += 1) {
      if (remaining % prime !== 0) continue;
      while (remaining % prime === 0) remaining /= prime;
      result -= result / prime;
    }
    if (remaining > 1) result -= result / remaining;
    return `Euler's totient: φ(${n}) = ${result}, using φ(n) = n ∏(1 - 1/p) over prime divisors p of n. Units: coprime-integer count.`;
  }
  if (mode === 'divisorcount') {
    requireArgs(1, 'divisorCount(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    let remaining = n;
    let count = 1;
    for (let prime = 2; prime * prime <= remaining; prime += 1) {
      let exponent = 0;
      while (remaining % prime === 0) {
        remaining /= prime;
        exponent += 1;
      }
      count *= exponent + 1;
    }
    if (remaining > 1) count *= 2;
    return `If n = ∏pᵢ^aᵢ, then τ(n) = ∏(aᵢ + 1). Therefore τ(${n}) = ${count}. Units: divisor count.`;
  }
  if (mode === 'multisetcombinations') {
    requireArgs(2, 'multisetCombinations(n, r)');
    const [n, r] = values;
    requireNonnegative(n, 'n');
    requireNonnegative(r, 'r');
    const result = chooseBigInt(n + r - 1, r);
    return `Combinations with repetition: C(n + r - 1, r) = C(${n + r - 1}, ${r}) = ${result}. Units: number of combinations.`;
  }
  if (mode === 'starsandbars') {
    requireArgs(2, 'starsAndBars(total, parts)');
    const [total, parts] = values;
    requireNonnegative(total, 'Total');
    if (parts < 1) throw new Error('Parts must be a positive integer.');
    const result = chooseBigInt(total + parts - 1, parts - 1);
    return `Non-negative integer solutions: C(total + parts - 1, parts - 1) = C(${total + parts - 1}, ${parts - 1}) = ${result}. Units: number of solutions.`;
  }
  if (mode === 'circularpermutations') {
    requireArgs(1, 'circularPermutations(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    return `Distinct circular arrangements: (n - 1)! = ${n - 1}! = ${factorialBigInt(n - 1)}. Units: number of arrangements.`;
  }
  if (mode === 'derangements') {
    requireArgs(1, 'derangements(n)');
    const [n] = values;
    requireNonnegative(n, 'n');
    let previous = 1n;
    if (n === 0) return 'Derangements: !0 = 1. Units: number of arrangements.';
    let current = 0n;
    for (let index = 2; index <= n; index += 1) {
      [previous, current] = [current, BigInt(index - 1) * (current + previous)];
    }
    return `Derangements satisfy !n = (n - 1)(!(n - 1) + !(n - 2)); !${n} = ${current}. Units: number of arrangements.`;
  }
  throw new Error('Unknown number theory or combinatorics formula.');
}