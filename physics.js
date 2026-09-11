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