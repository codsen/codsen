import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Benchmark from "benchmark";
import { opsPerSec, perfRef } from "perf-ref";
import { isMediaD } from "../../is-media-descriptor/dist/is-media-descriptor.esm.js";
import { fixEnt } from "../../string-fix-broken-named-entities/dist/string-fix-broken-named-entities.esm.js";
import { createMatcher, matchTypos } from "../dist/string-typo-match.esm.js";

// Run against saved pre-migration consumers and leven@4.1.0. This standalone
// experiment never writes package perf histories or imports comparison packages
// into the runtime dependency graph. JSON goes to stdout; progress to stderr.
const baselineRoot = process.argv[2];
const focusedRepeat = process.argv.includes("--focus");
if (!baselineRoot || baselineRoot.startsWith("--")) {
  throw new Error("Pass the directory containing the saved baseline artifacts");
}
const { default: leven } = await import(
  pathToFileURL(path.resolve(baselineRoot, "leven/index.js")).href
);
const { fixEnt: oldFixEnt } = await import(
  pathToFileURL(path.resolve(baselineRoot, "entity-fixer.mjs")).href
);
const { isMediaD: oldIsMediaD } = await import(
  pathToFileURL(path.resolve(baselineRoot, "media-descriptor.mjs")).href
);
const read = (filename) => readFileSync(new URL(filename, import.meta.url));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const entityBytes = read(
  "../../all-named-html-entities/src/allNamedEntities.json",
);
const corpusBytes = read("./corpus-v1.json");
const corpus = JSON.parse(corpusBytes);
const observed = corpus.cases.filter(
  (item) => item.provenance.kind === "repository-observed",
);
assert.equal(observed.length, 35);
assert.equal(corpus.vocabularies["repository-words"].length, 41);
// Read the authoritative consumer vocabulary, failing if its shape changes.
const mediaSource = read("../../is-media-descriptor/src/util.ts").toString();
const mediaMatch = mediaSource.match(
  /const recognisedMediaTypes = (\[[^;]+\]);/,
);
assert.ok(mediaMatch);
const mediaCandidates = JSON.parse(mediaMatch[1].replace(/,\s*]/, "]"));
assert.equal(mediaCandidates.length, 11);

const datasets = [
  {
    name: "html-entities",
    candidates: Object.keys(JSON.parse(entityBytes)),
    inputs: [
      "nbsp",
      "nbps",
      "nsp",
      "nbsxp",
      "CountContourIntegral",
      "zzzzzzzz",
      "ConterContourIntegral",
    ],
  },
  {
    name: "media-names",
    candidates: mediaCandidates,
    inputs: ["screen", "screeen", "prnit", "hanheld", "ttv", "notamedia", "al"],
  },
  {
    name: "repository-typos",
    candidates: corpus.vocabularies["repository-words"],
    inputs: observed.map((item) => item.input),
  },
];
assert.equal(datasets[0].candidates.length, 2125);

function lookupLeven(input, candidates) {
  if (candidates.includes(input)) {
    return {
      status: "exact",
      bestMatch: input,
      matches: [{ candidate: input, cost: 0 }],
    };
  }
  if (Array.from(input).length < 3) {
    return { status: "no-match", bestMatch: null, matches: [] };
  }
  // leven saturates at maxDistance, so 3 is strictly above the eligible
  // distance of 2. Capping at 2 would accidentally admit arbitrarily far misses.
  const matches = [];
  for (const candidate of candidates) {
    const cost = leven(candidate, input, { maxDistance: 3 }) * 100;
    if (cost <= 200) matches.push({ candidate, cost });
  }
  matches.sort(
    (a, b) => a.cost - b.cost || (a.candidate < b.candidate ? -1 : 1),
  );
  const unique =
    matches.length > 0 &&
    (matches.length === 1 || matches[1].cost - matches[0].cost >= 25);
  return {
    status: matches.length ? (unique ? "matched" : "ambiguous") : "no-match",
    bestMatch: unique ? matches[0].candidate : null,
    matches,
  };
}
assert.equal(leven("abcdefghi", "xyz", { maxDistance: 3 }), 3);
assert.equal(lookupLeven("xyz", ["abcdefghi"]).status, "no-match");
assert.equal(lookupLeven("cat", ["bat", "hat"]).status, "ambiguous");

