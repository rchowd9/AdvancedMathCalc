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