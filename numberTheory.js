function modularArithmetic(a, n) {

    return ((a % n) + n) % n;
}

function chineseRemainderTheorem()
{

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

