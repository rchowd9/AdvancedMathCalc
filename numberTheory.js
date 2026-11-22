function modularArithmetic(a, n) {

    return ((a % n) + n) % n;
}

function chineseRemainderTheorem(
    remainders,
    moduli
) {

    const M =
        moduli.reduce(
            (a,b) => a*b,
            1
        );

    let solution = 0;

    for (
        let i = 0;
        i < moduli.length;
        i++
    ) {

        const Mi =
            M / moduli[i];

        const inverse =
            extendedEuclid(
                Mi,
                moduli[i]
            ).x;

        solution +=
            remainders[i] *
            Mi *
            inverse;
    }

    return {
        solution:
            ((solution % M) + M) % M,
        modulus: M
    };
}

function millerRabinTest(
    n,
    k = 8
) {

    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0) return false;

    let r = 0;
    let d = n - 1;

    while (d % 2 === 0) {
        r++;
        d /= 2;
    }

    function modPow(
        base,
        exp,
        mod
    ) {

        let result = 1;

        base %= mod;

        while (exp > 0) {

            if (exp & 1) {
                result =
                    (result * base) % mod;
            }

            base =
                (base * base) % mod;

            exp >>= 1;
        }

        return result;
    }

    for (let i = 0; i < k; i++) {

        const a =
            2 +
            Math.floor(
                Math.random() *
                (n - 4)
            );

        let x =
            modPow(a, d, n);

        if (
            x === 1 ||
            x === n - 1
        ) {
            continue;
        }

        let continueOuter =
            false;

        for (
            let j = 0;
            j < r - 1;
            j++
        ) {

            x =
                (x * x) % n;

            if (x === n - 1) {
                continueOuter = true;
                break;
            }
        }

        if (continueOuter) {
            continue;
        }

        return false;
    }

    return true;
}

function cyclicGroup(g, n) {

    const elements = [];

    let current = 1;

    do {

        elements.push(current);

        current =
            (current * g) % n;

    } while (
        current !== 1
    );

    return {
        generator: g,
        modulus: n,
        group: elements
    };
}

function quadraticResidue(
    a,
    n
) {

    a =
        modularArithmetic(
            a,
            n
        );

    for (
        let x = 0;
        x < n;
        x++
    ) {

        if (
            (x*x)%n === a
        ) {

            return {
                residue: true,
                witness: x
            };
        }
    }

    return {
        residue: false
    };
}

function generator(
    g,
    n
) {

    const seen =
        new Set();

    let current = 1;

    do {

        current =
            (current * g) % n;

        seen.add(current);

    } while (
        current !== 1
    );

    return {
        generator: g,
        order:
            seen.size,
        elements:
            [...seen]
    };
}

function extendedEuclid(a, b) {

    if (b === 0) {
        return {
            gcd: a,
            x: 1,
            y: 0
        };
    }

    const result =
        extendedEuclid(
            b,
            a % b
        );

    return {
        gcd: result.gcd,
        x: result.y,
        y: result.x -
           Math.floor(a / b) *
           result.y
    };
}

function generalSolution(
    a,
    b,
    n
) {

    const eg =
        extendedEuclid(
            a,
            n
        );

    if (
        b % eg.gcd !== 0
    ) {

        return {
            solvable:false
        };
    }

    const x0 =
        modularArithmetic(
            eg.x *
            (b / eg.gcd),
            n
        );

    return {
        solvable:true,
        gcd:eg.gcd,
        particularSolution:x0
    };
}

function compositeModuli(n) {

    if (n < 2) {
        return {
            composite: false,
            factors: []
        };
    }

    const factors = [];

    let temp = n;

    for (let i = 2; i * i <= temp; i++) {

        while (temp % i === 0) {
            factors.push(i);
            temp /= i;
        }
    }

    if (temp > 1) {
        factors.push(temp);
    }

    return {
        modulus: n,
        composite: factors.length > 1,
        factors
    };
}

function wilsonTheorem(p) {

    if (p < 2) {
        return {
            valid: false,
            reason: "p must be ≥ 2"
        };
    }

    let factorial = 1;

    for (let i = 2; i < p; i++) {
        factorial = (factorial * i) % p;
    }

    const result =
        factorial === p - 1;

    return {
        p,
        factorialModP: factorial,
        prime: result,
        theorem:
            "(p-1)! ≡ -1 (mod p)"
    };
}

function rootOfPolynomial(coefficients) {

    if (!Array.isArray(coefficients)) {
        throw new Error(
            "Input must be an array of coefficients."
        );
    }

    const degree =
        coefficients.length - 1;

    const roots = [];

    function evaluate(x) {

        let result = 0;

        for (
            let i = 0;
            i < coefficients.length;
            i++
        ) {
            result =
                result * x +
                coefficients[i];
        }

        return result;
    }

    function derivative(x) {

        let result = 0;

        for (
            let i = 0;
            i < degree;
            i++
        ) {

            result =
                result * x +
                coefficients[i] *
                (degree - i);
        }

        return result;
    }

    function newton(initialGuess) {

        let x = initialGuess;

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const fx =
                evaluate(x);

            const dfx =
                derivative(x);

            if (
                Math.abs(dfx) < 1e-12
            ) {
                break;
            }

            const next =
                x - fx / dfx;

            if (
                Math.abs(next - x)
                < 1e-10
            ) {
                return next;
            }

            x = next;
        }

        return x;
    }

    for (
        let guess = -20;
        guess <= 20;
        guess += 1
    ) {

        const root =
            newton(guess);

        const alreadyFound =
            roots.some(
                r =>
                    Math.abs(r - root)
                    < 1e-6
            );

        if (
            Math.abs(
                evaluate(root)
            ) < 1e-6 &&
            !alreadyFound
        ) {

            roots.push(root);
        }
    }

    return {
        degree,
        coefficients,
        roots
    };
}

function totient(n) {

    let result = n;

    let temp = n;

    for (let p = 2; p * p <= temp; p++) {

        if (temp % p === 0) {

            while (temp % p === 0) {
                temp /= p;
            }

            result -= result / p;
        }
    }

    if (temp > 1) {
        result -= result / temp;
    }

    return result;
}

function modularExponentiation(base, exponent, modulus) {

    if (modulus === 1) return 0;

    let result = 1;

    base %= modulus;

    while (exponent > 0) {

        if (exponent & 1) {
            result = (result * base) % modulus;
        }

        exponent >>= 1;

        base = (base * base) % modulus;
    }

    return result;
}

function discreteLog(g, h, p) {

    let value = 1;

    for (let x = 0; x < p; x++) {

        if (value === h) {
            return x;
        }

        value = (value * g) % p;
    }

    return null;
}

function nonUnit(n) {

    const elements = [];

    for (let i = 0; i < n; i++) {

        if (math.gcd(i, n) !== 1) {
            elements.push(i);
        }
    }

    return elements;
}


function unitOrder()
{

}

function EulerTheorem()
{

}

function RSA()
{

}

function FermatTest()
{

}

function LagrangeTheorem()
{

}

function groupIsomorphism()
{

}

function coPrime()
{

}