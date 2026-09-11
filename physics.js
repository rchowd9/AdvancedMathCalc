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