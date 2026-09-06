window.GEOMETRY_PROOF_MODE_NAMES = new Set([
  'trianglecongruence',
  'trianglesimilarity',
  'pythagoras',
  'circletheorem',
  'parallellines',
  'coordinategeometry',
  'polygonangles'
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

  throw new Error("Unknown geometry proof method.");
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
  return [
    "Method: Triangle Similarity",
    `Claim: ${args.join(", ")}`,
    "Step 1: Check similarity criteria (AA, SAS, SSS).",
    "Step 2: Verify proportional sides or equal angles.",
    "Conclusion: Triangles are similar if criteria hold."
  ].join("\n");
}