# Repository guidance

## Architecture principles

`.agents/ARCHITECTURE_PRINCIPLES.md` defines the repository's direction for
typed source, generated declarations, monorepo scale, distribution formats,
purity boundaries, and the JavaScript/TypeScript toolchain seam. Read it before
making architectural, build, packaging, declaration-generation, or test-pipeline
decisions. Treat the principles as constraints, and verify the current
implementation before describing it as compliant.

## Repository improvement backlog

When present, the local `secret-plans/20260814-codex.md` records audited
architectural, CI, release, testing, and package-quality improvements. Read it
when the task concerns this backlog or the user asks to continue the monorepo
review plan. Treat it as a backlog, not as authority to expand the current task.
Revalidate each finding against the current tree before implementation, and
update the item's status and evidence when work is completed.

When a user references an item by a `REV-*` identifier, search the files in
`secret-plans/` for that identifier before planning or making changes.

## Agent planning documents

Put new agent-authored reviews, investigations, and implementation plans in the
repository-root `secret-plans/` directory instead of using
`.agents/CODE_REVIEW_*.md`. Name Codex files `YYYYMMDD-codex.md`, for example
`secret-plans/20260814-codex.md`, and use the corresponding lowercase agent
name for other agents. When available, follow
`secret-plans/20260814-claude.md` as the style reference: use ordinary Markdown
with a descriptive title and natural sections. Do not use all-caps filenames;
the directory and document title already identify the file's purpose.

## Monorepo package kinds

The root workspace uses npm and Turbo. Most published packages live under
`packages/`, and the generated aggregate package lives under `data/`. Most
package-level boilerplate is maintained by `ops/lect`; do not assume that a file
inside a package is hand-maintained just because it is checked into Git.

`ops/package-kinds.json` declares every workspace's primary architectural kind.
The declaration is authoritative; files such as `rollup.config.js` and manifest
fields such as `bin` are validated outputs or capabilities, not classifiers.

| Kind | Build shape | Example |
| --- | --- | --- |
| TypeScript library | esbuild compiles TypeScript into JavaScript; Rollup with `rollup-plugin-dts` emits one self-contained `types/index.d.ts` | `string-strip-html` |
| CLI | Uses the CLI script preset; build, declaration, example, and performance scripts are normally no-ops | `csv-sort-cli` |
| Generated data | Compiles generated TypeScript sources with `tsc` and publishes after the other packages | `@codsen/data` |

When adding or changing a workspace:

- Declare its name exactly once in the appropriate sorted list in
  `ops/package-kinds.json`.
- From the repository root, run `npm run lect`. This projects kind-specific
  build profiles into `turbo.json` and generates the package boilerplate. If you
  run a targeted package's `lect` script instead, also run
  `npm run ci:generate:package-kind-config` from the root.
- Run `npm run ci:verify:package-kinds` to validate complete inventory parity,
  structural invariants, generated build profiles, coverage exemptions, and the
  generated-data release role.

Keep capabilities independent from the primary kind. `package.json#bin`
declares executable commands, while `package.json#exports.script` declares an
IIFE build. A future TypeScript library can therefore expose a CLI without
changing its build kind. `data/sources/programClassification.ts` is a separate
website taxonomy and does not define workspace architecture.

## Published type dependencies

- Keep an `@types/*` package in a workspace's production dependencies when the
  published `types/index.d.ts` still imports the corresponding public module.
- When a type package is needed only to compile source and Rollup has removed
  that reference from the self-contained declaration bundle, keep it in that
  workspace's `devDependencies` instead.
- Prove a move at the package boundary: pack the workspace, install it with
  `--omit=dev --ignore-scripts --engine-strict` in a clean consumer, and compile
  representative imports with strict TypeScript and `skipLibCheck: false`.
  Confirm that build-only typings are absent and any public declaration typings
  remain installed without the consumer adding them manually.

## Node runtime compatibility

Supporting older Node.js release lines than competing packages is a Codsen USP.
Treat a low, truthful runtime floor as a product feature rather than incidental
legacy support.

- Keep `package.json#engines.node` owned by each package manifest. `lect` must
  neither add, remove, default, normalise, nor otherwise manage it.
- Use the exact lowest patch release actually exercised in compatibility tests,
  such as `>=18.20.8`; do not broaden that evidence to a blanket `>=18`.
