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