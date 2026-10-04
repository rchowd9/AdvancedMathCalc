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