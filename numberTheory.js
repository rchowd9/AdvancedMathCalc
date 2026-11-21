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

function millerRabinTest()
{

}

function cyclicGroup()
{

}

function quadraticResidue()
{

}

function generator()
{

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

function generalSolution()
{

}

