# Node 18 release bump reference

Snapshot: 2026-08-10. Baseline: live `origin/main` at
`acf8f9b9fd0304eee325b7c78ffbc3099a773607`, whose package versions come from
the collective release at `ae6dc7e`. This covers the 101 Rollup-family
libraries still present in the current branch whose remote baseline declares
`engines.node` as `>=14.18.0`. CLIs, `@codsen/data`, and locally removed packages
are out of scope.

## Release classification

- `minor` means the unchanged remote baseline passed its direct `unit` suite on
  exact Node `18.20.8`; under the requested release policy, the Node 18 engine
  floor can ship on the next minor line.
- `major` would mean the unchanged remote baseline failed that suite and the
  Node 18 work must use the next breaking-release line.
- `to` is the planned release line derived from the remote published version;
  the patch component is intentionally omitted.
- Raising the engine floor drops Node 14 and 16 consumers, so treating it as a
  minor is an explicit pragmatic policy rather than strict SemVer treatment.
- This is scoped to the engine-floor decision only. Unrelated unreleased changes
  still need their own SemVer review.

The remote commit was installed from its lockfile and built once under the root
Node `24.19.0` toolchain. Its direct library unit suites then ran under Node
`18.20.8` with npm `10.8.2`: 101 passed, 0 failed, and 0 timed out. The removed
`array-of-arrays-into-ast` remote baseline also passed separately, but it has no
current release to plan. The removed `gulp-email-remove-unused-css` package was
already on Node 18 and is not part of this floor change.

## Performance-floor audit

Performance snapshot: 2026-08-10. `optimal engine` is the lowest exact tested
floor which preserves the public contract and does not forgo a strong,
actionable newer-API improvement. A strong reason here means a repeatable gain
of at least 10% on a representative workload, with preserved semantics, which
cannot be obtained on Node 18 or through a practical feature-detected path.

Setting `engines.node` does not select or optimize V8. A consumer running an
`>=18.20.8` package on Node 26 already gets Node 26's V8; changing the manifest
to `>=26` would only reject Node 18 through 24 consumers. Runtime-only gains are
therefore evidence about which Node a consumer might choose, not evidence for a
higher package floor. A floor rises here only when it unlocks better library
code.

The audit covered all 101 libraries, 131 TypeScript source files, their complete
production dependency closure, and the exact runtimes `18.20.8`, `20.19.4`,
`22.21.1`, `24.19.0`, and `26.7.0`.

- All 101 libraries have an optimal engine of `>=18.20.8`.
- Zero libraries have a defensible performance floor of Node 20 or Node 22.
- No active library source imports a Node core module, no external production
  dependency requires Node 20 or newer, and esbuild emitted byte-identical
  library JavaScript for Node 18, 20, 22, 24, and 26 targets.
- The 98 maintained package workloads completed on all five runtimes: 490 of
  490 benchmark processes succeeded. Each result used seven alternating
  target/reference pairs. The other three libraries explicitly skip perf and
  were decided by the source/API audit.

### Current-code runtime matrix

The same-host raw target medians below show what the current code did on each
runtime. They are exploratory runtime ratios, not release-history scores and
not engine-floor recommendations.

| Exact Node | Median package ratio vs 18 | Geometric-mean ratio vs 18 |
| ---------- | -------------------------: | -------------------------: |
| `18.20.8`  |                      1.000 |                      1.000 |
| `20.19.4`  |                      1.045 |                      1.075 |
| `22.21.1`  |                      1.100 |                      1.162 |
| `24.19.0`  |                      1.125 |                      1.186 |
| `26.7.0`   |                      1.175 |                      1.236 |

The `perf-ref` reference itself ran about 1.90, 2.02, 2.40, and 2.52 times as
fast on Node 20, 22, 24, and 26 as on Node 18. Consequently, normalized scores
answer “target performance relative to this reference program”; they must not
be mistaken for absolute wall-clock cross-V8 speed. The raw ratios above are
comparable only because every lane ran on the same host in this one audit.

For the concrete `detergent` example, a longer two-round, runtime-order-balanced
rerun measured raw ratios of 1.000, 1.123, 1.167, 1.117, and 1.155 from Node 18
through 26. Its current workload plateaued around Node 22 on this host; forcing
`engines.node` to Node 22 or 26 would not make a Node 22 or 26 consumer any
faster. No newer-only API was found in `detergent` that could justify a higher
floor, so its optimal engine remains `>=18.20.8`.

### Newer-API findings

- `structuredClone` is already present on Node 18. It is not a compatible
  replacement for `codsen-utils`'s `deepClone`: functions and symbols throw,
  `Buffer` becomes `Uint8Array`, and `SharedArrayBuffer` remains shared. Across
  every exact runtime, the current clone was about 1.76–3.76 times faster on
  representative object, array, `Map`, and `Set` graphs. This also keeps all 14
  direct clone consumers and the wider `codsen-utils` dependency graph on 18.
