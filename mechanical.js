// mechanical.js
// Mechanical Engineering Module for Engineering Quest
 
window.MECHANICAL_FORMULAS = new Set([
'stress',
'strain',
'youngsmodulus',
'shearstress',
'torsion',
'beamdeflection',
'springforce',
'buckling',
'kineticenergy',
'potentialenergy',
'angularmomentum',
'flywheelenergy',
'gearratio',
'shafttorque',
'brakepower',
'thermalexpansion',
'thermalstress',
'vibrationfrequency',
'fluidpower',
'bearinglife'
]);

function solveMechanical(input) {
const match = input.match(/^([a-zA-Z]+)\(([\s\S]*)\)$/);
 
if (!match) {
throw new Error("Invalid mechanical formula syntax.");
}
 
const mode = match[1].toLowerCase();
const args = splitMechanicalArgs(match[2]).map(Number);

switch (mode) {
case 'stress': return solveStress(args);
case 'strain': return solveStrain(args);
case 'youngsmodulus': return solveYoungsModulus(args);
case 'shearstress': return solveShearStress(args);
case 'torsion': return solveTorsion(args);
case 'beamdeflection': return solveBeamDeflection(args);
case 'springforce': return solveSpringForce(args);
case 'buckling': return solveBuckling(args);
case 'kineticenergy': return solveKineticEnergy(args);
case 'potentialenergy': return solvePotentialEnergy(args);
case 'angularmomentum': return solveAngularMomentum(args);
case 'flywheelenergy': return solveFlywheelEnergy(args);
case 'gearratio': return solveGearRatio(args);
case 'shafttorque': return solveShaftTorque(args);
case 'brakepower': return solveBrakePower(args);
case 'thermalexpansion': return solveThermalExpansion(args);
case 'thermalstress': return solveThermalStress(args);
case 'vibrationfrequency': return solveVibrationFrequency(args);
case 'fluidpower': return solveFluidPower(args);
case 'bearinglife': return solveBearingLife(args);
 
default:
throw new Error("Unknown Mechanical Engineering formula.");
}
}