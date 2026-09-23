// electrical.js
// Electrical Engineering Module
 
window.ELECTRICAL_FORMULAS = new Set([
'ohmslaw',
'electricpower',
'resistance',
'conductance',
'capacitance',
'inductance',
'reactance',
'impedance',
'kirchhoffcurrent',
'kirchhoffvoltage',
'rccharge',
'rldecay',
'resonance',
'transformer',
'threephasepower',
'powerfactor',
'apparentpower',
'reactivepower',
'electricfield',
'magneticflux'
]);

function solveElectrical(input) {
const match = input.match(/^([a-zA-Z]+)\(([\s\S]*)\)$/);
 
if (!match) {
throw new Error("Invalid electrical formula syntax.");
}
 
const mode = match[1].toLowerCase();
const args = splitElectricalArgs(match[2]).map(Number);
 
switch(mode) {
 
case 'ohmslaw':
return solveOhmsLaw(args);
 
case 'electricpower':
return solveElectricPower(args);
 
case 'resistance':
return solveResistance(args);
 
case 'conductance':
return solveConductance(args);
 
case 'capacitance':
return solveCapacitance(args);
 
case 'inductance':
return solveInductance(args);
 
case 'reactance':
return solveReactance(args);
 
case 'impedance':
return solveImpedance(args);
 
case 'kirchhoffcurrent':
return solveKirchhoffCurrent(args);
 
case 'kirchhoffvoltage':
return solveKirchhoffVoltage(args);
 
case 'rccharge':
return solveRCCharge(args);
 
case 'rldecay':
return solveRLDecay(args);
 
case 'resonance':
return solveResonance(args);
 
case 'transformer':
return solveTransformer(args);
 
case 'threephasepower':
return solveThreePhasePower(args);
 
case 'powerfactor':
return solvePowerFactor(args);
 
case 'apparentpower':
return solveApparentPower(args);
 
case 'reactivepower':
return solveReactivePower(args);
 
case 'electricfield':
return solveElectricField(args);
 
case 'magneticflux':
return solveMagneticFlux(args);
 
default:
throw new Error("Unknown Electrical Engineering formula.");
}
}
 
function splitElectricalArgs(statement) {
return statement.split(',').map(x => x.trim());
}
 
// ----------------------------------
// OHM'S LAW
// ohmsLaw(V,R)
// ----------------------------------
 
function solveOhmsLaw([V,R]) {
 
const I = V / R;
 
return [
"Ohm's Law",
"I = V/R",
`I = ${V}/${R}`,
`Current = ${I} A`
].join("\n");
}
 
// ----------------------------------
// POWER
// electricPower(V,I)
// ----------------------------------
 
function solveElectricPower([V,I]) {
 
const P = V * I;
 
return [
"Electrical Power",
"P = VI",
`P = ${V} × ${I}`,
`Power = ${P} W`
].join("\n");
}
 
// ----------------------------------
// RESISTANCE
// resistance(resistivity,length,area)
// ----------------------------------
 
function solveResistance([rho,L,A]) {
 
const R = rho * L / A;
 
return [
"Resistance",
"R = ρL/A",
`R = ${R} Ω`
].join("\n");
}

// ----------------------------------
// CONDUCTANCE
// conductance(R)
// ----------------------------------
 
function solveConductance([R]) {
 
const G = 1 / R;
 
return [
"Conductance",
"G = 1/R",
`G = ${G} S`
].join("\n");
}
 
// ----------------------------------
// CAPACITANCE
// capacitance(Q,V)
// ----------------------------------
 
function solveCapacitance([Q,V]) {
 
const C = Q / V;
 
return [
"Capacitance",
"C = Q/V",
`C = ${C} F`
].join("\n");
}
 
// ----------------------------------
// INDUCTANCE
// inductance(N,flux,current)
// ----------------------------------
 
