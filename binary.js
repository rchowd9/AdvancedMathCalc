export function binary_to_decimal(binary_str) 
{
    let decimal = 0;
    for (let i = 0; i < binary_str.length; i++) {
        if (binary_str[i] === '1') {
            decimal += Math.pow(2, binary_str.length - 1 - i);
        }
    }
    return decimal;
}

export function decimal_to_binary(decimal) {
    if (decimal === 0) return '0';
    let binary = '';
    while (decimal > 0) {
        binary = (decimal % 2) + binary;
        decimal = Math.floor(decimal / 2);
    }
    return binary;
}

export function hexadecimal_to_octal(hexadecimal_str) 
{
    let decimal = parseInt(hexadecimal_str, 16);
    return decimal_to_octal(decimal);
}

export function hexadecimal_to_binary(hexadecimal_str) 
{
    let decimal = parseInt(hexadecimal_str, 16);
    return decimal_to_binary(decimal);
}

export function decimal_to_octal(decimal) 
{
    if (decimal === 0) return '0';
    let octal = '';
    while (decimal > 0) {
        octal = (decimal % 8) + octal;
        decimal = Math.floor(decimal / 8);
    }
    return octal;
}

export function decimal_to_hexadecimal(decimal) 
{
    if (decimal === 0) return '0';
    let hexadecimal = '';
    while (decimal > 0) {
        hexadecimal = (decimal % 16).toString(16).toUpperCase() + hexadecimal;
        decimal = Math.floor(decimal / 16);
    }
    return hexadecimal;
}

export function binary_addition(binary1, binary2) {
    let decimal1 = binary_to_decimal(binary1);
    let decimal2 = binary_to_decimal(binary2);
    let sum = decimal1 + decimal2;
    return decimal_to_binary(sum);
}


export function twos_complement(binary_str) 
{
    const inverted = binary_str.replace(/[01]/g, bit => bit === '1' ? '0' : '1');
    const sum = BigInt(`0b${inverted}`) + 1n;
    return (sum & ((1n << BigInt(binary_str.length)) - 1n))
        .toString(2)
        .padStart(binary_str.length, '0');
}

export function negate_twos_complement(binary_str) 
{
    const width = binary_str.length;
    const unsignedValue = binary_to_decimal(binary_str);
    const value = binary_str[0] === '1' ? unsignedValue - (2 ** width) : unsignedValue;
    const negated = -value;
    return (BigInt(negated) & ((1n << BigInt(width)) - 1n))
        .toString(2)
        .padStart(width, '0');
}

export function hamming_distance(binary1, binary2) 
{
    if (binary1.length !== binary2.length) {
        throw new Error("Binary strings must be of the same length");
    }
    let distance = 0;
    for (let i = 0; i < binary1.length; i++) {
        if (binary1[i] !== binary2[i]) {
            distance++;
        }
    }
    return distance;
}

export function sign_magnitude(binary_str) {
    let sign = binary_str[0] === '1' ? -1 : 1;
    let magnitude = binary_str.slice(1);
    return sign * binary_to_decimal(magnitude);
}

export function sign_extension(binary_str, new_length) {
    if (new_length < binary_str.length) {
        throw new Error("New length must be at least the original binary string length");
    }
    let sign = binary_str[0] === '1' ? '1' : '0';
    let extended = sign.repeat(new_length - binary_str.length) + binary_str;
    return extended;
}

export function decimal_to_floating_point(decimal, precision = 23, exponent_bits = 8) {
    return encode_floating_point(decimal, precision, exponent_bits);
}

export function fraction_to_floating_point(fraction, precision = 23, exponent_bits = 8) {
    return encode_floating_point(fraction, precision, exponent_bits);
}

export function binary_multiplication(binary1, binary2) {
    let decimal1 = binary_to_decimal(binary1);
    let decimal2 = binary_to_decimal(binary2);
    return decimal_to_binary(decimal1 * decimal2);
}

export function binary_division(binary1, binary2) {
    let decimal1 = binary_to_decimal(binary1);
    let decimal2 = binary_to_decimal(binary2);
    if (decimal2 === 0) throw new Error("Cannot divide by zero");
    return decimal_to_binary(Math.floor(decimal1 / decimal2));
}

