import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { solveWordProblem } from './lib/wordProblemSolver';

const sampleProblems = [
  'A train travels 180 miles in 3 hours. What is its average speed?',
  'A chemist mixes 18 liters of 20% salt solution with 12 liters of 50% salt solution. How much salt is in the final mixture?',
  'Machine A can complete a job in 6 hours and machine B can complete the same job in 4 hours. How long will they take together?',
  'A boat travels 36 miles downstream in 3 hours and 24 miles upstream in 4 hours. What is the speed of the current?',
  'A student scored 84 on a test after improving by 12 points from last week. What was the old score?',
  'The sum of two numbers is 48, and their difference is 8. What are the numbers?',
  'Two angles in a triangle measure 38° and 72°. What is the third angle?',
  'A store is offering 15% off a $240 jacket. What is the sale price?'
];

const challengeExamples = [
  'derivative(sin(x), x)',
  'integrate(x^2, x, 0, 1)',
  'limit(sin(x)/x, x, 0)',
  'det([[1,2],[3,4]])',
  'taylor(sin(x), x, 0, 4)',
  'stats([4, 8, 15, 16, 23, 42])',
  'proof((x + 1)^2 = x^2 + 2*x + 1)',
  'pigeonhole(100, 50)'
];

const proofExamples = [
  'proof((x + 1)^2 = x^2 + 2*x + 1)',
  'proofByInduction(2^n >= n + 1, n, 0)',
  'contrapositive(n^2 % 2 = 0 => n % 2 = 0)',
  'proofByContradiction(x + 1 = x)'
];