function solveInductance([N,flux,I]) {
 
const L = N * flux / I;
 
return [
"Inductance",
"L = NΦ/I",
`L = ${L} H`
].join("\n");
}
 
// ----------------------------------
// REACTANCE
// reactance(f,L)
// ----------------------------------
 
function solveReactance([f,L]) {
 
const XL = 2 * Math.PI * f * L;
 
return [
"Inductive Reactance",
"XL = 2πfL",
`XL = ${XL} Ω`
].join("\n");
}
 
// ----------------------------------
// IMPEDANCE
// impedance(R,X)
// ----------------------------------
 
function solveImpedance([R,X]) {
 
const Z = Math.sqrt(R*R + X*X);
 
return [
"Impedance",
"Z = √(R²+X²)",
`Z = ${Z} Ω`
].join("\n");
}
 
// ----------------------------------
// KIRCHHOFF CURRENT LAW
// ----------------------------------
 
function solveKirchhoffCurrent(args) {
 
const total = args.reduce((a,b)=>a+b,0);
 
return [
"Kirchhoff Current Law",
"Sum of currents entering = sum leaving",
`Net current = ${total} A`
].join("\n");
}
 
// ----------------------------------
// KIRCHHOFF VOLTAGE LAW
// ----------------------------------
 
function solveKirchhoffVoltage(args) {
 
const total = args.reduce((a,b)=>a+b,0);
 
return [
"Kirchhoff Voltage Law",
"Sum of voltages around loop = 0",
`Loop sum = ${total} V`
].join("\n");
}
 
// ----------------------------------
// RC CHARGING
// rcCharge(V,t,R,C)
// ----------------------------------
 
function solveRCCharge([V,t,R,C]) {
 
const chargeVoltage =
V * (1 - Math.exp(-t/(R*C)));
 
return [
"RC Charging Circuit",
"V(t)=V(1-e^(-t/RC))",
`Voltage = ${chargeVoltage} V`
].join("\n");
}
 
// ----------------------------------
// RL DECAY
// ----------------------------------
 
function solveRLDecay([I0,t,R,L]) {
 
const current =
I0*Math.exp(-(R/L)*t);
 
return [
"RL Decay",
"I(t)=I₀e^(-(R/L)t)",
`Current = ${current} A`
].join("\n");
}
 
// ----------------------------------
// RESONANCE
// resonance(L,C)
// ----------------------------------
 
function solveResonance([L,C]) {
 
const f =
1/(2*Math.PI*Math.sqrt(L*C));
 
return [
"Resonant Frequency",
"f=1/(2π√LC)",
`f = ${f} Hz`
].join("\n");
}
 
// ----------------------------------
// TRANSFORMER
// transformer(Vp,Np,Ns)
// ----------------------------------
 
function solveTransformer([Vp,Np,Ns]) {
 
const Vs = Vp * (Ns/Np);
 
return [
"Ideal Transformer",
"Vs/Vp = Ns/Np",
`Secondary Voltage = ${Vs} V`
].join("\n");
}
 
// ----------------------------------
// THREE PHASE POWER
// ----------------------------------
 
function solveThreePhasePower([V,I,pf]) {
 
const power =
Math.sqrt(3)*V*I*pf;
 
return [
"Three Phase Power",
"P=√3VIpf",
`Power = ${power} W`
].join("\n");
}
 
// ----------------------------------
// POWER FACTOR
// ----------------------------------
 
function solvePowerFactor([real,apparent]) {
 
return [
"Power Factor",
"pf=P/S",
`pf = ${real/apparent}`
].join("\n");
}
 
// ----------------------------------
// APPARENT POWER
// ----------------------------------
 
function solveApparentPower([V,I]) {
 
return [
"Apparent Power",
"S = VI",
`S = ${V*I} VA`
].join("\n");
}
 
// ----------------------------------
// REACTIVE POWER
// reactivePower(V,I,thetaDeg)
// ----------------------------------