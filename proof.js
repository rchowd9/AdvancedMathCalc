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
  const proved = difference === '0';
  const lines = [
    `Claim: ${left} = ${right}`,
    'Step 1: Move everything to one side.',
    `  ${left} - (${right})`,
    'Step 2: Simplify the difference.',
    `  ${difference}`,
    proved ? 'Conclusion: Proven, because the difference simplifies to 0.' : 'Conclusion: Not proven; the simplified difference is not 0.'
  ];

  return lines.join('\n');
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