- Prefer retaining the existing low floor when changing code or dependencies.
  Audit the complete production dependency closure and use a compatible
  dependency release when that remains sound and maintainable. Do not raise the
  floor merely because the newest dependency major did so.
- If the current floor genuinely fails, test the repository's exact configured
  patch for the next even Node major, proceeding through 20, 22, 24, and 26 only
  as needed. The canonical patches live in
  `ops/helpers/nodeCompatibility.js`. Record the concrete blocker when raising
  a package floor.
- Run every package's unit suite on every configured even Node major at or above
  its declared floor. Runtime tests and engine-strict installation checks are
  complementary; one does not replace the other.
- Treat the runtime matrix as cumulative. A Node 18 package is tested on 18,
  20, 22, 24, and 26; a Node 22 package is tested on 22, 24, and 26. Iterate all
  configured even lanes, not only the distinct majors currently present in
  package manifests, because a repository with only Node 18 floors still needs
  forward-compatibility coverage.
- Build and pack once under the root-supported toolchain. In CI, fan the packed
  artifacts out to parallel exact-runtime workers. Locally, use `n which` or
  `n exec` with exact versions; do not repeatedly replace the global Node
  installation during one parent npm process.
- Keep the Windows portability lane targeted. Reuse the Linux-built packed
  artifacts, discover every workspace with a `bin` capability, include its
  complete internal runtime closure plus `codsen-glob`, and exercise nested
  paths and spaces. Do not turn this smoke into a second all-package runtime
  matrix; the cumulative exact-Node lanes remain the authority for package
  unit compatibility.
- Run package `unit` scripts for runtime compatibility. Package `test` and
  `devtest` also invoke coverage, builds, `lect`, examples, or lint tooling whose
  higher engine requirements are not evidence about the published runtime.
- Keep root-toolchain quality checks (generation, build, coverage, examples,
  lint, and perf) separate from the cumulative published-runtime matrix, even
  when a root `npm test` command orchestrates both.
- Keep coupled CLIs and their same-purpose libraries on the lowest floor that
  the complete pair and its runtime closure can support.
- Esbuild derives its target from the package's explicit engine declaration.
  A lower target is acceptable when tests pass; do not assume a newer target is
  inherently faster or better.

## Browser IIFE compatibility

Chromium 58 is the minimum runtime for every package that declares
`package.json#exports.script`. Treat this low, truthful floor as a distribution
contract.

- Keep the esbuild target, exact Chromium snapshot, archive hash, and IIFE
  global-name rule in `ops/helpers/browserCompatibility.js`. Do not duplicate or
  override the target in package code.
- Remember that esbuild lowers syntax but does not polyfill runtime APIs. Avoid
  APIs newer than the floor in the complete bundled dependency closure. When a
  newer native API materially improves behavior or performance, feature-detect
  it and retain an equivalent Chrome 58 fallback.
- Build all packages before running `npm run ci:verify:browser-iifes`. The
  verifier scans the emitted bundles, loads all of them in isolated legacy API
  realms, checks every documented global, and runs representative API smokes.
  Hosted CI repeats the gate in the exact SHA-verified Chromium 58 binary under
  Xvfb.
- If the floor must change, audit every `exports.script` package and its bundled
  production dependency closure. Update the central policy, architecture
  principle, local emulation, pinned browser job, and validation evidence in
  the same change.

## Progress and completion observability

Progress reporting and completion statistics are product features for
nontrivial libraries, especially when ESM or direct-browser consumers can send
large inputs through a long-running transformation.

- Preserve existing progress callbacks and their composition ranges. Do not
  remove them merely to make the core mathematically pure.
- Preserve best-effort elapsed-time fields such as
  `log.timeTakenInMilliseconds`. A clock read used only for completion feedback
  is an intentional exception to deterministic result objects.
- When adding or substantially redesigning a nontrivial library, provide
  progress feedback and completion statistics, or record a concrete reason why
  the workload cannot take perceptible time and does not benefit from them.
- Keep observability separate from semantics. Clock values and callback effects
  must not change the transformed result, ranges, or deterministic counters.
- Do not assert naturally measured durations exactly. Stub the clock when
  testing timing plumbing, and compare deterministic result fields separately
  when testing transformations.
