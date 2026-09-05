import { test } from "uvu";
import { equal } from "uvu/assert";

import { createMatcher, matchTypos } from "../dist/string-typo-match.esm.js";
import { referenceMatch, semantic, words } from "../test-util/oracle.js";

test("01 - exhaustive binary alphabets agree across event and omission limits", () => {
  const inputs = words(["a", "b"], 4);
  const candidates = inputs.slice(1);
  const policies = [
    { maxEvents: 1 },
    { maxEvents: 2 },
    { maxEvents: 2, maxOmissionLength: 1 },
    { maxEvents: 2, maxOmissionRatio: 0 },
    { maxEvents: 2, maxOmissionRatio: 0.5, maxCost: 150 },
    { maxEvents: 2, maxOmissionRatio: 1, maxCost: 500 },
    { maxEvents: 2, maxOmissionRatio: 1, maxCost: 0 },
  ];
  for (const policy of policies) {
    const options = { minInputLength: 1, ...policy };
    const matcher = createMatcher(candidates, options);
    for (const input of inputs) {
      // Exclude the exact candidate so exhaustive fuzzy comparisons actually run.
      const dictionary = candidates.filter((candidate) => candidate !== input);
      equal(
        semantic(matchTypos(input, dictionary, options)),
        referenceMatch(input, dictionary, options),
        `01.01 - ${JSON.stringify({ input, options })}`,
      );
      equal(
        semantic(matcher.match(input)),
        referenceMatch(input, candidates, options),
        `01.02 - ${JSON.stringify({ input, options })}`,
      );
    }
  }
});

test("02 - independent oracle covers competing weighted explanations", () => {
  const inputs = words(["a", "b", "c"], 3);
  const policies = [
    { costs: { repeatedCharacter: 100, keyboardSubstitution: 150 } },
    { costs: { repeatedCharacter: 190, keyboardSubstitution: 190 } },
    {
      costs: {
        omissionExtend: 0,
        missingCharacter: 50,
        extraCharacter: 20,
        repeatedCharacter: 10,
        adjacentSwap: 70,
        substitution: 30,
      },
    },
    {
      costs: {
        omissionOpen: 200,
        omissionExtend: 50,
        missingCharacter: 150,
        adjacentSwap: 60,
        substitution: 30,
      },
    },
  ];
  for (const policy of policies) {
    const options = {
      minInputLength: 1,
      maxEvents: 2,
      maxCost: 500,
      maxOmissionRatio: 1,
      keyboard: { a: ["b"], c: ["a"] },
      ...policy,
    };
    for (const input of inputs) {
      const candidates = inputs.filter(
        (candidate) => candidate && candidate !== input,
      );
      equal(
        semantic(matchTypos(input, candidates, options)),
        referenceMatch(input, candidates, options),
        `02.01 - ${JSON.stringify({ input, options })}`,
      );
    }
  }
});

test("03 - exhaustive Unicode alphabets preserve original offset units", () => {
  const inputs = words(["a", "😀", "\ud800"], 3);
  const options = {
    minInputLength: 1,
    maxEvents: 2,
    maxCost: 350,
    maxOmissionRatio: 1,
    keyboard: { "😀": ["\ud800"] },
  };
  for (const input of inputs) {
    const candidates = inputs.filter(
      (candidate) => candidate && candidate !== input,
    );
    equal(
      semantic(matchTypos(input, candidates, options)),
      referenceMatch(input, candidates, options),
      `03.01 - ${JSON.stringify(input)}`,
    );
  }
});

test("04 - prepared candidate enumeration is complete and order independent", () => {
  const candidates = words(["a", "b"], 4).slice(1);
  const options = {
    minInputLength: 1,
    maxEvents: 2,
    maxCost: 400,
    maxOmissionLength: 2,
    minCostGap: 0,
    maxOmissionRatio: 1,
  };
  for (const input of ["aabbb", "baaaa", "abbab", "aaaaaa", "cab", "xyz"]) {
    for (const dictionary of [
      candidates,
      candidates.slice().reverse(),
      [...candidates, ...candidates.slice(0, 5)],
    ]) {
      equal(
        semantic(createMatcher(dictionary, options).match(input)),
        referenceMatch(input, dictionary, options),
        `04.01 - ${JSON.stringify(input)}`,
      );
    }
  }
});

test.run();
