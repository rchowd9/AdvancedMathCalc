export const MATERIALS_ENGINEERING = {
  id: 'materials',
  name: 'Materials Engineering',
  formulas: {
    density: 'mass / volume',
    youngsModulus: 'stress / strain',
    thermalExpansion: 'alpha * originalLength * deltaTemperature',
    fractureStress: 'fractureToughness / (geometryFactor * sqrt(pi * crackLength))',
    ruleOfMixtures: 'fiberFraction * fiberProperty + matrixFraction * matrixProperty',
    hardnessConversion: 'empiricalConversion(hardnessScale, value)',
    diffusionLength: 'sqrt(diffusionCoefficient * time)',
  },
};
