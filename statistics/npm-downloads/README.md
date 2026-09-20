# npm download history

Daily npm download observations for the current Codsen catalogue, stored as one
NDJSON file per package. Previously collected histories for retired and
auxiliary packages are preserved separately. The archive lives outside the
`@codsen/data` workspace so statistics updates can ship independently of npm
package releases.

## Refresh the archive

From the monorepo root, run:

```sh
npm run stats:refresh
npm run stats:check
```

The refresh uses all catalogue packages except retired products and fetches
history through npm's latest available day. It fills missing intervals, rechecks
at least the latest 60 days, and rechecks dates flagged as possible reporting
problems. It can request additional days to share bounded queries across
packages. Corrected observations replace the previous count for that date;
overlapping requests never add the same day twice. Retired histories remain
separate and do not generate requests.

Refresh monthly or before a website update. Occasionally recheck the entire
history, for example quarterly:

```sh
npm run stats:refresh -- --full
```

`--full` rechecks the entire history of the current catalogue. It also preserves
the retired archive without requesting those packages.

Requests run sequentially, in windows of at most 365 inclusive days. Unscoped
packages share batches of at most 64 names; scoped packages are requested
individually. Network and transient HTTP failures have bounded retries, and
`Retry-After` delays are respected. A requested delay longer than 60 seconds
stops the refresh so it can be retried later.

Every required response is checked for package identity, exact date bounds,
complete daily coverage, and non-negative safe-integer counts. npm can silently
truncate an oversized request, so an HTTP 200 response alone is insufficient.
An individual HTTP 404 marks a package unavailable; its previously collected
history remains in the archive. Bulk omissions and invalid responses fail the
refresh instead of becoming zero downloads.

Validated requests from a failed refresh are cached in `.cache/npm-downloads`
for up to one hour. Re-running the same command can resume that work. Successful
runs clear the request cache, so the next refresh can observe corrections even
when the latest-available date has not changed. The last successful refresh
report is `.cache/npm-downloads/last-refresh.json`; it lists corrections,
unavailable packages, and suspected reporting problems.

The collector stages and verifies the primary and retired snapshots together
before replacing the archive. Promotion uses a recovery copy and directory
renames. The next refresh recovers an interrupted rename when possible; invalid
conflicting snapshots require inspection. A lock prevents concurrent refreshes.
Failed network requests never replace the last good archive.

These commands do not build packages, commit, push, or publish. Normal builds
and `stats:check` are offline. The root `verify` command includes `stats:check`.
An unchanged refresh preserves the manifest timestamp and produces no data diff.

## Stored format

`packages/<name>.ndjson` contains compact daily records in ascending date order:

```ndjson
{"day":"2026-09-01","downloads":12788}
{"day":"2026-09-02","downloads":14354}
{"day":"2026-09-03","downloads":0}
```

The primary snapshot uses `manifest.json` and `packages/`. The optional retired
snapshot uses `retired/manifest.json` and `retired/packages/`. Scoped packages
use a directory, such as `retired/packages/@codsen/data.ndjson`.

Files use UTF-8, LF line endings, and a final newline. Dates are unique. Each
record has exactly `day` and `downloads`; metadata is not repeated in the stream.
An unavailable package without observations has an empty NDJSON file.

`manifest.json` contains:

- `schemaVersion`, source information, `through`, a content-derived `revision`,
  and `updatedAt`, which changes only with meaningful snapshot content.
- A package map with status, portfolio membership, earliest known publication
  day, availability, file path, and SHA-256 hash.
- Per-package coverage: observed start/end dates, row count, explicit missing
  intervals, and the sum of observed counts. No observations means `total: null`.
- Suspected shared-zero dates and the packages with that pattern.
- An optional `retiredRevision` linking the primary manifest to the retired
  snapshot's content revision.

The verifier recomputes metadata, hashes, totals, missing intervals, anomalies,
and the revision of each snapshot. It verifies the child revision against the
primary manifest, requires disjoint package sets, and rejects portfolio
membership in the retired snapshot. Retired snapshots cannot contain another
nested snapshot. Missing or extra files, invalid paths, non-canonical rows,
duplicate dates, and malformed metadata also fail verification.

The retired manifest has its own cutoff and timestamp. Refreshing the primary
catalogue preserves these values and the retired observations. A membership
change can update the retired snapshot; any uncollected intervals remain
explicitly missing. A retired package can have availability `not-collected`
when it was not yet published at its last collection and its publication date
falls on or before a later retired snapshot cutoff. This state records that no
downloads were fetched for that interval; it does not invent zero counts.

