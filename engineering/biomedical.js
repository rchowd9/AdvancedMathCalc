export const BIOMEDICAL_ENGINEERING = {
  id: 'biomedical',
  name: 'Biomedical Engineering',
  formulas: {
    bmi: 'mass / height^2',
    bloodFlow: 'pressureDifference / vascularResistance',
    poiseuilleFlow: 'pi * pressureDifference * radius^4 / (8 * viscosity * length)',
    diffusionFlux: '-diffusionCoefficient * concentrationGradient',
    drugDose: 'targetConcentration * bodyMass / bioavailability',
    oxygenDelivery: 'cardiacOutput * arterialOxygenContent',
    stress: 'force / crossSectionalArea',
  },
};