function encode_floating_point(value, precision, exponent_bits) {
    if (!Number.isFinite(value)) throw new Error("Floating-point input must be finite");
    if (!Number.isInteger(precision) || precision < 1 ||
        !Number.isInteger(exponent_bits) || exponent_bits < 2) {
        throw new Error("Precision must be positive and exponent bits must be at least 2");
    }

    const sign = value < 0 ? '1' : '0';
    const magnitude = Math.abs(value);
    if (magnitude === 0) return sign + '0'.repeat(exponent_bits + precision);

    const exponent = Math.floor(Math.log2(magnitude));
    const bias = 2 ** (exponent_bits - 1) - 1;
    const biasedExponent = exponent + bias;
    if (biasedExponent <= 0 || biasedExponent >= (2 ** exponent_bits) - 1) {
        throw new RangeError("Value is outside the supported normalized floating-point range");
    }

    let normalizedFraction = magnitude / (2 ** exponent) - 1;
    let mantissa = '';
    for (let i = 0; i < precision; i++) {
        normalizedFraction *= 2;
        if (normalizedFraction >= 1) {
            mantissa += '1';
            normalizedFraction -= 1;
        } else {
            mantissa += '0';
        }
    }
    const exponentBinary = biasedExponent.toString(2).padStart(exponent_bits, '0');
    return sign + exponentBinary + mantissa;
}

function divisionTrace(value, base) {
    const steps = [];
    let remaining = value;
    while (remaining > 0) {
        const quotient = Math.floor(remaining / base);
        const remainder = remaining % base;
        steps.push(`${remaining} ÷ ${base} = ${quotient} remainder ${remainder}`);
        remaining = quotient;
    }
    return steps;
}

function binaryPlaceValueSteps(binary) {
    return [...binary].map((bit, index) => {
        const power = binary.length - index - 1;
        return `${bit} × 2^${power} = ${Number(bit) * (2 ** power)}`;
    });
}

function explanation(steps, result) {
    return `${steps.map((step, index) => `Step ${index + 1}: ${step}`).join('\n')}\nAnswer: ${result}`;
}

