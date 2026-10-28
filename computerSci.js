function master_theorem(a, b, f) {
    const exponent = Math.log(a) / Math.log(b);
    const base = `n^(${exponent})`;

    return `T(n) = ${a}T(n/${b}) + ${f}\n` +
        `Let p = log_${b}(${a}) = ${exponent}. Then:\n` +
        `1. If ${f} = O(n^(p - ε)), T(n) = Θ(${base}).\n` +
        `2. If ${f} = Θ(n^p log^k(n)), k ≥ 0, T(n) = Θ(n^p log^(k + 1)(n)).\n` +
        `3. If ${f} = Ω(n^(p + ε)) and ${a}${f}(n/${b}) ≤ c${f}(n) for some c < 1, ` +
        `T(n) = Θ(${f}).`;
}

function linear_probing(hash, size, attempt = 0) 
{
    return (hash % size + attempt) % size;
}

function quadratic_probing(hash, size, attempt = 0)
{
    return (hash % size + attempt ** 2) % size;
}

function double_hashing(hash, size, attempt = 0, hash2)
{
    return (hash % size + attempt * hash2) % size;
}

function load_factor(num_elements, table_size) {
    return num_elements / table_size;
}