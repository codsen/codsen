# Monorepo improvement plan

This file is the durable backlog from the high-level monorepo review completed
on 2026-08-13. It turns the review into independently actionable work without
making every recommendation an immediate requirement.

## Review snapshot

- Status: Active
- Review date: 2026-08-13
- Baseline commit: `590d6c66c8`
- Baseline scope: 111 packages under `packages/` plus the `data` workspace
- Review method: Repository-wide configuration audit, quantitative inventory,
  and targeted package sampling
- Full Node compatibility matrix: Not run during this review
- Full performance suite: Not run during this review

The following checks passed against the reviewed working tree:

- `npm run check`
- `npm run lint:markdown`
- `npm run typecheck`
- `npm run ci:verify:node-compatibility`
- `node node_modules/uvu/bin.js ops/helpers/tests` — 21 tests passed
- Sample dry-run packs for `arrayiffy-if-string` and `string-strip-html`

The following failure was reproduced:

```text
$ node ops/scripts/npm-release.js assert-workspaces --expected 111
npm-release: Expected 111 workspaces, found 112
```

## How to use this plan

1. Choose the highest-priority pending item whose prerequisites are satisfied.
2. Revalidate its evidence against the current tree. Paths, line numbers,
   package counts, and implementation details can become stale.
3. Change the documented source of truth instead of generated output.
4. Run the item's validation together with the checks proportionate to its
   blast radius.
5. Update the item rather than deleting it:
   - Change `Status` to `In progress`, `Completed`, `Deferred`, or `Rejected`.
   - Record the completion date and commit or pull request when available.
   - Add validation results and any changed assumptions.
6. Move completed, deferred, or rejected items to the corresponding log near
   the end of this file during periodic cleanup.

Priorities have the following meanings:

- P0: The repository's normal CI or release path is blocked or unsafe.
- P1: User-visible correctness, published API, or required quality enforcement.
- P2: Material maintainability, reliability, or security improvement.
- P3: Useful hardening or dependency hygiene with lower immediate impact.

## Repository guardrails

- Preserve unrelated working-tree changes.
- Preserve the lowest truthful Node.js floor. Follow
  `.agents/skills/maintain-node-compatibility/SKILL.md` for engine,
  dependency-closure, build-target, or runtime-matrix changes.
- Keep root-toolchain checks separate from published-runtime compatibility
  checks.
- Change `ops/lect` sources instead of hand-editing generated package scripts,
  READMEs, Rollup configurations, or TypeScript configurations.
- Read `.agents/PERFORMANCE.md` before changing a benchmark. Reset the affected
  package's `perf/historical.json` to `{}` whenever its measured workload
  changes.
- Preserve test-title, assertion-label, throw-ID, and active debug-log line
  numbering rules from `AGENTS.md`.
- Use a disposable checkout or temporary directory for clean-checkout tests. Do
  not remove local build output or user files merely to reproduce a finding.

## Backlog summary

| ID | Priority | Status | Area | Outcome |
| --- | --- | --- | --- | --- |
| REV-001 | P0 | Completed | CI and release | Restore the workspace invariant |
| REV-002 | P0 | Completed | Bootstrap | Make a clean checkout self-bootstrapping |
| REV-003 | P1 | Completed | CI | Enforce package coverage in CI |
| REV-004 | P1 | Completed | Package correctness | Process minified responsive tables |
| REV-005 | P1 | Completed | CLI correctness | Overwrite the requested CSV path |
| REV-006 | P1 | Completed | Published types | Repair the remark plugin declarations |
| REV-007 | P1 | Completed | Generated data | Calculate dependency top tens correctly |
| REV-008 | P1 | Pending | Task graph | Make root quality and perf tasks hermetic |
| REV-009 | P2 | Completed | Coverage policy | Centralise thresholds and waivers |
| REV-010 | P2 | Completed | Package architecture | Centralise package classification |
| REV-011 | P2 | Completed | Repository tooling | Centralise workspace discovery |
| REV-012 | P2 | Completed | Generators | Make `lect` mutations reliable |
| REV-013 | P2 | Completed | Developer workflow | Separate mutation from verification |
| REV-014 | P2 | Pending | Release tooling | Modularise and test release-critical code |
| REV-015 | P2 | Pending | Error handling | Format arbitrary invalid inputs safely |
| REV-016 | P2 | Pending | Performance | Repair misleading benchmark workloads |
| REV-017 | P2 | Pending | Release safety | Retire or guard direct-publish scripts |
| REV-018 | P2 | Pending | Supply chain | Add dependency update and security checks |
| REV-019 | P3 | Completed | Reproducibility | Pin the root build runtime |
| REV-020 | P3 | Pending | Portability | Add targeted Windows smoke tests |
| REV-021 | P3 | Pending | Dependencies | Audit production `@types/*` edges |

## P0 — Restore normal CI and release operation

### REV-001 — Restore the workspace invariant

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Reproduced, fixed, and validated against the current 112
  workspaces and a disposable 111-workspace fixture
- Evidence:
  - `.github/workflows/ci.yml:54-55`
  - `.github/workflows/prepare_release.yml:60-61`
  - `.github/workflows/release.yml:44-45`
  - `ops/scripts/npm-release.js:32`
  - `ops/scripts/npm-release.js:466-482`
- Problem: The three workflows expected 111 workspaces, but npm and Lerna
  discovered 112: 111 packages plus `@codsen/data`. The assertion exited with
  status 1 before the workflows could build or test the repository.
- Recommended change:
  1. Update the immediate invariant to 112.
  2. Replace repeated literals with one source, or validate npm/Lerna parity
     without requiring a duplicated count in every workflow.
- Resolution:
  - The default invariant now lives once in `EXPECTED_WORKSPACE_COUNT`, set to
    112. The optional `--expected` override remains available for diagnostics.
  - CI, release preparation, and release all call the default assertion without
    embedding their own counts.
  - Existing npm/Lerna parity, manifest, unique-name, and `@codsen/data`
    placement checks remain in force.
