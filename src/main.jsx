import React from 'react';
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

function App() {
  const [prompt, setPrompt] = React.useState(sampleProblems[0]);
  const [result, setResult] = React.useState('');

  const handleSolve = () => {
    const parsed = solveWordProblem(prompt);
    setResult(`${parsed.summary}\n\nCategory: ${parsed.category}\nAnswer: ${parsed.answer ?? 'Not enough information'}\nSteps:\n- ${parsed.steps.join('\n- ')}`);
  };

  const handleLoadExample = (example) => {
    setPrompt(example);
    const parsed = solveWordProblem(example);
    setResult(`${parsed.summary}\n\nCategory: ${parsed.category}\nAnswer: ${parsed.answer ?? 'Not enough information'}\nSteps:\n- ${parsed.steps.join('\n- ')}`);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Math Quest</p>
          <h1>Brain Boost Lab</h1>
        </div>
      </header>

      <main className="workspace">
        <section className="panel">
          <h2>Advanced word problems</h2>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={5}
            placeholder="Type a real-world problem here..."
          />

          <div className="actions">
            <button onClick={handleSolve}>Solve problem</button>
            <button className="ghost" onClick={() => setPrompt('')}>Clear</button>
          </div>

          <div className="examples">
            {sampleProblems.map((problem) => (
              <button key={problem} className="example-chip" onClick={() => handleLoadExample(problem)}>
                {problem.slice(0, 48)}{problem.length > 48 ? '…' : ''}
              </button>
            ))}
          </div>
        </section>

        <section className="panel result-panel">
          <h2>Solution</h2>
          <pre>{result || 'Your answer will appear here.'}</pre>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
