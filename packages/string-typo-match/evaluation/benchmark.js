import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { brotliCompressSync, gzipSync } from "node:zlib";
import Benchmark from "benchmark";
import { opsPerSec, perfRef } from "perf-ref";
import { createMatcher, matchTypos } from "../dist/string-typo-match.esm.js";

// Comparison dependencies live outside the workspace. See README.md for the
// pinned installation command. They are never production dependencies.
const comparatorRoot = process.argv[2];
const baselineRoot = process.argv[3];
if (!comparatorRoot || !baselineRoot)
  throw new Error(
    "Pass the external comparator directory and baseline-artifact directory",
  );
const { createWeightedMap, editDistanceWeighted } = await import(
  pathToFileURL(
    path.resolve(comparatorRoot, "node_modules/cspell-trie-lib/dist/index.js"),
  ).href
);
const { gotoh } = await import(
  pathToFileURL(
    path.resolve(
      comparatorRoot,
      "node_modules/@nlptools/distance/dist/index.mjs",
    ),
  ).href
);
const { default: legacyDistance } = await import(
  pathToFileURL(path.resolve(baselineRoot, "leven/index.js")).href
);
const { fixEnt: oldFixEnt } = await import(
  pathToFileURL(path.resolve(baselineRoot, "entity-fixer.mjs")).href
);
const { isMediaD: oldIsMediaD } = await import(
  pathToFileURL(path.resolve(baselineRoot, "media-descriptor.mjs")).href
);
const { fixEnt } = await import(
  "../../string-fix-broken-named-entities/dist/string-fix-broken-named-entities.esm.js"
);
const { isMediaD } = await import(
  "../../is-media-descriptor/dist/is-media-descriptor.esm.js"
);
const entityBytes = readFileSync(
  new URL(
    "../../all-named-html-entities/src/allNamedEntities.json",
    import.meta.url,
  ),
);
const entities = Object.keys(JSON.parse(entityBytes));
const corpus = JSON.parse(
  readFileSync(new URL("./corpus-v1.json", import.meta.url), "utf8"),
);
const identifiers = corpus.vocabularies["repository-words"];
const entityVersion = JSON.parse(
  readFileSync(
    new URL("../../all-named-html-entities/package.json", import.meta.url),
    "utf8",
  ),
).version;
const bundle = readFileSync(
  new URL("../dist/string-typo-match.umd.js", import.meta.url),
);
const weights = createWeightedMap([
  {
    map: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    insDel: 100,
    swap: 100,
    replace: 150,
  },
]);
const affineOptions = {
  matchScore: 0,
  mismatchScore: -150,
  gapOpen: -100,
  gapExtend: -20,
};
const scoreMethods = {
  "capped-distance": (candidate, input, maxCost = 200) =>
    // This implementation saturates at the cap. Keep that sentinel strictly
    // above every eligible score, including cases that override maxCost.
    legacyDistance(candidate, input, {
      maxDistance: Math.floor(maxCost / 100) + 1,
    }) * 100,
  "cspell-weighted": (candidate, input) =>
    editDistanceWeighted(candidate, input, weights, 150),
  "affine-gap": (candidate, input) => -gotoh(candidate, input, affineOptions),
};
function lookup(input, candidates, score, options = {}) {
  const { maxCost = 200, minInputLength = 3, minCostGap = 25 } = options;
  if (candidates.includes(input))
    return {
      status: "exact",
      bestMatch: input,
      matches: [{ candidate: input, cost: 0 }],
    };
  if (!input.length || Array.from(input).length < minInputLength)
    return { status: "no-match", bestMatch: null, matches: [] };
  const matches = candidates
    .map((candidate) => ({ candidate, cost: score(candidate, input, maxCost) }))
    .filter(({ cost }) => cost <= maxCost)
    .sort((a, b) => a.cost - b.cost || (a.candidate < b.candidate ? -1 : 1));
  const unique =
    matches.length &&
    (matches.length === 1 ||
      (matches[0].cost < matches[1].cost &&
        matches[1].cost - matches[0].cost >= minCostGap));
  return {
    status: matches.length ? (unique ? "matched" : "ambiguous") : "no-match",
    bestMatch: unique ? matches[0].candidate : null,
    matches,
  };
}
const quality = {};
// Fail before timing if an external dependency changes its cost conventions.
assert.equal(scoreMethods["cspell-weighted"]("abc", "ac"), 100);
assert.equal(scoreMethods["cspell-weighted"]("abc", "axc"), 150);
assert.equal(scoreMethods["cspell-weighted"]("abc", "acb"), 100);
assert.equal(scoreMethods["cspell-weighted"]("abcd", "ad"), 200);
assert.equal(scoreMethods["affine-gap"]("abcd", "ad"), 120);
assert.equal(scoreMethods["affine-gap"]("ad", "abcd"), 120);
assert.equal(scoreMethods["capped-distance"]("abcdefghi", "xyz", 300), 400);
assert.equal(scoreMethods["capped-distance"]("abcdefghi", "xyz", 500), 600);
const qualityMethods = {
  "string-typo-match": matchTypos,
  ...Object.fromEntries(
    Object.entries(scoreMethods).map(([name, score]) => [
      name,
      (input, candidates, options) => lookup(input, candidates, score, options),
    ]),
  ),
};
for (const [name, match] of Object.entries(qualityMethods)) {
  quality[name] = {
    correctUnique: 0,
    incorrectUnique: 0,
    exact: 0,
    ambiguous: 0,
    noMatch: 0,
    intendedEligible: 0,
    differences: [],
  };
  for (const item of corpus.cases) {
    const candidates = item.candidates || corpus.vocabularies[item.vocabulary];
    const result = match(item.input, candidates, item.options);
    const key =
      result.status === "matched"
        ? result.bestMatch === item.intended
          ? "correctUnique"
          : "incorrectUnique"
        : result.status === "no-match"
          ? "noMatch"
          : result.status;
    quality[name][key] += 1;
    if (result.matches.some(({ candidate }) => candidate === item.intended))
      quality[name].intendedEligible += 1;
    if (
      result.status !== item.expectedStatus ||
      ((result.status === "exact" || result.status === "matched") &&
        result.bestMatch !== item.intended)
    )
      quality[name].differences.push({
        id: item.id,
        status: result.status,
        bestMatch: result.bestMatch,
      });
  }
}
if (process.argv.includes("--check")) {
  console.log(
    JSON.stringify({ comparatorPreflight: "passed", quality }, null, 2),
  );
  process.exit(0);
}
const inputs = [
  "nbsp",
  "nbps",
  "nsp",
  "nbsxp",
  "CountContourIntegral",
  "zzzzzzzz",
  "ConterContourIntegral",
];
const workloads = [];
for (const [vocabulary, candidates, probes] of [
  ["html-entities", entities, inputs],
  [
    "identifiers",
    identifiers,
    ["asterisk", "astrisk", "mulitple", "commments", "specificly", "unknown"],
  ],
]) {
  const options = { maxEvents: 2 };
  const matcher = createMatcher(candidates, options);
  workloads.push([
    `${vocabulary}:prepare`,
    () => createMatcher(candidates, options),
  ]);
  workloads.push([
    `${vocabulary}:one-shot`,
    () => probes.map((input) => matchTypos(input, candidates, options)),
  ]);
  workloads.push([
    `${vocabulary}:prepared`,
    () => probes.map((input) => matcher.match(input)),
  ]);
  for (const [name, score] of Object.entries(scoreMethods))
    workloads.push([
      `${vocabulary}:${name}`,
      () => probes.map((input) => lookup(input, candidates, score)),
    ]);
}
for (const size of [100, 1000, 10000]) {
  const candidates = Array.from(
    { length: size },
    (_, index) => `identifier${index.toString(36).padStart(4, "0")}`,
  );
  const matcher = createMatcher(candidates);
  workloads.push([
    `vocabulary-${size}:prepared`,
    () => matcher.match("identfier0000"),
  ]);
}
for (const size of [32, 256, 2048]) {
  const candidate = `${"a".repeat(size)}bc`;
  const input = `${"a".repeat(size - 1)}cb`;
  const matcher = createMatcher([candidate], { maxEvents: 2 });
  workloads.push([`repetitive-${size}:prepared`, () => matcher.match(input)]);
}
const longMatcher = createMatcher(["CounterClockwiseContourIntegral"], {
  maxOmissionLength: 9,
  maxCost: 300,
});
workloads.push([
  "long-omission:prepared",
  () => longMatcher.match("CounterContourIntegral"),
]);
const entityFixture = "&&NbSpzzz&&NbSpzzz\ny &isindot; z\n&nsp;\n&pound";
const mediaFixture = "screen and (color), projection and ((color)";
workloads.push(
  ["entity-fixer:before", () => oldFixEnt(entityFixture)],
  ["entity-fixer:after", () => fixEnt(entityFixture)],
  ["media-descriptor:before", () => oldIsMediaD(mediaFixture)],
  ["media-descriptor:after", () => isMediaD(mediaFixture)],
);
const entityTypos = "&nrrow; &rsqo; &intx; &boxplu; &notarealentity; &bus;";
const mediaTypos = ["screeen", "prnit", "hanheld", "ttv", "notamedia"];
workloads.push(
  ["entity-typos:before", () => oldFixEnt(entityTypos)],
  ["entity-typos:after", () => fixEnt(entityTypos)],
  ["media-typos:before", () => mediaTypos.map((input) => oldIsMediaD(input))],
  ["media-typos:after", () => mediaTypos.map((input) => isMediaD(input))],
);