Keep the NDJSON files uncompressed in Git so data changes remain reviewable.
The manifests and package streams are generated; do not format or edit them
manually.

## Package membership

The canonical snapshot contains 129 products. Its package set is `all` minus
`retired` from the shared
[`createCodsenPackageLists` selector](../../ops/helpers/codsenPackages.js).
This includes packages inside and outside the monorepo without classifying
their maintenance status.

The 27 retired products and the auxiliary `@codsen/data` package have 28
previously collected histories in `retired/`. They are excluded from the
primary manifest, portfolio totals, chart exports, and refresh requests.
The selector's `all` list includes every product in the catalogue, including
retired products. Its `deprecated` list records npm's latest-version flags
separately and does not control collection membership.

The archive retains its existing status values: `current` means included in
collection, and `deprecated` means retired by catalogue policy. These stored
labels are independent of npm's latest-version deprecation flags. Changing
the catalogue field names does not rewrite saved observations or revisions.

Publication dates come from the checked-in
[`firstPublishedAt` snapshot](../../data/sources/firstPublishedAt.ts), without
building or executing generated package code. Previously observed earlier dates
are retained. An unknown publication date remains `null`; retrieval then starts
at npm's supported history floor. If a publication date becomes known later,
already collected observations remain in the archive even when they precede
that metadata date. Full reconciliation continues to recheck those observations.

A package leaving the canonical catalogue moves its saved history into
`retired/` on the next refresh. Reinstating a package restores that history to
the primary snapshot before fetching missing days and corrections. Catalogue
membership changes therefore affect current portfolio totals.

`stats:check` verifies that the primary manifest matches the current canonical
catalogue, including status and portfolio membership. After changing the
catalogue policy or package inventory, regenerate the website metadata and
refresh the archive before validation:

```sh
npm run ci:generate:info
npm run stats:refresh
npm run stats:check
```

Verification remains offline; refreshing download observations requires the
npm API. npm maintainer search can reveal omissions, but membership comes from
the shared selector. Its explicit exclusions cover the npm test package,
frozen checkout aliases, and `postcss-nested-import`.

## Export chart data

Generate ordinary JSON assets in an explicit output directory:

```sh
npm run stats:export -- --output .cache/npm-download-charts
```

The exporter verifies both saved snapshots without network access and exports
the primary catalogue only. Retired packages do not appear in its index,
per-package assets, or portfolio totals.

`index.json` provides package metadata and aligned recent-window summaries;
each package has its own JSON history and calendar-month roll-ups. Exported data
includes the source revision and cut-off. Missing observations produce `null`
totals, and windows affected by suspected reporting problems are marked
provisional. The current incomplete calendar month is identified separately.

Window summaries and monthly entries also expose `observedDownloads`, the sum
of the available observations. Portfolio windows list `missingPackages`.
For an incomplete portfolio, a website can label this as a reported subtotal
and identify the missing coverage; it must not present it as a complete total.

The output must be empty or a valid prior export owned by this command. The
exporter rejects unrelated files and paths overlapping the source archive.

The website can import an exact monorepo revision, vendor these assets into
its own `public/` directory, and lazily load one package's JSON when needed.
Overview pages can use the small index. Commit the vendored assets with the
website so its builds and visitors do not depend on a working npm API. Updating
this archive alone does not change the deployed website.

## Interpretation and source limitations

Counts and dates come from the public
[npm download API](https://github.com/npm/registry/blob/main/docs/download-counts.md).
Daily dates are inclusive UTC days. The documented earliest date is
2015-01-10; limits apply to request size, so older history can be fetched in
chunks. Per-version counts cover only the preceding seven days and are not
part of this archive.

`through` means npm's latest available day, not today. Explicit requests beyond
that watermark can return zeros before reporting is ready. A stored zero is
an observed npm value; missing data is recorded separately and never filled
with synthetic zeros.

The anomaly detector flags a date when at least three packages each report
zero between immediately adjacent days with at least 100 downloads. This is a
conservative signal for inspection, not proof of an npm outage or a complete
detector of reporting problems. It can miss multi-day gaps and problems at the
end of the available history. Source values stay unchanged. A later correction
can remove the flag. An older correction can also fall outside the routine
refresh windows, which is why occasional full reconciliation is useful.

Downloads describe package distribution activity. They include repeated and
automated retrievals, and portfolio totals can include multiple dependency
downloads from one installation. They do not identify unique people, projects,
or companies. See npm's published
[download-count methodology](https://blog.npmjs.org/post/92574016600/numeric-precision-matters-how-npm-download-counts-work.html).
Runtime-speed charts should use the repository's separate benchmark histories.
