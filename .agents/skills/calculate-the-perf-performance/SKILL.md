---
name: calculate-the-perf-performance
description: Run, audit, and interpret the Codsen monorepo performance benchmarks. Use when the user says "calculate the perf", asks to run or review package perf checks, audit testme() workloads, compare current performance with preceding released versions, or summarize whether this monorepo became faster or slower.
---

# Calculate the Perf (Performance)

Run every package benchmark, compare normalized operations per second with each package's preceding version baseline, and summarize the monorepo-wide movement.

Read `.agents/PERFORMANCE.md` completely before auditing a workload, editing a
perf check, resetting history, or interpreting results. It is the source of
truth for benchmark intent, normalization, and history invalidation.

## Workflow

1. Locate the repository root by walking upward from the current directory until finding a `package.json` whose `name` is `codsen-mono`. Stop and explain if it cannot be found.
2. Before benchmarking, record `git status --short -- packages/*/perf/check.js packages/*/perf/historical.json`. These files may already contain user changes; preserve them.
3. For a release-wide audit, inspect every `packages/*/perf/check.js`; otherwise inspect every working-tree-modified check and each check relevant to the request. Confirm that `testme()` calls the current built public API with valid, meaningful, deterministic inputs and no mutable state that grows across iterations. Use source types, examples, and tests as evidence. If `dist` is missing or stale, treat source/types as the contract and rebuild before a runtime smoke test when the user has authorized builds.
4. When the measured workload changes, reset that package's complete `perf/historical.json` to `{}` before the next run. This is mandatory for changes to the callable, arguments, options, fixture contents, callbacks, setup placement, or amount of work. Do not reset for imports, comments, or formatting alone. Record every reset; never compare the new workload with old records.
5. If the user requested only an audit or workload repair, do not run perf merely to refill reset histories; leave them `{}`, complete static/smoke validation, and skip steps 6–9. Otherwise, from the repository root, run `npm run perf`. Allow the command to finish because each benchmark runs asynchronously and writes `perf/historical.json` when its own suite completes. A reset package will gain only a fresh baseline for its new workload.
6. If the command fails, distinguish the two causes before reporting. A regression beyond `ops/perf-policy.json#regressionThresholdPercent` sets a non-zero exit code deliberately: that is a measured result, its history is intact, and the package's baseline was deliberately kept rather than overwritten. The sweep still completes, because the root script passes `--continue=dependencies-successful`, so a regression exit does not mean missing measurements — check Turbo's task count to confirm. Any other failure is an incomplete run — report it with the affected package output, and do not manufacture a whole-monorepo conclusion from it. It is acceptable to analyze completed files only when clearly labelled partial.
7. Run:

   ```sh
   node .agents/skills/calculate-the-perf-performance/scripts/analyze-perf.mjs
   ```

   Pass `--root /absolute/path/to/repo` only when running the script outside the repository root.
   Pass `--all` when the user asks for the full per-package comparison table.
8. Read the complete analyser output before drawing conclusions. Higher normalized operations per second is better.
9. After benchmarking, run `git status --short -- packages/*/perf/historical.json` and mention that the benchmark updated performance history files. Preserve those run results unless the user asks otherwise; the mandatory pre-run reset for a changed workload is the sole automatic reset rule.

## Normalization model

Let `R` be the freshly measured `perfRef()` rate, `T` the freshly measured
`testme()` rate, and `C` the canonical `opsPerSec` exported by `perf-ref`.
Persist `T * C / R`, not raw `T`. The shared scale factor `C / R` makes the
reference score equal `C` — 183, the canonical value exported by `perf-ref` —
and scales the target equally. Compare this relative, normalized score across
releases; do not compare raw machine throughput.

## Reading historical.json by hand

`packages/*/perf/historical.json` is JSON except that its numbers carry underscore separators (`19_069_207`), and anything above 100 is stored rounded to a whole number. `JSON.parse()` throws on those files. Use `parseHistorical()` / `stringifyHistorical()` from `ops/scripts/historicalJson.js` instead — the analyser script and `ops/scripts/perf.js` both go through them.

Keys are either a semver version, `lastVersion`, or `lastSlowerRun`. Only the first two are baselines; see the comparison semantics below.

## Comparison semantics

- Treat `lastVersion` as the latest normalized score.
- Ignore `lastSlowerRun` when picking a baseline. It records a run which lost against `lastVersion` by more than 2%, kept as evidence precisely so that it did not become the baseline. The analyser reads it for you: such a package is classified `pendingRegression`, its `deltaPct` is `score` against `against` rather than anything derived from `lastVersion`, and `worstOpsPerSec` / `worstPct` report the lowest score seen while that baseline has stood. Count these separately from `slower` in the report — a `slower` package has already absorbed the loss into its baseline, whereas a pending regression is one the harness measured and refused to adopt.
- Compare the latest score with the last version-keyed numeric entry preceding it.
- When that entry is the current `package.json` version and duplicates `lastVersion`, skip it and use the preceding version entry. The benchmark writes the current score to both places, so comparing those duplicate values would always produce a misleading 0% change.
- Calculate `(latest / baseline - 1) * 100`. Positive values mean faster; negative values mean slower.
- Classify absolute changes of 2% or less as noise/roughly unchanged, matching `ops/scripts/perf.js`.
- Compare percentages across packages, not raw operations-per-second values, because package workloads differ greatly.
- Prefer the median percentage and geometric-mean ratio for the overall direction. Treat the arithmetic mean as secondary because outliers can dominate it.
- Call out a mixed result when the aggregate measures disagree or gains and regressions are broadly balanced.

## Final report

Lead with one plain-language verdict: faster, slower, roughly unchanged, or mixed. Then include:

- how many files were found and how many packages were compared;
- counts of faster, roughly unchanged, and slower packages using the 2% threshold, plus pending regressions counted separately;
- every entry in `pendingRegressions`, named individually rather than summarised: each is a regression the harness measured and deliberately did not absorb, and each is why `npm run perf` exited non-zero;
- median and geometric-mean percentage changes;
- the most important improvements and regressions, including package name, baseline version, and percentage;
- skipped or malformed files and any partial benchmark failures;
- pending reset histories and fresh baseline-only packages, listed separately
  from malformed or failed files;
- a short caution that benchmark noise can affect small movements and a rerun is worthwhile for surprising large changes.

Keep the summary concise. Do not dump the full package table unless the user asks for it.