- Done when:
  - CI, release preparation, and release use the same current invariant.
  - Adding or removing a workspace requires changing no more than one source.
  - The assertion still detects accidental workspace loss.
- Validation:
  - `node ops/scripts/npm-release.js assert-workspaces --expected 112`, if the
    explicit count remains part of the interface
  - `npm run lint:markdown`
  - GitHub Actions syntax validation
- Validation results:
  - The default assertion and the explicit 112 assertion both passed.
  - An explicit stale count failed with `Expected 111 workspaces, found 112`.
  - The default assertion against a disposable fixture with one package
    manifest withheld failed with `Expected 112 workspaces, found 111`,
    confirming that matched npm/Lerna workspace loss is still detected.
  - Biome passed for the modified release script, and all workflow YAML parsed
    successfully.
  - `actionlint` 1.7.12 passed for all three modified workflows.

### REV-002 — Make a clean checkout self-bootstrapping

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Reproduced, fixed, and validated in an exact-toolchain clean
  checkout
- Evidence:
  - `.gitignore:11-16` ignores all `dist/` output.
  - Before the fix, clean-checkout `lect` failed first on the missing
    `codsen-utils` bundle and then, after that package was built, on the missing
    `@codsen/data` bundle used for `esmBump`.
  - A clean full-package build also exposed an undeclared build-order edge in
    `html-table-patcher`: its IIFE follows the published
    `codsen-parser`/`codsen-tokenizer` closure back into workspace packages.
  - `ops/lect/plugins/pack.js` now uses native manifest filtering, and
    `ops/lect/plugins/readme.js` reads tracked `esmBump` source directly.
  - `package.json#ci:generate:info` owns the complete package build prerequisite,
    while `ops/scripts/generate-info.js` reads tracked classification source and
    rejects missing Rollup bundles or declarations before generation.
  - `packages/html-table-patcher/package.json` declares the four build-only
    workspace roots needed to make the hidden IIFE dependency closure visible
    to Turbo.
  - All three generation workflows build `@codsen/data` once, after regenerating
    its sources.
- Problem: A warm working tree contains ignored build output that can satisfy
  repository-tool imports. A fresh checkout has no tracked build output, while
  npm links those imports to unbuilt workspaces.
- Recommended change: Make bootstrap tooling source-self-contained. If that is
  not practical, encode and test an explicit private tooling build DAG before
  any generator imports workspace output.
- Resolution:
  - `lect` no longer imports any workspace build output during startup.
  - `generate-info` has an explicit full-package build prerequisite and a tested
    artifact preflight instead of silently producing incomplete sizes or
    exported defaults.
  - The package graph now orders `html-table-patcher` after the build-only
    workspace dependencies reached through its IIFE bundle.
  - Generated package and dependency metadata was refreshed so regeneration is
    clean from the new baseline.
- Done when:
  - A disposable, clean checkout succeeds with `npm ci` followed by the same
    generation and build order used in CI.
  - `lect` does not rely on stale local build output.
  - `generate-info` has explicit, reproducible prerequisites.
- Validation:
  - Run the CI sequence in a disposable checkout with no `dist/` directories.
  - Verify `git diff --exit-code` after regeneration.
  - Test at least one CLI package and one Rollup package through `lect`.
- Validation results:
  - Under the pinned Node 24.19.0 and npm 11.16.0, an archive-based clean
    checkout passed offline `npm ci` and started with no package or data
    `dist/` directories.
  - Targeted `lect` runs passed for CLI package `csv-sort-cli` and Rollup package
    `arrayiffy-if-string`; the full build-free `lect` run then passed all 112
    workspaces and left the checkout unchanged.
  - `ci:generate:info` passed a first-run, uncached 111-package build and
    generation. Changelog and root README generation, the subsequent data
    build, all 175 typecheck tasks, and `ci:verify:data` also passed.
  - Final `git diff --exit-code` and `git status --short --untracked-files=all`
    were empty in the clean checkout.
  - The artifact-helper unit tests passed 2/2. Biome, Markdown lint,
    `actionlint`, workflow YAML parsing, and `git diff --check` passed for the
    changed files.

## P1 — Fix correctness and quality enforcement

### REV-003 — Enforce package coverage in CI

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Confirmed, fixed, and validated against the current CI and
  package task definitions
- Evidence:
  - `package.json:43-45` defines `test:quality` and includes it in root `test`.
  - `ops/lect/.lectrc.json:196-213` makes Rollup `devtest` run c8, examples,
    and lint.
  - `.github/workflows/ci.yml:81-88` runs package examples and coverage under
    the root-supported toolchain.
  - `ops/scripts/audit-package-units.js:209-235` intentionally runs direct
    `unit` scripts without coverage.
- Problem: The Node compatibility matrix correctly avoids root-toolchain
  coverage, but CI never runs the separate coverage-bearing quality phase.
- Recommended change: Add `npm run test:quality`, or an equivalent dedicated
  coverage task, under the root-supported Node toolchain. Keep it separate from
  compatibility lanes.
- Resolution:
  - The CI validation job now runs `npm run test:quality` in a separately named
    coverage step after the root-toolchain build and example phases.
  - The cumulative Node compatibility job is unchanged and continues to run
    direct package `unit` scripts without root-toolchain coverage tooling.
- Done when:
  - A coverage regression fails CI.
  - Compatibility lanes continue to run direct unit suites only.
  - Coverage output is easy to identify independently of runtime failures.
- Validation:
  - `npm run test:quality`
  - A temporary local threshold violation produces a non-zero exit, then is
    reverted before commit.
