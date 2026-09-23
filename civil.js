// civil.js
// Civil Engineering Module

window.CIVIL_FORMULAS = new Set([
  'bendingstress',
  'shearstresscivil',
  'soilpressure',
  'bearingcapacity',
  'columnload',
  'trussforce',
  'manning',
  'hydraulicradius',
  'flowrate',
  'roadgrade',
  'concretestress',
  'momentofinertia',
  'beamreaction',
  'earthpressure',
  'retainingwall',
  'settlement',
  'compaction',
  'channelvelocity',
  'runoff',
  'culvertflow'
]);

function solveCivil(input) {
  const match = input.match(/^([a-zA-Z]+)\(([\s\S]*)\)$/);

  if (!match) {
    throw new Error("Invalid civil engineering syntax.");
  }

  const mode = match[1].toLowerCase();
  const args = match[2].split(',').map(x => Number(x.trim()));

  switch (mode) {
    case 'bendingstress':
      return `σ = My/I = ${(args[0]*args[1])/args[2]}`;

    case 'shearstresscivil':
      return `τ = VQ/It = ${(args[0]*args[1])/(args[2]*args[3])}`;

    case 'soilpressure':
      return `q = F/A = ${args[0]/args[1]} Pa`;

    case 'bearingcapacity':
      return `Bearing capacity = ${args[0]*args[1]} Pa`;

    case 'columnload':
      return `P = σA = ${args[0]*args[1]} N`;

    case 'trussforce':
      return `Member force = ${args[0]/Math.sin(args[1]*Math.PI/180)} N`;

    case 'manning':
      return `Velocity = ${(1/args[0])*Math.pow(args[1],2/3)*Math.sqrt(args[2])} m/s`;

    case 'hydraulicradius':
      return `R = A/P = ${args[0]/args[1]} m`;

    case 'flowrate':
      return `Q = AV = ${args[0]*args[1]} m³/s`;

    case 'roadgrade':
      return `Grade = ${(args[0]/args[1])*100}%`;

    case 'concretestress':
      return `Concrete stress = ${args[0]/args[1]} Pa`;

    case 'momentofinertia':
      return `I = bh³/12 = ${(args[0]*Math.pow(args[1],3))/12}`;

    case 'beamreaction':
      return `Reaction = ${args[0]/2}`;

    case 'earthpressure':
      return `Pressure = ${args[0]*args[1]*args[2]} Pa`;

    case 'retainingwall':
      return `Force = 0.5γH² = ${0.5*args[0]*args[1]*args[1]}`;

    case 'settlement':
      return `Settlement = ${(args[0]*args[1])/args[2]}`;

    case 'compaction':
      return `Compaction % = ${(args[0]/args[1])*100}`;

    case 'channelvelocity':
      return `Velocity = ${(1/args[0])*Math.pow(args[1],2/3)*Math.pow(args[2],1/2)}`;

    case 'runoff':
      return `Runoff = ${args[0]*args[1]*args[2]}`;

    case 'culvertflow':
      return `Flow = ${args[0]*args[1]}`;

    default:
      throw new Error("Unknown Civil Engineering formula.");
  }
}