window.REAL_ANALYSIS_FORMULAS = new Set([
'epsilondelta',
'sequencelimit',
'seriesconvergence',
'monotoneconvergence',
'cauchy',
'uniformcontinuity',
'continuity',
'differentiability',
'integrability',
'supremum',
'infimum',
'bounded',
'bolzanoweierstrass',
'heineborel',
'taylortheorem',
'powerseries',
'fourierseries'
]);

function solveRealAnalysis(input) {
 
const match = input.match(/^([a-zA-Z]+)\((.*)\)$/);
 
if (!match) {
throw new Error("Invalid real analysis syntax");
}
 
const mode = match[1].toLowerCase();
 
switch(mode) {
 
case 'epsilondelta':
return [
"ε-δ Definition",
"For every ε>0",
"there exists δ>0",
"such that",
"|x-a|<δ ⇒ |f(x)-L|<ε"
].join("\n");
 
case 'sequencelimit':
return [
"Limit of Sequence",
"lim an = L",
"iff for every ε > 0",
"there exists N",
"such that n>N"
].join("\n");
 
case 'seriesconvergence':
return [
"Series Convergence",
"Σ an converges",
"if partial sums",
"approach a finite limit."
].join("\n");
 
case 'monotoneconvergence':
return [
"Monotone Convergence Theorem",
"Increasing + bounded",
"⇒ convergent"
].join("\n");
 
case 'cauchy':
return [
"Cauchy Sequence",
"For every ε>0",
"there exists N",
"with |an-am|<ε"
].join("\n");
 
case 'uniformcontinuity':
return [
"Uniform Continuity",
"δ depends only on ε",
"not on x"
].join("\n");
 
case 'continuity':
return [
"Continuity",
"lim f(x)=f(a)"
].join("\n");
 
case 'differentiability':
return [
"Differentiability",
"f'(a)=lim(h→0)",
"(f(a+h)-f(a))/h"
].join("\n");
 
case 'integrability':
return [
"Riemann Integrability",
"Upper sums and lower sums",
"converge together."
].join("\n");
 
case 'supremum':
return [
"Supremum",
"Least upper bound"
].join("\n");
 
case 'infimum':
return [
"Infimum",
"Greatest lower bound"
].join("\n");
 
case 'bounded':
return [
"Bounded Set",
"∃ M >0",
"such that |x|≤M"
].join("\n");
 
case 'bolzanoweierstrass':
return [
"Bolzano-Weierstrass",
"Every bounded sequence",
"has a convergent subsequence."
].join("\n");
 
case 'heineborel':
return [
"Heine-Borel",
"Compact iff",
"closed and bounded",
"(in ℝⁿ)."
].join("\n");
 
case 'taylortheorem':
return [
"Taylor Theorem",
"f(x)=Σ f⁽ⁿ⁾(a)/n! (x-a)^n"
].join("\n");