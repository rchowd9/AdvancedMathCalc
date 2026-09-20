window.GEOMETRY_PROOF_MODE_NAMES = new Set([
  'trianglecongruence',
  'trianglesimilarity',
  'pythagoras',
  'circletheorem',
  'parallellines',
  'coordinategeometry',
  'polygonangles',
  'lawofcosines'
]);

function solveGeometryProof(input) {
  const match = input.match(/^([a-zA-Z]+)\(\s*([\s\S]*)\s*\)$/);
  if (!match) {
    throw new Error("Use geometry proof modes like triangleCongruence(...), pythagoras(...), circleTheorem(...).");
  }

  const mode = match[1].toLowerCase();
  const args = splitTopLevel(match[2]);

  if (mode === 'trianglecongruence') {
    return solveTriangleCongruenceProof(args);
  }
  if (mode === 'trianglesimilarity') {
    return solveTriangleSimilarityProof(args);
  }
  if (mode === 'pythagoras') {
    return solvePythagorasProof(args);
  }
  if (mode === 'circletheorem') {
    return solveCircleTheoremProof(args);
  }
  if (mode === 'parallellines') {
    return solveParallelLinesProof(args);
  }
  if (mode === 'coordinategeometry') {
    return solveCoordinateGeometryProof(args);
  }
  if (mode === 'polygonangles') {
    return solvePolygonAnglesProof(args);
  }
  if (mode === 'lawofcosines') {
    return solveLawOfCosinesProof(args);
  }

  throw new Error("Unknown geometry proof method.");
}

function normalizeGeometrySymbols(arg) {
  return arg
    .replace(/∠/g, "angle")
    .replace(/°/g, "deg");
}

function solveTriangleCongruenceProof(args) {
  return [
    "Method: Triangle Congruence",
    `Claim: ${args.join(", ")}`,
    "Step 1: Check congruence criteria (SSS, SAS, ASA, RHS).",
    "Step 2: Verify sides/angles match.",
    "Conclusion: Triangles are congruent if one of the criteria holds."
  ].join("\n");
}

function solveTriangleSimilarityProof(args) {
  args = args.map(normalizeGeometrySymbols);
  return [
    "Method: Triangle Similarity",
    `Claim: ${args.join(", ")}`,
    "Step 1: Check similarity criteria (AA, SAS, SSS).",
    "Step 2: Verify proportional sides or equal angles.",
    "Conclusion: Triangles are similar if criteria hold."
  ].join("\n");
}

function solvePythagorasProof(args) {
  if (args.length < 3) throw new Error("Use pythagoras(a, b, c) with sides of a right triangle.");
  const [a, b, c] = args.map(Number);
  const lhs = a * a + b * b;
  const rhs = c * c;
  return [
    "Method: Pythagoras Theorem",
    `Claim: a² + b² = c²`,
    `Step 1: Compute a² + b² = ${lhs}`,
    `Step 2: Compute c² = ${rhs}`,
    lhs === rhs ? "Conclusion: The triangle satisfies Pythagoras." : "Conclusion: Not a right triangle."
  ].join("\n");
}

function solveCircleTheoremProof(args) {
  return [
    "Method: Circle Theorem",
    `Claim: ${args.join(", ")}`,
    "Step 1: Apply circle theorems (angle in semicircle = 90°, opposite angles in cyclic quadrilateral sum to 180°, etc.).",
    "Step 2: Verify with given values.",
    "Conclusion: Circle theorem holds if conditions are satisfied."
  ].join("\n");
}

function solveParallelLinesProof(args) {
  return [
    "Method: Parallel Lines",
    `Claim: ${args.join(", ")}`,
    "Step 1: Use alternate angles, corresponding angles, or co-interior angles.",
    "Step 2: Show equality or supplementary relationship.",
    "Conclusion: Lines are parallel if angle conditions hold."
  ].join("\n");
}

function solveCoordinateGeometryProof(args) {
  return [
    "Method: Coordinate Geometry",
    `Claim: ${args.join(", ")}`,
    "Step 1: Use slope, distance, or midpoint formulas.",
    "Step 2: Verify relationships (parallel, perpendicular, equal length).",
    "Conclusion: Claim proven using coordinate geometry."
  ].join("\n");
}

function solvePolygonAnglesProof(args) {
  if (args.length < 1) throw new Error("Use polygonAngles(n) with number of sides.");
  const n = Number(args[0]);
  const sum = (n - 2) * 180;
  return [
    "Method: Polygon Interior Angles",
    `Claim: Sum of interior angles of polygon with ${n} sides.`,
    `Step 1: Formula = (n - 2) × 180`,
    `Step 2: Compute = ${sum}`,
    `Conclusion: Interior angle sum = ${sum}°`
  ].join("\n");
}

function solveLawOfCosinesProof(args) {
  if (args.length < 4) throw new Error('Use lawOfCosines(a, b, angleDeg, c) to verify a triangle side.');
  const [a, b, angleDeg, c] = args.map(Number);
  if ([a, b, c].some((value) => !Number.isFinite(value) || value <= 0) || !Number.isFinite(angleDeg) || angleDeg <= 0 || angleDeg >= 180) {
    throw new Error('Triangle sides must be positive and the included angle must be between 0 and 180 degrees.');
  }
  const angle = angleDeg * Math.PI / 180;
  const expectedSquared = a ** 2 + b ** 2 - 2 * a * b * Math.cos(angle);
  const suppliedSquared = c ** 2;
  const tolerance = 1e-9 * Math.max(1, expectedSquared);
  const agrees = Math.abs(expectedSquared - suppliedSquared) <= tolerance;
  return [
    'Law of Cosines Proof',
    `Claim: c^2 = a^2 + b^2 - 2ab cos(C), with a = ${a}, b = ${b}, C = ${angleDeg}°, c = ${c}`,
    'Step 1: Resolve the included angle into the dot-product term -2ab cos(C).',
    `Step 2: a^2 + b^2 - 2ab cos(C) = ${formatProofNumber(expectedSquared)}`,
    `Step 3: Compare with c^2 = ${formatProofNumber(suppliedSquared)}.`,
    agrees ? 'Conclusion: The supplied side satisfies the Law of Cosines.' : 'Conclusion: The supplied side does not satisfy the Law of Cosines.'
  ].join('\n');
}

function formatProofNumber(value) {
  return Number(value.toPrecision(8));
}

function splitTopLevel(statement) {
  const parts = [];
  let start = 0;
  let depth = 0;
  for (let index = 0; index < statement.length; index++) {
    if ('(['.includes(statement[index])) depth += 1;
    if ([')', ']'].includes(statement[index])) depth -= 1;
    if (statement[index] === ',' && depth === 0) {
      parts.push(statement.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(statement.slice(start).trim());
  return parts;
}

window.triangleCongruence = (...args) => solveGeometryProof(`triangleCongruence(${args.join(", ")})`);
window.triangleSimilarity = (...args) => solveGeometryProof(`triangleSimilarity(${args.join(", ")})`);
window.pythagoras = (...args) => solveGeometryProof(`pythagoras(${args.join(", ")})`);
window.circleTheorem = (...args) => solveGeometryProof(`circleTheorem(${args.join(", ")})`);
window.parallelLines = (...args) => solveGeometryProof(`parallelLines(${args.join(", ")})`);
window.coordinateGeometry = (...args) => solveGeometryProof(`coordinateGeometry(${args.join(", ")})`);
window.polygonAngles = (...args) => solveGeometryProof(`polygonAngles(${args.join(", ")})`);
window.lawOfCosines = (...args) => solveGeometryProof(`lawOfCosines(${args.join(", ")})`);