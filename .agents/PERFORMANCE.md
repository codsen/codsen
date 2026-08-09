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

Treat `lastVersion` as the latest normalized score and compare it only with the
preceding score produced by the same workload. Compare percentage changes, not
raw score magnitudes across packages, because each package deliberately does a
different amount of work. For monorepo summaries, prefer the median percentage
and geometric-mean ratio; large outliers can distort an arithmetic mean.