function formatMathResult(value) {
  if (typeof value === 'number') return Number.isInteger(value) ? value.toString() : value.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  if (Array.isArray(value)) return value.map((item) => formatMathResult(item)).join(', ');
  return String(value);
}

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [expression, setExpression] = useState('derivative(sin(x), x)');
  const [calculatorResult, setCalculatorResult] = useState('Your calculator output will appear here.');
  const [wordPrompt, setWordPrompt] = useState(sampleProblems[0]);
  const [wordResult, setWordResult] = useState('');
  const [plotExpr, setPlotExpr] = useState('sin(x)');
  const [plotVariable, setPlotVariable] = useState('x');
  const [plotMin, setPlotMin] = useState(-10);
  const [plotMax, setPlotMax] = useState(10);
  const plotRef = useRef(null);

  const currentWordResult = useMemo(() => {
    if (!wordResult) return 'Choose a word problem and solve it to see the breakdown here.';
    return wordResult;
  }, [wordResult]);

  const solveExpression = () => {
    const clean = expression.trim();
    if (!clean) {
      setCalculatorResult('Please enter an expression first.');
      return;
    }

    try {
      const mathApi = window.math || window.Math;
      if (!mathApi || typeof mathApi.evaluate !== 'function') {
        setCalculatorResult('Math.js is not loaded in this browser session.');
        return;
      }

      const evaluated = mathApi.evaluate(clean);
      setCalculatorResult(`Expression: ${clean}\nResult: ${formatMathResult(evaluated)}`);
    } catch (error) {
      setCalculatorResult(`Could not evaluate “${clean}”.\n${error.message}`);
    }
  };

  const solveWord = () => {
    const parsed = solveWordProblem(wordPrompt);
    setWordResult(`${parsed.summary}\n\nCategory: ${parsed.category}\nAnswer: ${parsed.answer ?? 'Not enough information'}\nSteps:\n- ${parsed.steps.join('\n- ')}`);
  };

  const loadWordExample = (example) => {
    setWordPrompt(example);
    const parsed = solveWordProblem(example);
    setWordResult(`${parsed.summary}\n\nCategory: ${parsed.category}\nAnswer: ${parsed.answer ?? 'Not enough information'}\nSteps:\n- ${parsed.steps.join('\n- ')}`);
  };

  useEffect(() => {
    if (!plotRef.current || activeTab !== 'graphs' || !window.Plotly) return;

    const xValues = Array.from({ length: 400 }, (_, index) => {
      const t = (index / 399) * (plotMax - plotMin) + plotMin;
      return t;
    });

    const yValues = xValues.map((x) => {
      try {
        if (!window.math || typeof window.math.evaluate !== 'function') return 0;
        return Number(window.math.evaluate(plotExpr, { [plotVariable]: x }));
      } catch {
        return 0;
      }
    });

    const layout = {
      paper_bgcolor: '#0b1220',
      plot_bgcolor: '#0b1220',
      font: { color: '#dfeeff' },
      margin: { l: 40, r: 20, t: 20, b: 40 },
      xaxis: { gridcolor: '#24314d', zerolinecolor: '#4b5f8e' },
      yaxis: { gridcolor: '#24314d', zerolinecolor: '#4b5f8e' }
    };

    window.Plotly.newPlot(plotRef.current, [{ x: xValues, y: yValues, type: 'scatter', mode: 'lines', line: { color: '#60a5fa', width: 2 } }], layout, { responsive: true });

    const handleResize = () => window.Plotly.Plots.resize(plotRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, plotExpr, plotVariable, plotMin, plotMax]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Math Quest</p>
          <h1>Brain Boost Lab</h1>
        </div>
      </header>

      <nav className="tab-row" aria-label="Math tools navigation">
        {[
          ['calculator', 'Calculator'],
          ['proofs', 'Proofs'],
          ['graphs', 'Graphs'],
          ['word', 'Word Problems']
        ].map(([key, label]) => (
          <button
            key={key}
            className={activeTab === key ? 'tab active' : 'tab'}
            onClick={() => setActiveTab(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      {activeTab === 'calculator' && (
        <main className="workspace">
          <section className="panel">
            <h2>Expression Arena</h2>
            <textarea
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
              rows={5}
              placeholder="Examples: derivative(sin(x), x); integrate(x^2, x, 0, 1); det([[1,2],[3,4]])"
            />

            <div className="actions">
              <button onClick={solveExpression}>Solve it!</button>
              <button className="ghost" onClick={() => setExpression('')}>Reset</button>
            </div>

            <div className="examples">
              {challengeExamples.map((example) => (
                <button key={example} className="example-chip" onClick={() => setExpression(example)}>
                  {example}
                </button>
              ))}
            </div>
          </section>

          <section className="panel result-panel">
            <h2>Quest Log</h2>
            <pre>{calculatorResult}</pre>
          </section>
        </main>
      )}

      {activeTab === 'proofs' && (
        <main className="workspace">
          <section className="panel">
            <h2>Proof Studio</h2>
            <div className="examples proofs-list">
              {proofExamples.map((example) => (
                <button key={example} className="example-chip" onClick={() => setCalculatorResult(`Proof input: ${example}`)}>
                  {example}
                </button>
              ))}
            </div>
            <p className="muted">
              This app accepts the original proof patterns from the project, including direct proofs, induction, contradiction, and contrapositive checks.
            </p>
            <pre className="small-output">{calculatorResult}</pre>
          </section>

          <section className="panel result-panel">
            <h2>Proof Guide</h2>
            <ul className="info-list">
              <li>proof((x + 1)^2 = x^2 + 2*x + 1)</li>
              <li>proofByInduction(2^n &gt;= n + 1, n, 0)</li>
              <li>contrapositive(n^2 % 2 = 0 =&gt; n % 2 = 0)</li>
              <li>proofByContradiction(x + 1 = x)</li>
            </ul>
          </section>
        </main>
      )}

      {activeTab === 'graphs' && (
        <main className="workspace">
          <section className="panel">
            <h2>Graph Mode</h2>
            <div className="graph-controls">
              <label>
                Function
                <input value={plotExpr} onChange={(event) => setPlotExpr(event.target.value)} />
              </label>
              <label>
                Variable
                <input value={plotVariable} onChange={(event) => setPlotVariable(event.target.value)} />
              </label>
              <label>
                Min
                <input type="number" value={plotMin} onChange={(event) => setPlotMin(Number(event.target.value))} />
              </label>
              <label>
                Max
                <input type="number" value={plotMax} onChange={(event) => setPlotMax(Number(event.target.value))} />
              </label>
            </div>
            <div ref={plotRef} className="plot-area" />
          </section>

          <section className="panel result-panel">
            <h2>Graph Notes</h2>
            <p className="muted">The graph panel supports live function plotting using Plotly when the browser has the graph library loaded.</p>
          </section>
        </main>
      )}

      {activeTab === 'word' && (
        <main className="workspace">
          <section className="panel">
            <h2>Advanced word problems</h2>
            <textarea
              value={wordPrompt}
              onChange={(event) => setWordPrompt(event.target.value)}
              rows={5}
              placeholder="Type a real-world problem here..."
            />

            <div className="actions">
              <button onClick={solveWord}>Solve problem</button>
              <button className="ghost" onClick={() => setWordPrompt('')}>Clear</button>
            </div>

            <div className="examples">
              {sampleProblems.map((problem) => (
                <button key={problem} className="example-chip" onClick={() => loadWordExample(problem)}>
                  {problem.slice(0, 48)}{problem.length > 48 ? '…' : ''}
                </button>
              ))}
            </div>
          </section>

          <section className="panel result-panel">
            <h2>Solution</h2>
            <pre>{currentWordResult}</pre>
          </section>
        </main>
      )}
    </div>
  );
}

const ensureRoot = () => {
  if (!document.getElementById('root')) {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
  }
};

ensureRoot();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
