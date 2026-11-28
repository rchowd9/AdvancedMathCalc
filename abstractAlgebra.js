function cardinality(set) {

    return {
        set,
        cardinality: new Set(set).size
    };
}

function emptySet() {

    return {
        set: [],
        cardinality: 0,
        empty: true
    };
}


function set(elements) {

    return [...new Set(elements)];
}

function russellParadox() {

    return {
        statement:
            "R = {x | x ∉ x}",
        paradox:
            "If R ∈ R then R ∉ R. If R ∉ R then R ∈ R."
    };
}

function complement(
    universalSet,
    subset
) {

    return universalSet.filter(
        x => !subset.includes(x)
    );
}


function subset(A, B) {

    return A.every(
        x => B.includes(x)
    );
}

function relation(pairs) {

    return {
        relation: pairs,
        size: pairs.length
    };
}

function transitivity(rel) {

    for (const [a,b] of rel) {

        for (const [c,d] of rel) {

            if (b === c) {

                const exists =
                    rel.some(
                        ([x,y]) =>
                            x === a &&
                            y === d
                    );

                if (!exists) {
                    return false;
                }
            }
        }
    }

    return true;
}

function equivalenceRelation(
    rel,
    universe
) {

    const reflexive =
        universe.every(
            x =>
                rel.some(
                    ([a,b]) =>
                        a===x &&
                        b===x
                )
        );

    const symmetric =
        rel.every(
            ([a,b]) =>
                rel.some(
                    ([c,d]) =>
                        c===b &&
                        d===a
                )
        );

    const transitive =
        transitivity(rel);

    return {
        reflexive,
        symmetric,
        transitive,
        equivalence:
            reflexive &&
            symmetric &&
            transitive
    };
}

function image(
    func,
    domain
) {

    return domain.map(
        x => func(x)
    );
}

function preimage(
    func,
    codomainValue,
    domain
) {

    return domain.filter(
        x => func(x) === codomainValue
    );
}

function injection(
    func,
    domain
) {

    const outputs =
        domain.map(func);

    return new Set(outputs).size
        === outputs.length;
}

function surjection(
    func,
    domain,
    codomain
) {

    const outputs =
        new Set(
            domain.map(func)
        );

    return codomain.every(
        y => outputs.has(y)
    );
}

function bijection(
    func,
    domain,
    codomain
) {

    return (
        injection(func, domain) &&
        surjection(
            func,
            domain,
            codomain
        )
    );
}

function invertible(
    func,
    domain,
    codomain
) {

    return bijection(
        func,
        domain,
        codomain
    );
}

function identityPermutation(n) {

    return Array
        .from(
            {length:n},
            (_,i)=>i+1
        );
}

function inversePermutation
{
    
}

function permutationMultiplication(
    p1,
    p2
) {

    const result = [];

    for (
        let i = 0;
        i < p1.length;
        i++
    ) {

        result[i] =
            p1[
                p2[i]-1
            ];
    }

    return result;
}

function transposition(
    permutation,
    i,
    j
) {

    const result =
        [...permutation];

    [
        result[i],
        result[j]
    ] =
    [
        result[j],
        result[i]
    ];

    return result;
}

function disjointCycle(
    permutation
) {

    const visited =
        Array(
            permutation.length
        ).fill(false);

    const cycles = [];

    for (
        let i = 0;
        i < permutation.length;
        i++
    ) {

        if (!visited[i]) {

            let current = i;
            const cycle = [];

            while (
                !visited[current]
            ) {

                visited[current] = true;

                cycle.push(
                    current+1
                );

                current =
                    permutation[current]-1;
            }

            if (
                cycle.length > 1
            ) {
                cycles.push(cycle);
            }
        }
    }

    return cycles;
}

function permutationGroup(n) {

    function permute(arr) {

        if (
            arr.length <= 1
        ) return [arr];

        const result = [];

        for (
            let i = 0;
            i < arr.length;
            i++
        ) {

            const rest =
                [
                    ...arr.slice(0,i),
                    ...arr.slice(i+1)
                ];

            for (
                const p of permute(rest)
            ) {

                result.push(
                    [arr[i], ...p]
                );
            }
        }

        return result;
    }

    return permute(
        identityPermutation(n)
    );
}

function corollary(
    theorem,
    statement
) {

    return {
        theorem,
        corollary: statement,
        derived: true
    };
}