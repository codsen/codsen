# @codsen/data

Metadata for Codsen packages, including package lists, declarations, examples,
changelogs, dependency statistics, first-publication dates, and the coverage and
performance gates each package is held to.

## Package inventory

Package location, Codsen retirement decisions, and npm deprecation are separate
facts. None of these lists promises active development or a maintenance schedule.

| Field | Meaning |
| --- | --- |
| `packages.all` | Every known Codsen product name, including retired and unavailable products |
| `packages.inMonorepo` | Public product names from manifests under `packages/` |
| `packages.outsideMonorepo` | `all` minus `inMonorepo`, including retired products |
| `packages.retired` | Products deliberately retired by Codsen |
| `packages.deprecated` | Products whose npm `latest` version has a nonempty deprecation message in the recorded snapshot |
| `packages.npmStatusCheckedAt` | UTC timestamp of the npm status snapshot |

The product inventory excludes the auxiliary `@codsen/data` package, publishing
experiments, unpublished checkout aliases, and co-maintained third-party
projects. It is not an npm account membership list. `inMonorepo` excludes the
`data/` workspace because its scope is public products under `packages/`.

The `Package` type covers `all`, preserving retired documentation names. Lists
are sorted and contain unique names. Counts are derived from the corresponding
array lengths; for example, `totalPackageCount` is `all.length` and
`inMonorepoCount` is `inMonorepo.length`.

Use location to count repository packages and retirement to select products for
promotion. An outside package needs no additional public maintenance label:

```ts
import { packages } from "@codsen/data";

const repositoryPackageCount = packages.inMonorepo.length;
const retired = new Set<string>(packages.retired);
const catalogue = packages.all.filter((name) => !retired.has(name));
const otherPackages = packages.outsideMonorepo.filter((name) => !retired.has(name));
```

`deprecated` reflects npm's `latest` dist-tag, not deprecation on any older
version. Retirement can exist without that flag. A missing registry record is
unknown, not proof of non-deprecation; the recorded snapshot retains unavailable
results separately. Inspect `ops/package-npm-status.json` for versions, messages,
and unavailable reasons. Importing this package never contacts npm.

### Capabilities and presentation

`packages.libraries` identifies TypeScript libraries under `packages/`.
`packages.cli` identifies packages there with a `bin` capability, and
`packages.browserScripts` identifies those with a direct-browser script export.
These lists describe this checkout; absence does not establish that an outside
package lacks a capability.

`packages.categories` contains the website's curated groups: `flagshipLibs`,
`rangeLibs`, `htmlLibs`, `stringLibs`, `objectOrArrayLibs`, `lernaLibs`, `cliApps`,
`astLibs`, and `miscLibs`. These are presentation groups, not lifecycle statuses.
A website should count its rendered entries and documented routes explicitly,
and select documentation controls from available examples, declarations, and
artifacts rather than inferring them from repository location.

### Migration from the previous inventory

Two existing fields have corrected meanings: `all` now includes retired products,
and `deprecated` now means npm deprecation rather than Codsen retirement. Move
policy-based checks from `deprecated` to `retired`. Consumers that previously
used `all` to promote products should use `all` minus `retired`.

Compatibility aliases remain while consumers migrate:

| Previous field | Replacement |
| --- | --- |
| `historical` | `all` |
| `current` | `all` minus `retired`; use `inMonorepo` for repository membership |
| `packagesOutsideMonorepo` | `outsideMonorepo` minus `retired` to preserve the old population |
| `programs` | `libraries` |
| `script` | `browserScripts` |
| `splitList*` | The matching `categories` member |

The corresponding legacy count fields also remain, derived from their arrays.
`special` is a legacy residual classification; select explicit capabilities
instead. New consumers should use the canonical fields above.

Deploy the website's compatibility adapter before publishing the corrected data
API. The adapter accepts both the previous schema and this one, preserving
retirement handling during the transition. Update the website's installed
`@codsen/data` after publication, then regenerate and validate its static data.
Do not replace its dependency with an unpublished version or local path for
deployment.

The generator and [npm download archive](../statistics/npm-downloads/README.md)
share `ops/helpers/codsenPackages.js`. Download statistics select `all` minus
`retired`; correcting `all` therefore does not add retired downloads to the
portfolio. Edit the shared policy or workspace manifests and regenerate rather
than editing `data/sources/packages.ts`.

## First-publication dates

```js
import { firstPublishedAt, packages } from "@codsen/data";

const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
const recentlyPublished = packages.all.filter((name) => {
  const timestamp = firstPublishedAt[name];
  return timestamp !== null && timestamp >= cutoff;
});
```

`firstPublishedAt` maps every name in `packages.all` to milliseconds since the
Unix epoch, suitable for `new Date(timestamp)` and comparisons with `Date.now()`.
It includes packages outside the monorepo and retired products. Select `all`
minus `retired` when using publication dates to promote products.

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
npm run ci:generate:info -- --npm-dates --npm-status
npm run build --workspace=@codsen/data
npm run ci:verify:data
```

The refresh queries the public npm registry for the complete inventory emitted
as `packages.all`. HTTP 404 leaves an unknown package at
`null`; other registry or metadata errors fail generation without replacing the
snapshot. npm status records HTTP 404 as unavailable. Other HTTP, network, or
malformed-metadata failures abort the refresh before writing either snapshot.
Do not edit `data/sources/firstPublishedAt.ts` or `ops/package-npm-status.json`
by hand.

Ordinary generation and verification use the checked-in snapshot without network
requests. Generation adds new package names with `null` and removes names no
longer in `packages.all`. The npm status snapshot must match that inventory
exactly; after adding or removing a product, run the refresh command above.
Use `--npm-status` or `--npm-dates` independently to refresh only one snapshot.
Release preparation and rehearsal refresh both snapshots, then build them into
`@codsen/data`. A package first published
in that same release receives its timestamp on a subsequent refresh, because
release preparation runs before publication. Importing `@codsen/data` never
queries npm.
