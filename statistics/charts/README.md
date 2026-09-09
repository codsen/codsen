# Codsen statistics charts

Open [the chart gallery](index.html) to inspect the baked SVGs and the interactive
dependency molecule. The artifacts are checked in and work without a chart
service, CDN, or registry request. Each package node links to its Codsen page;
external molecule nodes link to their locked version on npm.

## Regenerate

From the repository root, with the root dependencies installed:

```sh
npm run stats:charts
npm run stats:charts:check
```

Generation reads local files, validates the download archive, and updates only
changed artifacts in this directory. The check command compares the expected
files without writing. Neither command refreshes downloads or builds packages.
Generated output is excluded from Biome; edit the generators under
`ops/helpers/statisticsCharts*.js` and `ops/scripts/generate-statistics-charts.js`.
This README is maintained by hand.

To fetch newer download observations, run `npm run stats:refresh` before baking.
After changing package dependency declarations, regenerate the dependency data
with `npm run ci:generate:info` before baking. The chart generator rejects stale
catalogue membership and stale generated dependency edges.
It also rejects workspace production or optional dependency declarations that
differ from the lockfile, so update the lockfile when changing those declarations.

For a local browser preview, run this command from the repository root and open
the localhost address it prints:

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory statistics/charts
```

## Files and measurements

| File | Contents |
| --- | --- |
| [download-concentration.svg](download-concentration.svg) | Cumulative download share, the smallest group reaching 80%, and the download share of the top fifth |
| [download-ranking.svg](download-ranking.svg) | The top 15 packages and the remaining packages combined |
| [download-concentration-history.svg](download-concentration-history.svg) | Concentration across complete calendar years |
| [interdependencies.svg](interdependencies.svg) | A circular map of the active catalogue and its known direct internal dependencies |
| [dependency-topology.svg](dependency-topology.svg) | The same graph arranged in dependency-depth bands, with shared dependencies represented once |
| [dependency-topology-narrow.svg](dependency-topology-narrow.svg) | A three-column topology for narrower article layouts |
| [dependency-molecule.svg](dependency-molecule.svg) | A static perspective view of the `string-strip-html` dependency closure |
| [dependency-molecule.html](dependency-molecule.html) | A self-contained 3D explorer with a package selector, rotation, zoom, and an accessible dependency list |
| [summary.json](summary.json) | Exact counts, rankings, excluded packages, archive anomalies, graph scope, and source hashes |

### Download concentration

The main window is the 365 days ending at the archive's `manifest.through` date,
inclusive. Packages are ranked by downloads, then by name to break ties. The
80% group is the minimum whole-package count whose cumulative share reaches at
least 80%. The top fifth contains `ceil(packageCount / 5)` packages, so its
actual package percentage can be slightly above 20%.

The cohort contains current, available libraries and CLIs included in the
archive portfolio. Retired packages, unavailable packages, and `@codsen/data`
are excluded. Exclusion reasons are retained in `summary.json`. Missing daily
observations make a window's concentration unavailable. Dates known to precede
publication contribute zero. Suspected shared-zero dates already flagged by
the archive remain in the counts and make the result provisional; they are
neither discarded nor estimated.

The historical chart holds today's cohort fixed, including known prepublication
zeros. It describes the history of today's packages, rather than reconstructing
the catalogue that existed in each year. Incomplete calendar years are omitted;
missing observations or zero total downloads produce gaps.

These are npm package download counts, including dependency and automated
installs. They measure package fetches, not unique people or website traffic.
The archive's source is documented in
[npm's download-count API](https://github.com/npm/registry/blob/main/docs/download-counts.md).

### Circular and topological maps

The maps read `data/sources/interdeps.ts`, check it against workspace manifests,
and restore isolated packages from the current catalogue. Their arrows point
from a package to its dependency. Depth is the longest known dependency chain;
these are directed graphs, so a shared dependency is not duplicated as a tree
branch.

Current packages maintained outside this checkout are included, with dashed
nodes to mark unknown outgoing dependencies. A node with unknown dependencies
does not prove that the package has none. Third-party npm dependencies are
outside these two maps; the molecule includes the resolved external closure.

The topology fits ordinary desktop widths and has a narrower variant. All
package names are retained, so the complete graph extends vertically. At phone
widths, use the full-size links or zoom to inspect the dense static maps.

### Dependency molecule

The explorer bakes the complete resolved production and optional dependency
closure for every active workspace root. Current workspace manifests supply
workspace edges; `package-lock.json` supplies installed locations, external
versions, and transitive edges. Shared nodes, multiple installed versions, and
cycles are retained. Missing resolutions are reported in the explorer and
summary. Development dependencies and peer-only relationships are excluded;
platform-specific optional dependencies remain visible.

This is a snapshot of this checkout's resolved dependencies, which can differ
from a fresh consumer installation or the latest published package. Roots
outside the checkout are not offered because their full manifests are unknown.

The rendering uses baked three-dimensional coordinates and a perspective
projection. Drag or use the arrow keys to rotate; use the buttons or `+` and `-`
to zoom, and `0` to reset. A URL fragment selects a package, for example
[the email-comb molecule](dependency-molecule.html#email-comb).

For large graphs, labels initially identify the selected package and its direct
dependencies. Enable all labels to inspect the rest, or use the full linked list.
Every node and edge remains in the graph when labels are reduced.

The reference is
[Andrei Kashcha's npm graph](https://github.com/anvaka/npmgraph.an), which uses
live registry data. This explorer embeds its own data and renderer. It needs no
WebGL library or external asset. SVG preserves one camera view; the HTML file
preserves rotation and selection. Its initial SVG remains visible when scripts
are disabled.

## Embed on codsen.com

The website's `npm run ops:charts` syncs these assets into
`public/statistics/charts/`; its build and development scripts run the sync
automatically. Locally, it verifies and reads this sibling checkout. Hosted
builds resolve the latest completed successful npm release to one Git commit
and fetch every chart from that revision. Set `CODSEN_CHARTS_REVISION` to a
full commit SHA to select a different published snapshot, or
`CODSEN_CHARTS_SOURCE` to preview another local checkout. Set only one override.

The website records the selected revision and asset hashes in
`/statistics/charts/source.json`. It serves the SVGs, explorer, gallery,
summary, and this README from its own origin. Chart assets remain outside
`@codsen/data`, and syncing them does not update the website's npm dependencies.

Release preparation regenerates charts after dependency data and package
versions are current. Repository verification checks chart freshness. After a
successful release, a separate workflow requests a Vercel build; see
[website chart setup](../../.github/NPM_RELEASES.md#website-charts). A
statistics-only update can be selected with the website's revision override.
The default source continues to follow successful npm releases.

The examples below use the website's stable `/statistics/charts/` URLs. These
embeds need no release-by-release edits.

Use an image when only the picture is needed:

```html
<img
  src="/statistics/charts/download-concentration.svg"
  alt="Cumulative npm download share across current Codsen packages"
  style="width: 100%; height: auto"
/>
```

Use an object or inline SVG to retain package links. Links inside an SVG loaded
as an image are not interactive:

```html
<object
  data="/statistics/charts/dependency-topology.svg"
  type="image/svg+xml"
  aria-label="Codsen package dependency topology"
  style="width: 100%; height: auto"
>
  <a href="/statistics/charts/dependency-topology.svg">Open the dependency map</a>
</object>
```

The gallery switches to the narrow topology below 700 CSS pixels. A website can
use the same two object elements and a media query, or embed the narrow file
directly in an article column. Each SVG supplies an accessible title,
description, node labels, and link destinations. If inlining the same SVG more
than once, give each copy unique IDs and update its fragment references.

Use an iframe for the interactive molecule; the HTML is a single portable file:

```html
<iframe
  src="/statistics/charts/dependency-molecule.html#string-strip-html"
  title="Interactive string-strip-html dependency graph"
  loading="lazy"
  style="width: 100%; height: 900px; border: 0"
></iframe>
```

Allow the file's embedded script and styles in the hosting site's content
security policy. If using an iframe sandbox, it needs scripts and popup links;
the standalone explorer also works without a sandbox attribute. No website
files are modified or deployed by the chart generator.
