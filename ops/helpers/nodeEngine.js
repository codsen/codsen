function lowestNodeMajor(nodeEngineRange) {
  if (typeof nodeEngineRange !== "string" || !nodeEngineRange.trim()) {
    throw new TypeError("engines.node must be a non-empty string");
  }

  const alternatives = nodeEngineRange.split("||").map((alternative) => {
    const trimmed = alternative.trim();
    if (!trimmed) {
      throw new TypeError(
        `engines.node contains an empty range alternative: ${nodeEngineRange}`,
      );
    }

    // A hyphen range's first version is its lower bound, for example
    // "18.17.0 - 22".
    const hyphenRange = trimmed.match(
      /^v?(\d+)(?:\.(?:\d+|x|X|\*))?(?:\.(?:\d+|x|X|\*))?\s+-\s+/,
    );
    if (hyphenRange) {
      return Number(hyphenRange[1]);
    }

    const lowerBounds = [];
    const lowerBoundPattern =
      /(?:^|\s)(>=|>|=|\^|~)?\s*v?(\d+)(?:\.(?:\d+|x|X|\*))?(?:\.(?:\d+|x|X|\*))?(?=$|\s)/g;
    let match;
    for (
      match = lowerBoundPattern.exec(trimmed);
      match;
      match = lowerBoundPattern.exec(trimmed)
    ) {
      lowerBounds.push(Number(match[2]));
    }

    if (!lowerBounds.length) {
      throw new TypeError(
        `engines.node must contain a lower version bound: ${nodeEngineRange}`,
      );
    }

    // Comparator sets are intersections, so their effective lower bound is
    // the highest lower bound in the set (for example, ">=18 >=20" is 20).
    return Math.max(...lowerBounds);
  });

  // Alternatives are unions, so the complete range starts at the lowest
  // lower bound among them.
  return Math.min(...alternatives);
}

function nodeTargetFromEngineRange(nodeEngineRange) {
  return `node${lowestNodeMajor(nodeEngineRange)}`;
}

export { lowestNodeMajor, nodeTargetFromEngineRange };
