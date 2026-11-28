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

function image 
{
    
}

function preimage
{
    
}

function injection
{
    
}

function surjection
{
    
}

function bijection
{
    
}

function invertible
{
    
}

function identityPermutation
{
    
}

function inversePermutation
{
    
}

function permutationMultiplication
{
    
}

function transposition
{
    
}

function disjointCycle
{
    
}

function permutationGroup
{
    
}

function corollary
{
    
}