# Biome checks

## uvu runner guard

`require-uvu-test-run.grit` checks runtime runner imports from `uvu`, regardless
of whether assertions use `uvu/assert`, `node:assert`, or another library.
Assertion-only modules and explicit TypeScript type imports need no runner.

Use these forms in maintained test modules:

- Import `test` by name, optionally with `as`. All aliases refer to uvu's same
  singleton, so one direct `alias.run()` starts it.
- Import `suite` by name, optionally with `as`, and assign each direct factory
  call to a module-level identifier. Exported variable declarations and multiple
  declarators are supported. Each distinct suite needs its own `.run()` call.
- Put each runner call in a standalone module-level expression statement:
  `test.run();` or `spec.run();`. Calls inside functions, blocks, conditions,
  assignments, or other expressions do not satisfy the guard.
- Register ordinary tests. Biome's built-in rules reject `test.only` and
  `test.skip`; the plugin adds checks for aliases and suite instances.

Namespace, default, combined-default, bare side-effect, literal dynamic, and
`require("uvu")` imports receive an unsupported-import diagnostic. A runtime
`suite` import must create at least one supported suite declaration. Factory
calls outside those declarations receive an unsupported-creation diagnostic.
Use the named import and direct declaration forms instead of adding an exemption.

Indirect starts, including copied runner methods and computed `.run` access,
cannot replace a supported direct start. Once a valid direct start exists,
other indirect references are outside this guard's analysis.

This is a structural safeguard, not a control-flow or symbol-resolution check.
Keep runner and factory names unshadowed, and do not reassign suite bindings.
The guard does not follow arbitrary alias chains, computed module names, or
runtime changes to methods, nor prove that execution reaches a valid start.

The patterns use Biome syntax fields and are checked against the installed
Biome version. Re-run `ops/helpers/tests/biomeRulesCli.test.js` when changing
the plugin or upgrading Biome. Its fixtures inherit the real root configuration
and invoke the actual CLI; runner checks are exercised alongside the other
rules. Keep the root `packages/*/tap` force-ignore intact.

## Explicit-any allowances

The source override in [biome.json](../../biome.json) enables `noExplicitAny`
for `packages/*/src/**`. A later override lists the exact legacy source files
that still contain explicit `any` types. Keep that list sorted and limited to
existing type debt; new files in the same packages remain checked.

When improving a listed file's types, remove its allowance once it passes the
rule. Use correct relationships or justified local suppressions, and verify the
package's public types and consumers. Replacing every `any` with `unknown`
mechanically can break the API without making its types more useful.

The global setting remains off for generated declarations and intentional
consumer-type tests. Fix declaration types through their authored source and
build pipeline, without editing generated `.d.ts` files.
