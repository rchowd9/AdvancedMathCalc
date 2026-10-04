window.TOPOLOGY_FORMULAS = new Set([
'openset',
'closedset',
'compactset',
'connectedset',
'boundary',
'closure',
'interior',
'metric',
'hausdorff',
'neighborhood',
'denseset',
'accumulationpoint',
'homeomorphism',
'continuitytopological'
]);

function solveTopology(input) {
 
const match = input.match(/^([a-zA-Z]+)\((.*)\)$/);
 
if (!match) {
throw new Error("Invalid topology syntax");
}
 
const mode = match[1].toLowerCase();

switch(mode) {
 
case 'openset':
return [
"Open Set",
"Definition:",
"A set U is open if for every x∈U",
"there exists ε>0 such that",
"B(x,ε) ⊂ U"
].join("\n");
 
case 'closedset':
return [
"Closed Set",
"A set contains",
"all of its limit points."
].join("\n");
 
case 'compactset':
return [
"Compactness",
"Every open cover",
"has a finite subcover.",
"In ℝⁿ:",
"Closed + Bounded ⇔ Compact"
].join("\n");
 
case 'connectedset':
return [
"Connected Set",
"Cannot be represented",
"as union of two",
"disjoint open sets."
].join("\n");
 
case 'boundary':
return [
"Boundary",
"∂A = closure(A) − interior(A)"
].join("\n");
 
case 'closure':
return [
"Closure",
"cl(A)=A ∪ limit points"
].join("\n");

case 'interior':
return [
"Interior",
"Largest open subset of A"
].join("\n");
 
case 'metric':
return [
"Metric Space Conditions",
"1. d(x,y) ≥ 0",
"2. d(x,y)=0 iff x=y",
"3. symmetry",
"4. triangle inequality"
].join("\n");
 
case 'hausdorff':
return [
"Hausdorff Space",
"Distinct points possess",
"disjoint neighborhoods."
].join("\n");
 
case 'neighborhood':
return [
"Neighborhood",
"Contains an open ball",
"around a point."
].join("\n");
 
case 'denseset':
return [
"Dense Set",
"closure(A)=X"
].join("\n");
 
case 'accumulationpoint':
return [
"Accumulation Point",
"Every neighborhood",
"contains infinitely many",
"points of the set."
].join("\n");
 
case 'homeomorphism':
return [
"Homeomorphism",
"Continuous bijection",
"with continuous inverse."
].join("\n");

case 'continuitytopological':
return [
"Topological Continuity",
"Preimage of every",
"open set is open."
].join("\n");
 
default:
throw new Error("Unknown topology operation");
}
}