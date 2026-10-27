function binary_to_decimal(binary_str) 
{
    let decimal = 0;
    for (let i = 0; i < binary_str.length; i++) {
        if (binary_str[i] === '1') {
            decimal += Math.pow(2, binary_str.length - 1 - i);
        }
    }
    return decimal;
}

function decimal_to_binary(decimal) {
    if (decimal === 0) return '0';
    let binary = '';
    while (decimal > 0) {
        binary = (decimal % 2) + binary;
        decimal = Math.floor(decimal / 2);
    }
    return binary;
}

function hexadecimal_to_octal(hexadecimal_str) 
{
    let decimal = parseInt(hexadecimal_str, 16);
    return decimal_to_binary(decimal);
}

function hexadecimal_to_binary(hexadecimal_str) 
{
    let decimal = parseInt(hexadecimal_str, 16);
    return decimal_to_binary(decimal);
}

function decimal_to_octal(decimal) 
{
    if (decimal === 0) return '0';
    let octal = '';
    while (decimal > 0) {
        octal = (decimal % 8) + octal;
        decimal = Math.floor(decimal / 8);
    }
    return octal;
}

function decimal_to_hexadecimal(decimal) 
{
    if (decimal === 0) return '0';
    let hexadecimal = '';
    while (decimal > 0) {
        hexadecimal = (decimal % 16).toString(16).toUpperCase() + hexadecimal;
        decimal = Math.floor(decimal / 16);
    }
    return hexadecimal;
}

function binary_addition(binary1, binary2) {
    let decimal1 = binary_to_decimal(binary1);
    let decimal2 = binary_to_decimal(binary2);
    let sum = decimal1 + decimal2;
    return decimal_to_binary(sum);
}


function twos_complement(binary_str) 
{
    let decimal = binary_to_decimal(binary_str);
    let complement = ~decimal + 1; // Two's complement formula
    return decimal_to_binary(complement);
}

function negate_twos_complement(binary_str) 
{
    let decimal = binary_to_decimal(binary_str);
    let negated = -decimal;
    return decimal_to_binary(negated);
}

function hamming_distance(binary1, binary2) 
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

function sign_magnitude(binary_str) {
    let sign = binary_str[0] === '1' ? -1 : 1;
    let magnitude = binary_str.slice(1);
    return sign * binary_to_decimal(magnitude);
}

function sign_extension(binary_str, new_length) {
    let sign = binary_str[0] === '1' ? '1' : '0';
    let extended = sign.repeat(new_length - binary_str.length) + binary_str;
    return extended;
}

function decimal_to_floating_point(decimal, precision = 23, exponent_bits = 8) {