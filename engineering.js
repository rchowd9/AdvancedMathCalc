window.ENGINEERING_MODE_NAMES = new Set([
  'stress',
  'beam',
  'reynolds',
  'heattransfer',
  'safetyfactor',
  'powertransmission',
  'shafttorque',
  'pumphead',
  'pipeflow',
  'rigidbodydynamics',
  'electromagneticinduction'
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
    case 'powertransmission': return solvePowerTransmission(args);
    case 'shafttorque': return solveShaftTorque(args);
    case 'pumphead': return solvePumpHead(args);
    case 'pipeflow': return solvePipeFlow(args);
    case 'rigidbodydynamics': return solveRigidBodyDynamics(args);
    case 'electromagneticinduction': return solveElectromagneticInduction(args);
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

function formatGreekSymbol(name) {
  const greekMap = {
    rho: 'ρ',
    mu: 'μ',
    sigma: 'σ',
    theta: 'θ',
    lambda: 'λ',
    eta: 'η',
    phi: 'Φ',
    delta: 'Δ',
    omega: 'ω',
    pi: 'π'
  };
  return greekMap[name.toLowerCase()] ?? name;
}

function solveStress(args) {
  requirePositive(args, 2, 'stress(forceN, areaMm2)');
  const [force, area] = args;
  const stress = force / area;
  return [
    'Normal Stress',
    `Force = ${force} N, area = ${area} mm^2`,
    `${formatGreekSymbol('sigma')} = F / A = ${formatEngineeringNumber(stress)} MPa`,
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
    `${formatGreekSymbol('rho')} = ${density} kg/m^3, v = ${velocity} m/s, D = ${diameter} m`,
    `Re = ${formatGreekSymbol('rho')}·v·D/${formatGreekSymbol('mu')} = ${formatEngineeringNumber(reynoldsNumber)}`,
    `Flow regime: ${regime}`
  ].join('\n');
}

function solveHeatTransfer(args) {
  requirePositive(args, 4, 'heatTransfer(conductivityWmK, areaM2, deltaTK, thicknessM)');
  const [conductivity, area, deltaTemperature, thickness] = args;
  const heatRate = (conductivity * area * deltaTemperature) / thickness;
  return [
    'Steady-State Conduction',
    `k = ${conductivity} W/(m*K), A = ${area} m^2, ${formatGreekSymbol('delta')}T = ${deltaTemperature} K`,
    `Heat rate = k·A·${formatGreekSymbol('delta')}T/L = ${formatEngineeringNumber(heatRate)} W`,
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

function solvePowerTransmission(args) {
  requirePositive(args, 3, 'powerTransmission(inputPowerW, speedRPM, efficiency)');
  const [inputPower, speedRpm, efficiency] = args;
  const mechanicalPower = inputPower * efficiency;
  const shaftTorque = mechanicalPower / ((2 * Math.PI * speedRpm) / 60);

  return [
    'Power Transmission',
    `P_in = ${inputPower} W, speed = ${speedRpm} rpm, ${formatGreekSymbol('eta')} = ${efficiency}`,
    `P_out = P_in × ${formatGreekSymbol('eta')} = ${formatEngineeringNumber(mechanicalPower)} W`,
    `T = P_out / ${formatGreekSymbol('omega')} = ${formatEngineeringNumber(shaftTorque)} N·m`,
    'Conclusion: Output power and shaft torque estimated for a rotating machine.'
  ].join('\n');
}

function solveShaftTorque(args) {
  requirePositive(args, 2, 'shaftTorque(powerW, speedRPM)');
  const [power, speedRpm] = args;
  const angularVelocity = (2 * Math.PI * speedRpm) / 60;
  const torque = power / angularVelocity;

  return [
    'Shaft Torque',
    `P = ${power} W, speed = ${speedRpm} rpm`,
    `T = P / ω = ${formatEngineeringNumber(torque)} N·m`,
    'Conclusion: Shaft torque computed from power and rotational speed.'
  ].join('\n');
}

function solvePumpHead(args) {
  requirePositive(args, 3, 'pumpHead(flowM3s, densityKgM3, pressureRisePa)');
  const [flowRate, density, pressureRise] = args;
  const hydraulicHead = pressureRise / (density * 9.81);
  const hydraulicPower = flowRate * pressureRise;

  return [
    'Pump Head',
    `Q = ${flowRate} m^3/s, ${formatGreekSymbol('rho')} = ${density} kg/m^3, ${formatGreekSymbol('delta')}P = ${pressureRise} Pa`,
    `H = ${formatGreekSymbol('delta')}P / (${formatGreekSymbol('rho')}g) = ${formatEngineeringNumber(hydraulicHead)} m`,
    `P_hydraulic = Q${formatGreekSymbol('delta')}P = ${formatEngineeringNumber(hydraulicPower)} W`,
    'Conclusion: Hydraulic head and power estimated for pump sizing.'
  ].join('\n');
}

function solvePipeFlow(args) {
  requirePositive(args, 5, 'pipeFlow(densityKgM3, velocityMs, diameterM, viscosityPaS, roughnessM)');
  const [density, velocity, diameter, viscosity, roughness] = args;
  const reynoldsNumber = (density * velocity * diameter) / viscosity;
  const relativeRoughness = roughness / diameter;
  const frictionFactor = reynoldsNumber < 2300
    ? 64 / reynoldsNumber
    : 0.25 / Math.log10((roughness / (3.7 * diameter)) + (5.74 / reynoldsNumber ** 0.9)) ** 2;
  const pressureDrop = frictionFactor * (1 / diameter) * (density * velocity ** 2 / 2);
  return [
    'Internal Pipe Flow',
    `Re = ${formatEngineeringNumber(reynoldsNumber)}, relative roughness = ${formatEngineeringNumber(relativeRoughness)}`,
    `Darcy friction factor f = ${formatEngineeringNumber(frictionFactor)}`,
    `Pressure gradient = f·(1/D)·ρv²/2 = ${formatEngineeringNumber(pressureDrop)} Pa/m`,
    `Flow regime: ${reynoldsNumber < 2300 ? 'laminar' : 'turbulent'}`,
    'Assumption: Fully developed steady flow in a circular pipe; turbulent flow uses an explicit Colebrook approximation.'
  ].join('\n');
}

function solveRigidBodyDynamics(args) {
  requirePositive(args, 4, 'rigidBodyDynamics(massKg, netForceN, inertiaKgM2, netTorqueNm)');
  const [mass, netForce, inertia, netTorque] = args;
  const linearAcceleration = netForce / mass;
  const angularAcceleration = netTorque / inertia;
  return [
    'Rigid-Body Dynamics',
    `ΣF = ${netForce} N, m = ${mass} kg, Στ = ${netTorque} N·m, I = ${inertia} kg·m^2`,
    `Translational equation: ΣF = m·a → a = ${formatEngineeringNumber(linearAcceleration)} m/s^2`,
    `Angular acceleration: Στ = I·α → α = ${formatEngineeringNumber(angularAcceleration)} rad/s^2`,
    'Conclusion: Coupled translational and rotational accelerations computed for a rigid body.'
  ].join('\n');
}

function solveElectromagneticInduction(args) {
  requirePositive(args, 4, 'electromagneticInduction(turns, areaM2, dBdtTPerS, resistanceOhm)');
  const [turns, area, magneticFieldRate, resistance] = args;
  const inducedEmf = turns * area * magneticFieldRate;
  const current = inducedEmf / resistance;
  const power = inducedEmf * current;
  return [
    'Electromagnetic Induction',
    `N = ${turns}, A = ${area} m^2, dB/dt = ${magneticFieldRate} T/s, R = ${resistance} Ω`,
    `Faraday's law: |ε| = N·A·|dB/dt| = ${formatEngineeringNumber(inducedEmf)} V`,
    `Induced current: I = |ε|/R = ${formatEngineeringNumber(current)} A`,
    `Resistive power: P = ε·I = ${formatEngineeringNumber(power)} W`,
    'Assumption: Uniform magnetic field normal to the coil; self-inductance is neglected.'
  ].join('\n');
}