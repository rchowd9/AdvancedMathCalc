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

function substituteQuantifier(
    expression,
    variable,
    replacement
) {

    const regex =
        new RegExp(
            `\\b${variable}\\b`,
            'g'
        );

    return expression.replace(
        regex,
        replacement
    );
}

function skolemConstant(
    existentialVariable,
    constantName = "c"
) {

    return {
        originalVariable:
            existentialVariable,

        skolemConstant:
            constantName,

        transformation:
            `∃${existentialVariable} P(${existentialVariable}) → P(${constantName})`
    };
}

const artificialIntelligenceFunctions = {
    unaryRelation,
    nAryRelation,
    funcRelation,
    universalQuantifier,
    existentialQuantifier,
    nestedQuantifier,
    DeMorgan,
    generalizedDeMorgan,
    Axiom,
    substituteQuantifier,
    skolemConstant
};

export const ARTIFICIAL_INTELLIGENCE_MODE_NAMES = new Set(
    Object.keys(artificialIntelligenceFunctions).map(name => name.toLowerCase())
);

export function solveArtificialIntelligence(mode, values) {
    const canonicalName = Object.keys(artificialIntelligenceFunctions)
        .find(name => name.toLowerCase() === mode.toLowerCase());
    if (!canonicalName) {
        throw new Error(`Unknown artificial-intelligence formula: ${mode}.`);
    }

    const modeName = canonicalName.toLowerCase();
    let result;
    let formula;

    if (modeName === 'demorgan') {
        if (values.length !== 1 || typeof values[0] !== 'string') {
            throw new Error('Use DeMorgan(expression) with a propositional expression string.');
        }
        result = DeMorgan(values[0]);
        formula = '¬(A ∧ B) = ¬A ∨ ¬B; ¬(A ∨ B) = ¬A ∧ ¬B';
    } else if (modeName === 'generalizeddemorgan') {
        if (values.length !== 2 || typeof values[0] !== 'string' || !Array.isArray(values[1])) {
            throw new Error('Use generalizedDeMorgan("AND"|"OR", [A, B, ...]).');
        }
        result = generalizedDeMorgan(values[0], values[1]);
        formula = 'De Morgan generalized: ¬(A₁ op A₂ op ...) = ¬A₁ inverse-op ¬A₂ inverse-op ...';
    } else if (modeName === 'funcrelation') {
        if (values.length !== 1 || !Array.isArray(values[0])) {
            throw new Error('Use funcRelation([[domain, range], ...]).');
        }
        result = funcRelation(values[0]);
        formula = 'A relation is a function when each domain value maps to exactly one range value.';
    } else if (modeName === 'naryrelation') {
        if (values.length === 0 || values.some(set => !Array.isArray(set))) {
            throw new Error('nAryRelation arguments must be arrays.');
        }
        result = nAryRelation(...values);
        formula = 'n-ary relation = A₁ × A₂ × ... × Aₙ';
    } else if (modeName === 'axiom') {
        if (values.length !== 1) throw new Error('Use Axiom(statement).');
        result = Axiom(String(values[0]));
        formula = 'An axiom is an accepted foundational statement.';
    } else if (modeName === 'substitutequantifier') {
        if (values.length !== 3 || typeof values[0] !== 'string' ||
            typeof values[1] !== 'string' || typeof values[2] !== 'string') {
            throw new Error('Use substituteQuantifier(expression, variable, replacement).');
        }
        result = substituteQuantifier(values[0], values[1], values[2]);
        formula = 'Substitute the replacement for every free occurrence of the quantified variable.';
    } else if (modeName === 'skolemconstant') {
        if (values.length < 1 || values.length > 2 || typeof values[0] !== 'string') {
            throw new Error('Use skolemConstant(variable, [constantName]).');
        }
        result = skolemConstant(values[0], values[1] || 'c');
        formula = 'Existential elimination introduces a fresh Skolem constant.';
    } else {
        throw new Error(`${canonicalName} requires an interactive predicate and is not available as a calculator expression.`);
    }

    const formatValue = value => {
        if (Array.isArray(value)) return `[${value.map(formatValue).join(', ')}]`;
        if (value && typeof value === 'object') {
            return `{ ${Object.entries(value).map(([key, item]) => `${key}: ${formatValue(item)}`).join(', ')} }`;
        }
        return String(value);
    };

    return [
        `Artificial intelligence — ${canonicalName}`,
        `Step 1: Identify the inputs: ${values.map(formatValue).join(', ')}.`,
        `Step 2: Apply the rule: ${formula}.`,
        `Result: ${formatValue(result)}`
    ].join('\n');
}

export {
    unaryRelation,
    nAryRelation,
    funcRelation,
    universalQuantifier,
    existentialQuantifier,
    nestedQuantifier,
    DeMorgan,
    generalizedDeMorgan,
    Axiom,
    substituteQuantifier,
    skolemConstant
};