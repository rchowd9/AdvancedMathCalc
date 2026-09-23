export function dynamicPressure(density, velocity) {
  return 0.5 * density * velocity ** 2;
}

export function lift(density, velocity, wingArea, liftCoefficient) {
  return dynamicPressure(density, velocity) * wingArea * liftCoefficient;
}

export function drag(density, velocity, referenceArea, dragCoefficient) {
  return dynamicPressure(density, velocity) * referenceArea * dragCoefficient;
}

export function thrustToWeight(thrust, weight) {
  return thrust / weight;
}

export function rocketDeltaV(specificImpulse, standardGravity, massRatio) {
  return specificImpulse * standardGravity * Math.log(massRatio);
}

export function orbitalVelocity(gravitationalParameter, orbitalRadius) {
  return Math.sqrt(gravitationalParameter / orbitalRadius);
}

export function machNumber(velocity, speedOfSound) {
  return velocity / speedOfSound;
}
