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


// ======================================
// Nested Quantifier
// Example:
// ∀x ∈ A ∃y ∈ B : P(x,y)
// ======================================

function nestedQuantifier(
    setA,
    setB,
    predicate
) {

    for (const x of setA) {

        let found = false;

        for (const y of setB) {

            if (predicate(x, y)) {
                found = true;
                break;
            }
        }

        if (!found) {
            return false;
        }
    }

    return true;
}

function DeMorgan(expression) {

    expression =
        expression.replace(/\s+/g, '');

    expression =
        expression.replace(
            /~\(([A-Za-z])&([A-Za-z])\)/g,
            '(~$1|~$2)'
        );

    expression =
        expression.replace(
            /~\(([A-Za-z])\|([A-Za-z])\)/g,
            '(~$1&~$2)'
        );

    return expression;
}

function generalizedDeMorgan(
    operator,
    propositions
) {

    if (operator === "AND") {

        return (
            "~(" +
            propositions.join(" AND ") +
            ") = " +
            propositions
                .map(p => `~${p}`)
                .join(" OR ")
        );
    }

    if (operator === "OR") {

        return (
            "~(" +
            propositions.join(" OR ") +
            ") = " +
            propositions
                .map(p => `~${p}`)
                .join(" AND ")
        );
    }

    throw new Error(
        "Operator must be AND or OR."
    );
}

function Axiom(statement) {

    return {
        type: "Axiom",
        accepted: true,
        statement
    };
}

function substituteQuantifier()
{

}

function skolemConstant()
{

}