- Validation results:
  - `npm run test:quality` passed all 112 workspace tasks uncached in 6m36s.
  - A command-line c8 override raised `arrayiffy-if-string`'s line threshold to
    101%. Its two tests passed at 100% coverage, after which c8 exited 1 with the
    expected threshold failure. Reports were written outside the repository,
    so no tracked threshold edit or reversion was required.
  - `actionlint` 1.7.12 passed all workflows, Ruby parsed every workflow and
    local action YAML file, and `git diff --check` passed for the CI workflow.
  - The compatibility verifier still invokes `npm run unit --silent`; its
    workflow command and matrix job were not changed.

### REV-004 — Process minified responsive tables

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Fixed and validated against compact and formatted fixtures
- Evidence:
  - `packages/rehype-responsive-tables/src/main.ts:84-103` requires a truthy
    visitor `index` before processing `tbody`.
  - `packages/rehype-responsive-tables/test/test.js:10-20` places whitespace
    before `tbody`, so its index is non-zero.
- Problem: When `tbody` is the first child at index 0, the plugin skips the
  table. The reviewed build left this input unchanged:

  ```html
  <table><tbody><tr><td>a</td><td>b</td></tr></tbody></table>
  ```

- Recommended change: Test whether `index` is a number rather than whether it
  is truthy. Add compact and formatted fixtures.
- Resolution:
  - The visitor now accepts every numeric child index, including zero.
  - A numbered regression test confirms that compact and formatted equivalents
    both produce the intended transformed structure.
- Done when:
  - Compact and formatted equivalents produce the same transformed structure.
  - Existing formatting-sensitive expectations remain intentional.
- Validation:
  - Package unit suite and coverage
  - Package examples
  - Package typecheck
- Validation results:
  - The regression test failed at `07.01` before the source fix because the
    compact table remained unchanged.
  - `npm run build && npm run devtest` passed: 25 unit tests, 100% line
    coverage, all six examples, Biome lint, and TypeScript typecheck.

### REV-005 — Overwrite the requested CSV path

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Reproduced, fixed, and validated against source and packed CLI
- Evidence:
  - `packages/csv-sort-cli/cli.js:254-283` writes
    `path.basename(requestedCSVsPath)` when overwrite mode is enabled.
  - The original tests did not exercise path-mode overwrite; overwrite coverage
    only confirmed that filter modes take precedence over the flag.
- Problem: `csv-sort-cli --overwrite path/to/file.csv` can create or replace
  `./file.csv` instead of replacing `path/to/file.csv`.
- Recommended change: In overwrite mode, write to the resolved requested path.
  Preserve the existing output naming policy for non-overwrite mode unless that
  behaviour is deliberately redesigned.
- Resolution:
  - Overwrite mode now writes to the resolved requested path; non-overwrite
    naming is unchanged.
  - Numbered, automatically cleaned-up tests cover a nested relative path and a
    mixed relative/absolute, same-basename multi-file invocation.
- Done when:
  - Relative nested and absolute overwrite targets replace the requested file.
  - No same-basename file is created in the process working directory.
  - Multiple-file behaviour remains deterministic.
- Validation:
  - Add numbered tests using isolated temporary directories.
  - Run the CLI unit suite and packed CLI smoke test.
  - Run the coupled `csv-sort` library suite.
- Validation results:
  - The two regression tests failed before the source fix because requested
    files stayed unchanged while their basename was written in the process
    working directory.
  - `npm run prettier && npm test` passed for `csv-sort-cli`: 15 unit tests,
    coverage collection, Biome formatting, and Biome lint.
  - `npm run build && npm run devtest` passed for `csv-sort`: 23 unit tests,
    100% line coverage, all five examples, Biome lint, and typecheck.
  - A disposable install of the packed CLI and its packed internal dependency
    closure successfully overwrote `nested/input.csv`; the working directory
    contained no same-basename output file. All disposable files were removed.

### REV-006 — Repair the remark plugin declarations

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Reproduced, fixed, and validated against packed declarations
- Evidence:
  - `packages/remark-conventional-commit-changelog-timeline/src/main.ts:38-42`
    wraps an already tuple-shaped parameter in another tuple.
  - Its generated `types/index.d.ts:15-16` exposes the same shape.
  - `packages/remark-typography/src/main.ts:2,9-12` uses a HAST root for a
    remark/MDAST plugin and declares an argument shape that rejects normal use.
  - Its generated `types/index.d.ts:1-5` publishes that declaration.
- Problem: Strict TypeScript consumers can be rejected for documented Unified
  calls such as `.use(plugin)` and `.use(plugin, options)`. JavaScript examples
  do not detect this failure.
- Recommended change:
  - Correct the Unified `Plugin` parameter tuples.
  - Use the appropriate MDAST root type for `remark-typography`.
  - Add consumer-style declaration compilation tests for calls with and
    without options.
- Resolution:
  - Both plugins now pass their option tuple directly to Unified's `Plugin`
    type. Timeline accepts optional partial options; typography accepts only an
    optional empty options object.
  - `remark-typography` now publishes an MDAST root and depends on
    `@types/mdast`; the lockfile records the same dependency.
  - Strict compile-only fixtures exercise positive `.use(...)` forms, reject
    invalid options, and explicitly assert the intended HAST/MDAST tree types.
- Done when:
  - Documented `.use(...)` forms compile under strict TypeScript.
  - Invalid option shapes still fail compilation.
  - Generated declarations contain the intended tree and parameter types.
- Validation:
  - Build and typecheck both packages.
  - Compile clean consumer fixtures against each packed tarball.
  - Run both packages' examples and unit suites.
