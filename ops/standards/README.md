# Standards-derived package tests

This catalogue connects pinned official specifications, reviewed input cases,
and package-owned assertions. The first pilot covers `html-crush`, `email-comb`,
and `string-strip-html` using the same 36 HTML fragments.

It records coverage of 21 selected requirements, not complete HTML, CSS, browser,
or ECMAScript-engine conformance. The eight backlog areas in `requirements.json`
make unharvested work visible. A covered entry means its package test exists;
the package's unit command establishes whether that assertion passes.

## Automatic enforcement

The standards checks are part of the normal test pipeline:

- Root `npm test` runs `npm run verify`, which checks the shared catalogue.
- Each package's `test/standards-pilot.js` runs through its ordinary unit and
  coverage suites. The cumulative Node compatibility matrix also runs those
  tests against installed package artifacts on every supported Node lane.
- The shared repository-verification action checks the catalogue during
  preparation for pull requests, main pushes, and releases. This check runs
  outside Turbo caches. Package tests and local fixtures are existing cache
  inputs, so changing either invalidates the corresponding test results.
- Repository tooling tests protect the local and hosted catalogue wiring.

All 108 pilot case/library combinations have assertions in the normal package
suites, with no recorded known failures. Source refresh is explicit so routine
tests use reviewed, pinned specification content without network access.

## Focused commands

Run these from the repository root:

```sh
npm run standards:check
npm run standards:report
npm run unit --workspace=html-crush
npm run unit --workspace=email-comb
npm run unit --workspace=string-strip-html
```

Build affected packages before running their unit suites. Ordinary catalogue
checks work offline. They verify archived source and licence hashes, harvested
anchors, generated excerpts, fixture identity, requirement links, every
case/target disposition, and matching numbered tests with fixture references
and assertions. `npm run verify` includes this check outside Turbo caches.

To execute the unresolved cases against built packages:

```sh
npm run standards:known-failures
```

This command prints expected and actual results and exits nonzero for unresolved
failures. It also exits nonzero when a gap starts passing, because its expectation
must then be promoted into the package's normal suite and its disposition updated.
Store each unresolved expectation in the affected package's local
`test/fixtures/standards/known-failures.json`. These diagnostics do not count as
passing regression tests. The initial `email-comb/css-nesting` gap is now covered
by an ordinary package assertion that preserves both nested CSS and its HTML
classes.

## Sources and harvested material

`sources.json` pins eight official documents by retrieval date and SHA-256.
Their unchanged bytes are stored as compressed HTML under `upstream/`, alongside
source-specific licence notices. Read an archived document with `gzip -dc`.
The archived documents contain the complete definitions and examples, including
context omitted by extracts. Original copyrights and document notices apply.

`extracts.json` provides abridged definitions, examples, and grammar blocks for
28 selected anchors. Extraction normalizes prose whitespace, retains example
text content, and labels truncation. These are reading aids; an extracted
example is not automatically a correct package expectation. Source notices,
normative status, fragment context, and negative examples still matter.

The documents are WHATWG HTML syntax/parsing, CSS Syntax, Selectors, Custom
Properties, Nesting, and ECMA-262 lexical grammar/expressions. CSS draft status
is recorded explicitly. The JavaScript cases test source preservation inside
HTML; no harvested JavaScript is executed.

The package fixture inputs are original Codsen examples derived from those
requirements, rather than copied upstream test implementations. Their prose
requirements and output expectations are reviewed independently of current
library output. Keep imported examples, notices, and attribution with their
source; if future package fixtures copy upstream material, also follow the
repository's `lect.licence.extras` policy.

Reuse the existing [WHATWG entity snapshot](../../packages/all-named-html-entities/upstream/provenance.json)
when expanding entity coverage. Do not create another independent copy. Further
harvests can adapt [Web Platform Tests](https://web-platform-tests.org/),
[html5lib tokenizer tests](https://github.com/html5lib/html5lib-tests),
[Test262](https://github.com/tc39/test262), and
[Webref definitions](https://github.com/w3c/webref). The html5lib repository now
directs tree-construction work to WPT. These additional suites have not yet been
imported by this pilot.

## Add a requirement and test all targets

1. Add the requirement, source identity, and anchors. Describe the normative
   fact separately from a package's transformation policy. Record untouched
   feature families in the backlog.
2. Add an original or attributed input to `cases/pilot.json`, with a stable ID,
   requirement, classification, context, origin, and adaptation notes. Preserve
   significant whitespace, escapes, and code units inside input strings.
3. Add a coverage disposition for each target: `covered`, `known-failure`,
   `deferred`, or `not-applicable`. Every non-covered record needs a reason.
4. Run `npm run standards:project` to copy the exact inputs into each package's
   local fixture. This command also regenerates excerpts from pinned sources.
   It never changes package expectations. Its final audit can report missing
   tests until the next step is complete.
5. Add an ordinary numbered `test()` to each applicable `test/standards-pilot.js`.
   Start its description with the case ID and refer directly to `cases["id"]`
   inside a direct call to the target entrypoint. Import that entrypoint by name
   from the package's own built `dist/<package>.esm.js`; omit options or pass
   `{}` for the default-profile assertion. Use numbered `equal()` assertions and
   independently reviewed expected values. Imported loops that dynamically
   create test titles are not supported by this pilot. The mapping check is
   structural; the unit suite establishes actual execution and pass/fail.
6. Run the affected package suites and `npm run standards:check`. For runtime
   changes, use the existing cumulative Node, browser-artifact, coverage, and
   performance checks. Commit fixes one published package at a time.

The registry currently supports exactly one named profile, `default`, with empty
options. Tests can additionally assert other options, but those checks are not
counted as separately covered profiles. Adding profiles requires extending the
mapping checker to verify which options each referenced test actually exercises.

Package tests read only local JSON and built ESM artifacts. This preserves the
isolated-consumer Node test workflow and existing `test/**` Turbo inputs. Keep
raw JavaScript fixtures as data, because `uvu` discovers executable JS under
`test/`. Package tests and fixtures remain excluded from npm payloads.

## Refresh official sources

```sh
npm run standards:refresh
npm run standards:check
```

Refresh explicitly downloads the configured official URLs and licence notices,
validates all selected anchors before writing, and updates content pins and
excerpts. It does not modify case inputs or expected package behavior. Review
the source/excerpt diffs and document status, then decide which requirements and
cases change. A missing anchor fails the refresh instead of silently dropping
coverage. Unchanged content retains its original retrieval date.

Review upstream freshness monthly and before releases affecting these libraries.
Record the review in the normal task log, including a no-change review. Keep
old regression cases when upstream examples are removed or relocated unless a
reviewed semantic reason makes the case obsolete.

## Interpretation boundaries

- A no-throw result is robustness evidence, not semantic correctness.
- CSS snippets are embedded in style elements with explicit HTML usage; this
  adaptation is part of the case, not an assertion of full document validity.
- `stripHtml()` has deliberate text and entity-decoding policies. Its expected
  output is not simply browser `textContent` or HTML tokenizer output.
- `comb()` has deliberate comment-separator behavior and conservatively retains
  functional selectors and nested style-rule groups. Those product policies are
  not browser DOM equivalence.
- Input-language freshness and implementation-runtime floors are independent.
  Modern JS inside a string can be preserved by code running on Node 18 or
  Chromium 58 without executing that modern syntax.
- Timing is observational. Assert deterministic results and source ranges;
  do not compare naturally measured durations exactly.
