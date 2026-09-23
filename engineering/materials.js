export function density(mass, volume) {
  return mass / volume;
}

export function youngsModulus(stress, strain) {
  return stress / strain;
}

export function thermalExpansion(alpha, originalLength, deltaTemperature) {
  return alpha * originalLength * deltaTemperature;
}

export function fractureStress(fractureToughness, geometryFactor, crackLength) {
  return fractureToughness / (geometryFactor * Math.sqrt(Math.PI * crackLength));
}

export function ruleOfMixtures(fiberFraction, fiberProperty, matrixFraction, matrixProperty) {
  return fiberFraction * fiberProperty + matrixFraction * matrixProperty;
}

export function hardnessConversion(value, conversionFactor) {
  return value * conversionFactor;
}

export function diffusionLength(diffusionCoefficient, time) {
  return Math.sqrt(diffusionCoefficient * time);
}
