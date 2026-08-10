---
name: maintain-node-compatibility
description: Audit, lower, test, and preserve Codsen package Node.js engine floors. Use when changing package engines, runtime dependencies, esbuild targets, Node compatibility CI, CLI/library support, or investigating whether a package can support an older Node release.
---

# Maintain Node Compatibility

Preserve Codsen's unusually broad Node support as a product advantage. Seek the
lowest truthful and maintainable floor; never equate a dependency's newest major
with best practice automatically.

## Workflow

1. Record the working tree and active `node`/`npm` versions. Preserve unrelated
   changes and avoid concurrent global Node switches.
2. Start with the package's declared floor. For a new audit, test exact Node
   `18.20.8` first, then the canonical exact patches of 20, 22, 24, and 26 from
   `ops/helpers/nodeCompatibility.js` only after a genuine failure.
3. Run the package's direct `unit` script, bypassing root housekeeping, coverage,
   and build tools whose own engine floor is unrelated to the published runtime.
4. Test coupled CLI/library packages together and include every internal runtime
   dependency in the audit.
5. Inspect the complete production dependency closure. Passing with an existing
   install is insufficient when a dependency's `engines.node` would make a fresh
   engine-strict consumer install fail. Prefer a sound compatible dependency
   release when its API and behavior fit the package.
6. Set `package.json#engines.node` to the exact tested patch floor, for example
   `>=18.20.8`, not `>=18`. Keep engines manifest-owned; never add engine policy
   to `lect`.
7. Rebuild on the root-supported toolchain. Esbuild derives its Node target from
   the manifest, so compare artifacts when lowering could change emitted code.
8. Regenerate the root lockfile and verify manifest/lock engine parity.
9. Run unit suites in CI on every configured even Node major at or above each
   package's floor. Also perform engine-strict packed-artifact installation and
   library-import or CLI-functional smokes.

## Matrix orchestration

- Build and pack all workspaces once under the root-supported Node toolchain.
- Use cumulative eligibility: on a given lane, test packages whose declared
  floor is less than or equal to that lane. Always run every configured even
  lane through the top version, even when no package starts at an intermediate
  major.
- In CI, run exact-version lanes in parallel and share the immutable packed
  artifacts from the build job.
- Locally, keep majors sequential by default and parallelize packages within a
  lane. Resolve cached runtimes with `n which` or execute them with `n exec`;
  never mutate the global Node installation underneath the parent npm process.
- Keep coverage, examples, lint, generated-file checks, and perf in a separate
  root-toolchain phase. Compatibility lanes run direct unit scripts plus packed
  install/import/CLI checks.

Run `npm run test:compatibility` for the local build-once, pack-once exact Node
matrix. Root `npm test` also runs the separate `test:quality` (`turbo run
devtest`) phase and performance benchmarks.

## Raising a floor

Raise a package only after reproducing a concrete source, runtime, or defensible
dependency blocker on the lower major. Report the failing package, command,
error, and the first exact newer runtime that passes. Do not use EOL status alone
to erase deliberately supported compatibility.

## Validation result

Summarize package counts by engine floor, exact runtime versions tested, unit
pass/fail totals, dependency downgrades, packed-install results, and CI matrix
coverage. Distinguish published runtime compatibility from root development
toolchain requirements.
