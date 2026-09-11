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