- Keep progress and completion APIs equivalent across ESM and the
  direct-browser `*.umd.js` script. Any implementation must still satisfy the
  Chromium 58 runtime contract.

## Codsen website API contract

The sibling `codsen.com` project is a first-party consumer of published package
APIs. When its checkout is available, inspect
`../_____WEB-PROJ/codsen.com/v5/app/routes/**/play.tsx` and
`../_____WEB-PROJ/codsen.com/v5/public/web-workers/*.js` before removing,
renaming, or changing:

- package exports, browser filenames, browser globals, or callable entrypoints;
- option keys, defaults, result keys, types, units, or serialization;
- progress, completion-statistics, applicability, diagnostic, or customization
  callbacks; or
- metadata projected into `@codsen/data`, including declarations, defaults,
  examples, manifests, and versions.

The playground routes use installed ESM types and defaults, but their workers
load direct-browser bundles from CDN URLs without a version segment. Preserve
compatibility across both paths. Results sent from a worker must remain plain,
structured-cloneable, and meaningfully JSON-representable because the GUIs send
them through `postMessage()` and expose full-output panels.

Treat input-sensitive applicability reporting as a product capability. It lets
the GUI separate relevant controls from controls that cannot affect the current
input. Compute applicability independently from the user's current option
settings so the report answers whether toggling an option could change the
result.

If a contract change is intentional, prefer an additive migration and update
the package, generated data, website route, worker, and documentation together.
When the website checkout is available, run its typecheck and relevant
playground end-to-end tests. Its current smoke suite exercises representative
results but does not explicitly protect every progress, timing, applicability,
or raw-output field, so retain focused package-side contract tests too. If the
checkout is unavailable, treat the consumer impact as unknown rather than
assuming that no website dependency exists.

## Biome scope

`packages/*/tap` directories are DIY testbeds, not maintained source. They may
contain committed legacy fixtures such as old Vue.js distributions.

- `biome.json#files.includes` force-ignores every `packages/*/tap` directory.
  This exclusion applies globally to formatting, linting, import organisation,
  and scanner indexing.
- Do not run Biome directly on files inside these directories or replace the
  global exclusion with tool-specific formatter or linter exceptions.

## Performance is a product requirement

Runtime performance is one of the primary aims of publishing these open-source
programs. Users experience the program's speed even when they never read its
source, and competing packages can win adoption by being faster. Treat a
performance regression as a product regression, not as an acceptable price for
code that merely looks cleaner.

Prefer the fastest correct implementation, even when it uses an unconventional
algorithm, deliberate duplication, large branches, or a structure that appears
monstrous at first sight. Do not simplify, abstract, or replace proven fast code
solely to improve readability or conformity. At the same time, complexity must
earn its place through measurements on representative public-API workloads;
avoid speculative cleverness, bloat, and over-engineering.

Use normalised historical scores, not raw operations per second from one
computer, as performance evidence. In the same benchmark run, measure
`perf-ref` at rate `R` and the target at rate `T`. Let `C` be the canonical score
exported by `perf-ref` (`183` currently). The target's normalised score is
`T * C / R`. For example, if `R = 250` and `T = 300`, the normalised target score
is `219.6`. This reference ratio makes scores approximately comparable across
hardware, although ordinary benchmark noise still applies.

## Performance benchmarks

Read `.agents/PERFORMANCE.md` before creating, reviewing, changing, or
interpreting `packages/*/perf/check.js` benchmarks.

- `testme()` must exercise the package's current public API with valid,
  representative input. Check it against the source types, quick-take example,
  and tests; copied fixtures, stale arguments, guaranteed no-op paths, and
  cross-iteration mutable state make a benchmark misleading.
- Any change to the measured workload invalidates that package's complete
  history. If the called function, arguments, option values, input fixture,
  callback behaviour, setup placement, or repeated work changes, reset the
  same package's `perf/historical.json` to `{}` in the same change. Never
  compare scores from different workloads. Imports, comments, and formatting
  alone do not require a reset.
- Interpret only normalized scores produced through `perf-ref`; raw operations
  per second from different computers are not comparable.

## Unit-test title numbering