- Validation results:
  - Pre-fix strict consumer fixtures rejected the documented calls with Unified
    overload errors; the corrected declarations compile them.
  - Both packed tarballs passed strict consumer compilation with
    `skipLibCheck: false`; disposable tarballs, consumers, and caches were
    removed.
  - Both `npm run devtest` suites passed: seven unit tests per package, 100%
    line coverage, four timeline examples, seven typography examples, Biome
    lint, and strict package/consumer typechecks.
  - Direct unit suites passed on exact Node 18.20.8 for both packages after
    keeping compile-only TypeScript fixtures outside uvu's runtime test scan.
  - `npm run ci:verify:node-compatibility` passed for all 112 workspaces across
    the cumulative Node 18, 20, 22, 24, and 26 policy lanes.

### REV-007 — Calculate dependency top tens correctly

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Reproduced, fixed, and independently recalculated
- Evidence:
  - `ops/scripts/generate-info.js:456-479` stops adding each category after ten
    distinct dependencies and sorts only that prefix.
  - At the review baseline, generated internal results omitted
    `string-left-right: 16` and `ranges-push: 12` while retaining dependencies
    used once or twice.
  - Generated external results omitted `p-reduce: 6` and
    `write-file-atomic: 4` while retaining one-use dependencies.
- Problem: `top10OwnDeps` and `top10ExternalDeps` describe insertion order, not
  the ten highest counts.
- Recommended change: Collect every dependency, sort descending by count with
  a deterministic name tie-breaker, and then take the first ten.
- Resolution:
  - A pure helper filters the complete dependency set, sorts by descending
    count with ascending dependency-name tie-breaking, then applies the limit.
  - The generator uses the helper for both internal and external rankings.
  - Focused tests cover candidates beyond the first ten, category filtering,
    and deterministic equal-count ordering.
  - Data verification now compares the generated `dependencyStats` source with
    the compiled `@codsen/data` export so stale rankings fail validation.
- Done when:
  - Generated top tens match a separately calculated full-set ranking.
  - Equal counts have deterministic ordering.
  - A focused unit test catches truncation before sorting.
- Validation:
  - Run the new focused test.
  - Regenerate repository data.
  - `npm run ci:verify:data`
  - Inspect the generated diff.
- Validation results:
  - The focused helper tests passed, and the complete helper suite passed 23
    tests.
  - Two `CI=1 node ./ops/scripts/generate-info.js` runs produced identical
    generated-file hashes while preserving the pre-existing `gitStats.ts`
    change.
  - The generated internal and external top tens exactly match two independent
    recalculations from all current package production dependencies.
  - Targeted Biome checks and `git diff --check` passed.
  - `@codsen/data` built successfully, and `npm run ci:verify:data` verified 111
    manifests, 102 declaration/example sets, and eight compiled generated-data
    exports including `dependencyStats`.

### REV-008 — Make root quality and performance tasks hermetic

- Status: Pending
- Evidence status: Confirmed from the task graph
- Evidence:
  - `turbo.json:74-77` gives `devtest` no build dependency.
  - `turbo.json:90-93` gives `perf` no build dependency.
  - Package tests, examples, and benchmarks commonly import `dist` directly.
- Problem: Root command ordering and warm build output mask missing task
  dependencies. Standalone `npm run test:quality` or `npm run perf` is not
  guaranteed to work on a clean tree.
- Recommended change: Encode build prerequisites in Turbo rather than relying
  on callers to run commands in the correct order.
- Done when:
  - Each public root task works independently in a disposable clean checkout.
  - Turbo invalidates tasks when relevant build inputs change.
  - No task rebuilds packages unnecessarily within a single run.
- Validation:
  - Clean-checkout `npm run test:quality`
  - Clean-checkout `npm run perf`
  - Inspect `turbo run ... --dry` or the task graph for expected dependencies.

## P2 — Improve consistency and maintainability

### REV-009 — Centralise coverage thresholds and waivers

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Revalidated, centralised, generated, and enforced
- Evidence:
  - All nine CLI-family packages set `check-coverage` to `false`.
  - Of 102 Rollup-family packages, 26 gate branches, functions, statements, and
    lines; 72 gate lines only; three use a zero line threshold; and one uses
    95% lines.
- Problem: Coverage policy is distributed across 111 manifests without a
  repository check that distinguishes deliberate waivers from drift.
- Recommended change: Define the minimum policy and an explicit, reviewed
  waiver mechanism. Add a verifier that reports packages below the policy.
- Resolution:
  - `ops/coverage-policy.json` now defines the common 100% line floor, the 26
    packages retaining 100% four-metric enforcement, family-specific source
    discovery, reporting overrides, and every documented waiver.
  - `lect` generates each of the 111 package manifests' `c8` configuration from
    that policy using the same Rollup-file family signal as its script presets.
    The verifier rejects manifest drift, unknown or unclassified packages,
    vacuous source discovery, disabled or zero enforcement, unsafe overrides,
    and undocumented workspaces or threshold reductions.
  - All Rollup packages now include their built ESM entry under `all` discovery.
    The three former zero thresholds pass the 100% line default; `detergent`
    has the sole Rollup waiver at 97% for its measured 97.61% bundle coverage.
  - All nine CLI-family packages now enable checks and `all` discovery. Eight
    established subprocess suites have measured integer line floors from 76%
    to 97%, each with a reason and removal follow-up. `codsen` replaces its
    placeholder with default, version, and help subprocess tests and reaches
    100% across all four metrics.
  - The generated `@codsen/data` workspace is explicitly documented outside
    package coverage because `ci:verify:data` validates its generated exports;
    the exemption requires removal if hand-authored runtime behaviour appears.
  - CI and the root `house` command run the policy verifier, so a new workspace
    must receive generated defaults or be explicitly reviewed.
- Done when:
  - Every exception has a documented reason and intended follow-up.
  - New packages receive the default policy automatically or fail validation.
  - CLI behaviour is covered through an appropriate subprocess strategy rather
    than silently exempted.
- Validation:
  - Run the policy verifier across all workspaces.
  - Run the CI coverage phase from REV-003.
