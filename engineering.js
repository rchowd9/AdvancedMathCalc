window.ENGINEERING_MODE_NAMES = new Set([
  'stress',
  'beam',
  'reynolds',
  'heattransfer',
  'safetyfactor'
]);

function solveEngineering(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error('Use engineering modes like stress(...), beam(...), or reynolds(...).');
  }

  const mode = match[1].toLowerCase();
  const args = splitEngineeringArgs(match[2]).map(Number);

  switch (mode) {
    case 'stress': return solveStress(args);
    case 'beam': return solveBeam(args);
    case 'reynolds': return solveReynolds(args);
    case 'heattransfer': return solveHeatTransfer(args);
    case 'safetyfactor': return solveSafetyFactor(args);
    default: throw new Error('Unknown engineering mode.');
  }
}

function splitEngineeringArgs(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;

  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (character === '(' || character === '[') depth += 1;
    if (character === ')' || character === ']') depth -= 1;
    if (character === ',' && depth === 0) {
      parts.push(statement.slice(start, index).trim());
      start = index + 1;
    }
  }

  parts.push(statement.slice(start).trim());
  return parts;
}

function requirePositive(args, count, syntax) {
  if (args.length < count || args.slice(0, count).some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error(`Use ${syntax} with positive numeric values.`);
  }
}

function formatEngineeringNumber(value) {
  return Number(value.toPrecision(6));
}

function solveStress(args) {
  requirePositive(args, 2, 'stress(forceN, areaMm2)');
  const [force, area] = args;
  const stress = force / area;
  return [
    'Normal Stress',
    `Force = ${force} N, area = ${area} mm^2`,
    `sigma = F / A = ${formatEngineeringNumber(stress)} MPa`,
    'Conclusion: Axial stress calculated from load and cross-sectional area.'
  ].join('\n');
}

function solveBeam(args) {
  requirePositive(args, 4, 'beam(loadN, lengthM, youngsModulusPa, inertiaM4)');
  const [load, length, youngsModulus, inertia] = args;
  const deflection = (load * length ** 3) / (48 * youngsModulus * inertia);
  const moment = (load * length) / 4;
  return [
    'Simply Supported Beam',
    `Point load = ${load} N, span = ${length} m`,
    `Maximum moment = P*L/4 = ${formatEngineeringNumber(moment)} N*m`,
    `Center deflection = P*L^3/(48*E*I) = ${formatEngineeringNumber(deflection)} m`,
    'Assumption: A centered point load and linear elastic behavior.'
  ].join('\n');
}

function solveReynolds(args) {
  requirePositive(args, 4, 'reynolds(densityKgM3, velocityMs, diameterM, viscosityPaS)');
  const [density, velocity, diameter, viscosity] = args;
  const reynoldsNumber = (density * velocity * diameter) / viscosity;
  const regime = reynoldsNumber < 2300 ? 'laminar' : reynoldsNumber <= 4000 ? 'transitional' : 'turbulent';
  return [
    'Reynolds Number',
    `rho = ${density} kg/m^3, v = ${velocity} m/s, D = ${diameter} m`,
    `Re = rho*v*D/mu = ${formatEngineeringNumber(reynoldsNumber)}`,
    `Flow regime: ${regime}`
  ].join('\n');
}

function solveHeatTransfer(args) {
  requirePositive(args, 4, 'heatTransfer(conductivityWmK, areaM2, deltaTK, thicknessM)');
  const [conductivity, area, deltaTemperature, thickness] = args;
  const heatRate = (conductivity * area * deltaTemperature) / thickness;
  return [
    'Steady-State Conduction',
    `k = ${conductivity} W/(m*K), A = ${area} m^2, deltaT = ${deltaTemperature} K`,
    `Heat rate = k*A*deltaT/L = ${formatEngineeringNumber(heatRate)} W`,
    'Assumption: One-dimensional conduction through a uniform slab.'
  ].join('\n');
}

function solveSafetyFactor(args) {
  requirePositive(args, 2, 'safetyFactor(yieldStrengthMPa, workingStressMPa)');
  const [yieldStrength, workingStress] = args;
  const safetyFactor = yieldStrength / workingStress;
  const status = safetyFactor >= 1.5 ? 'pass for a basic preliminary check' : 'review required';
  return [
    'Safety Factor Check',
    `Yield strength = ${yieldStrength} MPa, working stress = ${workingStress} MPa`,
    `N = yield strength / working stress = ${formatEngineeringNumber(safetyFactor)}`,
    `Screening result: ${status}`
  ].join('\n');
}