- Node 20's `path.matchesGlob` has incompatible filesystem/platform semantics
  and was about 3.7–37 times slower than `codsen-utils.match` in the tested
  simple-pattern prototype.
- Node 22 Set algebra was about 1.3–3.0 times slower than the existing prepared
  `Set` plus filter loops and can change result ordering.
- Node 20 `toSorted()` stayed within roughly 6% of copy-plus-sort and can be
  feature-detected, so it provides no floor reason.
- `Intl.Segmenter` can materially improve long-input grapheme splitting in
  `string-convert-indexes`, and direct code-point iteration can improve
  `ranges-process-outside`; both are already available on Node 18. They are
  follow-up implementation opportunities, not engine bumps.
- The other inspected Node 20–26 additions either do not match a library's
  contract, are slower, affect a cold/non-representative path, or can be used
  through feature detection without abandoning Node 18.

### Benchmark limits

`rehype-responsive-tables`,
`remark-conventional-commit-changelog-timeline`, and `remark-typography` have no
package perf workload. Several maintained checks are also weak evidence for
their package as a whole: `codsen-utils` times `isPlainObject`, not cloning;
`ranges-sort` uses semantically backwards ranges; `util-nonempty` mostly times
fixture allocation; and `lerna-clean-changelogs` uses an already-clean no-op
fixture. These findings were not repaired here because changing a workload
would require resetting its complete performance history. No history file was
changed by this audit.

Current total: 101 `minor`, 0 `major`; 101 optimal at Node 18, 0 at Node 20, and
0 at Node 22.

