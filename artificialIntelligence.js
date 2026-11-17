function unaryRelation(set, predicate) {

    return set.filter(predicate);
}

// ================================
// n-ary Relation
// R ⊆ A₁ × A₂ × ... × Aₙ
// ================================

function nAryRelation(...sets) {

    let relation = [[]];

    for (const set of sets) {

        const temp = [];

        for (const tuple of relation) {

            for (const element of set) {
                temp.push([
                    ...tuple,
                    element
                ]);
            }
        }

        relation = temp;
    }

    return relation;
}

// ================================
// Function Relation
// Tests if relation represents a function
// ================================

function funcRelation(relation) {

    const domain = new Map();

    for (const [x, y] of relation) {

        if (
            domain.has(x) &&
            domain.get(x) !== y
        ) {

            return {
                isFunction: false
            };
        }

        domain.set(x, y);
    }

    return {
        isFunction: true
    };
}

// ================================
// Universal Quantifier
// ∀x P(x)
// ================================

function universalQuantifier(
    set,
    predicate
) {

    return set.every(predicate);
}

// ================================
// Existential Quantifier
// ∃x P(x)
// ================================

function existentialQuantifier(
    set,
    predicate
) {

    return set.some(predicate);
}
