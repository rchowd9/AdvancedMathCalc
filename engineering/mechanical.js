export function stress(force, area) {
  return force / area;
}

export function strain(changeInLength, originalLength) {
  return changeInLength / originalLength;
}

export function youngsModulus(stressValue, strainValue) {
  return stressValue / strainValue;
}

export function torsionStress(torque, radius, polarMoment) {
  return torque * radius / polarMoment;
}

export function beamDeflection(load, length, modulus, inertia) {
  return load * length ** 3 / (48 * modulus * inertia);
}

export function bucklingLoad(modulus, inertia, length) {
  return Math.PI ** 2 * modulus * inertia / length ** 2;
}

export function kineticEnergy(mass, velocity) {
  return 0.5 * mass * velocity ** 2;
}

export function shaftTorque(power, angularVelocity) {
  return power / angularVelocity;
}