export const BINARY_EXPLANATIONS = {
    binary_to_decimal(binary) {
        const terms = binaryPlaceValueSteps(binary);
        const result = binary_to_decimal(binary);
        return explanation([
            `Assign powers of 2 from right to left: ${terms.join(' + ')}.`,
            `Add the place values: ${terms.map(term => term.split(' = ')[1]).join(' + ')} = ${result}.`,
        ], result);
    },
    decimal_to_binary(decimal) {
        const divisions = divisionTrace(decimal, 2);
        const result = decimal_to_binary(decimal);
        return explanation([
            ...divisions.map(step => `Repeatedly divide by 2: ${step}.`),
            `Read the remainders from bottom to top: ${result}.`,
        ], result);
    },
    hexadecimal_to_octal(hexadecimal) {
        const decimal = parseInt(hexadecimal, 16);
        const result = hexadecimal_to_octal(hexadecimal);
        return explanation([
            `Convert hexadecimal ${hexadecimal} to decimal: ${decimal}.`,
            `Convert ${decimal} to octal by repeated division by 8; read remainders upward: ${result}.`,
        ], result);
    },
    hexadecimal_to_binary(hexadecimal) {
        const digits = [...hexadecimal.toUpperCase()].map(digit =>
            `${digit}₁₆ = ${parseInt(digit, 16).toString(2).padStart(4, '0')}`
        );
        const result = hexadecimal_to_binary(hexadecimal);
        return explanation([
            `Convert each hexadecimal digit to 4 bits: ${digits.join(', ')}.`,
            `Join the bit groups: ${result}.`,
        ], result);
    },
    decimal_to_octal(decimal) {
        const divisions = divisionTrace(decimal, 8);
        const result = decimal_to_octal(decimal);
        return explanation([
            ...divisions.map(step => `Repeatedly divide by 8: ${step}.`),
            `Read the remainders from bottom to top: ${result}.`,
        ], result);
    },
    decimal_to_hexadecimal(decimal) {
        const divisions = divisionTrace(decimal, 16);
        const result = decimal_to_hexadecimal(decimal);
        return explanation([
            ...divisions.map(step => `Repeatedly divide by 16: ${step}.`),
            `Convert remainders 10–15 to A–F, then read upward: ${result}.`,
        ], result);
    },
    binary_addition(binary1, binary2) {
        const value1 = binary_to_decimal(binary1);
        const value2 = binary_to_decimal(binary2);
        const result = binary_addition(binary1, binary2);
        return explanation([
            `${binary1}_2 = ${value1}_10 and ${binary2}_2 = ${value2}_10.`,
            `Add in decimal: ${value1} + ${value2} = ${value1 + value2}.`,
            `Convert ${value1 + value2} back to binary: ${result}.`,
        ], result);
    },
    twos_complement(binary) {
        const inverted = binary.replace(/[01]/g, bit => bit === '1' ? '0' : '1');
        const result = twos_complement(binary);
        return explanation([
            `Invert each bit: ${binary} → ${inverted}.`,
            `Add 1 to the inverted bits, keeping the original ${binary.length}-bit width.`,
        ], result);
    },
    negate_twos_complement(binary) {
        const unsignedValue = binary_to_decimal(binary);
        const signedValue = binary[0] === '1' ? unsignedValue - (2 ** binary.length) : unsignedValue;
        const result = negate_twos_complement(binary);
        return explanation([
            `Interpret ${binary} as a ${binary.length}-bit two's-complement number: ${signedValue}.`,
            `Negate the value: -(${signedValue}) = ${-signedValue}.`,
            `Encode the result using the same ${binary.length}-bit width.`,
        ], result);
    },
    hamming_distance(binary1, binary2) {
        const differences = [...binary1].flatMap((bit, index) =>
            bit === binary2[index] ? [] : [`position ${index + 1}: ${bit} ≠ ${binary2[index]}`]
        );
        const result = hamming_distance(binary1, binary2);
        return explanation([
            `Compare corresponding bits: ${differences.length ? differences.join('; ') : 'all positions match'}.`,
            `Count the differing positions: ${result}.`,
        ], result);
    },
    sign_magnitude(binary) {
        const result = sign_magnitude(binary);
        return explanation([
            `Read the first bit as the sign: ${binary[0] === '1' ? 'negative' : 'positive'}.`,
            `Convert the remaining magnitude bits ${binary.slice(1)} to decimal: ${binary_to_decimal(binary.slice(1))}.`,
        ], result);
    },
    sign_extension(binary, newLength) {
        const result = sign_extension(binary, newLength);
        return explanation([
            `The sign bit is ${binary[0]}.`,
            `Repeat it ${newLength - binary.length} time(s) to extend the ${binary.length}-bit value to ${newLength} bits.`,
        ], result);
    },
    decimal_to_floating_point(value, precision = 23, exponentBits = 8) {
        return explainFloatingPoint(value, precision, exponentBits, decimal_to_floating_point);
    },
    fraction_to_floating_point(value, precision = 23, exponentBits = 8) {
        return explainFloatingPoint(value, precision, exponentBits, fraction_to_floating_point);
    },
    binary_multiplication(binary1, binary2) {
        const value1 = binary_to_decimal(binary1);
        const value2 = binary_to_decimal(binary2);
        const result = binary_multiplication(binary1, binary2);
        return explanation([
            `${binary1}_2 = ${value1}_10 and ${binary2}_2 = ${value2}_10.`,
            `Multiply in decimal: ${value1} × ${value2} = ${value1 * value2}.`,
            `Convert ${value1 * value2} to binary: ${result}.`,
        ], result);
    },
    binary_division(binary1, binary2) {
        const value1 = binary_to_decimal(binary1);
        const value2 = binary_to_decimal(binary2);
        const result = binary_division(binary1, binary2);
        return explanation([
            `${binary1}_2 = ${value1}_10 and ${binary2}_2 = ${value2}_10.`,
            `Divide in decimal: ${value1} ÷ ${value2} = ${value1 / value2}; take the integer quotient ${Math.floor(value1 / value2)}.`,
            `Convert the quotient to binary: ${result}.`,
        ], result);
    },
};

function explainFloatingPoint(value, precision, exponentBits, convert) {
    const result = convert(value, precision, exponentBits);
    if (value === 0) {
        return explanation(['Zero is represented by a zero sign bit, exponent, and mantissa.'], result);
    }
    const sign = value < 0 ? 1 : 0;
    const exponent = Math.floor(Math.log2(Math.abs(value)));
    const normalized = Math.abs(value) / (2 ** exponent);
    const bias = 2 ** (exponentBits - 1) - 1;
    const biasedExponent = exponent + bias;
    const exponentBinary = biasedExponent.toString(2).padStart(exponentBits, '0');
    const mantissa = result.slice(1 + exponentBits);
    return explanation([
        `Set the sign bit: ${sign}.`,
        `Normalize the magnitude: ${Math.abs(value)} = ${normalized} × 2^${exponent}.`,
        `Add the exponent bias ${bias}: ${exponent} + ${bias} = ${biasedExponent} = ${exponentBinary}_2.`,
        `Write the ${precision}-bit fractional mantissa: ${mantissa}.`,
        'Concatenate the sign, biased exponent, and mantissa.',
    ], result);
}
