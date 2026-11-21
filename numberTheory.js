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

function compositeModuli()
{

}

function wilsonTheorem()