- Prefix every unit-test title with its sequential order number within the test
  file. Use at least two digits (`01`, `02`, and so on). When the title has a
  description, separate it from the number with exactly ` - `, for example
  `test("01 - the most basic", ...)`. When there is no description, use the
  number alone, for example `test("02", ...)`.
- Keep test numbers in ascending source order without gaps or duplicates. When
  adding, removing, or moving a test, renumber all affected tests so the file's
  sequence remains correct.
- Give every `equal()` assertion a numbered third argument. Combine the
  containing test number with the assertion's sequential number within that
  test, separated by a dot. For example, the first and second `equal()` calls in
  test `14` use `"14.01"` and `"14.02"`. Renumber affected assertion labels when
  adding, removing, or moving an `equal()` call.
- Use two-digit zero-padding by default. Switch the test-number component to
  three digits only when a package has a test suite large enough to require it;
  if so, use three digits consistently for every test in that package and in
  the test-number component of assertion labels (for example, `"014.01"`). Never
  use four-digit padding, and never use fewer than two digits.
- During every code review that includes test changes, check the test-title
  and assertion numbering and fix any stale or out-of-order numbers as part of
  the review. Use `packages/string-remove-widows/test/basic.js` as the canonical
  test-title example and `packages/string-uglify/test/test.js` (around test `14`)
  as an assertion-numbering example.

## Input-validation errors

- Begin every input-validation error message with the package name and function
  name, followed immediately by an ordered throw identifier, for example
  `string-strip-html/stripHtml(): [THROW_ID_01]`. Use the form
  `<package>/<function>(): [THROW_ID_XX]` consistently.
- Number throw identifiers in ascending source order, starting from `01`, without
  gaps or duplicates. When adding, removing, or moving a validation throw,
  renumber all affected identifiers and update the corresponding tests.

## Development-only source logging

Many files under `packages/*/src/*.ts` contain debug logging guarded by the
compile-time `DEV` global, commonly in the form `DEV && console.log(...)`.

- The Rollup-family `dev` script passes `--dev` to
  `ops/scripts/esbuild.js`. Esbuild replaces the source-level `DEV` global with
  `true`, keeps the logging for debugging, and leaves the development bundle
  unminified. The production `build` script omits the flag, replaces `DEV` with
  `false`, and ignores any ambient `DEV` environment variable. Minification then
  removes the unreachable logging branch and its `console.log` call. Keep this
  build-time guard instead of replacing it with a runtime environment check. An
  accompanying `declare let DEV: boolean` is an ambient TypeScript declaration
  and does not create a runtime variable.
- These logs deliberately make heavy use of ANSI colour escapes. Preserve that
  colouring, including its reset sequences, when moving or editing an existing
  log unless the task asks for a different output format.
- Every active debug message must include its current source line number. The
  number is a manually maintained navigation aid, not runtime metadata. For a
  multiline log, it must match the line that contains the number inside the
  message, rather than the earlier `DEV` or `console.log` line. For example, a
  message written on line 1037 starts with `1037`. Purely visual separator or
  banner logs need a label too; add it inside the existing output structure
  without removing the ANSI styling. Existing zero-padding below line 100 may
  be preserved, for example `083` on line 83.
- Perform the line-number audit after final formatting. If an edit adds or
  removes source lines, inspect every later active debug log in that file, not
  only logs near the edit, because every downstream label may have shifted.
  When adding a new debug log, include its line number from the start.
- Audit executable syntax rather than blindly replacing numeric text. Ignore
  commented-out log examples, but include active logs nested inside callbacks.
  Update only the navigation label: ANSI codes such as `90` and `39`, plus
  numbers in the diagnostic payload, are not line-number labels.

## Examples and Quick Takes

- Keep `examples/_quickTake.js` focused on one introductory scenario. Add each
  further option, integration, or substantially different usage scenario as a
  descriptively named file under `examples/` instead of appending it to the
  quick take.
- Keep at most one `assert.deepEqual()` call in each example file. When another
  deep-equality example is useful, create another example file for it.
- Examples may import other libraries when that makes realistic composition or
  the expected result clearer, provided those libraries are already available
  to the package's example runner.

## `lect` is the source of truth

`ops/lect/lect.js` runs from a package directory. It reads that package's
`package.json`, the root `package.json`, `ops/package-kinds.json`, and
`ops/lect/.lectrc.json`, resolves the declared kind, and runs its
file-maintenance plugins. The main sources of truth are:

- `ops/package-kinds.json`: each workspace's primary architectural kind.
- `ops/lect/.lectrc.json`: script presets, package keys, deletion list, and
  static hard-write configuration.
- `ops/lect/plugins/`: generation and normalisation logic.
- `ops/helpers/prepExampleFileStr.js`: conversion of
  `examples/_quickTake.js` into README code.
- `data/sources/esmBump.ts`: older-version guidance used in generated ESM
  notices.

Change these sources rather than making changes that the next `lect` run will
erase.

### Files and fields maintained by `lect`

- `README.md` is fully regenerated. It is assembled from the package name and
  description, package type, standard badges and links, optional playground and
  ESM notices, `examples/_quickTake.js`, and optional
  `package.json#lect.licence.extras`. Edit those inputs or
  `ops/lect/plugins/readme.js`, not the generated README.
- `package.json` is rewritten and sorted. For current packages, its whole
  `scripts` object is replaced from `scripts.cli` or `scripts.rollup` in
  `.lectrc.json`, based on the declared kind.
  Package-specific additions belong in `scripts_extras`.
  - A previous `perf` command containing `skip` is preserved.
  - `homepage` is normalised to `https://codsen.com/os/<package>`,
    `publishConfig` is hard-written, selected obsolete keys are deleted, the
    description's first letter is capitalised, and dev dependencies already
    present in the root are removed.
  - `c8` is generated from `ops/coverage-policy.json`, including package
    waivers. Edit that policy instead of a package's generated coverage fields.
  - Other package metadata is preserved, but direct edits to generated fields
    will not survive.
- `rollup.config.js` is fully overwritten with the standard declaration-only
  config for a declared TypeScript library. Every TypeScript library must expose
  `package.json#exports`; a missing config is created and does not need to exist
  before `lect` runs.
- `tsconfig.json` is rewritten for declared TypeScript libraries. The standard
  config extends `../../tsconfig.base.json`, uses `dist` as `outDir`, adds the
  standard include/exclude entries, and preserves the existing `include` array.
  It is deleted from declared CLIs. `@codsen/data` is not maintained by `lect`
  and keeps its own `data/tsconfig.json`. The CLI deletion explicitly preserves
  the behaviour that existed before package kinds were centralised.
- `.all-contributorsrc` is rewritten with standard project metadata. An existing
  contributors list is preserved when readable, and Roy's contributor record is
  normalised.
- The package `LICENSE` and the repository-root `LICENSE` are rewritten with the
  current year.
- Every path in `.lectrc.json#files.delete` is deleted if present. This includes
  `.npmignore`, legacy lint/build/CI configs, lock files, temporary stats, and
  other obsolete generated files. Check the current list before adding a
  package-local configuration file with a conventional name.
- `.lectrc.json#files.cleanup_only` lists ignored ephemeral artifacts such as
  `.DS_Store`. Write mode removes them opportunistically; read-only check mode
  does not treat their presence as stale generated state.
- `.lectrc.json#files.write_hard` can hard-write static files, but its current
  placeholder is empty, so it performs no writes.

### Code present but not active

- `ops/lect/plugins/npmIgnore.js` is not called by `lect.js`; meanwhile
  `.npmignore` is on the hard-delete list. Do not treat `.npmignore` generation
  as active.
- Do not document dormant plugins as current automation without first wiring
  them into the entry point.

## Running and validating the automation

- From one package, run `npm run lect` to regenerate that package.
- From the repository root, `npm run lect` regenerates the kind-derived Turbo
  profiles, then runs every workspace's `lect` task through Turbo. The task is
  uncached.
- Root `npm run generate` and `npm run fix` are the explicit mutation commands.
  Root `npm test`, `npm run unit`, `npm run lint`, and `npm run typecheck` are
  read-only verification commands. Package `pretest` scripts verify `lect`
  output before building; they do not regenerate package files.
- Prefer a targeted package run while changing the generator. Validate at least
  one representative CLI and TypeScript library when shared classification or
  templates change, then inspect the complete diff before accepting it.
- Do not hand-polish regenerated output. If the output is wrong across packages,
  fix the template or preset. If one package is a legitimate exception, encode
  that exception in `ops/lect` so the result is reproducible.