const workloads = [];
const outcomes = {};
for (const { name, candidates, inputs } of datasets) {
  outcomes[name] = {};
  for (const maxEvents of [1, 2]) {
    const options = { maxEvents };
    const matcher = createMatcher(candidates, options);
    const label = `events-${maxEvents}`;
    const prepared = () => inputs.map((input) => matcher.match(input));
    const oneShot = () =>
      inputs.map((input) => matchTypos(input, candidates, options));
    const semantic = (result) => ({
      status: result.status,
      bestMatch: result.bestMatch,
      matches: result.matches,
    });
    const preparedResults = prepared().map(semantic);
    assert.deepEqual(preparedResults, oneShot().map(semantic));
    assert.deepEqual(preparedResults, prepared().map(semantic));
    outcomes[name][label] = preparedResults.map((result, index) => ({
      input: inputs[index],
      status: result.status,
      bestMatch: result.bestMatch,
      eligibleCount: result.matches.length,
    }));
    workloads.push(
      [`${name}:${label}:prepared`, prepared],
      [`${name}:${label}:one-shot`, oneShot],
    );
  }
  const baseline = () => inputs.map((input) => lookupLeven(input, candidates));
  outcomes[name].leven = baseline().map((result, index) => ({
    input: inputs[index],
    status: result.status,
    bestMatch: result.bestMatch,
    eligibleCount: result.matches.length,
  }));
  workloads.push([`${name}:leven`, baseline]);
}

const entityFixture = "&&NbSpzzz&&NbSpzzz\ny &isindot; z\n&nsp;\n&pound";
const mediaFixture = "screen and (color), projection and ((color)";
const entityTypos = "&nrrow; &rsqo; &intx; &boxplu; &notarealentity; &bus;";
const mediaTypos = ["screeen", "prnit", "hanheld", "ttv", "notamedia"];
workloads.push(
  ["entity-fixture:leven", () => oldFixEnt(entityFixture)],
  ["entity-fixture:current", () => fixEnt(entityFixture)],
  ["media-fixture:leven", () => oldIsMediaD(mediaFixture)],
  ["media-fixture:current", () => isMediaD(mediaFixture)],
  ["entity-typos:leven", () => oldFixEnt(entityTypos)],
  ["entity-typos:current", () => fixEnt(entityTypos)],
  ["media-typos:leven", () => mediaTypos.map((input) => oldIsMediaD(input))],
  ["media-typos:current", () => mediaTypos.map((input) => isMediaD(input))],
);
// Consumer elapsed-time fields are deliberately omitted from equality checks.
const withoutTiming = (value) =>
  JSON.parse(
    JSON.stringify(value, (key, item) =>
      key === "timeTakenInMilliseconds" ? undefined : item,
    ),
  );
const consumerOutcomes = {};
for (const [name, fn] of workloads.filter(
  ([name]) =>
    !name.includes("events-") &&
    !datasets.some((dataset) => name.startsWith(`${dataset.name}:`)),
)) {
  consumerOutcomes[name] = withoutTiming(fn());
  assert.deepEqual(consumerOutcomes[name], withoutTiming(fn()));
}
const observedQuality = Object.fromEntries(
  Object.entries(outcomes["repository-typos"]).map(([method, results]) => [
    method,
    {
      correctUnique: results.filter(
        (result, index) => result.bestMatch === observed[index].intended,
      ).length,
      incorrectUnique: results.filter(
        (result, index) =>
          result.bestMatch !== null &&
          result.bestMatch !== observed[index].intended,
      ).length,
      ambiguous: results.filter((result) => result.status === "ambiguous")
        .length,
      noMatch: results.filter((result) => result.status === "no-match").length,
    },
  ]),
);

