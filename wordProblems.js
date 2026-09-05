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