```text
all-named-html-entities: minor, to v3.2, optimal engine >=18.20.8
array-group-str-omit-num-char: minor, to v6.2, optimal engine >=18.20.8
array-includes-with-glob: minor, to v5.2, optimal engine >=18.20.8
array-pull-all-with-glob: minor, to v7.2, optimal engine >=18.20.8
arrayiffy-if-string: minor, to v5.2, optimal engine >=18.20.8
ast-compare: minor, to v4.2, optimal engine >=18.20.8
ast-contains-only-empty-space: minor, to v4.2, optimal engine >=18.20.8
ast-deep-contains: minor, to v5.2, optimal engine >=18.20.8
ast-delete-object: minor, to v4.2, optimal engine >=18.20.8
ast-get-object: minor, to v4.2, optimal engine >=18.20.8
ast-get-values-by-key: minor, to v5.2, optimal engine >=18.20.8
ast-is-empty: minor, to v4.2, optimal engine >=18.20.8
ast-loose-compare: minor, to v4.2, optimal engine >=18.20.8
ast-monkey: minor, to v9.2, optimal engine >=18.20.8
ast-monkey-traverse: minor, to v4.2, optimal engine >=18.20.8
ast-monkey-traverse-with-lookahead: minor, to v4.2, optimal engine >=18.20.8
ast-monkey-util: minor, to v3.2, optimal engine >=18.20.8
charcode-is-valid-xml-name-character: minor, to v3.2, optimal engine >=18.20.8
check-types-mini: minor, to v8.2, optimal engine >=18.20.8
codsen-utils: minor, to v1.8, optimal engine >=18.20.8
color-shorthand-hex-to-six-digit: minor, to v5.2, optimal engine >=18.20.8
csv-sort: minor, to v7.2, optimal engine >=18.20.8
csv-split-easy: minor, to v7.2, optimal engine >=18.20.8
detect-is-it-html-or-xhtml: minor, to v6.2, optimal engine >=18.20.8
detect-templating-language: minor, to v4.2, optimal engine >=18.20.8
detergent: minor, to v9.4, optimal engine >=18.20.8
edit-package-json: minor, to v0.10, optimal engine >=18.20.8
email-all-chars-within-ascii: minor, to v5.2, optimal engine >=18.20.8
email-comb: minor, to v7.2, optimal engine >=18.20.8
extract-search-index: minor, to v2.2, optimal engine >=18.20.8
generate-atomic-css: minor, to v3.2, optimal engine >=18.20.8
html-all-known-attributes: minor, to v6.2, optimal engine >=18.20.8
html-crush: minor, to v6.2, optimal engine >=18.20.8
html-entities-not-email-friendly: minor, to v0.10, optimal engine >=18.20.8
html-img-alt: minor, to v4.2, optimal engine >=18.20.8
html-table-patcher: minor, to v6.2, optimal engine >=18.20.8
is-char-suitable-for-html-attr-name: minor, to v4.2, optimal engine >=18.20.8
is-html-attribute-closing: minor, to v4.2, optimal engine >=18.20.8
is-html-tag-opening: minor, to v4.2, optimal engine >=18.20.8
is-language-code: minor, to v5.2, optimal engine >=18.20.8
is-media-descriptor: minor, to v5.2, optimal engine >=18.20.8
is-relative-uri: minor, to v5.2, optimal engine >=18.20.8
js-row-num: minor, to v7.2, optimal engine >=18.20.8
json-comb-core: minor, to v8.2, optimal engine >=18.20.8
json-variables: minor, to v12.2, optimal engine >=18.20.8
lerna-clean-changelogs: minor, to v5.2, optimal engine >=18.20.8
object-all-values-equal-to: minor, to v4.2, optimal engine >=18.20.8
object-boolean-combinations: minor, to v6.3, optimal engine >=18.20.8
object-delete-key: minor, to v4.2, optimal engine >=18.20.8
object-fill-missing-keys: minor, to v11.2, optimal engine >=18.20.8
object-flatten-all-arrays: minor, to v7.2, optimal engine >=18.20.8
object-flatten-referencing: minor, to v7.2, optimal engine >=18.20.8
object-merge-advanced: minor, to v14.2, optimal engine >=18.20.8
object-no-new-keys: minor, to v5.3, optimal engine >=18.20.8
object-set-all-values-to: minor, to v6.2, optimal engine >=18.20.8
ranges-apply: minor, to v7.2, optimal engine >=18.20.8
ranges-crop: minor, to v6.2, optimal engine >=18.20.8
ranges-ent-decode: minor, to v6.2, optimal engine >=18.20.8
ranges-invert: minor, to v6.2, optimal engine >=18.20.8
ranges-is-index-within: minor, to v4.2, optimal engine >=18.20.8
ranges-iterate: minor, to v4.2, optimal engine >=18.20.8
ranges-merge: minor, to v9.2, optimal engine >=18.20.8
ranges-process-outside: minor, to v6.2, optimal engine >=18.20.8
ranges-push: minor, to v7.2, optimal engine >=18.20.8
ranges-regex: minor, to v6.2, optimal engine >=18.20.8
ranges-sort: minor, to v6.2, optimal engine >=18.20.8
regex-empty-conditional-comments: minor, to v3.2, optimal engine >=18.20.8
regex-is-jinja-nunjucks: minor, to v4.2, optimal engine >=18.20.8
regex-is-jsp: minor, to v4.2, optimal engine >=18.20.8
regex-jinja-specific: minor, to v4.2, optimal engine >=18.20.8
rehype-responsive-tables: minor, to v2.2, optimal engine >=18.20.8
remark-conventional-commit-changelog-timeline: minor, to v3.3, optimal engine >=18.20.8
remark-typography: minor, to v0.8, optimal engine >=18.20.8
str-indexes-of-plus: minor, to v5.2, optimal engine >=18.20.8
string-apostrophes: minor, to v4.2, optimal engine >=18.20.8
string-character-is-astral-surrogate: minor, to v3.2, optimal engine >=18.20.8
string-collapse-leading-whitespace: minor, to v7.2, optimal engine >=18.20.8
string-collapse-white-space: minor, to v11.2, optimal engine >=18.20.8
string-convert-indexes: minor, to v6.2, optimal engine >=18.20.8
string-dashes: minor, to v1.4, optimal engine >=18.20.8
string-extract-class-names: minor, to v8.2, optimal engine >=18.20.8
string-extract-sass-vars: minor, to v4.2, optimal engine >=18.20.8
string-find-heads-tails: minor, to v6.2, optimal engine >=18.20.8
string-find-malformed: minor, to v4.2, optimal engine >=18.20.8
string-fix-broken-named-entities: minor, to v7.2, optimal engine >=18.20.8
string-left-right: minor, to v6.2, optimal engine >=18.20.8
string-match-left-right: minor, to v9.2, optimal engine >=18.20.8
string-process-comma-separated: minor, to v4.3, optimal engine >=18.20.8
string-range-expander: minor, to v4.2, optimal engine >=18.20.8
string-remove-duplicate-heads-tails: minor, to v7.2, optimal engine >=18.20.8
string-remove-thousand-separators: minor, to v7.2, optimal engine >=18.20.8
string-remove-widows: minor, to v4.2, optimal engine >=18.20.8
string-split-by-whitespace: minor, to v4.2, optimal engine >=18.20.8
string-strip-html: minor, to v13.6, optimal engine >=18.20.8
string-trim-spaces-only: minor, to v5.2, optimal engine >=18.20.8
string-uglify: minor, to v3.2, optimal engine >=18.20.8
string-unfancy: minor, to v6.2, optimal engine >=18.20.8
test-mixer: minor, to v4.3, optimal engine >=18.20.8
tsd-extract: minor, to v0.10, optimal engine >=18.20.8
util-array-object-or-both: minor, to v5.2, optimal engine >=18.20.8
util-nonempty: minor, to v5.2, optimal engine >=18.20.8
```
