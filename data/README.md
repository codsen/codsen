# @codsen/data

Metadata for Codsen packages, including package lists, declarations, examples,
changelogs, dependency statistics, and first-publication dates.

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
It includes packages published outside the monorepo and deprecated packages.
Choose a narrower list, such as `packages.current`, to exclude deprecated names.

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

## Refreshing the snapshot

From the monorepo root, run:

```sh
npm run ci:generate:info -- --npm-dates
npm run build --workspace=@codsen/data
npm run ci:verify:data
```

The refresh queries the public npm registry for the complete inventory emitted
as `data/sources/packages.ts`'s `all` list. HTTP 404 leaves an unknown package at
`null`; other registry or metadata errors fail generation without replacing the
snapshot. Do not edit `data/sources/firstPublishedAt.ts` by hand.

Ordinary generation and verification use the checked-in snapshot without network
requests. Generation adds new package names with `null` and removes names no
longer in `packages.all`. Release preparation and rehearsal explicitly refresh
npm dates, then build the snapshot into `@codsen/data`. A package first published
in that same release receives its timestamp on a subsequent refresh, because
release preparation runs before publication. Importing `@codsen/data` never
queries npm.
