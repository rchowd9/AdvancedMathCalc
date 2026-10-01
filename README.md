# Brain Boost Lab — Advanced Math Calculator

A powerful, interactive math calculator built with JavaScript, [Math.js](https://mathjs.org/), and [Plotly.js](https://plotly.com/javascript/). It supports symbolic and numeric computation, graph plotting, equation solving, matrix operations, statistics, combinatorics, and step-by-step explanations — wrapped in a gamified XP/achievements interface.

## ⭐ Features

### Expression Evaluation
- Evaluate any valid Math.js expression
- Step-by-step explanations for arithmetic, derivatives, limits, and more

### Calculus
- Derivatives — `derivative(f, x)`
- Inverse trigonometric functions — `arcsin(x)`, `arccos(x)`, `arctan(x)`
- Partial derivatives — `partial(f, x)`
- Gradients — `gradient(f, [x, y])`
- Numeric definite integrals — `integrate(f, x, a, b)`
- Triple integrals — `tripleIntegral(f, x=a..b, y=c..d, z=e..f, steps=n)`
- Limits — `limit(f, x, a)`
- Taylor series expansion — `taylor(f, x, point, order)`

### Algebra
- Symbolic simplification — `simplify(expr)`

### Linear Algebra
- Determinants — `det(matrix)`
- Matrix inverse — `inv(matrix)`
- Eigenvalues — `eigenvalues(matrix)`
- Transpose, rank, and trace — `transpose(A)`, `rank(A)`, `trace(A)`
- Matrix addition and multiplication — `matrixAdd(A, B)`, `matrixMultiply(A, B)`
- Scalar multiplication — `scalarMultiply(A, c)`

### Equation Solvers
- Linear systems — `solveSystem(A, b)`
- Nonlinear systems — `solveSystemNL([eq1, eq2], [vars], [initialGuess])`
- Quadratic equations — `solveEquation(expr = 0, variable)`
- General equations (Newton's method) — `solve(left = right, variable)`
- Root finding over an interval — `findRoots(f, x, lower, upper)`

### Sequences & Series
- Summation — `sum(expr, i, start, end)`
- Products — `product(expr, i, start, end)`
- Arithmetic terms and partial sum — `arithmeticSequence(first, difference, count)`
- Geometric terms and partial sum — `geometricSequence(first, ratio, count)`
- Harmonic and alternating harmonic partial sums — `harmonicSequence(count)`, `alternatingHarmonic(count)`
- Finite p-series partial sum — `pSeries(p, count)`
- Fibonacci terms and partial sum — `fibonacciSequence(count)`

### Statistics
- Descriptive statistics (mean, median, variance, standard deviation, range, mode) — `stats([data])`

### Combinatorics & Number Theory
- Factorials — `factorial(n)`
- Permutations — `permutations(n, r)`
- Combinations — `combinations(n, r)`
- Prime factorization — `primeFactors(n)`
- Greatest common divisor — `gcd(a, b)`
- Least common multiple — `lcm(a, b)`

### Proof Methods
- Direct proof — `directProof(statement)`
- Proof by induction — `proofByInduction(statement, variable, baseValue)`
- Proof by contrapositive — `contrapositive(P => Q)`
- Proof by contradiction — `proofByContradiction(statement)`
- Proof by cases — `proofByCases(claim, variable, cases...)`
- Proof by exhaustion — `proofByExhaustion(claim, variable, domain)`
- Proof by divisibility — `proofByDivisibility(expr, divisor, variable, baseValue)`
- Disproof by counterexample — `disprove(statement)`
- Pigeonhole principle — `pigeonholeprinciple(numItems, numContainers)`
- Combinatorial proofs — `combinatorialproof(identity)` with support for Pascal's identity, binomial sum, symmetry proofs, and hockey-stick identity
- Law of cosines verification proof — `lawOfCosines(a, b, includedAngleDeg, c)`

### Vectors & Units
- Dot product — `dot(v1, v2)`
- Cross product — `cross(v1, v2)`
- Magnitude — `magnitude(v)`
- Unit conversion — `convert(value unit, targetUnit)`

### Graph Plotting
- Plot any single-variable function
- Adjustable domain
- Smooth, interactive Plotly.js graphs

### Engineering Studio
- Normal stress — `stress(forceN, areaMm2)`
- Simply supported beam checks — `beam(loadN, lengthM, youngsModulusPa, inertiaM4)`
- Reynolds number and flow regime — `reynolds(densityKgM3, velocityMs, diameterM, viscosityPaS)`
- Steady-state conduction — `heatTransfer(conductivityWmK, areaM2, deltaTK, thicknessM)`
- Preliminary safety-factor screening — `safetyFactor(yieldStrengthMPa, workingStressMPa)`
- Darcy-Weisbach pipe-flow estimate — `pipeFlow(densityKgM3, velocityMs, diameterM, viscosityPaS, roughnessM)`
- Coupled rigid-body dynamics — `rigidBodyDynamics(massKg, netForceN, inertiaKgM2, netTorqueNm)`
- Electromagnetic induction and coil power — `electromagneticInduction(turns, areaM2, dBdtTPerS, resistanceOhm)`

### Gamification
- XP, levels, and solve streaks
- Daily mission tracker (solve 3 challenges)
- Random challenge generator
- Achievement badges, including a "Renaissance Solver" badge for using six or more different math categories

### Error Handling
- Friendly messages for invalid input
- Domain errors
- Non-real values

## 📦 Tech Stack

- **JavaScript** — application logic
- **Math.js** — symbolic and numeric math engine
- **Plotly.js** — interactive graph plotting
- **HTML + CSS** — UI

## SQL schema

The optional SQLite schema in `schema.sql` provides tables for player progress, calculation history, and unlocked achievements. It can be applied with:

```bash
sqlite3 mathcalc.db < schema.sql
```

The current browser app still stores progress in local storage; the schema is ready for a server or desktop persistence layer.

## 🚀 Live Demo

If deployed on GitHub Pages, add your link here:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## 🧠 Usage Examples

**Derivatives**
```
derivative(sin(x), x)
partial(x^2*y + y^3, x)
gradient(x^2*y + y^3, [x, y])
taylor(sin(x), x, 0, 4)
```

**Integrals**
```
integrate(x^2, x, 0, 1)
```

**Limits**
```
limit(sin(x)/x, x, 0)
```

**Algebra**
```
simplify((x+1)^2 - (x^2+2x+1))
```

**Proof methods**
```
directProof(x^2 + 2*x + 1 = (x + 1)^2)
proofByInduction((n + 1)^2 = n^2 + 2*n + 1, n, 0)
contrapositive(x > 2 => x^2 > 4)
proofByContradiction((x + 1)^2 = x^2 + 2*x + 1)
pigeonhole(100, 50)
combinatorial(C(n,k)=C(n,n-k))
```

Induction takes an equality, its variable, and its base value. Contrapositive transforms an implication using `=>`; direct and contradiction modes accept equalities. Pigeonhole principle takes the number of items and containers. Combinatorial proofs support identities like Pascal's identity, binomial sum, and symmetry properties.


**Famous proof themes**
- Pythagorean theorem: $a^2 + b^2 = c^2$
- Fundamental theorem of arithmetic: every integer greater than 1 has a unique prime factorization
- Euclid's theorem: there are infinitely many primes
- Fermat's little theorem: $a^p \equiv a \pmod p$
- Gödel's incompleteness theorem: any sufficiently strong consistent formal system is incomplete
- Cantor's diagonal argument: the real numbers are uncountable
- Turing's halting theorem: no general algorithm can decide whether every program halts

**Linear System Solver**
```
solveSystem([[2,3],[4,-1]], [7,5])
```

**Quadratic Equation Solver**
```
solveEquation(x^2 - 5*x + 6 = 0, x)
```

**General Equation Solver**
```
solve(sin(x) = 0.5, x)
```

**Sequences & Series**
```
sum(i^2, i, 1, 10)
product(i, i, 1, 6)
arithmeticSequence(2, 3, 6)
geometricSequence(2, 3, 6)
harmonicSequence(6)
alternatingHarmonic(6)
pSeries(2, 6)
fibonacciSequence(8)
```
Sequence helpers show the requested terms and their finite partial sum. `fibonacciSequence(n)` starts at `F₀ = 0`; generated sequences are limited to 1,000 terms.

**More Linear Algebra**
```
transpose([[1, 2], [3, 4]])
rank([[1, 2], [2, 4]])
trace([[1, 2], [3, 4]])
matrixMultiply([[1, 2], [3, 4]], [[2], [1]])
matrixAdd([[1, 2], [3, 4]], [[4, 3], [2, 1]])
scalarMultiply([[1, 2], [3, 4]], 3)
```

**Statistics**
```
stats([4, 8, 15, 16, 23, 42])
sampleVariance([2, 4, 6, 8])
quartile([1, 2, 3, 4, 5, 6, 7, 8], 3)
standardError(12, 36)
meanConfidenceInterval(50, 12, 36, 1.96)
binomialPmf(2, 5, 0.4)
poissonPmf(3, 2.5)
linearRegression([1, 2, 3], [2, 4, 5])
tCriticalValue(10, 95)
chiSquareIndependence([[20, 30], [30, 20]])
oneWayAnova([[1, 2, 3], [4, 5, 6]])
```
The statistics backend also supports probability rules, normal/exponential/geometric distributions, z/t critical values, z/t test statistics, effect sizes, chi-square tests, and ANOVA. Tabulated t critical values are available for df 10, 20, 30, and Infinity. Formula conventions follow the [StatsCalculators statistics formula sheet](https://www.statscalculators.com/resources/formula-sheet/statistics-formula-sheet.pdf).

**Combinatorics & Number Theory**
```
factorial(6)
permutations(6, 3)
combinations(6, 3)
primeFactors(360)
gcd(48, 18)
lcm(4, 6)
```

**Vectors & Units**
```
dot([1,2,3], [4,5,6])
cross([1,0,0], [0,1,0])
magnitude([3,4])
convert(5 km, mi)
```

**Graph Plotting**

Enter one or more semicolon-separated functions and a range. The graph marks sampled x-intercepts, and its controls set sample resolution and y-axis scale:
```
Functions: sin(x); cos(x)
Variable: x
From: -10
To: 10
Samples: 800
Y scale: Linear
```

## 📁 Project Structure

```
/
├── index.html
├── style.css
├── script.js
├── proof.js
└── README.md
```

## 🔧 Local Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

Open `index.html` in your browser — no build step required.

### Proofs and Stokes' theorem

Use `proof(...)` or `prove(...)` to check an equality with step-by-step output:

```
proof((x + 1)^2 = x^2 + 2*x + 1)
```

Stokes' theorem keeps field components symbolic, so variables are allowed in the vector field:

```
stokesTheorem([y, -x, 0], [0, 0, 1], x, y, 0, 1, 0, 2, steps=40)
```

## 🌐 Deploying to GitHub Pages

1. Push your project to GitHub
2. Go to **Settings → Pages**
3. Select:
   - Source: **Deploy from branch**
   - Branch: **main**
   - Folder: **/root**
4. Save

Your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

## 🛠 GitHub Actions Auto-Deploy

Add this workflow at `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 📜 License

MIT License — free to use, modify, and distribute.

## 🙌 Contributing

Pull requests are welcome. Feel free to open issues for feature requests or bug reports.

---

Want a project logo, badges, or a GIF demo preview to make your GitHub page look even more polished? Just ask.