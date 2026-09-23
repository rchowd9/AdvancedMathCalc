export function bmi(mass, height) {
  return mass / height ** 2;
}

export function bloodFlow(pressureDifference, vascularResistance) {
  return pressureDifference / vascularResistance;
}

export function poiseuilleFlow(pressureDifference, radius, viscosity, length) {
  return Math.PI * pressureDifference * radius ** 4 / (8 * viscosity * length);
}

export function diffusionFlux(diffusionCoefficient, concentrationGradient) {
  return -diffusionCoefficient * concentrationGradient;
}

export function drugDose(targetConcentration, bodyMass, bioavailability) {
  return targetConcentration * bodyMass / bioavailability;
}

export function oxygenDelivery(cardiacOutput, arterialOxygenContent) {
  return cardiacOutput * arterialOxygenContent;
}

export function biomedicalStress(force, crossSectionalArea) {
  return force / crossSectionalArea;
}
