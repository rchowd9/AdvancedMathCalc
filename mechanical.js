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