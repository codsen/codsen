# Retired package performance evidence

These frozen records preserve the benchmarks and changelogs of packages removed
from active maintenance. They remain separate from the replacement package's
history because each benchmark measures a different workload.

The traversal archives were captured from
[revision c1898722b0926cda2d53d1e8d430396e6f3192bc](https://github.com/codsen/codsen/tree/c1898722b0926cda2d53d1e8d430396e6f3192bc).
The [manifest](manifest.json) records package versions, exact release revisions,
source links, and SHA-256 checksums for every copied file and the frozen harness.

| Package | Frozen package version | Recorded versions and normalized scores |
| --- | --- | --- |
| `ast-monkey-traverse` | 4.3.1 | 4.2.2: 26,312; 4.3.1: 30,404 |
| `ast-monkey-traverse-with-lookahead` | 4.2.5 | 4.1.3: 15,634; 4.2.4: 20,435 |

Each package directory contains byte-for-byte copies of its complete history,
changelog, manifest, license, source, and measured workload. The `.txt` suffixes
identify archival material: `check.js.txt` is not an executable benchmark, and
`historical.json.txt` retains the original numeric separators, which are not
standard JSON. The frozen `historicalJson.js` helper linked in the manifest
parses that history format.

The ordinary traversal workload returns each visited value. The observer
workload requests one future node and sums `innerObj.next.length` in a counter
created for each invocation. Their shared fixture is created outside the timed
callback. The exact callbacks and fixture are preserved in each
`original-workload/check.js.txt`.

Scores use `target rate * 183 / reference rate`, with `perf-ref@1.0.5` providing
the canonical reference score. They are historical measurements, not new
retirement measurements. Do not compare scores across these two workloads or
merge them into `ast-monkey/perf/historical.json`. The latest observer package
version has no separate recorded score; its history is preserved as received.

## Reconstruct the frozen benchmark

Use a separate checkout of the complete pinned repository so the original
relative imports resolve to their matching source, build tooling, dependencies,
and benchmark harness:

```sh
git clone --no-checkout https://github.com/codsen/codsen.git codsen-perf-snapshot
git -C codsen-perf-snapshot checkout --detach c1898722b0926cda2d53d1e8d430396e6f3192bc
cd codsen-perf-snapshot
npm ci
npm run build:packages
npm run perf --workspace ast-monkey-traverse
npm run perf --workspace ast-monkey-traverse-with-lookahead
```

Use Node and npm versions accepted by that checkout's root `engines`. Run the
two benchmarks serially after the build, without concurrent builds, tests, or
other benchmarks. The commands update only the disposable checkout's original
histories. Keep these archived records unchanged.

For the implementation corresponding to an older recorded score, use its exact
release revision from the manifest. Preserve the benchmark workload when
comparing implementations, and follow the performance policy from the frozen
checkout. A new run is new evidence; it does not reproduce historical machine
conditions or promise the same score.
