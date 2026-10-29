export function master_theorem(a, b, f) {
    const exponent = Math.log(a) / Math.log(b);
    const base = `n^(${exponent})`;

    return `T(n) = ${a}T(n/${b}) + ${f}\n` +
        `Let p = log_${b}(${a}) = ${exponent}. Then:\n` +
        `1. If ${f} = O(n^(p - ε)), T(n) = Θ(${base}).\n` +
        `2. If ${f} = Θ(n^p log^k(n)), k ≥ 0, T(n) = Θ(n^p log^(k + 1)(n)).\n` +
        `3. If ${f} = Ω(n^(p + ε)) and ${a}${f}(n/${b}) ≤ c${f}(n) for some c < 1, ` +
        `T(n) = Θ(${f}).`;
}

export function linear_probing(hash, size, attempt = 0) 
{
    return (hash % size + attempt) % size;
}

export function quadratic_probing(hash, size, attempt = 0)
{
    return (hash % size + attempt ** 2) % size;
}

export function double_hashing(hash, size, attempt = 0, hash2)
{
    return (hash % size + attempt * hash2) % size;
}

export function load_factor(num_elements, table_size) {
    return num_elements / table_size;
}

export function modulo_division_hash(key, table_size) {
    return key % table_size;
}

export function multiplicative_hash(key, table_size) {
    const A = (Math.sqrt(5) - 1) / 2; // Knuth's suggestion
    const fractional_part = (key * A) % 1;
    return Math.floor(table_size * fractional_part);
}

const describeResult = (steps, result) =>
    `${steps.join('\n')}\nAnswer: ${result}`;

export const COMPUTER_SCIENCE_EXPLANATIONS = {
    master_theorem(a, b, f) {
        const exponent = Math.log(a) / Math.log(b);
        const result = master_theorem(a, b, f);
        const powerMatch = String(f).trim().match(/^n(?:\s*\^\s*(-?\d+(?:\.\d+)?))?$/i);
        const fExponent = powerMatch ? Number(powerMatch[1] ?? 1) : null;
        const steps = [
            `Step 1: Write the recurrence as T(n) = ${a}T(n/${b}) + ${f}.`,
            `Step 2: Compute p = log_${b}(${a}) = ${exponent}.`,
        ];

        if (fExponent !== null) {
            steps.push(`Step 3: Since f(n) = n^${fExponent}, compare its exponent with p = ${exponent}.`);
            if (fExponent < exponent) {
                steps.push(`Step 4: f(n) has the smaller exponent, so Master theorem case 1 gives T(n) = Θ(n^${exponent}).`);
            } else if (fExponent === exponent) {
                steps.push(`Step 4: f(n) matches n^p, so case 2 gives T(n) = Θ(n^${exponent} log n).`);
            } else {
                steps.push(`Step 4: f(n) has the larger exponent. If the regularity condition holds, case 3 gives T(n) = Θ(${f}).`);
            }
        } else {
            steps.push(`Step 3: Compare f(n) = ${f} with n^${exponent} and check the regularity condition to select a case.`);
            steps.push(`Step 4: Apply the matching case shown below.`);
        }

        return `${steps.join('\n')}\n${result}`;
    },
    linear_probing(hash, size, attempt = 0) {
        const result = linear_probing(hash, size, attempt);
        return describeResult([
            `Step 1: Use the linear probing formula (hash + attempt) mod table size.`,
            `Step 2: Substitute (${hash} + ${attempt}) mod ${size}.`,
        ], result);
    },
    quadratic_probing(hash, size, attempt = 0) {
        const result = quadratic_probing(hash, size, attempt);
        return describeResult([
            `Step 1: Use the quadratic probing formula (hash + attempt²) mod table size.`,
            `Step 2: Substitute (${hash} + ${attempt}²) mod ${size}.`,
        ], result);
    },
    double_hashing(hash, size, attempt = 0, hash2) {
        const result = double_hashing(hash, size, attempt, hash2);
        return describeResult([
            `Step 1: Use the double hashing formula (hash + attempt × second hash) mod table size.`,
            `Step 2: Substitute (${hash} + ${attempt} × ${hash2}) mod ${size}.`,
        ], result);
    },
    load_factor(num_elements, table_size) {
        const result = load_factor(num_elements, table_size);
        return describeResult([
            'Step 1: Use load factor = number of elements ÷ table size.',
            `Step 2: Substitute ${num_elements} ÷ ${table_size}.`,
        ], result);
    },
    modulo_division_hash(key, table_size) {
        const result = modulo_division_hash(key, table_size);
        return describeResult([
            'Step 1: Use the division hash formula key mod table size.',
            `Step 2: Divide ${key} by ${table_size} and take the remainder.`,
        ], result);
    },
    multiplicative_hash(key, table_size) {
        const A = (Math.sqrt(5) - 1) / 2;
        const product = key * A;
        const fractionalPart = product % 1;
        const result = multiplicative_hash(key, table_size);
        return describeResult([
            `Step 1: Set A = (√5 - 1) / 2 ≈ ${A}.`,
            `Step 2: Multiply the key by A: ${key} × ${A} = ${product}.`,
            `Step 3: Keep the fractional part, ${fractionalPart}, and multiply by table size ${table_size}.`,
            `Step 4: Take the floor of ${table_size * fractionalPart}.`,
        ], result);
    },
};