- Validation results:
  - `npm run ci:verify:coverage-policy` passed for all 112 workspaces: 111
    covered packages, nine subprocess CLIs, 26 full-coverage packages, nine
    threshold waivers, and one generated-data workspace exemption.
  - The coverage-policy helper suite passed all 11 focused tests; the complete
    `ops/helpers` suite passed 34 tests.
  - A full `npm run lect` completed across all 112 workspaces and produced
    policy-matching coverage fields for every package manifest.
  - `npm run test:quality` passed all 112 workspace tasks with zero Turbo cache
    hits, exercising every new threshold and source-discovery rule.
  - Targeted Biome checks and `git diff --check` passed.

### REV-010 — Centralise package classification

- Status: Completed
- Completion date: 2026-08-13
- Evidence status: Implemented and validated
- Evidence:
  - `ops/package-kinds.json` declares the complete, sorted workspace partition:
    102 TypeScript libraries, nine CLIs, and one generated-data workspace.
  - `ops/helpers/packageKinds.js` validates the registry, fails closed on
    unknown names, and projects all three build profiles into `turbo.json`.
  - `lect`, generated-data collection and verification, coverage policy,
    package-build preflight, and unit inventory consume the same resolver.
  - `package.json`, CI, prepare-release, and release workflows verify the
    committed registry and generated Turbo profiles before build orchestration.
  - `bin`, `exports.script`, and the website's
    `programClassification.ts` remain separate capability or presentation
    signals rather than alternate architectural classifiers.
- Problem: File presence acts as schema, and consumers can disagree as the
  package set evolves.
- Recommended change: Define one explicit, tested package-kind model and make
  generators, data collection, and task configuration consume it. Preserve
  current behaviour unless a migration explicitly changes it.
- Done when:
  - Adding a library or CLI requires declaring its kind once.
  - `lect`, generated data, and build tasks agree on every workspace.
  - The `isCLI`/`isBin` behaviour is either deliberately preserved and tested
    or deliberately corrected with migration coverage.
- Validation:
  - Classification inventory test for all workspaces
  - Targeted `lect` runs for a CLI and TypeScript library
  - Generated-data verification and full diff inspection
- Validation results:
  - `npm run ci:verify:package-kinds` passed the exact 112-workspace inventory
    and the 102/9/1 kind partition, including structure, build profiles,
    coverage exemption, and generated-data release invariants.
  - The package-kind helper suite passed 10 focused tests covering malformed,
    missing, duplicate, and stale inventory; fail-closed lookup; isolated Turbo
    projections; and preservation of custom tasks.
  - Targeted `lect` runs passed for `csv-sort-cli` and
    `arrayiffy-if-string`. A seeded CLI `tsconfig.json` was deleted, preserving
    the established policy, and a declared library bootstrapped a missing
    `rollup.config.js` without using that file as its classifier.
  - Turbo dry runs resolved the declared CLI with no build outputs, the library
    with `dist/**` and `types/**`, and `@codsen/data` with `dist/**` plus its
    actual TypeScript inputs.
  - The complete 55-test helper suite, full 112-workspace `lect`, all 111
    package builds, data regeneration and compilation, `ci:verify:data`,
    coverage and Node-policy verifiers, Biome, maintained Markdown lint, and
    `git diff --check` passed.

### REV-011 — Centralise workspace discovery

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Revalidated, centralised, and tested across every consumer
- Evidence:
  - `ops/helpers/nodeCompatibility.js:22-85`
  - `ops/scripts/package-node-compatibility.js`, starting near its workspace
    discovery helpers
  - `ops/scripts/audit-package-units.js:119-161`
  - `ops/scripts/npm-release.js:340-463`
- Problem: Multiple implementations expand workspace patterns, read manifests,
  and validate identities with different safety and parity checks.
- Recommended change: Extract one pure, tested workspace inventory module.
  Keep command-specific policy layered on top of that inventory.
- Resolution:
  - `ops/helpers/workspaceInventory.js` owns pure pattern, parity, and manifest
    identity validation. `workspaceInventoryFile.js` is the filesystem adapter
    that reads npm and Lerna inputs and returns one sorted POSIX-path inventory.
  - Release planning, package compatibility, unit inventory, Node policy,
    coverage policy, package-kind verification, and local compatibility now
    consume the same inventory. Release-only SemVer and `@codsen/data` placement
    checks remain layered in the release command.
  - Unsafe or unsupported patterns, malformed lists and manifests, duplicate or
    blank package names, and npm/Lerna disagreement fail consistently.
- Done when:
  - All repository tools return the same ordered workspace set.
  - Unsupported patterns, duplicates, missing names, and npm/Lerna disagreement
    have focused tests.
  - REV-001 no longer needs repeated workflow literals.
- Validation:
  - Unit tests for inventory edge cases
  - Node-policy verification
  - Release plan and package compatibility dry runs
- Validation results:
  - Nine focused tests cover both npm workspace forms, deterministic glob
    expansion and deduplication, unsafe and unsupported patterns, malformed npm
    and Lerna lists, duplicate and blank names, npm/Lerna disagreement,
    malformed JSON, and the current repository inventory.
  - The complete helper suite passed 64 tests. Node compatibility, package-kind,
    and coverage-policy verification agreed on all 112 workspaces.
  - `assert-workspaces` passed. A three-workspace unit inventory dry run found a
    library, CLI, and generated-data workspace, and the package compatibility
    CLI loaded successfully.
  - A release plan and summary generated successfully from a historical base,
    selecting `codsen-glob` in one layer while reporting 112 workspaces.
  - Targeted Biome checks and `git diff --check` passed.

### REV-012 — Make `lect` mutations reliable

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Reproduced, fixed, and exercised through failure fixtures
- Evidence:
  - `ops/lect/lect.js:75-97` starts independent mutations concurrently and
    exits on rejection.
  - `ops/lect/lect.js:99-103` makes every package task write the root licence.
  - `ops/lect/plugins/hardDelete.js` does not distinguish missing paths from
    other deletion failures.
  - `ops/lect/plugins/tsconfig.js` contains deletion work that is not reliably
    awaited.
