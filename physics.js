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
  'continuouscharge'
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
    `q = ${q} C, v = ${v} m/s, B = ${B} T, θ = ${thetaDeg}°`,
    `F = q·v·B·sin(θ) = ${F} N`,
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
    `B = ${B} T, A = ${A} m², θ = ${thetaDeg}°`,
    `Φ = B·A·cos(θ) = ${phi} Wb`,
    "Conclusion: Magnetic flux computed."
  ].join("\n");
}

// Faraday’s Law: faraday(dFlux, dt)
function solveFaraday(args) {
  if (args.length < 2) throw new Error("Use faraday(dFlux, dt)");
  const [dFlux, dt] = args.map(Number);
  const emf = -dFlux / dt;

  return [
    "Faraday’s Law of Induction",
    `ΔΦ = ${dFlux} Wb, Δt = ${dt} s`,
    `emf = -ΔΦ / Δt = ${emf} V`,
    "Conclusion: Induced emf computed."
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