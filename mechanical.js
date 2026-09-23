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

function splitMechanicalArgs(statement) {
return statement.split(',').map(x => x.trim());
}
 
// ======================
// 1. STRESS
// stress(force, area)
// ======================
 
function solveStress([force, area]) {
const stress = force / area;
 
return [
"Mechanical Stress",
`σ = F / A`,
`σ = ${force} / ${area}`,
`Stress = ${stress}`
].join("\n");
}
 
// ======================
// 2. STRAIN
// strain(deltaL, L)
// ======================
 
function solveStrain([deltaL, length]) {
const strain = deltaL / length;
 
return [
"Mechanical Strain",
`ε = ΔL / L`,
`ε = ${deltaL}/${length}`,
`Strain = ${strain}`
].join("\n");
}

// ======================
// 3. YOUNG'S MODULUS
// ======================
 
function solveYoungsModulus([stress, strain]) {
const E = stress / strain;
 
return [
"Young's Modulus",
`E = σ / ε`,
`E = ${stress}/${strain}`,
`E = ${E}`
].join("\n");
}

// ======================
// 4. SHEAR STRESS
// ======================
 
function solveShearStress([force, area]) {
const tau = force / area;
 
return [
"Shear Stress",
`τ = F/A`,
`τ = ${tau}`
].join("\n");
}
 
// ======================
// 5. TORSION
// τ = Tr/J
// ======================
 
function solveTorsion([torque, radius, polarMoment]) {
const tau = torque * radius / polarMoment;
 
return [
"Torsion Formula",
`τ = Tr/J`,
`τ = (${torque} × ${radius})/${polarMoment}`,
`τ = ${tau}`
].join("\n");
}

// ======================
// 6. BEAM DEFLECTION
// ======================
 
function solveBeamDeflection([P, L, E, I]) {
const delta = (P * Math.pow(L, 3)) / (48 * E * I);
 
return [
"Beam Deflection",
`δ = PL³/(48EI)`,
`δ = ${delta}`
].join("\n");
}
 
// ======================
// 7. SPRING FORCE
// ======================
 
function solveSpringForce([k, x]) {
const force = k * x;
 
return [
"Hooke's Law",
`F = kx`,
`F = ${force}`
].join("\n");
}

/ ======================
// 8. EULER BUCKLING
// ======================
 
function solveBuckling([E, I, L]) {
const P = Math.PI ** 2 * E * I / (L * L);
 
return [
"Euler Buckling",
`Pcr = π²EI/L²`,
`Critical Load = ${P}`
].join("\n");
}
 
// ======================
// 9. KINETIC ENERGY
// ======================
 
function solveKineticEnergy([m, v]) {
const ke = 0.5 * m * v * v;
 
return [
"Kinetic Energy",
`KE = ½mv²`,
`KE = ${ke} J`
].join("\n");
}
 
// ======================
// 10. POTENTIAL ENERGY
// ======================
 
function solvePotentialEnergy([m, g, h]) {
return `Potential Energy = ${m * g * h} J`;
}