const report = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform,
  architecture: process.arch,
  processor: os.cpus()[0].model,
  levenVersion: JSON.parse(
    readFileSync(path.resolve(baselineRoot, "leven/package.json")),
  ).version,
  referenceCanonicalScore: opsPerSec,
  artifactSha256: {
    matcher: sha256(read("../dist/string-typo-match.esm.js")),
    currentEntity: sha256(
      read(
        "../../string-fix-broken-named-entities/dist/string-fix-broken-named-entities.esm.js",
      ),
    ),
    currentMedia: sha256(
      read("../../is-media-descriptor/dist/is-media-descriptor.esm.js"),
    ),
    previousEntity: sha256(
      readFileSync(path.resolve(baselineRoot, "entity-fixer.mjs")),
    ),
    previousMedia: sha256(
      readFileSync(path.resolve(baselineRoot, "media-descriptor.mjs")),
    ),
    leven: sha256(readFileSync(path.resolve(baselineRoot, "leven/index.js"))),
    corpus: sha256(corpusBytes),
    htmlInventory: sha256(entityBytes),
  },
  policy: {
    normalization:
      "Each round measures perf-ref afresh; score = targetRate * opsPerSec / referenceRate. Higher is better; compare only the same batch.",
    sampling: focusedRepeat
      ? "Focused repeat of noisy comparisons, minSamples 50 and maxTime 3 seconds per workload. Relative margin of error is Benchmark.js's 95% statistic, not a guarantee against system noise."
      : "Two rounds, reversed workload order in round 2, minSamples 25 and maxTime 2 seconds per workload. Relative margin of error is Benchmark.js's 95% statistic, not a guarantee against system noise.",
    commonLookup:
      "Identical full vocabulary and probe batch per method. Exact bypass, minimum input 3 code points, cost limit 200, minimum cost gap 25. No callbacks. Each call returns its complete eligible list, sorted by cost then candidate.",
    prepared:
      "Candidate preparation outside timing; each query includes scoring, operation explanations, result ordering, and completion statistics. No cross-query caching.",
    oneShot:
      "A fresh matchTypos call, including candidate preparation, for every probe in every timed batch.",
    leven:
      "leven@4.1.0, unit cost scaled by 100; maxDistance 3 keeps the saturation sentinel above the acceptance limit 2. Wrapper builds suggestions and resolves ambiguity but has no operation explanations or completion statistics.",
    semantics:
      "Unequal algorithms and outputs. Leven does not model an adjacent swap or omitted block as one event, does not weight retained-neighbor repetition, and has no event count/omission constraints. These are throughput comparisons of actual APIs, not equivalent-result speedup claims.",
    consumers:
      "Saved pre-migration public consumers versus current public consumers, including their actual domain policy. Exact/case handling and parsing included. Their outputs intentionally differ for some typos. Current consumers use prepared one-event matchers and conservative abstentions; media permits two-code-point inputs.",
    interpretation:
      "Two percent or less is noise. This selected engineering corpus is not a representative distribution of all real spelling errors. No package perf history is read or written.",
  },
  datasets: datasets.map(({ name, candidates, inputs }) => ({
    name,
    candidateCount: candidates.length,
    inputs,
  })),
  consumerFixtures: { entityFixture, mediaFixture, entityTypos, mediaTypos },
  observedQuality,
  outcomes,
  consumerOutcomes,
  rounds: [],
};
if (process.argv.includes("--check")) {
  console.log(JSON.stringify({ preflight: "passed", ...report }, null, 2));
  process.exit(0);
}

const selectedWorkloads = focusedRepeat
  ? workloads.filter(
      ([name]) =>
        /^(entity-fixture|media-fixture|repository-typos):/.test(name) ||
        /^(html-entities|media-names):(events-1:prepared|leven)$/.test(name),
    )
  : workloads;
for (const round of focusedRepeat ? [1] : [1, 2]) {
  const measurements = [];
  const suite = new Benchmark.Suite();
  const sampling = focusedRepeat
    ? { minSamples: 50, maxTime: 3 }
    : { minSamples: 25, maxTime: 2 };
  suite.add("perf-ref", perfRef, sampling);
  const ordered =
    round === 1 ? selectedWorkloads : [...selectedWorkloads].reverse();
  for (const [name, fn] of ordered) suite.add(name, fn, sampling);
  suite.on("cycle", ({ target }) => {
    measurements.push({
      workload: target.name,
      rate: target.hz,
      relativeMarginOfError: target.stats.rme,
      samples: target.stats.sample.length,
    });
    console.error(`Round ${round}: measured ${target.name}`);
  });
  await new Promise((resolve, reject) => {
    suite.on("error", ({ target }) => reject(target.error));
    suite.on("complete", resolve);
    suite.run({ async: true });
  });
  const referenceRate = measurements[0].rate;
  report.rounds.push({
    round,
    measurements: measurements.map(({ rate, ...rest }) => ({
      ...rest,
      normalizedScore: (rate * opsPerSec) / referenceRate,
    })),
  });
}
console.log(JSON.stringify(report, null, 2));
