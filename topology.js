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