- Problem: Partial generation and swallowed filesystem failures can leave the
  tree in an ambiguous state. Concurrent package tasks also write the same
  root-owned file.
- Recommended change:
  - Sequence dependent phases and await every mutation.
  - Propagate errors other than expected missing-path cases.
  - Generate root-owned files once from the root.
  - Add failure-path tests using temporary package fixtures.
- Resolution:
  - `runLect.js` now owns an importable, ordered pipeline. Each phase completes
    before the next starts, and the CLI sets a non-zero exit code only after the
    failure has propagated to its single top-level boundary.
  - File deletion and `tsconfig.json` deletion ignore only `ENOENT`. Invalid
    TypeScript configuration, malformed quick-take examples, malformed
    contributor data, and other filesystem failures now stop generation.
  - Package normalization completes before downstream files render, so a
    capitalized description appears consistently in `package.json` and README
    output after one pass.
  - Package runs write only their package licence. Root `npm run lect` invokes a
    dedicated root generator once before Turbo starts package generation.
  - Plugins resolve their targets from the explicit package root, which makes
    temporary-fixture testing independent of process-wide directory changes.
- Done when:
  - A failed plugin produces a non-zero exit without unobserved background work.
  - Non-`ENOENT` deletion errors are reported.
  - Concurrent package generation does not race on root files.
- Validation:
  - Focused temporary-fixture tests
  - Targeted CLI and Rollup `lect` runs
  - Repository-wide regeneration followed by a clean diff check
- Validation results:
  - Ten focused tests cover missing versus non-missing deletion failures,
    awaited CLI deletion, invalid library configuration preservation, malformed
    hard-write and contributor inputs, ordered phase failure, malformed quick
    takes, one-pass package/README consistency, CLI exit status, and root file
    ownership.
  - The complete helper suite passed 74 tests. Targeted `lect` runs passed for
    `arrayiffy-if-string` and `csv-sort-cli`.
  - Two consecutive full `npm run lect` runs completed all 112 workspaces. The
    tracked diff hash was identical before and after the second run, and no
    generated package files changed.
  - Package-kind verification, targeted Biome, Markdown lint, and
    `git diff --check` passed.

### REV-013 — Separate mutation from verification

- Status: Completed
- Completed: 2026-08-14
- Evidence status: Reproduced, expanded, fixed, and validated across the full
  repository
- Evidence:
  - The original root `test` and `unit` scripts invoked `house` and `lect`, and
    `test` also ran the history-writing performance recorder.
  - The generated library `dts` script ran package-wide formatting, so builds
    used by unit and typecheck could rewrite maintained source files.
  - `ops/scripts/generate-info.js` regenerated Git-derived statistics locally
    by default even though release preparation was their intended owner.
  - The generator audit also found callback writes, unsorted inventories, and
    no general exact-byte freshness check outside mutate-then-diff CI steps.
- Problem: Routine test commands rewrite files. Failures can leave unrelated
  diffs, and test outcomes can depend on repository history or formatting.
- Recommended change: Provide explicit mutation commands such as `generate`
  and `fix`, plus read-only verification commands that generate into temporary
  locations or compare deterministic output.
- Resolution:
  - Added a shared exact-byte generated-file write/check abstraction. Check
    mode reports the stale path and its fix command without changing bytes,
    timestamps, or required absence.
  - Check mode exempts an explicit set of ignored, cleanup-only artifacts such
    as `.DS_Store`, while write mode still removes them. Obsolete
    tracked-capable configuration remains enforced as required absence.
  - `lect`, package metadata, root licence, generated info, changelogs, and the
    root README now have deterministic check modes. JSON projections are
    formatted in memory before either comparison or atomic write.
    Changelog verification includes the generated-data workspace while the
    website projection intentionally remains the 111-package map.
  - `lect` now renders the canonical normalised manifest before dependent
    output, runs mutation phases in order, and keeps every asynchronous write
    observable. Package scripts expose `lect:check`; package pretests use it.
  - Library builds format only the ignored generated declaration instead of
    the whole package. Root `unit`, `lint`, `typecheck`, and `test` now call
    read-only verification paths. Performance history recording remains an
    explicit command outside `test`.
  - Root `generate` and `fix` own mutation. The compatible `house` alias points
    to `fix`. Git statistics are unchanged by default and are updated only by
    explicit `generate-info --git-stats` release preparation.
  - CI and release verification use check mode; prepare-release retains
    explicit generation after versioning.
- Done when:
  - `test`, `unit`, `lint`, and typecheck verification leave a clean tracked
    tree when started from one.
  - A stale generated file still fails verification with an actionable diff.
  - Developer fix commands remain convenient and documented.
- Validation:
  - Record `git status`, run each verification command, and confirm no new diff.
  - Deliberately stale one generated fixture in a temporary checkout and verify
    detection.
- Validation results:
  - The generated-file suite passed 7 tests and the `lect` reliability suite
    passed 12 tests, including missing, stale, forbidden, cleanup-only,
    unchanged-timestamp, one-pass canonicalisation, failure-ordering, and
    write-then-check cases. The complete ops helper suite passed all 83 tests.
  - Full write and check passes completed all 112 workspaces. Info, changelog,
    root README, package-kind, coverage, Node-policy, and generated-data checks
    passed; default info generation preserved the exact `gitStats.ts` hash.
  - Full `unit` (224 Turbo tasks plus helper tests), `typecheck` (175 tasks),
    lint, Markdown lint, and the 112-workspace quality suite passed.
  - The canonical packed-artifact compatibility harness passed all 112
    packages cumulatively on exact Node 18.20.8, 20.19.4, 22.21.1, 24.19.0,
    and 26.7.0 lanes.
  - A review retry encountered ignored `.DS_Store` files and exposed a conflict
    between cleanup and read-only verification. The restarted review made that
    exemption explicit, retained strict checks for obsolete tracked-capable
    files, and confirmed a subsequent 112-workspace pack did not recreate them.
  - The tracked diff hash stayed identical across generation, unit, typecheck,
    lint, compatibility, and quality runs. No declaration or performance
    history diff appeared. Biome, workflow YAML parsing, Markdown lint, and
    `git diff --check` passed; `actionlint` was not installed locally.

