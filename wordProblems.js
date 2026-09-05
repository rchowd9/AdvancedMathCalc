window.WORD_PROBLEM_MODE = new Set([
  'wordproblem',
  'solvewordproblem',
  'storyproblem',
  'wp'
]);


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