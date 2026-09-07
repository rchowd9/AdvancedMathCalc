import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../style.css';

const loadLegacyScripts = () => {
  if (window.__mathcalcLegacyLoaded) return;
  window.__mathcalcLegacyLoaded = true;

  const legacyScripts = ['/wordProblems.js', '/proof.js', '/geometryProofs.js', '/script.js'];
  legacyScripts.forEach((src) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.appendChild(script);
  });
};

function App() {
  useEffect(() => {
    loadLegacyScripts();
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">M</div>
          <div>
            <p className="eyebrow">Math Quest</p>
            <h1>Brain Boost Lab</h1>
          </div>
        </div>

        <div className="player-card">
          <span className="level-badge" id="levelBadge">Lvl 1</span>
          <div>
            <strong>Player One</strong>
            <small id="xpLabel">0 XP</small>
          </div>
        </div>
      </header>

      <section className="hud" aria-label="Player status">
        <div className="hud-item">
          <span>XP</span>
          <strong id="xpValue">0</strong>
        </div>
        <div className="hud-item">
          <span>Streak</span>
          <strong id="streakValue">1</strong>
        </div>
        <div className="hud-item">
          <span>Level</span>
          <strong id="levelValue">1</strong>
        </div>
        <div className="hud-item">
          <span>Quests</span>
          <strong id="missionProgress">0/3</strong>
        </div>
      </section>

      <section className="quest-panel card">
        <div className="card-header">
          <div>
            <p className="eyebrow">Daily mission</p>
            <h2>Solve 3 challenges</h2>
          </div>
          <button id="randomChallengeBtn" className="secondary-btn" type="button">Random mission</button>
        </div>

        <div className="challenge-list" aria-label="Quick math challenges">
          <button className="challenge-chip" data-expression="derivative(sin(x), x)" type="button">Derivative drill</button>
          <button className="challenge-chip" data-expression="integrate(x^2, x, 0, 1)" type="button">Integral launch</button>
          <button className="challenge-chip" data-expression="limit(sin(x)/x, x, 0)" type="button">Limit test</button>
          <button className="challenge-chip" data-expression="det([[1,2],[3,4]])" type="button">Matrix power</button>
          <button className="challenge-chip" data-expression="taylor(sin(x), x, 0, 4)" type="button">Taylor series</button>
          <button className="challenge-chip" data-expression="stats([4, 8, 15, 16, 23, 42])" type="button">Stats check</button>
          <button className="challenge-chip" data-expression="combinations(6, 3)" type="button">Combinatorics</button>
          <button className="challenge-chip" data-expression="volumeOfRevolution(x^2, x, 0, 2)" type="button">Solid of revolution</button>
          <button className="challenge-chip" data-expression="proof((x + 1)^2 = x^2 + 2*x + 1)" type="button">Proof drill</button>
          <button className="challenge-chip" data-expression="pigeonhole(100, 50)" type="button">Pigeonhole principle</button>
          <button className="challenge-chip" data-expression="combinatorial(C(n,k)=C(n,n-k))" type="button">Combinatorial proof</button>
        </div>
      </section>

      <main className="layout">
        <section className="card calculator-panel">
          <div className="card-header">
            <div>
              <p className="eyebrow">Expression arena</p>
              <h2>Build your move</h2>
            </div>
          </div>

          <label htmlFor="expr">Enter expression:</label>
          <textarea id="expr" rows="3" placeholder="Examples: derivative(sin(x), x); taylor(sin(x), x, 0, 4); proof((x+1)^2=x^2+2*x+1); pigeonhole(100,50); combinatorial(C(n,k)=C(n,n-k))" />

          <div className="action-row">
            <button id="evalBtn" type="button">Solve it!</button>
            <button id="clearBtn" className="ghost-btn" type="button">Reset</button>
          </div>
        </section>

        <aside className="card achievements-panel">
          <div className="card-header compact">
            <div>
              <p className="eyebrow">Rewards</p>
              <h2>Badges</h2>
            </div>
          </div>

          <ul className="achievement-list" id="achievementList">
            <li className="achievement locked">
              <span className="badge-icon">🌟</span>
              <div>
                <strong>Starter</strong>
                <small>First correct solve</small>
              </div>
            </li>
            <li className="achievement locked">
              <span className="badge-icon">📈</span>
              <div>
                <strong>Graph Explorer</strong>
                <small>Plot your first function</small>
              </div>
            </li>
            <li className="achievement locked">
              <span className="badge-icon">🧠</span>
              <div>
                <strong>Derivative Pro</strong>
                <small>Complete a derivative challenge</small>
              </div>
            </li>
            <li className="achievement locked">
              <span className="badge-icon">🏆</span>
              <div>
                <strong>Math Master</strong>
                <small>Earn 250 XP</small>
              </div>
            </li>
            <li className="achievement locked">
              <span className="badge-icon">🎨</span>
              <div>
                <strong>Renaissance Solver</strong>
                <small>Use 6 different math categories</small>
              </div>
            </li>
          </ul>
        </aside>
      </main>

      <section className="card result-panel">
        <div className="result-header">
          <h2>Quest Log</h2>
          <span id="statusBadge" className="status-badge ready">Ready</span>
        </div>
        <pre id="result">Your next big win is waiting...</pre>
      </section>

      <section className="card graph-section">
        <div className="graph-heading">
          <div>
            <p className="eyebrow">Graph mode</p>
            <h2>Plot a function</h2>
          </div>
          <button id="plotBtn" type="button">Plot it!</button>
        </div>

        <div className="graph-controls">
          <label>
            Function
            <input id="plotExpr" type="text" defaultValue="sin(x)" placeholder="e.g. x^2 - 4" />
          </label>
          <label>
            Variable
            <input id="plotVariable" type="text" defaultValue="x" maxLength="10" />
          </label>
          <label>
            From
            <input id="plotMin" type="number" defaultValue="-10" step="any" />
          </label>
          <label>
            To
            <input id="plotMax" type="number" defaultValue="10" step="any" />
          </label>
        </div>

        <div id="plot" aria-label="Function graph" />
        <p id="plotStatus" className="plot-status" role="status" />
      </section>

      <section className="section examples-panel">
        <h2>Quick examples</h2>
        <div className="examples-grid">
          <div className="examples-group">
            <h3>Calculus</h3>
            <ul>
              <li>derivative(sin(x), x)</li>
              <li>partial(x^2*y + y^3, x)</li>
              <li>gradient(x^2*y + y^3, [x, y])</li>
              <li>integrate(x^2, x, 0, 1)</li>
              <li>limit(sin(x)/x, x, 0)</li>
              <li>taylor(sin(x), x, 0, 4)</li>
            </ul>
          </div>
          <div className="examples-group">
            <h3>Algebra &amp; Linear Algebra</h3>
            <ul>
              <li>simplify((x+1)^2 - (x^2+2x+1))</li>
              <li>solveEquation(x^2 - 4 = 0, x)</li>
              <li>det([[1,2],[3,4]])</li>
              <li>inv([[1,2],[3,4]])</li>
              <li>eigenvalues([[2,1],[1,2]])</li>
            </ul>
          </div>
          <div className="examples-group">
            <h3>Sequences &amp; Statistics</h3>
            <ul>
              <li>sum(i^2, i, 1, 10)</li>
              <li>product(i, i, 1, 6)</li>
              <li>stats([4, 8, 15, 16, 23, 42])</li>
            </ul>
          </div>
          <div className="examples-group">
            <h3>Combinatorics &amp; Number Theory</h3>
            <ul>
              <li>factorial(6)</li>
              <li>permutations(6, 3)</li>
              <li>combinations(6, 3)</li>
              <li>primeFactors(360)</li>
              <li>gcd(48, 18)</li>
              <li>lcm(4, 6)</li>
            </ul>
          </div>
          <div className="examples-group">
            <h3>Vectors &amp; Units</h3>
            <ul>
              <li>dot([1,2,3], [4,5,6])</li>
              <li>cross([1,0,0], [0,1,0])</li>
              <li>magnitude([3,4])</li>
              <li>convert(5 km, mi)</li>
            </ul>
          </div>
          <div className="examples-group">
            <h3>Volume, Surface Area &amp; Boundary</h3>
            <ul>
              <li>volumeOfRevolution(x^2, x, 0, 2)</li>
              <li>surfaceOfRevolution(x^2, x, 0, 2)</li>
              <li>arcLength(x^2, x, 0, 2)</li>
            </ul>
          </div>
          <div className="examples-group">
            <h3>Proofs</h3>
            <ul>
              <li>proof((x + 1)^2 = x^2 + 2*x + 1)</li>
              <li>proofByInduction(2^n &gt;= n + 1, n, 0)</li>
              <li>contrapositive(n^2 % 2 = 0 =&gt; n % 2 = 0)</li>
              <li>proofByContradiction(x + 1 = x)</li>
              <li>proveInequality(x^2 + 1 &gt;= 2*x)</li>
              <li>proofByBiconditional(n % 2 = 0 &lt;=&gt; n^2 % 2 = 0)</li>
              <li>proofByCases(n^2 % 2 = 0, n, [2,4,6,8], [1,3,5,7])</li>
              <li>proofByExhaustion(n^2 &gt;= n, n, [0,1,2,3,4])</li>
              <li>disprove(x^2 &gt;= x)</li>
              <li>proofByDivisibility(n^3 - n, 6, n, 1)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
