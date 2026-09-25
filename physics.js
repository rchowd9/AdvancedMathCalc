window.PHYSICS_MODE_NAMES = new Set([
  'kinematics',
  'newton2',
  'workenergy',
  'momentum',
  'coulomb',
  'ohm',
  'power',
  'gravitation',
  'projectile',
  'electricfield',
  'magneticforce',
  'lorentzforce',
  'capacitor',
  'inductor',
  'flux',
  'faraday',
  'continuousforce',
  'continuousmass',
  'continuouscharge',
  'wave',
  'circularmotion',
  'resonance',
  'weight',
  'friction',
  'torque',
  'rotationalke',
  'thermalenergy',
  'idealgas',
  'snelllaw',
  'bernoulli',
  'radioactivedecay',
  'photonenergy',
  'lens'
]);

function solvePhysics(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error("Use physics modes like kinematics(...), newton2(...), workEnergy(...), electricField(...).");
  }


  const mode = match[1].toLowerCase();
  const args = splitPhysicsArgs(match[2]);

  switch (mode) {
    case 'kinematics': return solveKinematics(args);
    case 'newton2': return solveNewton2(args);
    case 'workenergy': return solveWorkEnergy(args);
    case 'momentum': return solveMomentum(args);
    case 'coulomb': return solveCoulomb(args);
    case 'ohm': return solveOhm(args);
    case 'power': return solvePower(args);
    case 'gravitation': return solveGravitation(args);
    case 'projectile': return solveProjectile(args);
    case 'wave': return solveWave(args);
    case 'circularmotion': return solveCircularMotion(args);
    case 'resonance': return solveResonance(args);
    case 'weight': return solveWeight(args);
    case 'friction': return solveFriction(args);
    case 'torque': return solveTorque(args);
    case 'rotationalke': return solveRotationalKE(args);
    case 'thermalenergy': return solveThermalEnergy(args);
    case 'idealgas': return solveIdealGas(args);
    case 'snelllaw': return solveSnellLaw(args);
    case 'bernoulli': return solveBernoulli(args);
    case 'radioactivedecay': return solveRadioactiveDecay(args);
    case 'photonenergy': return solvePhotonEnergy(args);
    case 'lens': return solveLens(args);

    // Electromagnetism
    case 'electricfield': return solveElectricField(args);
    case 'magneticforce': return solveMagneticForce(args);
    case 'lorentzforce': return solveLorentzForce(args);
    case 'capacitor': return solveCapacitor(args);
    case 'inductor': return solveInductor(args);
    case 'flux': return solveFlux(args);
    case 'faraday': return solveFaraday(args);

    case 'continuousforce': return solveContinuousForce(args);
    case 'continuousmass': return solveContinuousMass(args);
    case 'continuouscharge': return solveContinuousCharge(args);

    default:
      throw new Error("Unknown physics mode.");
  }
}

