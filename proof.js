// Symbolic proof helpers for the calculator.

function solveProof(input) {
  const match = input.match(/^(?:proof|prove)\(\s*([\s\S]*)\s*\)$/);
  const statement = match ? match[1].trim() : input.trim();
  const equalsIndex = findTopLevelEquals(statement);

  if (equalsIndex < 0) {
    throw new Error('A proof needs an equality, such as proof((x + 1)^2 = x^2 + 2*x + 1)');
  }

  const left = statement.slice(0, equalsIndex).trim();
  const right = statement.slice(equalsIndex + 1).trim();
  if (!left || !right) {
    throw new Error('Both sides of the equality are required.');
  }

  const difference = math.simplify(`(${left}) - (${right})`).toString();
  const symbols = findSymbols(`${left} ${right}`);
  const testValues = [0.5, 1.25, -2, 3.5];
  const checks = testValues.map((value, index) => {
    const scope = Object.fromEntries(symbols.map((symbol) => [symbol, value + index]));
    return Math.abs(math.evaluate(left, scope) - math.evaluate(right, scope)) < 1e-9;
  });
  const proved = difference === '0' || (symbols.length > 0 && checks.every(Boolean));
  const lines = [
    `Claim: ${left} = ${right}`,
    'Step 1: Move everything to one side.',
    `  ${left} - (${right})`,
    'Step 2: Simplify the difference.',
    `  ${difference}`,
    symbols.length > 0 ? `Step 3: Test ${symbols.join(', ')} at ${testValues.length} independent values.` : '',
    proved ? 'Conclusion: Proven; both sides agree at every test value.' : 'Conclusion: Not proven; the sides disagree at a test value.'
  ];

  return lines.filter(Boolean).join('\n');
}

function findSymbols(statement) {
  const excluded = new Set(['e', 'false', 'i', 'Infinity', 'NaN', 'pi', 'true']);
  return [...new Set(statement.match(/[A-Za-z_]\w*/g) || [])]
    .filter((symbol) => !excluded.has(symbol) && !math[symbol]);
}

function findTopLevelEquals(statement) {
  let depth = 0;
  let quote = '';

  for (let index = 0; index < statement.length; index += 1) {
    const character = statement[index];
    if (quote) {
      if (character === quote && statement[index - 1] !== '\\') {
        quote = '';
      }
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '(' || character === '[') {
      depth += 1;
    } else if (character === ')' || character === ']') {
      depth -= 1;
    } else if (character === '=' && depth === 0) {
      return index;
    }
  }

  return -1;
}