### REV-014 — Modularise and test release-critical code

- Status: Pending
- Evidence status: Confirmed from code structure
- Evidence:
  - `ops/scripts/npm-release.js` is approximately 2,178 lines and owns argument
    parsing, workspace validation, planning, payload traversal, packing,
    publication, verification, and tagging.
  - `ops/scripts/package-node-compatibility.js` is approximately 1,261 lines.
  - Existing `ops/helpers/tests` focus on helper modules rather than complete
    release and archive flows.
- Problem: Many release invariants live in large scripts whose pure logic and
  failure paths are difficult to exercise independently.
- Recommended change: Extract pure modules for release planning, payload and
  archive validation, registry state, tagging, and compatibility manifests.
  Add temporary-repository integration tests around command boundaries.
- Done when:
  - Critical invariants have focused unit tests.
  - Pack and plan commands have offline integration fixtures.
  - Network-facing publish tests use controlled fakes and cannot publish.
  - CLI behaviour and output remain compatible unless deliberately changed.
- Validation:
  - Ops unit and integration suites
  - Release plan, summary, and pack against temporary fixtures
  - Existing CI and release workflow linting

### REV-015 — Format arbitrary invalid inputs safely

- Status: Pending
- Evidence status: Reproduced for representative inputs
- Evidence:
  - At the review baseline, 163 throws across 52 source files interpolated a
    direct `JSON.stringify(...)` call into an error message.
  - `packages/extract-search-index/src/main.ts:9-16` is one representative
    example.
  - Calling that package with BigInt or a circular object produced native
    serialization `TypeError`s instead of its `THROW_ID_01` error.
- Problem: Validation itself can fail while describing the invalid input. This
  bypasses the stable package/function/throw-ID contract.
- Recommended change: Add one small safe diagnostic formatter that handles
  BigInt, circular references, symbols, functions, and values with throwing
  accessors. Adopt it incrementally in validation paths.
- Done when:
  - Representative hostile values preserve the intended error class, prefix,
    and throw ID.
  - Diagnostic formatting never mutates input.
  - Output is bounded so very large inputs do not create excessive messages.
- Validation:
  - Focused formatter tests
  - Numbered validation tests for representative packages
  - Throw-ID sequence audit after each affected edit

### REV-016 — Repair misleading benchmark workloads

- Status: Pending
- Evidence status: Confirmed against tests and benchmark policy
- Evidence:
  - `packages/ast-compare/perf/check.js:9-16` benchmarks a fixture asserted to
    return `false` in `packages/ast-compare/test/arrays.js:505-519`.
  - `packages/string-process-comma-separated/perf/check.js:9-28` gathers
    callback output but returns nothing, which weakens one-shot verification.
  - `.agents/PERFORMANCE.md` requires representative success paths and exposed
    results when practical.
- Problem: At least one history measures a known mismatch path, and another
  workload conceals the callback work that proves meaningful execution.
- Recommended change: Audit the affected public contracts, choose meaningful
  deterministic workloads, and expose results without adding unrelated work.
- Done when:
  - Each changed `testme()` has a one-shot assertion showing meaningful work.
  - Mutable state is local to each iteration.
  - Every workload change resets that package's full history to `{}`.
- Validation:
  - Follow `.agents/PERFORMANCE.md`.
  - Run one-shot workload checks before the benchmark runner.
  - Run targeted perf checks only after resetting invalid histories.

### REV-017 — Retire or guard direct-publish scripts

- Status: Pending
- Evidence status: Confirmed from generated scripts
- Evidence:
  - `ops/lect/.lectrc.json:177-203` generates
    `letspublish: npm publish --provenance` for both package families.
  - `data/package.json:27-35` exposes a separate direct publish alias.
  - The primary workflow uses planned, immutable, verified artifacts through
    `ops/scripts/npm-release.js`.
- Problem: Convenience scripts bypass release planning, dependency ordering,
  controlled staging, artifact checksums, registry verification, and the
  production environment approval.
- Recommended change: Remove the alternative scripts or make them exit with
  instructions to use the release workflow. Document any intentional emergency
  path separately with equivalent safeguards.
- Done when:
  - Normal package scripts cannot bypass the hardened release path.
  - The release documentation names one supported production procedure.
  - An emergency procedure, if retained, has explicit approval and verification
    requirements.
- Validation:
  - Regenerate representative package manifests through `lect`.
  - Inspect the release plan and pack path.
  - Verify no generated script calls bare `npm publish` for production use.

### REV-018 — Add dependency update and security checks

- Status: Pending
- Evidence status: Confirmed absence at the review baseline; no network audit run
- Evidence:
  - CI installs with `npm ci` but has no separate dependency review, OSV, or
    production-closure audit step.
  - No Dependabot or Renovate configuration was found.
  - Compatibility verification appropriately disables npm audit inside its
    isolated runtime work.
- Problem: Lock integrity is present, but the repository has no automated path
  for surfacing new advisories or dependency updates.
- Recommended change:
  - Add scheduled and pull-request dependency update automation.
  - Add a production-closure security check with a documented severity and
    waiver policy.
  - Let the exact Node compatibility matrix reject updates that raise supported
    runtime floors.
- Done when:
  - Dependency advisories have an owned, visible workflow.
  - Waivers are time-bounded and explain impact.
  - Automation never raises package Node floors as a side effect.
