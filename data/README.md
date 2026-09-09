# @codsen/data

Metadata for Codsen packages, including package lists, declarations, examples,
changelogs, dependency statistics, first-publication dates, and the coverage and
performance gates each package is held to.

## Package catalogue

`packages.all` and `packages.current` contain the same current Codsen product
catalogue: public monorepo packages and packages maintained elsewhere, including
frozen libraries that remain available on npm. Both exclude decommissioned
packages, the auxiliary `@codsen/data` package, publishing experiments, and
third-party projects that share an npm maintainer.

`packages.historical` adds the names in `packages.deprecated`. Use it for
"published ever" counts and publication chronology. The `Package` type covers
this historical list so deprecated documentation remains type-safe.
`totalPackageCount` counts `all`; `historicalPackageCount` counts `historical`.

The generator and the [npm download archive](../statistics/npm-downloads/README.md)
use the same selector in `ops/helpers/codsenPackages.js`. Edit that policy or the
workspace manifests, then regenerate; do not edit `data/sources/packages.ts`.

## First-publication dates

```js
import { firstPublishedAt, packages } from "@codsen/data";

const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
const recentlyPublished = packages.all.filter((name) => {
  const timestamp = firstPublishedAt[name];
  return timestamp !== null && timestamp >= cutoff;
});
```

`firstPublishedAt` maps every name in `packages.historical` to milliseconds since the
Unix epoch, suitable for `new Date(timestamp)` and comparisons with `Date.now()`.
It includes packages published outside the monorepo and deprecated packages.
Choose `packages.all` or `packages.current` to exclude deprecated names.

Each number is the earliest version-publication time observed in npm's
[package metadata](https://github.com/npm/registry/blob/main/docs/responses/package-metadata.md).
Prereleases count. Package-creation times, modification times, and subsequent
releases do not make an established library new again. Once recorded, an earlier
timestamp is retained if npm later removes its version history.

A `null` value means no version-publication date is known. This includes packages
that have not been published when the snapshot is collected. It does not mean
that the package was published at the Unix epoch or that it was never published;
npm may no longer expose its history.

Consumers choose the cutoff, package count, and tie handling. For example, select
the three newest packages with known publication dates:

```js
import { firstPublishedAt, packages } from "@codsen/data";

const newest = packages.all
  .flatMap((name) => {
    const timestamp = firstPublishedAt[name];
    return timestamp === null ? [] : [{ name, timestamp }];
  })
  .sort((a, b) => b.timestamp - a.timestamp || a.name.localeCompare(b.name))
  .slice(0, 3);
```

## Quality gates

`coverageStats` and `perfStats` report the gates a released package has already
passed, not targets it aims at. Both are generated from the repository, so a
package which stops meeting a gate leaves these figures rather than sitting in
them misreported.

```js
import { coverageStats, perfStats } from "@codsen/data";

// "114 packages, every one gated at 100% line coverage, 32 of them also at
//  100% branches, functions and statements"
const { checked, fullyCovered, lowestLineThreshold } = coverageStats;

// "103 benchmarked packages, 1011 recorded runs; a release more than 10%
//  slower than its baseline fails the build"
const { benchmarked, recordedRuns, regressionThresholdPercent } = perfStats;
```

`coverageStats` reads the `c8` block `lect` generates into every package
manifest from `ops/coverage-policy.json`. Each of those blocks sets
`check-coverage`, so a threshold is enforced rather than advisory.
`lowestLineThreshold` is the weakest line threshold in force across `checked`;
every checked package is gated at that percentage or above.

`perfStats.baselines` maps a package to the score its next benchmark run is
compared against, taken from `packages/<name>/perf/historical.json`. Scores are
ops/sec normalised against the `perf-ref` reference program, which makes them
comparable between packages and between machines but not equal to raw ops/sec
on any one machine. A package which has a benchmark but has never completed a
run appears in `benchmarked` without an entry in `baselines`. A run more than
`regressionThresholdPercent` slower than its baseline fails the build and does
not replace the baseline it lost against; a run within
`unchangedTolerancePercent` counts as unchanged.

## Refreshing the snapshot

From the monorepo root, run:

```sh
npm run ci:generate:info -- --npm-dates
npm run build --workspace=@codsen/data
npm run ci:verify:data
```

The refresh queries the public npm registry for the complete inventory emitted
as `data/sources/packages.ts`'s `historical` list. HTTP 404 leaves an unknown package at
`null`; other registry or metadata errors fail generation without replacing the
snapshot. Do not edit `data/sources/firstPublishedAt.ts` by hand.

Ordinary generation and verification use the checked-in snapshot without network
requests. Generation adds new package names with `null` and removes names no
longer in `packages.historical`. Release preparation and rehearsal explicitly refresh
npm dates, then build the snapshot into `@codsen/data`. A package first published
in that same release receives its timestamp on a subsequent refresh, because
release preparation runs before publication. Importing `@codsen/data` never
queries npm.
