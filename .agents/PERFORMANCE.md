# Performance benchmark strategy

Read this file before creating, reviewing, changing, running, or interpreting a
package benchmark under `packages/*/perf/`.

## What the score means

During each release, the root benchmark task runs two programs for every
package:

1. `perfRef()` from the root `perf-ref` dependency at `package.json:81`.
2. The package's target callback, conventionally named `testme()` in
   `perf/check.js`.

Benchmark.js first measures the local reference rate `R`, then the local target
rate `T`. Let `C` be `opsPerSec`, the canonical reference score exported by
`perf-ref`. The runner applies one scale factor to both programs:

```text
scale factor = C / R
normalized reference = R * C / R = C
normalized target = T * C / R
```

The canonical reference score is 183. The runner should source it from the
dependency's exported `opsPerSec` rather than duplicating the literal; installed
`perf-ref@1.0.5` exports 183.

If a computer is twice as fast, both `R` and `T` should roughly double and the
normalized target should stay roughly equal. This is the reason Codsen scores
remain comparable between a many-core local machine and a small CI runner. We
do not care how many raw cycles program X can complete on computer Y. We care
how fast the target is relative to the fixed reference program in the same run.

Hardware normalization does not remove ordinary benchmark noise. CPU load,
thermal changes, runtime warm-up, and reference/target run order can still
affect a result. Treat movements of 2% or less as roughly unchanged and rerun
surprising results.

## Correctness can require more work

A fixed program can be slower because it finally does the work that its buggy
predecessor skipped. Recovering the old speed might require a major algorithm
redesign. Investigate avoidable overhead, measure the cost, then accept a justified
regression when correct behavior requires it. Record the behavior fixed, regression
tests, measured loss and why further optimization is beyond the current change.
Do not restore the bug or leave a completed fix open indefinitely to match an
incorrect implementation's speed.

For an unchanged benchmark workload, preserve earlier scores and record the loss
in `lastSlowerRun`. A reasoned waiver can accept the cost in the optional strict
check. A change to the workload itself still requires the reset below. Before a
reset, reconcile and preserve its valid historical changelog gains; those describe
the previous workload and must not be compared with the new one.

## Measure one package at a time

Root `npm run perf` completes its package build phase before measuring with
`--concurrency=1`. Do not run other substantial CPU work alongside a measurement
sweep. Independent concurrent benchmarks or builds can change the load between
reference and target samples; reference normalization cannot cancel that effect.

The runner reports reference and target sample counts and relative margins of
error. Preserve unexpected measurements and repeat affected cases under controlled
conditions. Do not select only the best retry or treat a retained high score as
proof that its measurement was noise-free.

## The `testme()` contract

Each `testme()` defines the workload whose normalized history is being tracked.
It must:

- import and call the package's current built public API, normally from
  `../dist/<package>.esm.js`;
- pass values that satisfy the current public types and runtime contract;
- exercise a representative, meaningful success path rather than a copied
  fixture, guaranteed miss, validation error, empty early return, or unrelated
  API;
- be deterministic and perform the same amount of work on every iteration;
- keep per-call output and callback state local, so arrays, maps, counters, or
  mutated inputs do not grow across benchmark iterations;
- return the API result, or otherwise expose callback work, so a one-shot audit
  harness can verify it when practical;
- avoid filesystem, network, clock, random, logging, and other unstable work
  unless that work is itself the package's public purpose.

Immutable fixture construction may live outside `testme()` when setup is not
part of the operation being measured. Mutable inputs must be recreated or
cloned per invocation if the API mutates them. Do not move setup across the
benchmark boundary casually: that changes what the score measures.

A factory package can legitimately benchmark only construction when returning
the constructed value is its complete public API. Do not add downstream native
work, such as `RegExp#test()`, unless the benchmark intentionally measures that
combined workload.

The current `runPerf()` wrapper executes `cb()` but does not consume its return
value. Returning a result still documents the workload and makes direct smoke
tests verifiable; do not add unrelated work merely to manufacture a sink.

## Audit procedure

For a release-wide perf review, inspect every `packages/*/perf/check.js`, not
only benchmarks with surprising scores.

For each package:

1. Identify the imported symbol and compare it with the current exports and
   declaration signature.
2. Compare every argument and option with `src/`, `types/`,
   `examples/_quickTake.js`, and representative unit tests.
3. Run or inspect one invocation to confirm it reaches a meaningful success
   path and produces the intended kind of result or callback activity.
4. Check for state declared outside `testme()` that is mutated by the target.
5. Check that the workload is stable, focused on the package, and substantial
   enough to measure without being dominated by unrelated setup.
6. Fix genuine mismatches. Do not redesign a valid workload solely to make its
   score look better.

Treat source and declarations as the current contract. If the benchmark imports
a missing or stale `dist` build, rebuild the package before runtime validation
when builds are authorized; do not mistake stale generated code for the desired
public API.

## History invalidation is mandatory

`perf/historical.json` is valid only while `testme()` keeps the same measured
workload. If that workload changes, reset the package's entire history to:

```json
{}
```

Do this in the same change and record which package histories were reset. The
next benchmark run establishes a fresh baseline; it must not report a speedup
or regression against a different old workload.

A reset is required when changing any of these:

- the public function or method being called;
- arguments, option values, or input fixture contents;
- callbacks, callback side effects, or result-consumption behaviour;
- loop counts or the number of API calls per `testme()` invocation;
- setup placement when moving work into or out of the timed callback;
- shared mutable state, cloning, or input recreation in a way that changes
  timed work;
- a path from a no-op, miss, error, or early return to meaningful work, or the
  reverse.

Imports, path spelling, comments, formatting, and variable renames do not
require a reset when the executed workload is byte-for-byte equivalent in
meaning.

