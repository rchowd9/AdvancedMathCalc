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

### Equation Solvers
- Linear systems — `solveSystem(A, b)`
- Nonlinear systems — `solveSystemNL([eq1, eq2], [vars], [initialGuess])`
- Quadratic equations — `solveEquation(expr = 0, variable)`
- General equations (Newton's method) — `solve(left = right, variable)`
- Root finding over an interval — `findRoots(f, x, lower, upper)`

### Sequences & Series
- Summation — `sum(expr, i, start, end)`
- Products — `product(expr, i, start, end)`

### Statistics
- Descriptive statistics (mean, median, variance, standard deviation, range, mode) — `stats([data])`

### Combinatorics & Number Theory
- Factorials — `factorial(n)`
- Permutations — `permutations(n, r)`
- Combinations — `combinations(n, r)`
- Prime factorization — `primeFactors(n)`
- Greatest common divisor — `gcd(a, b)`
- Least common multiple — `lcm(a, b)`

### Vectors & Units
- Dot product — `dot(v1, v2)`
- Cross product — `cross(v1, v2)`
- Magnitude — `magnitude(v)`
- Unit conversion — `convert(value unit, targetUnit)`

### Graph Plotting
- Plot any single-variable function
- Adjustable domain
- Smooth, interactive Plotly.js graphs

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
```

**Statistics**
```
stats([4, 8, 15, 16, 23, 42])
```

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

Enter a function and range:
```
Function: sin(x)
Variable: x
From: -10
To: 10
```

## 📁 Project Structure

```
/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🔧 Local Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

Open `index.html` in your browser — no build step required.

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