- Validation:
  - Validate updater configuration.
  - Exercise the security job with a controlled fixture where practical.
  - Run the full compatibility policy and packed consumer checks for runtime
    dependency updates.

## P3 — Add reproducibility and portability hardening

### REV-019 — Pin the root build runtime

- Status: Completed
- Completed: 2026-08-13
- Evidence status: Revalidated, fixed, and tested with the exact root toolchain
- Evidence:
  - `.node-version` selects Node 24.19.0 for root builds.
  - Root `package.json` selects npm 11.16.0 and declares matching minimum Node
    and npm versions. The lockfile mirrors those minimums.
  - `.github/actions/setup-node/action.yml` installs both selected versions,
    then reports and verifies the running toolchain.
  - `ops/helpers/rootToolchain.js` validates the selectors, root engine floors,
    lockfile declarations, and running versions without coupling this policy to
    published package compatibility.
  - `ops/scripts/npm-release.js pack --reference` compares independently
    packed release manifests and every tarball hash, excluding only the
    generated manifest timestamp.
- Problem: Separate CI or release reruns can build publishable artifacts under
  different Node 24 patch releases.
- Recommended change: Pin the root CI and release build patch, and centralise
  the root Node/npm version declarations as far as the tooling permits. Keep
  this policy separate from published package engine floors.
- Resolution:
  - The root toolchain now selects exact Node 24.19.0 and npm 11.16.0 versions.
    The verifier rejects floating selectors, declaration drift, and different
    running patches within the same major.
  - CI validation, release preparation, release packing, release tests,
    publishing, and tagging use the same composite setup action. Publishing and
    tagging disable npm caching because those jobs don't install dependencies
    and hold elevated permissions.
  - The Node selector participates in Turbo build hashes, so a toolchain update
    invalidates cached build artifacts.
  - Release packing now forces a second package and data build, packs into a
    separate directory, and requires the second controlled manifest and all
    tarball hashes to match the first pack.
  - The cumulative Node 18, 20, 22, 24, and 26 package compatibility matrix is
    unchanged. All 112 published workspaces retain `>=18.20.8`.
- Done when:
  - Validation and release builds use the same exact root runtime.
  - Version drift is detected automatically.
  - Published packages retain their independently tested engine declarations.
- Validation:
  - Workflow linting
  - Root toolchain version report in CI
  - Build and pack reproducibility check
- Validation results:
  - The root verifier passed under exact Node 24.19.0 and npm 11.16.0. It and
    the local compatibility orchestrator both rejected the ambient npm 11.17.0
    patch.
  - All 43 helper tests passed, including exact-selector, declaration-drift,
    runtime-patch-drift, timestamp-exclusion, and tarball-hash-drift cases.
  - `actionlint` 1.7.12 passed all workflows. Ruby parsed every workflow and
    local action YAML file. The repository-wide Biome check covered 2,038
    files, and the maintained Markdown lint passed.
  - The exact root toolchain built all 112 workspaces successfully with no
    cache hits. Type checking completed all 171 tasks, and the dry-run pack
    validated all 112 workspaces and 785 entries.
  - A representative controlled package was packed, forcibly rebuilt, and
    packed again. Both tarballs were byte-identical with SHA-256
    `a60a4b1597024f9d0a08b293b7f091c1c7e7da25173480edc172c67a8fdf9759`.
  - `npm run ci:verify:node-compatibility` passed for all 112 workspaces across
    the cumulative Node 18, 20, 22, 24, and 26 policy lanes.

### REV-020 — Add targeted Windows smoke tests

- Status: Pending
- Evidence status: Confirmed Linux-only CI at the review baseline
- Evidence:
  - Main validation and all Node compatibility jobs use `ubuntu-latest`.
  - The monorepo contains nine CLI workspaces plus filesystem and glob logic.
- Problem: Linux-only validation does not exercise Windows paths, npm command
  shims, quoting, or glob behaviour.
- Recommended change: Add a small Windows job for the nine CLIs and
  `codsen-glob`. Keep the full 112-package by five-runtime matrix on Linux unless
  evidence justifies expanding it.
- Done when:
  - Packed CLIs start and perform one meaningful operation on Windows.
  - Nested paths and spaces in paths are covered.
  - `codsen-glob` has representative Windows separator tests.
- Validation:
  - Targeted `windows-latest` workflow
  - Existing Linux compatibility matrix

### REV-021 — Audit production `@types/*` edges

- Status: Pending
- Evidence status: Candidate list only; each move requires consumer validation
- Evidence:
  - Some production manifests include declaration-only packages such as
    `@types/lodash-es` even though Rollup bundles package declarations into one
    `types/index.d.ts` file.
  - Examples include `string-strip-html` and `json-comb-core`.
  - Public declarations that directly import a type package, such as HAST types,
    still require a consumer-visible dependency.
- Problem: Build-only type packages can unnecessarily enlarge production
  dependency closures, but moving a publicly referenced type package would
  break consumers.
- Recommended change: Inspect generated declarations and packed consumer
  compilation package by package. Move only proven build-only type dependencies
  to development dependencies.
- Done when:
  - Every moved package passes a clean packed-consumer typecheck.
  - Publicly referenced type packages remain consumer-visible.
  - Exact Node floor and lockfile checks still pass.
- Validation:
  - Build and pack each candidate package.
  - Install it into a clean engine-strict consumer.
  - Compile representative imports under strict TypeScript.
  - Run `npm run ci:verify:node-compatibility`.

## Completed work

Move completed items here without removing their original validation evidence.
Record the completion date and commit or pull request.

None yet.

## Deferred work

Move deferred items here with the reason, reconsideration trigger, and date.

None yet.

## Rejected recommendations

Move rejected items here with the decision rationale and date. Keeping rejected
items prevents the same recommendation from resurfacing without new evidence.

None yet.
