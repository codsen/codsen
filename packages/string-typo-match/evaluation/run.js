import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { matchTypos } from "../dist/string-typo-match.esm.js";

const corpus = JSON.parse(
  readFileSync(new URL("./corpus-v1.json", import.meta.url), "utf8"),
);
const summary = {};
const strata = {};
const failures = [];
const seen = new Map();
const totals = () => ({
  cases: 0,
  exact: 0,
  correctUnique: 0,
  incorrectUnique: 0,
  ambiguous: 0,
  noMatch: 0,
  intendedEligible: 0,
});
function record(target, item, result) {
  target.cases += 1;
  if (result.status === "exact") target.exact += 1;
  if (result.status === "matched")
    target[
      result.bestMatch === item.intended ? "correctUnique" : "incorrectUnique"
    ] += 1;
  if (result.status === "ambiguous") target.ambiguous += 1;
  if (result.status === "no-match") target.noMatch += 1;
  if (result.matches.some(({ candidate }) => candidate === item.intended))
    target.intendedEligible += 1;
}
const outcomes = corpus.cases.map((item) => {
  if (item.split !== "regression") {
    assert.ok(
      !seen.has(item.intended) || seen.get(item.intended) === item.split,
      "Intended candidates must not cross development and held-out sets",
    );
    seen.set(item.intended, item.split);
  }
  const candidates = item.candidates || corpus.vocabularies[item.vocabulary];
  const result = matchTypos(item.input, candidates, item.options);
  const intended = result.matches.find(
    ({ candidate }) => candidate === item.intended,
  );
  const omitted = intended
    ? intended.operations.reduce(
        (sum, operation) =>
          sum +
          (operation.kind === "missing-character" ||
          operation.kind === "omitted-block"
            ? Array.from(
                item.intended.slice(
                  operation.candidateFrom,
                  operation.candidateTo,
                ),
              ).length
            : 0),
        0,
      )
    : item.intended === null
      ? "not-applicable"
      : "not-eligible";
  summary[item.split] ||= totals();
  record(summary[item.split], item, result);
  for (const [axis, value] of Object.entries({
    family: item.family,
    inputLength: Array.from(item.input).length,
    omissionLength: omitted,
    vocabularySize: candidates.length,
    provenance: item.provenance.kind,
  })) {
    const key = `${axis}:${value}`;
    strata[key] ||= totals();
    record(strata[key], item, result);
  }
  if (
    result.status !== item.expectedStatus ||
    ((result.status === "matched" || result.status === "exact") &&
      result.bestMatch !== item.intended)
  )
    failures.push(item.id);
  return {
    id: item.id,
    status: result.status,
    bestMatch: result.bestMatch,
    intendedEligible: Boolean(intended),
  };
});

// This selected, paired experiment deliberately gives nearby initial/later
// substitutions equal binary cost. The opposite intentions expose the cost of
// preferring an initial typo. These are hypotheses, not runtime options.
const positions = {};
for (const [row, offset, y] of [
  ["qwertyuiop", 0, 0],
  ["asdfghjkl", 0.25, 1],
  ["zxcvbnm", 0.75, 2],
]) {
  Array.from(row).forEach((letter, x) => {
    positions[letter] = [x + offset, y];
  });
}
const positionExperiment = [];
for (const item of corpus.cases.filter(({ id }) =>
  id.startsWith("position-tie-"),
)) {
  for (const mode of [
    "ordinary",
    "binary",
    "graded",
    "binary-initial-discount",
  ]) {
    const matches = item.candidates
      .map((candidate) => {
        const from = Array.from(candidate);
        const to = Array.from(item.input);
        const index = from.findIndex((letter, i) => letter !== to[i]);
        const [x1, y1] = positions[from[index]];
        const [x2, y2] = positions[to[index]];
        const distance = Math.hypot(x1 - x2, y1 - y2);
        let cost = mode === "ordinary" ? 150 : distance <= 1.3 ? 75 : 150;
        if (mode === "graded" && distance > 1.05 && distance <= 1.3) cost = 100;
        if (mode === "binary-initial-discount" && index === 0) cost -= 25;
        return {
          candidate,
          cost,
          position: index === 0 ? "initial" : "later",
          keyDistance: distance,
        };
      })
      .sort((a, b) => a.cost - b.cost || (a.candidate < b.candidate ? -1 : 1));
    const bestMatch =
      matches[1].cost - matches[0].cost >= 25 ? matches[0].candidate : null;
    positionExperiment.push({
      id: item.id,
      intended: item.intended,
      device: "unknown",
      layout: "explicit US-QWERTY coordinates",
      mode,
      bestMatch,
      incorrectUnique: bestMatch !== null && bestMatch !== item.intended,
      matches,
    });
  }
}
console.log(
  JSON.stringify(
    {
      corpusVersion: corpus.version,
      defaultPolicy: corpus.defaultPolicy,
      limitations: corpus.limitations,
      omissionLengthBasis:
        "Accepted intended-candidate explanation; unavailable alignments are marked not-eligible or not-applicable rather than counted as zero omissions.",
      summary,
      strata,
      failures,
      positionExperiment,
      outcomes,
    },
    null,
    2,
  ),
);
if (failures.length) process.exitCode = 1;