const measurements = [];
const suite = new Benchmark.Suite();
const consumersOnly = process.argv.includes("--consumers");
const sampling = consumersOnly
  ? { minSamples: 40, maxTime: 5 }
  : { minSamples: 15, maxTime: 2 };
suite.add("perf-ref", perfRef, sampling);
for (const [name, fn] of workloads) {
  if (
    !consumersOnly ||
    /^(entity-fixer|media-descriptor|entity-typos|media-typos):/.test(name)
  ) {
    suite.add(name, fn, sampling);
  }
}
suite.on("cycle", ({ target }) => {
  measurements.push({
    workload: target.name,
    rate: target.hz,
    relativeMarginOfError: target.stats.rme,
    samples: target.stats.sample.length,
  });
  console.error(`Measured ${target.name}`);
});
suite.on("error", ({ target }) => {
  throw target.error;
});
await new Promise((resolve) => {
  suite.on("complete", resolve);
  suite.run({ async: true });
});
const reference = measurements[0].rate;
const memory = [];
function retainedHeapPerMatcher(candidates) {
  // A separate scope releases the previous vocabulary's retained matchers
  // before the next baseline GC, so their collection cannot erase its delta.
  global.gc();
  const before = process.memoryUsage().heapUsed;
  const retained = Array.from({ length: 30 }, () => createMatcher(candidates));
  global.gc();
  const difference = process.memoryUsage().heapUsed - before;
  assert.equal(retained[0].log.candidateCount, candidates.length);
  return difference > 0 ? difference / retained.length : null;
}
if (global.gc) {
  for (const [name, candidates] of [
    ["html-entities", entities],
    ["identifiers", identifiers],
  ]) {
    memory.push({
      vocabulary: name,
      candidateCount: candidates.length,
      estimatedHeapBytesPerMatcher: retainedHeapPerMatcher(candidates),
    });
  }
}
console.log(
  JSON.stringify(
    {
      node: process.version,
      comparisonPolicy: {
        direction: "intended candidate to observed input",
        cappedDistance:
          "Unit-cost Levenshtein scaled by 100; saturation cap is floor(maxCost/100)+1 (3 for the default budget).",
        cspellWeighted:
          "Symmetric ASCII letters/digits map: insertion/deletion 100, substitution 150, adjacent swap 100; fallback edit cost 150.",
        affineGap:
          "Global Gotoh score negated: match 0, substitution 150, either insertion or omission run 100+(length-1)*20.",
        shared:
          "Exact-match bypass, minimum input length, maximum cost, and minimum gap follow each corpus case.",
        differences:
          "Comparators have no maxEvents, omission length/ratio limits, retained-neighbour repetition weighting, or configured keyboard weighting. Their string units and alignments are their own APIs. Scalar comparator results omit operation explanations. Throughput is not an equivalent-result speedup claim.",
      },
      qualityLimitations: corpus.limitations,
      comparatorVersions: Object.fromEntries(
        [
          ["leven", path.resolve(baselineRoot, "leven/package.json")],
          [
            "cspell-trie-lib",
            path.resolve(
              comparatorRoot,
              "node_modules/cspell-trie-lib/package.json",
            ),
          ],
          [
            "@nlptools/distance",
            path.resolve(
              comparatorRoot,
              "node_modules/@nlptools/distance/package.json",
            ),
          ],
        ].map(([name, filename]) => [
          name,
          JSON.parse(readFileSync(filename, "utf8")).version,
        ]),
      ),
      workloadPolicy: {
        preparation:
          "One createMatcher call per iteration; candidate snapshots, code-point arrays, exact lookup, and preparation statistics included.",
        lookups:
          "HTML batch has 7 probes; identifier batch has 6. One-shot includes a fresh preparation per probe; prepared excludes preparation. Explanation and completion-statistics creation included; progress callbacks disabled.",
        sizeAndRepetition:
          "One prepared lookup per iteration; vocabulary and immutable input construction excluded. Long-omission workload explicitly allows 9 omitted code points and cost 300.",
        consumers:
          "Existing perf fixtures are separate from explicit typo workloads: six entities in one document, and five media calls per iteration. Before/after outputs intentionally differ under conservative ambiguity policy.",
        preparationLatency:
          "Milliseconds per preparation are derived from measured mean seconds per iteration; normalized scores remain the throughput comparison evidence.",
        memory:
          "Heap differences over 30 retained matchers after explicit garbage collection; approximate retained heap only, not peak allocation or process RSS.",
      },
      entityInventory: {
        version: entityVersion,
        candidateCount: entities.length,
        sha256: createHash("sha256").update(entityBytes).digest("hex"),
      },
      bundleBytes: {
        raw: bundle.length,
        gzip: gzipSync(bundle).length,
        brotli: brotliCompressSync(bundle).length,
      },
      referenceCanonicalScore: opsPerSec,
      measurements: measurements.map(({ rate, ...rest }) => ({
        ...rest,
        normalizedScore: (rate * opsPerSec) / reference,
        ...(rest.workload.endsWith(":prepare")
          ? { meanMillisecondsPerPreparation: 1000 / rate }
          : {}),
      })),
      memory,
      quality,
    },
    null,
    2,
  ),
);
