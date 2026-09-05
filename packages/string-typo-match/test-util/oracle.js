// Deliberately unoptimized test oracle: enumerate every local alignment, then
// validate and price the complete path. No production scorer helpers are used.
const kindOrder = [
  "missing-character",
  "omitted-block",
  "repeated-character",
  "extra-character",
  "adjacent-swap",
  "keyboard-substitution",
  "substitution",
];

const baseline = {
  maxEvents: 1,
  maxCost: 200,
  minCostGap: 25,
  minInputLength: 3,
  maxOmissionLength: 4,
  maxOmissionRatio: 0.5,
  keyboard: null,
  costs: {
    missingCharacter: 100,
    omissionOpen: 100,
    omissionExtend: 20,
    extraCharacter: 100,
    repeatedCharacter: 75,
    adjacentSwap: 100,
    keyboardSubstitution: 75,
    substitution: 150,
  },
};

function points(string) {
  const chars = Array.from(string);
  const offsets = [0];
  for (const char of chars) {
    offsets.push(offsets[offsets.length - 1] + char.length);
  }
  return { chars, offsets };
}

function compareExplanations(a, b) {
  if (a.cost !== b.cost) return a.cost - b.cost;
  if (a.eventCount !== b.eventCount) return a.eventCount - b.eventCount;
  for (let index = 0; index < a.operations.length; index += 1) {
    for (const key of [
      "candidateFrom",
      "inputFrom",
      "candidateTo",
      "inputTo",
    ]) {
      const difference = a.operations[index][key] - b.operations[index][key];
      if (difference) return difference;
    }
    const difference =
      kindOrder.indexOf(a.operations[index].kind) -
      kindOrder.indexOf(b.operations[index].kind);
    if (difference) return difference;
  }
  return 0;
}

export function referenceScore(candidate, input, options = {}) {
  const policy = {
    ...baseline,
    ...options,
    costs: { ...baseline.costs, ...options.costs },
  };
  const intended = points(candidate);
  const observed = points(input);
  const a = intended.chars;
  const b = observed.chars;
  let optimum = null;

  function evaluate(path) {
    const operations = [];
    let omitted = 0;
    let omissionSinceMatch = false;
    for (let index = 0; index < path.length; index += 1) {
      const step = path[index];
      if (step.kind === "match") {
        omissionSinceMatch = false;
        continue;
      }
      let kind = step.kind;
      let cost;
      if (kind === "omission") {
        const length = step.toA - step.fromA;
        if (omissionSinceMatch || length > policy.maxOmissionLength) return;
        omissionSinceMatch = true;
        omitted += length;
        kind = length === 1 ? "missing-character" : "omitted-block";
        cost =
          length === 1
            ? policy.costs.missingCharacter
            : policy.costs.omissionOpen +
              (length - 1) * policy.costs.omissionExtend;
      } else if (kind === "extra-character") {
        cost = policy.costs.extraCharacter;
        const left = path[index - 1];
        const right = path[index + 1];
        const repeat =
          (left?.kind === "match" && a[left.fromA] === b[step.fromB]) ||
          (right?.kind === "match" && a[right.fromA] === b[step.fromB]);
        if (repeat && policy.costs.repeatedCharacter <= cost) {
          kind = "repeated-character";
          cost = policy.costs.repeatedCharacter;
        }
      } else if (kind === "substitution") {
        cost = policy.costs.substitution;
        if (
          policy.keyboard &&
          Object.hasOwn(policy.keyboard, a[step.fromA]) &&
          policy.keyboard[a[step.fromA]].includes(b[step.fromB]) &&
          policy.costs.keyboardSubstitution <= cost
        ) {
          kind = "keyboard-substitution";
          cost = policy.costs.keyboardSubstitution;
        }
      } else {
        cost = policy.costs.adjacentSwap;
      }
      operations.push({
        kind,
        candidateFrom: intended.offsets[step.fromA],
        candidateTo: intended.offsets[step.toA],
        inputFrom: observed.offsets[step.fromB],
        inputTo: observed.offsets[step.toB],
        cost,
      });
    }
    if (omitted / a.length > policy.maxOmissionRatio) return;
    const cost = operations.reduce((sum, operation) => sum + operation.cost, 0);
    if (!Number.isSafeInteger(cost) || cost > policy.maxCost) return;
    const result = { cost, eventCount: operations.length, operations };
    if (!optimum || compareExplanations(result, optimum) < 0) optimum = result;
  }

  function enumerate(i, j, events, path) {
    if (i === a.length && j === b.length) {
      evaluate(path);
      return;
    }
    function next(kind, toA, toB, event) {
      enumerate(toA, toB, events + event, [
        ...path,
        { kind, fromA: i, toA, fromB: j, toB },
      ]);
    }
    if (i < a.length && j < b.length && a[i] === b[j]) {
      next("match", i + 1, j + 1, 0);
    }
    if (events === policy.maxEvents) return;
    // Enumerate complete omission spans before applying any omission policy.
    for (let end = i + 1; end <= a.length; end += 1) {
      next("omission", end, j, 1);
    }
    if (j < b.length) next("extra-character", i, j + 1, 1);
    if (i < a.length && j < b.length && a[i] !== b[j]) {
      next("substitution", i + 1, j + 1, 1);
    }
    if (
      i + 1 < a.length &&
      j + 1 < b.length &&
      a[i] !== a[i + 1] &&
      a[i] === b[j + 1] &&
      a[i + 1] === b[j]
    ) {
      next("adjacent-swap", i + 2, j + 2, 1);
    }
  }

  if (!input.length) return null;
  enumerate(0, 0, 0, []);
  return optimum;
}

export function referenceMatch(input, candidates, options = {}) {
  const policy = { ...baseline, ...options };
  const entries = candidates
    .map((candidate, candidateIndex) => ({ candidate, candidateIndex }))
    .filter((entry, index) => candidates.indexOf(entry.candidate) === index);
  const exact = entries.find((entry) => entry.candidate === input);
  if (exact) {
    return {
      status: "exact",
      bestMatch: input,
      matches: [{ ...exact, cost: 0, eventCount: 0, operations: [] }],
    };
  }
  if (!input || Array.from(input).length < policy.minInputLength) {
    return { status: "no-match", bestMatch: null, matches: [] };
  }
  const matches = entries
    .map((entry) => {
      const score = referenceScore(entry.candidate, input, options);
      return score ? { ...entry, ...score } : null;
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        a.cost - b.cost ||
        (a.candidate < b.candidate ? -1 : a.candidate > b.candidate ? 1 : 0) ||
        a.candidateIndex - b.candidateIndex,
    );
  if (!matches.length) return { status: "no-match", bestMatch: null, matches };
  const ambiguous =
    matches.length > 1 &&
    (matches[0].cost === matches[1].cost ||
      matches[1].cost - matches[0].cost < policy.minCostGap);
  return {
    status: ambiguous ? "ambiguous" : "matched",
    bestMatch: ambiguous ? null : matches[0].candidate,
    matches,
  };
}

export function words(alphabet, maximumLength) {
  const result = [""];
  let previous = [""];
  for (let length = 1; length <= maximumLength; length += 1) {
    previous = previous.flatMap((prefix) =>
      alphabet.map((character) => prefix + character),
    );
    result.push(...previous);
  }
  return result;
}

export function semantic(result) {
  const { log, ...value } = result;
  return value;
}
