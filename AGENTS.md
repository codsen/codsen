# Repository guidance

## Monorepo package families

Published packages live under `packages/`. The root workspace uses npm and Turbo.
Most package-level boilerplate is maintained by `ops/lect`; do not assume that a
file inside a package is hand-maintained just because it is checked into Git.

There are two main package families:

| Family | How `lect` recognises it | Build shape | Example |
| --- | --- | --- | --- |
| TypeScript library | `rollup.config.js` exists in the package | esbuild builds TS into JS; Rollup with `rollup-plugin-dts` builds `types/index.d.ts` so that type defs is one file and all type imports are baked-in | `string-strip-html` |
| CLI | No `rollup.config.js`; normally has `package.json#bin` pointing at `cli.js` | Uses the CLI script preset; build, declaration, example, and perf scripts are normally no-ops | `csv-sort-cli` |

These signals are implementation details, not just documentation:

- Among current packages, one without a Rollup config gets the CLI preset;
  otherwise, it gets the Rollup preset.
- `package.json#bin` only controls CLI-specific README text. It does not choose
  the CLI script preset. An otherwise unclassified package also receives the CLI
  scripts.
- `rollup.config.js` must already exist before `lect` runs for a new TypeScript
  library. `lect` uses the file as the type marker and does not create a missing
  marker from scratch.
- `ops/scripts/generate-info.js` also uses the presence of
  `rollup.config.js` to classify program packages. Keep both consumers in mind
  when changing classification.

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

## Biome scope

`packages/*/tap` directories are DIY testbeds, not maintained source. They may
contain committed legacy fixtures such as old Vue.js distributions.

- `biome.json#files.includes` force-ignores every `packages/*/tap` directory.
  This exclusion applies globally to formatting, linting, import organisation,
  and scanner indexing.
- Do not run Biome directly on files inside these directories or replace the
  global exclusion with tool-specific formatter or linter exceptions.

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

- The Rollup-family `dev` script sets the `DEV` environment variable before it
  runs `ops/scripts/esbuild.js`. Esbuild replaces the source-level `DEV` global
  with `true`, keeps the logging for debugging, and leaves the development
  bundle unminified. A production build replaces `DEV` with `false`; minification
  then removes the unreachable logging branch and its `console.log` call. Keep
  this build-time guard instead of replacing it with a runtime environment
  check. An accompanying `declare let DEV: boolean` is an ambient TypeScript
  declaration and does not create a runtime variable.
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

## `lect` is the source of truth

`ops/lect/lect.js` runs from a package directory. It reads that package's
`package.json`, the root `package.json`, and `ops/lect/.lectrc.json`, classifies
the package, and runs its file-maintenance plugins. The main sources of truth are:

- `ops/lect/.lectrc.json`: script presets, package keys, deletion list, and
  static hard-write configuration.
- `ops/lect/plugins/`: generation and normalisation logic.
- `ops/helpers/prepExampleFileStr.js`: conversion of
  `examples/_quickTake.js` into README code.
- `data/dist/sources/esmBump.js`: older-version guidance used in generated ESM
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
  `.lectrc.json`.
  Package-specific additions belong in `scripts_extras`.
  - A previous `perf` command containing `skip` is preserved.
  - `homepage` is normalised to `https://codsen.com/os/<package>`,
    `publishConfig` is hard-written, selected obsolete keys are deleted, the
    description's first letter is capitalised, and dev dependencies already
    present in the root are removed.
  - Other package metadata is preserved, but direct edits to generated fields
    will not survive.
- `rollup.config.js` is fully overwritten with the standard declaration-only
  config when the package was classified as Rollup and has
  `package.json#exports`. A Rollup package without `exports` keeps its existing
  config. A package without a Rollup config gets no config.
- `tsconfig.json` is rewritten for packages with a Rollup config. The standard
  config extends `../../tsconfig.base.json`, uses `dist` as `outDir`, adds the
  standard include/exclude entries, and preserves existing `include` and
  `references` arrays.
  - Current implementation checks `state.isCLI`, while the classifier defines
    `state.isBin`. Consequently, a package without `rollup.config.js` has its
    `tsconfig.json` deleted, including a CLI. Preserve this behaviour unless a
    task explicitly changes the generator.
- `.all-contributorsrc` is rewritten with standard project metadata. An existing
  contributors list is preserved when readable, and Roy's contributor record is
  normalised.
- The package `LICENSE` and the repository-root `LICENSE` are rewritten with the
  current year.
- Every path in `.lectrc.json#files.delete` is deleted if present. This includes
  `.npmignore`, legacy lint/build/CI configs, lock files, temporary stats, and
  other obsolete generated files. Check the current list before adding a
  package-local configuration file with a conventional name.
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
- From the repository root, `npm run lect` runs every workspace's `lect` task
  through Turbo. The task is uncached.
- Root `npm test` depends on `lect` and `build`; many package `pretest` scripts
  also run both. Generated-file changes can therefore appear during an ordinary
  test run.
- Prefer a targeted package run while changing the generator. Validate at least
  one representative CLI and Rollup library when shared classification or
  templates change, then inspect the complete diff before accepting it.
- Do not hand-polish regenerated output. If the output is wrong across packages,
  fix the template or preset. If one package is a legitimate exception, encode
  that exception in `ops/lect` so the result is reproducible.