If a task is only repairing workloads, leave reset histories empty rather than
running perf merely to refill them. During the next intended release benchmark,
an empty history becomes the new workload's baseline.

## Interpreting history

Treat `lastVersion` as the latest accepted normalized baseline and compare it
only with the preceding score produced by the same workload. Compare percentage
changes, not raw score magnitudes across packages, because each package does a
different amount of work. For monorepo summaries, prefer the median percentage
and geometric-mean ratio; large outliers can distort an arithmetic mean.

`lastSlowerRun`, when present, records a run which lost against `lastVersion`
by more than the unchanged tolerance. It is a record of the measurement, never
a baseline. A later run which is not materially slower removes it. It holds
four fields:

- `against` — the baseline that was kept, so a reader does not have to work out
  which figure the run lost to. It always equals the current `lastVersion`,
  because advancing the baseline clears the record.
- `score` — the latest slower measurement.
- `worst` — the lowest score seen while this baseline has stood, so a partial
  recovery cannot hide how far the package fell.
- `version` — the package version that measured slower. The rejected score
  neither adds nor overwrites its version-keyed baseline. An earlier accepted
  score for that same version can remain in the history.

The analyser reads this record and reports the package as `pendingRegression`
with its percentage. Do not judge a package by `lastVersion` alone; a retained
baseline means the newest measurement is somewhere else.

## A regression keeps the baseline it lost against

`ops/scripts/perf.js` judges each run before recording it, and a run which is
materially slower than the baseline does not replace it. Without that rule a
regression is reported once and then treated as the thing to compare against,
so the same lost performance is reported as "just as fast as before" on every
later run, and the evidence needed to notice it is gone.

The verdicts, and what each one records:

| Verdict | When | Recorded |
| --- | --- | --- |
| `baseline` | no comparable score yet | becomes the baseline |
| `faster` | faster by more than the tolerance | becomes the baseline |
| `unchanged` | within the tolerance either way | becomes the baseline |
| `slower` | slower by more than the tolerance, within the threshold | `lastSlowerRun` only |
| `regression` | slower by more than the threshold | `lastSlowerRun` only |

A valid measurement, including a `regression`, completes `npm run perf`
successfully and leaves the slowdown visible in output and history. Exceptions,
aborted suites, invalid rates and history-write failures still fail the command.
The root sweep keeps `--continue=dependencies-successful` so one broken workload
does not discard measurements from independent packages.

`npm run perf:check` is the optional strict gate. It reads the latest recorded
measurements, applies the same thresholds and waivers, and exits non-zero for
unwaived regressions, missing measurements or malformed records. It neither
reruns benchmarks nor changes history. Use `npm run perf && npm run perf:check`
for fresh measurements followed by strict validation. A strict failure identifies
a cost to investigate or explain; it does not require reverting a correctness fix.

`ops/perf-policy.json` holds both percentages:

- `unchangedTolerancePercent` is the noise band, `2` by default, matching the
  2% guidance above.
- `regressionThresholdPercent` is the point at which a slowdown fails the strict
  check, `10` by default. It must not sit inside the tolerance.
- `packageOverrides` sets either percentage for one package.
- `waivers` opts a package out of strict failure for a documented reason, such
  as an inherently noisy workload or a necessary correctness-related cost.
  Measurements still report the regression and retain its baseline.

Accepting a justified slowdown is an explicit engineering decision. Explain it
and retain the evidence; do not erase an unchanged workload's history to make its
next run look unchanged. Reset only when the workload changes and the scores
would no longer be comparable.

## Reflect every historical gain in the changelog

Performance improvements are a product selling point. Reconcile every package's
retained version-keyed scores with its `CHANGELOG.md`, comparing consecutive
recorded versions in semantic version order. Gaps in release numbers are normal:
a release without a benchmark is not the comparison baseline. Gains above the
configured unchanged tolerance belong under `### Performance Improvements`, with
the percentage, normalized scores and preceding measured version made explicit.

Create the release section when `lerna-clean-changelogs` previously removed it,
using a verified release date from the exact tag or historical changelog. Do not
attach a historical gain to an unrelated version or invent a date. When local
release evidence and npm publication metadata provide no date, use an undated
version heading explicitly identifying the historical benchmark and unverified
release date. Put added performance content before a bump-only note, and verify
the complete result
survives cleaning and remains unchanged when reconciliation runs again.

Do not claim gains from the first score, `lastVersion` housekeeping duplicates,
`lastSlowerRun`, or histories that used different workloads. Keep existing
handwritten release notes. Update or deduplicate generated gain notes rather than
appending another copy each time the same version is measured.

Run `npm run perf:changelogs` and `npm run perf:changelogs:check` after benchmarking
and during release preparation. Normal changelog generation and verification
also run these commands. Use `npm run perf:changelogs -- --registry` to consult
public npm publication metadata when local release evidence is missing. Checking
a current release alone is insufficient: every retained historical gain must have
a corresponding changelog entry.

## Why `perf` is not a hosted job

This is a decision, not an omission. `perf` runs locally, before a release, and
in no GitHub Actions workflow.

Two reasons, the second decisive:

- Hosted runners are noisy in ways `perf-ref` normalization does not remove.
  Normalization makes scores comparable across hardware; it does not make one
  measurement on a shared, throttled runner trustworthy enough to fail a pull
  request on.
- The benchmark writes `perf/historical.json` by design, and both hosted lanes
  end by asserting a clean tree through `git diff --exit-code`. A perf step in
  either lane would fail that check on any run whose score moved, which is
  every run. Making perf hosted therefore means separating recording from
  measuring first; it is not a matter of adding a step.

Revisit this if the recording split is built. Until then, the optional strict
check remains a local maintainer tool. Do not add it to a hosted lane merely
because it does not write history.
