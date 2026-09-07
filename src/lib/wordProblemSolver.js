export function classifyWordProblem(text) {
  const lower = text.toLowerCase();

  if (/(speed|rate|distance|travel|train|car|boat|miles|km|hours?)/.test(lower)) return 'motion';
  if (/(percent|discount|tax|interest|profit|sale|commission|increase|decrease)/.test(lower)) return 'percent';
  if (/(area|perimeter|volume|rectangle|triangle|circle|cylinder|cone|radius|width|length|height)/.test(lower)) return 'geometry';
  if (/(mixture|solution|concentration|salt|acid|alcohol|water)/.test(lower)) return 'mixture';
  if (/(work|together|alone|job|machine|pipe|pump|hours?)/.test(lower)) return 'work';
  if (/(age|older|younger|sum of ages|current age)/.test(lower)) return 'age';
  if (/(probability|chance|odds|random|at least|at most)/.test(lower)) return 'probability';

  return 'algebra';
}

function parseNumbers(text) {
  return (text.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return 'N/A';
  return Math.abs(value) < 1e-9 ? 0 : Number(value.toFixed(4));
}

export function solveWordProblem(input) {
  const text = String(input)
    .replace(/^(?:wordProblem|solveWordProblem|storyProblem|wp)\s*\(/i, '')
    .replace(/\)$/g, '')
    .replace(/^['"]|['"]$/g, '')
    .trim();

  if (!text) {
    return {
      category: 'unknown',
      answer: null,
      summary: 'No problem text was provided.',
      steps: []
    };
  }

  const category = classifyWordProblem(text);
  const numbers = parseNumbers(text);

  switch (category) {
    case 'motion': {
      const [distance, time] = numbers;
      const speed = distance && time ? distance / time : null;
      const summary = speed
        ? `The speed is ${formatNumber(speed)} units per hour because distance ÷ time = ${distance} ÷ ${time}.`
        : 'There is not enough information to determine a speed.';
      return { category, answer: speed, summary, steps: ['Identify distance and time', 'Use rate = distance ÷ time'] };
    }
    case 'percent': {
      const [base, percent] = numbers;
      const value = base && percent !== undefined ? base * (percent / 100) : null;
      const summary = value !== null
        ? `${percent}% of ${base} is ${formatNumber(value)}.`
        : 'This percentage problem is missing a base value or percentage.';
      return { category, answer: value, summary, steps: ['Convert percentage to decimal', 'Multiply by the base amount'] };
    }
    case 'geometry': {
      const [a, b] = numbers;
      const area = a && b ? a * b : null;
      const summary = area !== null
        ? `The area is ${formatNumber(area)} square units using A = l × w.`
        : 'This geometry problem needs two dimensions.';
      return { category, answer: area, summary, steps: ['Identify the relevant dimensions', 'Apply the correct area formula'] };
    }
    case 'mixture': {
      const [amountA, concentrationA, amountB, concentrationB] = numbers;
      if (amountA && concentrationA !== undefined && amountB && concentrationB !== undefined) {
        const saltA = amountA * (concentrationA / 100);
        const saltB = amountB * (concentrationB / 100);
        const totalSalt = saltA + saltB;
        const totalVolume = amountA + amountB;
        const finalConcentration = totalVolume ? (totalSalt / totalVolume) * 100 : 0;
        return {
          category,
          answer: formatNumber(totalSalt),
          summary: `The final mixture contains ${formatNumber(totalSalt)} units of solute and a concentration of ${formatNumber(finalConcentration)}%.`,
          steps: [
            'Compute the solute in each component',
            'Add the solute amounts together',
            'Divide by the total volume to get the final concentration'
          ]
        };
      }
      return {
        category,
        answer: null,
        summary: 'This mixture problem needs at least two solution amounts and their concentrations.',
        steps: ['List both solution amounts', 'Track the concentration for each solution']
      };
    }
    case 'work': {
      const [timeA, timeB] = numbers;
      const rateA = timeA ? 1 / timeA : 0;
      const rateB = timeB ? 1 / timeB : 0;
      const combinedTime = (rateA + rateB) ? 1 / (rateA + rateB) : null;
      const summary = combinedTime !== null
        ? `Together, the workers finish in ${formatNumber(combinedTime)} hours because the combined rate is ${formatNumber(rateA + rateB)} jobs per hour.`
        : 'This work problem needs how long each person takes individually.';
      return { category, answer: combinedTime, summary, steps: ['Convert each time to a rate', 'Add the rates together', 'Take the reciprocal to get total time'] };
    }
    case 'age': {
      const [ageA, ageB] = numbers;
      const totalAge = ageA !== undefined && ageB !== undefined ? ageA + ageB : null;
      const summary = totalAge !== null
        ? `The combined age is ${formatNumber(totalAge)}.`
        : 'This age problem needs the age values to compare.';
      return { category, answer: totalAge, summary, steps: ['Read the ages given', 'Add or compare as the problem asks'] };
    }
    case 'probability': {
      const [success, total] = numbers;
      const odds = success !== undefined && total ? success / total : null;
      const summary = odds !== null
        ? `The probability is ${formatNumber(odds)} = ${success}/${total}.`
        : 'This probability problem needs the number of favorable outcomes and total outcomes.';
      return { category, answer: odds, summary, steps: ['Identify favorable outcomes', 'Divide by total outcomes'] };
    }
    default: {
      const [a, b] = numbers;
      const value = a && b ? a + b : null;
      const summary = value !== null
        ? `Using the available numbers, a reasonable algebraic result is ${formatNumber(value)}.`
        : 'This algebra problem needs clearer numeric relationships to solve.';
      return { category, answer: value, summary, steps: ['Extract the numbers', 'Use the structure of the sentence to determine the operation'] };
    }
  }
}
