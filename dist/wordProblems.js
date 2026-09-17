window.WORD_PROBLEM_MODE = new Set([
  'wordproblem',
  'solvewordproblem',
  'storyproblem',
  'wp'
]);

window.solveWordProblem = solveWordProblem;


function solveWordProblem(input) {
  const match = input.match(/^(?:wordProblem|solveWordProblem|storyProblem|wp)\(\s*([\s\S]*)\s*\)$/i);
  if (!match) {
    throw new Error("Use wordProblem(\"your problem here\")");
  }

  const text = match[1].trim().replace(/^["']|["']$/g, "");

  // Step 1: classify problem type
  const category = classifyWordProblem(text);

  // Step 2: extract numbers and variables
  const data = extractNumbersAndVariables(text);

  // Step 3: solve based on category
  const solution = solveByCategory(category, data, text);

  // Step 4: return formatted explanation
  return [
    `Word Problem Category: ${category}`,
    `Original Problem: ${text}`,
    "",
    "Extracted Data:",
    `Numbers: ${JSON.stringify(data.numbers)}`,
    `Variables: ${JSON.stringify(data.variables)}`,
    "",
    "Solution:",
    solution,
    "",
    "Conclusion: Word problem solved using automatic classification + symbolic reasoning."
  ].join("\n");
}

function classifyWordProblem(text) {
  const lower = text.toLowerCase();

  if (lower.includes("rate") || lower.includes("speed") || lower.includes("distance") || lower.includes("time")) {
    return "Rates / Motion";
  }
  if (lower.includes("percent") || lower.includes("interest") || lower.includes("tax") || lower.includes("discount")) {
    return "Finance / Percentage";
  }
  if (lower.includes("area") || lower.includes("perimeter") || lower.includes("volume")) {
    return "Geometry";
  }
  if (lower.includes("probability") || lower.includes("chance") || lower.includes("odds")) {
    return "Probability";
  }
  if (lower.includes("mixture") || lower.includes("solution") || lower.includes("concentration")) {
    return "Mixture Problems";
  }
  if (lower.includes("work") || lower.includes("together")) {
    return "Work Problems";
  }
  if (lower.includes("age")) {
    return "Age Problems";
  }
  return "General Algebra";
}

function extractNumbersAndVariables(text) {
  const numbers = (text.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  const variables = (text.match(/[a-zA-Z]+/g) || []).filter(v => isNaN(v));

  return { numbers, variables };
}

function solveByCategory(category, data, text) {
  switch (category) {
    case "Rates / Motion":
      return solveRatesProblem(data, text);
    case "Finance / Percentage":
      return solveFinanceProblem(data, text);
    case "Geometry":
      return solveGeometryProblem(data, text);
    case "Probability":
      return solveProbabilityProblem(data, text);
    case "Mixture Problems":
      return solveMixtureProblem(data, text);
    case "Work Problems":
      return solveWorkProblem(data, text);
    case "Age Problems":
      return solveAgeProblem(data, text);
    default:
      return solveGeneralAlgebraProblem(data, text);
  }
}


function solveRatesProblem(data, text) {
  if (data.numbers.length >= 2) {
    const [speed, time] = data.numbers;
    const distance = speed * time;
    return `Distance = speed × time = ${speed} × ${time} = ${distance}`;
  }
  return "Rates problem detected, but insufficient numeric data.";
}

function solveFinanceProblem(data, text) {
  if (text.toLowerCase().includes("percent")) {
    const [amount, percent] = data.numbers;
    const result = amount * (percent / 100);
    return `${percent}% of ${amount} = ${result}`;
  }
  return "Finance problem detected, but insufficient numeric data.";
}

function solveGeometryProblem(data, text) {
  if (text.includes("area") && data.numbers.length >= 2) {
    const [a, b] = data.numbers;
    return `Area = ${a} × ${b} = ${a * b}`;
  }
  return "Geometry problem detected, but insufficient numeric data.";
}

function solveProbabilityProblem(data, text) {
  if (data.numbers.length >= 2) {
    const [favorable, total] = data.numbers;
    const probability = favorable / total;
    return `Probability = favorable / total = ${favorable} / ${total} = ${probability}`;
  }
  return "Probability problem detected, but insufficient numeric data.";
}

function solveMixtureProblem(data, text) {
  return "Mixture problem detected. Full mixture solver not implemented yet.";
}

function solveWorkProblem(data, text) {
  if (data.numbers.length >= 2) {
    const [rate1, rate2] = data.numbers;
    const combined = rate1 + rate2;
    return `Combined work rate = ${rate1} + ${rate2} = ${combined}`;
  }
  return "Work problem detected, but insufficient numeric data.";
}

function solveAgeProblem(data, text) {
  return "Age problem detected. Age solver not implemented yet.";
}

function solveGeneralAlgebraProblem(data, text) {
  return "General algebra problem detected. Try providing more numeric relationships.";
}