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