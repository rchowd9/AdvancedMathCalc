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
    if (n < 2) return `${n} is not prime.`;
    for (let divisor = 2; divisor * divisor <= n; divisor += 1) if (n % divisor === 0) return `${n} is composite; ${divisor} is a divisor.`;
    return `${n} is prime.`;
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
    return `Repeated squaring gives ${base}^${exponent} mod ${modulus} = ${result}.`;
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
    return `Euler's totient: φ(${n}) = ${result}, using φ(n) = n ∏(1 - 1/p) over prime divisors p of n.`;
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
    return `If n = ∏pᵢ^aᵢ, then τ(n) = ∏(aᵢ + 1). Therefore τ(${n}) = ${count}.`;
  }
  if (mode === 'multisetcombinations') {
    requireArgs(2, 'multisetCombinations(n, r)');
    const [n, r] = values;
    requireNonnegative(n, 'n');
    requireNonnegative(r, 'r');
    const result = chooseBigInt(n + r - 1, r);
    return `Combinations with repetition: C(n + r - 1, r) = C(${n + r - 1}, ${r}) = ${result}.`;
  }
  if (mode === 'starsandbars') {
    requireArgs(2, 'starsAndBars(total, parts)');
    const [total, parts] = values;
    requireNonnegative(total, 'Total');
    if (parts < 1) throw new Error('Parts must be a positive integer.');
    const result = chooseBigInt(total + parts - 1, parts - 1);
    return `Non-negative integer solutions: C(total + parts - 1, parts - 1) = C(${total + parts - 1}, ${parts - 1}) = ${result}.`;
  }
  if (mode === 'circularpermutations') {
    requireArgs(1, 'circularPermutations(n)');
    const [n] = values;
    if (n < 1) throw new Error('n must be a positive integer.');
    return `Distinct circular arrangements: (n - 1)! = ${n - 1}! = ${factorialBigInt(n - 1)}.`;
  }
  if (mode === 'derangements') {
    requireArgs(1, 'derangements(n)');
    const [n] = values;
    requireNonnegative(n, 'n');
    let previous = 1n;
    if (n === 0) return 'Derangements: !0 = 1.';
    let current = 0n;
    for (let index = 2; index <= n; index += 1) {
      [previous, current] = [current, BigInt(index - 1) * (current + previous)];
    }
    return `Derangements satisfy !n = (n - 1)(!(n - 1) + !(n - 2)); !${n} = ${current}.`;
  }
  throw new Error('Unknown number theory or combinatorics formula.');
}