export function bendingStress(moment, distance, inertia) {
  return moment * distance / inertia;
}

export function shearStress(shearForce, firstMoment, inertia, thickness) {
  return shearForce * firstMoment / (inertia * thickness);
}

export function bearingCapacity(load, area) {
  return load / area;
}

export function manningVelocity(roughness, hydraulicRadius, slope) {
  return (1 / roughness) * hydraulicRadius ** (2 / 3) * Math.sqrt(slope);
}

export function runoff(coefficient, rainfallIntensity, area) {
  return coefficient * rainfallIntensity * area;
}

export function culvertFlow(area, velocity) {
  return area * velocity;
}
