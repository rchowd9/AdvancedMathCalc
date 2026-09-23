export function molarity(moles, solutionVolume) {
  return moles / solutionVolume;
}

export function idealGasPressure(moles, gasConstant, temperature, volume) {
  return moles * gasConstant * temperature / volume;
}

export function enthalpyChange(productEnthalpy, reactantEnthalpy) {
  return productEnthalpy - reactantEnthalpy;
}

export function gibbsFreeEnergy(enthalpyChangeValue, temperature, entropyChange) {
  return enthalpyChangeValue - temperature * entropyChange;
}

export function reactionRate(rateConstant, concentration, order) {
  return rateConstant * concentration ** order;
}

export function arrhenius(rateFactor, activationEnergy, gasConstant, temperature) {
  return rateFactor * Math.exp(-activationEnergy / (gasConstant * temperature));
}

export function dilution(initialConcentration, initialVolume, finalVolume) {
  return initialConcentration * initialVolume / finalVolume;
}