function splitPhysicsArgs(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;

  for (let i = 0; i < statement.length; i++) {
    const ch = statement[i];
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(statement.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(statement.slice(start).trim());
  return parts;
}

// 1. Kinematics: kinematics(v0, a, t)
function solveKinematics(args) {
  if (args.length < 3) throw new Error("Use kinematics(v0, a, t)");
  const [v0, a, t] = args.map(Number);
  const v = v0 + a * t;
  const d = v0 * t + 0.5 * a * t * t;

  return [
    "Kinematics (constant acceleration)",
    `v0 = ${v0}, a = ${a}, t = ${t}`,
    `Final velocity: v = v0 + a·t = ${v}`,
    `Displacement: d = v0·t + ½·a·t² = ${d}`,
    "Conclusion: Motion solved using basic kinematic equations."
  ].join("\n");
}

// 2. Newton’s Second Law: newton2(m, a)
function solveNewton2(args) {
  if (args.length < 2) throw new Error("Use newton2(m, a)");
  const [m, a] = args.map(Number);
  const F = m * a;

  return [
    "Newton’s Second Law",
    `m = ${m}, a = ${a}`,
    `Force: F = m·a = ${F} N`,
    "Conclusion: Net force computed."
  ].join("\n");
}

// 3. Work-Energy: workEnergy(F, d)
function solveWorkEnergy(args) {
  if (args.length < 2) throw new Error("Use workEnergy(F, d)");
  const [F, d] = args.map(Number);
  const W = F * d;

  return [
    "Work-Energy",
    `F = ${F}, d = ${d}`,
    `Work: W = F·d = ${W} J`,
    "Conclusion: Work done computed."
  ].join("\n");
}

// 4. Momentum: momentum(m, v)
function solveMomentum(args) {
  if (args.length < 2) throw new Error("Use momentum(m, v)");
  const [m, v] = args.map(Number);
  const p = m * v;

  return [
    "Momentum",
    `m = ${m}, v = ${v}`,
    `p = m·v = ${p} kg·m/s`,
    "Conclusion: Momentum computed."
  ].join("\n");
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

// 5. Coulomb’s Law: coulomb(q1, q2, r)
function solveCoulomb(args) {
  if (args.length < 3) throw new Error("Use coulomb(q1, q2, r)");
  const [q1, q2, r] = args.map(Number);
  const k = 8.99e9;
  const F = k * q1 * q2 / (r * r);

  return [
    "Coulomb’s Law",
    `q1 = ${q1} C, q2 = ${q2} C, r = ${r} m`,
    `F = k·q1·q2 / r² = ${F} N`,
    "Conclusion: Electrostatic force computed."
  ].join("\n");
}

// 6. Ohm’s Law: ohm(V, R)
function solveOhm(args) {
  if (args.length < 2) throw new Error("Use ohm(V, R)");
  const [V, R] = args.map(Number);
  const I = V / R;

  return [
    "Ohm’s Law",
    `V = ${V} V, R = ${R} Ω`,
    `I = V / R = ${I} A`,
    "Conclusion: Current computed."
  ].join("\n");
}

// 7. Power: power(V, I)
function solvePower(args) {
  if (args.length < 2) throw new Error("Use power(V, I)");
  const [V, I] = args.map(Number);
  const P = V * I;

  return [
    "Electric Power",
    `V = ${V} V, I = ${I} A`,
    `P = V·I = ${P} W`,
    "Conclusion: Power computed."
  ].join("\n");
}

// 8. Gravitation: gravitation(m1, m2, r)
function solveGravitation(args) {
  if (args.length < 3) throw new Error("Use gravitation(m1, m2, r)");
  const [m1, m2, r] = args.map(Number);
  const G = 6.674e-11;
  const F = G * m1 * m2 / (r * r);

  return [
    "Newton’s Law of Gravitation",
    `m1 = ${m1} kg, m2 = ${m2} kg, r = ${r} m`,
    `F = G·m1·m2 / r² = ${F} N`,
    "Conclusion: Gravitational force computed."
  ].join("\n");
}

// 9. Projectile Motion: projectile(v0, angle)
function solveProjectile(args) {
  if (args.length < 2) throw new Error("Use projectile(v0, angle)");
  const [v0, angleDeg] = args.map(Number);
  const angle = angleDeg * Math.PI / 180;
  const g = 9.8;

  const range = (v0 * v0 * Math.sin(2 * angle)) / g;
  const height = (v0 * v0 * Math.sin(angle) * Math.sin(angle)) / (2 * g);

  return [
    "Projectile Motion",
    `v0 = ${v0} m/s, angle = ${angleDeg}°`,
    `Range = ${range} m`,
    `Max height = ${height} m`,
    "Conclusion: Projectile motion solved."
  ].join("\n");
}

// Electric field of a point charge: electricField(q, r)
function solveElectricField(args) {
  if (args.length < 2) throw new Error("Use electricField(q, r)");
  const [q, r] = args.map(Number);
  const k = 8.99e9;
  const E = k * q / (r * r);

  return [
    "Electric Field of a Point Charge",
    `q = ${q} C, r = ${r} m`,
    `E = k·q / r² = ${E} N/C`,
    "Conclusion: Electric field magnitude computed."
  ].join("\n");
}

// Magnetic force on a moving charge: magneticForce(q, v, B, thetaDeg)
function solveMagneticForce(args) {
  if (args.length < 4) throw new Error("Use magneticForce(q, v, B, thetaDeg)");
  const [q, v, B, thetaDeg] = args.map(Number);
  const theta = thetaDeg * Math.PI / 180;
  const F = q * v * B * Math.sin(theta);

  return [
    "Magnetic Force on a Moving Charge",
    `q = ${q} C, v = ${v} m/s, B = ${B} T, ${formatGreekSymbol('theta')} = ${thetaDeg}°`,
    `F = q·v·B·sin(${formatGreekSymbol('theta')}) = ${F} N`,
    "Conclusion: Magnetic force computed."
  ].join("\n");
}

// Lorentz force: lorentzForce(q, Ex, Ey, Ez, vx, vy, vz, Bx, By, Bz)
function solveLorentzForce(args) {
  if (args.length < 10) throw new Error("Use lorentzForce(q, Ex, Ey, Ez, vx, vy, vz, Bx, By, Bz)");
  const [q, Ex, Ey, Ez, vx, vy, vz, Bx, By, Bz] = args.map(Number);

  const Fx = q * (Ex + vy * Bz - vz * By);
  const Fy = q * (Ey + vz * Bx - vx * Bz);
  const Fz = q * (Ez + vx * By - vy * Bx);

  return [
    "Lorentz Force",
    `q = ${q} C`,
    `E = <${Ex}, ${Ey}, ${Ez}> V/m`,
    `v = <${vx}, ${vy}, ${vz}> m/s`,
    `B = <${Bx}, ${By}, ${Bz}> T`,
    `F = q(E + v × B) = <${Fx}, ${Fy}, ${Fz}> N`,
    "Conclusion: Lorentz force vector computed."
  ].join("\n");
}

// Capacitor: capacitor(C, V)
function solveCapacitor(args) {
  if (args.length < 2) throw new Error("Use capacitor(C, V)");
  const [C, V] = args.map(Number);
  const Q = C * V;
  const U = 0.5 * C * V * V;

  return [
    "Capacitor",
    `C = ${C} F, V = ${V} V`,
    `Charge: Q = C·V = ${Q} C`,
    `Energy: U = ½·C·V² = ${U} J`,
    "Conclusion: Capacitor charge and energy computed."
  ].join("\n");
}

// Inductor: inductor(L, I)
function solveInductor(args) {
  if (args.length < 2) throw new Error("Use inductor(L, I)");
  const [L, I] = args.map(Number);
  const U = 0.5 * L * I * I;

  return [
    "Inductor",
    `L = ${L} H, I = ${I} A`,
    `Energy: U = ½·L·I² = ${U} J`,
    "Conclusion: Inductor energy computed."
  ].join("\n");
}

// Magnetic flux: flux(B, A, thetaDeg)
function solveFlux(args) {
  if (args.length < 3) throw new Error("Use flux(B, A, thetaDeg)");
  const [B, A, thetaDeg] = args.map(Number);
  const theta = thetaDeg * Math.PI / 180;
  const phi = B * A * Math.cos(theta);

  return [
    "Magnetic Flux",
    `B = ${B} T, A = ${A} m², ${formatGreekSymbol('theta')} = ${thetaDeg}°`,
    `${formatGreekSymbol('phi')} = B·A·cos(${formatGreekSymbol('theta')}) = ${phi} Wb`,
    "Conclusion: Magnetic flux computed."
  ].join("\n");
}

// Wave motion: wave(f, lambda, [v])
function solveWave(args) {
  if (args.length < 2) throw new Error('Use wave(frequencyHz, wavelengthM, [speedMs])');
  const [frequency, wavelength, speedValue] = args.map(Number);
  const waveSpeed = (speedValue !== undefined && Number.isFinite(speedValue)) ? speedValue : frequency * wavelength;

  return [
    'Wave Motion',
    `f = ${frequency} Hz, ${formatGreekSymbol('lambda')} = ${wavelength} m`,
    `v = f·${formatGreekSymbol('lambda')} = ${waveSpeed} m/s`,
    'Conclusion: Wave speed computed from frequency and wavelength.'
  ].join('\n');
}

// Uniform circular motion: circularMotion(m, v, r)
function solveCircularMotion(args) {
  if (args.length < 3) throw new Error('Use circularMotion(massKg, speedMs, radiusM)');
  const [mass, speed, radius] = args.map(Number);
  const centripetalForce = (mass * speed * speed) / radius;

  return [
    'Circular Motion',
    `m = ${mass} kg, v = ${speed} m/s, r = ${radius} m`,
    `F_c = m·v²/r = ${centripetalForce} N`,
    'Conclusion: Centripetal force computed.'
  ].join('\n');
}

// Resonance / simple harmonic oscillator: resonance(m, k)
function solveResonance(args) {
  if (args.length < 2) throw new Error('Use resonance(massKg, springConstantNpm)');
  const [mass, springConstant] = args.map(Number);
  const naturalFrequency = Math.sqrt(springConstant / mass) / (2 * Math.PI);

  return [
    'Simple Harmonic Motion / Resonance',
    `m = ${mass} kg, k = ${springConstant} N/m`,
    `f = (1/2π)·sqrt(k/m) = ${naturalFrequency} Hz`,
    'Conclusion: Natural frequency of the oscillator determined.'
  ].join('\n');
}

// Faraday’s Law: faraday(dFlux, dt)
function solveFaraday(args) {
  if (args.length < 2) throw new Error("Use faraday(dFlux, dt)");
  const [dFlux, dt] = args.map(Number);
  const emf = -dFlux / dt;

  return [
    "Faraday’s Law of Induction",
    `${formatGreekSymbol('delta')}${formatGreekSymbol('phi')} = ${dFlux} Wb, ${formatGreekSymbol('delta')}t = ${dt} s`,
    `emf = -${formatGreekSymbol('delta')}${formatGreekSymbol('phi')} / ${formatGreekSymbol('delta')}t = ${emf} V`,
    "Conclusion: Induced emf computed."
  ].join("\n");
}

// Weight: weight(m, g)
function solveWeight(args) {
  if (args.length < 2) throw new Error("Use weight(massKg, gravityMs2)");
  const [m, g] = args.map(Number);
  const W = m * g;

  return [
    "Weight",
    `m = ${m} kg, g = ${g} m/s²`,
    `W = m·g = ${W} N`,
    "Conclusion: Weight force computed."
  ].join("\n");
}

// Friction: friction(mu, N)
function solveFriction(args) {
  if (args.length < 2) throw new Error("Use friction(mu, normalForceN)");
  const [mu, N] = args.map(Number);
  const f = mu * N;

  return [
    "Friction Force",
    `μ = ${mu}, N = ${N} N`,
    `f = μ·N = ${f} N`,
    "Conclusion: Friction force computed."
  ].join("\n");
}

// Torque: torque(r, F, thetaDeg)
function solveTorque(args) {
  if (args.length < 3) throw new Error("Use torque(r, F, thetaDeg)");
  const [r, F, thetaDeg] = args.map(Number);
  const theta = thetaDeg * Math.PI / 180;
  const tau = r * F * Math.sin(theta);

  return [
    "Torque",
    `r = ${r} m, F = ${F} N, θ = ${thetaDeg}°`,
    `τ = r·F·sin(θ) = ${tau} N·m`,
    "Conclusion: Torque computed."
  ].join("\n");
}

// Rotational kinetic energy: rotationalKE(I, omega)
function solveRotationalKE(args) {
  if (args.length < 2) throw new Error("Use rotationalKE(I, omega)");
  const [I, omega] = args.map(Number);
  const KE = 0.5 * I * omega * omega;

  return [
    "Rotational Kinetic Energy",
    `I = ${I} kg·m², ω = ${omega} rad/s`,
    `KE = ½·I·ω² = ${KE} J`,
    "Conclusion: Rotational kinetic energy computed."
  ].join("\n");
}

// Thermal energy: thermalEnergy(m, c, deltaT)
function solveThermalEnergy(args) {
  if (args.length < 3) throw new Error("Use thermalEnergy(massKg, specificHeat, deltaT)");
  const [m, c, deltaT] = args.map(Number);
  const Q = m * c * deltaT;

  return [
    "Heat Energy",
    `m = ${m} kg, c = ${c} J/(kg·K), ΔT = ${deltaT} K`,
    `Q = m·c·ΔT = ${Q} J`,
    "Conclusion: Heat transferred computed."
  ].join("\n");
}

// Ideal gas law: idealGas(P, V, n, T)
function solveIdealGas(args) {
  if (args.length < 4) throw new Error("Use idealGas(P, V, n, T)");
  const [P, V, n, T] = args.map(Number);
  const R = 8.314;
  const leftSide = P * V;
  const rightSide = n * R * T;

  return [
    "Ideal Gas Law",
    `P = ${P} Pa, V = ${V} m³, n = ${n} mol, T = ${T} K`,
    `P·V = ${leftSide} J`,
    `n·R·T = ${rightSide} J`,
    "Conclusion: Ideal gas relation checked."
  ].join("\n");
}

// Snell's law: snellLaw(n1, theta1Deg, n2)
function solveSnellLaw(args) {
  if (args.length < 3) throw new Error("Use snellLaw(n1, theta1Deg, n2)");
  const [n1, theta1Deg, n2] = args.map(Number);
  const theta1 = theta1Deg * Math.PI / 180;
  const sinTheta2 = (n1 * Math.sin(theta1)) / n2;
  const theta2Deg = Math.asin(Math.max(-1, Math.min(1, sinTheta2))) * 180 / Math.PI;

  return [
    "Snell’s Law",
    `n₁ = ${n1}, θ₁ = ${theta1Deg}°, n₂ = ${n2}`,
    `n₁·sin(θ₁) = n₂·sin(θ₂)`,
    `θ₂ = arcsin((n₁·sin θ₁)/n₂) = ${theta2Deg}°`,
    "Conclusion: Refracted angle computed."
  ].join("\n");
}

// Bernoulli equation: bernoulli(P1, rho, v1, z1, v2, z2)
function solveBernoulli(args) {
  if (args.length < 6) throw new Error("Use bernoulli(P1, rho, v1, z1, v2, z2)");
  const [P1, rho, v1, z1, v2, z2] = args.map(Number);
  const g = 9.8;
  const P2 = P1 + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * (z1 - z2);

  return [
    "Bernoulli’s Equation",
    `P₁ = ${P1} Pa, ρ = ${rho} kg/m³, v₁ = ${v1} m/s, z₁ = ${z1} m`,
    `v₂ = ${v2} m/s, z₂ = ${z2} m`,
    `P₂ = P₁ + ½·ρ·(v₁² − v₂²) + ρ·g·(z₁ − z₂) = ${P2} Pa`,
    "Conclusion: Pressure at the second point computed."
  ].join("\n");
}

// Radioactive decay: radioactiveDecay(N0, lambda, t)
function solveRadioactiveDecay(args) {
  if (args.length < 3) throw new Error("Use radioactiveDecay(N0, lambda, t)");
  const [N0, lambda, t] = args.map(Number);
  const N = N0 * Math.exp(-lambda * t);

  return [
    "Radioactive Decay",
    `N₀ = ${N0}, λ = ${lambda} s⁻¹, t = ${t} s`,
    `N = N₀·e^(-λ·t) = ${N}`,
    "Conclusion: Remaining quantity after time t computed."
  ].join("\n");
}

// Photon energy: photonEnergy(f)
function solvePhotonEnergy(args) {
  if (args.length < 1) throw new Error("Use photonEnergy(frequencyHz)");
  const [f] = args.map(Number);
  const h = 6.62607015e-34;
  const E = h * f;

  return [
    "Photon Energy",
    `f = ${f} Hz`,
    `E = h·f = ${E} J`,
    "Conclusion: Energy of a photon computed."
  ].join("\n");
}

// Thin lens equation: lens(do, di)
function solveLens(args) {
  if (args.length < 2) throw new Error("Use lens(objectDistance, imageDistance)");
  const [do, di] = args.map(Number);
  const f = 1 / ((1 / do) + (1 / di));

  return [
    "Thin Lens Equation",
    `dₒ = ${do} m, dᵢ = ${di} m`,
    `1/f = 1/dₒ + 1/dᵢ`,
    `f = 1 / (1/dₒ + 1/dᵢ) = ${f} m`,
    "Conclusion: Focal length computed."
  ].join("\n");
}

// ---------------- Calculus-based Physics ----------------

// Continuous force: continuousForce(Fx(x), x, a, b)
function solveContinuousForce(args) {
  if (args.length < 4) throw new Error("Use continuousForce(Fx(x), x, a, b)");
  const [FxStr, variable, aStr, bStr] = args;
  const a = Number(aStr);
  const b = Number(bStr);
  const steps = 1000;
  const W = numericIntegral(FxStr, variable, a, b, steps);

  return [
    "Work from Variable Force",
    `F(x) = ${FxStr}, from x = ${a} to x = ${b}`,
    `Work: W = ∫ F(x) dx ≈ ${W} J`,
    "Conclusion: Work computed via numerical integration."
  ].join("\n");
}

// Continuous mass: continuousMass(rho(x), x, a, b)
function solveContinuousMass(args) {
  if (args.length < 4) throw new Error("Use continuousMass(rho(x), x, a, b)");
  const [rhoStr, variable, aStr, bStr] = args;
  const a = Number(aStr);
  const b = Number(bStr);
  const steps = 1000;
  const m = numericIntegral(rhoStr, variable, a, b, steps);

  return [
    "Continuous Mass Distribution",
    `ρ(x) = ${rhoStr}, from x = ${a} to x = ${b}`,
    `Mass: m = ∫ ρ(x) dx ≈ ${m} kg`,
    "Conclusion: Mass of 1D rod computed via numerical integration."
  ].join("\n");
}

// Continuous charge: continuousCharge(lambda(x), x, a, b)
function solveContinuousCharge(args) {
  if (args.length < 4) throw new Error("Use continuousCharge(lambda(x), x, a, b)");
  const [lambdaStr, variable, aStr, bStr] = args;
  const a = Number(aStr);
  const b = Number(bStr);
  const steps = 1000;
  const Q = numericIntegral(lambdaStr, variable, a, b, steps);

  return [
    "Continuous Charge Distribution",
    `λ(x) = ${lambdaStr}, from x = ${a} to x = ${b}`,
    `Charge: Q = ∫ λ(x) dx ≈ ${Q} C`,
    "Conclusion: Total charge of 1D line computed via numerical integration."
  ].join("\n");
}