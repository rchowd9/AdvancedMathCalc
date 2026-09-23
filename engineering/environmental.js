export const ENVIRONMENTAL_ENGINEERING = {
  id: 'environmental',
  name: 'Environmental Engineering',
  formulas: {
    firstOrderDecay: 'C0 * exp(-k * time)',
    removalEfficiency: '(Cin - Cout) / Cin',
    settlingVelocity: 'g * (particleDensity - fluidDensity) * diameter^2 / (18 * viscosity)',
    dilution: 'massLoad / flowRate',
    airQualityIndex: 'interpolate(concentration, breakpointTable)',
    detentionTime: 'tankVolume / flowRate',
    massBalance: 'input - output + generation - consumption',
  },
};
