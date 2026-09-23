export function ohmsLaw(voltage, resistance) {
  return voltage / resistance;
}

export function electricPower(voltage, current) {
  return voltage * current;
}

export function resistance(resistivity, length, area) {
  return resistivity * length / area;
}

export function capacitance(charge, voltage) {
  return charge / voltage;
}

export function inductiveReactance(frequency, inductance) {
  return 2 * Math.PI * frequency * inductance;
}

export function impedance(resistanceValue, reactance) {
  return Math.sqrt(resistanceValue ** 2 + reactance ** 2);
}

export function threePhasePower(voltage, current, powerFactor) {
  return Math.sqrt(3) * voltage * current * powerFactor;
}

export function magneticFlux(fieldStrength, area) {
  return fieldStrength * area;
}
