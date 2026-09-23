export function firstOrderDecay(initialConcentration, decayConstant, time) {
  return initialConcentration * Math.exp(-decayConstant * time);
}

export function removalEfficiency(inletConcentration, outletConcentration) {
  return (inletConcentration - outletConcentration) / inletConcentration;
}

export function settlingVelocity(gravity, particleDensity, fluidDensity, diameter, viscosity) {
  return gravity * (particleDensity - fluidDensity) * diameter ** 2 / (18 * viscosity);
}

export function dilution(massLoad, flowRate) {
  return massLoad / flowRate;
}

export function detentionTime(tankVolume, flowRate) {
  return tankVolume / flowRate;
}

export function massBalance(input, output, generation, consumption) {
  return input - output + generation - consumption;
}

export function airQualityIndex(concentration, breakpointLow, breakpointHigh, indexLow, indexHigh) {
  return indexLow + (indexHigh - indexLow) * (concentration - breakpointLow) / (breakpointHigh - breakpointLow);
}
