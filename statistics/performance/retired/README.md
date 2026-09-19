# Retired package performance evidence

These frozen records preserve the benchmarks and changelogs of packages removed
from active maintenance. They remain separate from the replacement package's
history because each benchmark measures a different workload.

The traversal archives were captured from
[revision c1898722b0926cda2d53d1e8d430396e6f3192bc](https://github.com/codsen/codsen/tree/c1898722b0926cda2d53d1e8d430396e6f3192bc).
The [traversal manifest](manifest.json) records package versions, exact release
revisions, source links, and SHA-256 checksums for every copied file and the
frozen harness.

The ranges and loose-comparison archives were captured from
[revision 76b7ad7c5fdc268dde81c8329f1edf98e52d47d1](https://github.com/codsen/codsen/tree/76b7ad7c5fdc268dde81c8329f1edf98e52d47d1),
the last shared revision before their workspaces were removed. Every copied file
matches its package's individual retirement-parent revision. Their separate
[manifest](ranges-and-loose-compare-manifest.json) records the same provenance
and checksums. Two historical `ranges-regex` release tags, `5.0.8` and `5.0.9`,
are unavailable in the local Git history; their scores remain preserved without
an asserted release revision.

The object, HTML, and entity-decoding archives were captured from
[revision fe2563742f3fb797b242ac37554e309b4c544d13](https://github.com/codsen/codsen/tree/fe2563742f3fb797b242ac37554e309b4c544d13).
Their [manifest](object-html-and-entity-manifest.json) records the frozen package
versions, release revisions, source links, and SHA-256 checksums. Historical tags
for `ast-get-object` and `html-img-alt` versions `3.0.8` and `3.0.9`, and
`ranges-ent-decode` versions `5.0.8` and `5.0.9`, are unavailable locally; the
manifest preserves those scores without asserting their release revisions.

| Package | Frozen package version | Recorded versions and normalized scores |
| --- | --- | --- |
| `ast-monkey-traverse` | 4.3.1 | 4.2.2: 26,312; 4.3.1: 30,404 |
| `ast-monkey-traverse-with-lookahead` | 4.2.5 | 4.1.3: 15,634; 4.2.4: 20,435 |
| `ast-loose-compare` | 4.2.4 | 4.1.3: 1,681,338; 4.2.0: 1,683,144; 4.2.3: 1,760,455 |
| `ranges-iterate` | 4.2.4 | 4.1.3: 4,363,352; 4.2.0: 5,099,135; 4.2.3: 5,082,124 |
| `ranges-regex` | 6.2.5 | 17 accepted scores, from 5.0.5: 1,333,180 through 6.2.1: 1,221,560; see the complete history |
| `ast-delete-object` | 4.2.7 | 4.1.3: 214,904; 4.2.1: 397,119 |
| `ast-get-object` | 4.2.6 | 17 accepted scores, from 3.0.5: 147,176 through 4.1.3: 417,718; see the complete history |
| `html-img-alt` | 4.2.5 | 18 accepted scores, from 3.0.5: 74,986 through 4.2.3: 129,240; see the complete history |
| `ranges-ent-decode` | 6.2.5 | 16 accepted scores, from 5.0.5: 550,186 through 6.2.4: 1,301,222; see the complete history |

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

The `ranges-iterate` workload gathers callback indexes and values after a range
replacement. The `ranges-regex` workload records ranges with empty replacement
strings for two matches. The `ast-loose-compare` workload compares nested object
subsets. Their arguments and callback work are preserved in their own workload
files.

The `ast-delete-object` workload removes an object matching a subset, while
`ast-get-object` retrieves a matching object. The `html-img-alt` workload adds
an empty alternative-text attribute to an image tag. The `ranges-ent-decode`
workload identifies a numeric entity replacement range. All four retain their
original arguments, source, and `lastSlowerRun` records. Their frozen package
versions have no separate accepted scores.

Scores use `target rate * 183 / reference rate`, with `perf-ref@1.0.5` providing
the canonical reference score. They are historical measurements, not new
retirement measurements. Do not compare scores across different workloads or
merge retired histories into a successor package's history. The latest observer,
ranges, and loose-comparison package versions have no separate recorded scores;
their histories are preserved as received. The `ranges-regex` history also
retains its `lastSlowerRun`: version 6.2.4 scored 1,172,804 against the retained
1,221,560 baseline, with a worst observed score of 869,440. This rejected
measurement is not an accepted baseline or a performance improvement.

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

For the ranges and loose-comparison workloads, use a separate disposable
checkout at their own frozen revision, then run them serially after building:

```sh
git clone --no-checkout https://github.com/codsen/codsen.git codsen-ranges-perf-snapshot
git -C codsen-ranges-perf-snapshot checkout --detach 76b7ad7c5fdc268dde81c8329f1edf98e52d47d1
cd codsen-ranges-perf-snapshot
npm ci
npm run build:packages
npm run perf --workspace ranges-iterate
npm run perf --workspace ranges-regex
npm run perf --workspace ast-loose-compare
```

For the object, HTML, and entity-decoding workloads, create a disposable checkout
at `fe2563742f3fb797b242ac37554e309b4c544d13` using the same procedure. After
installing dependencies and building, run these benchmarks serially:

```sh
npm run perf --workspace ast-delete-object
npm run perf --workspace ast-get-object
npm run perf --workspace html-img-alt
npm run perf --workspace ranges-ent-decode
```

For the implementation corresponding to an older recorded score, use its exact
release revision from the relevant manifest when available. Preserve the
benchmark workload when comparing implementations, and follow the performance
policy from the frozen checkout. A new run is new evidence; it does not reproduce
historical machine conditions or promise the same score.
