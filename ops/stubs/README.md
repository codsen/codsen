# Dependency stubs

Local no-op replacements for transitive dependencies that are unreachable in
this repo but still cost us disk on every install. They are wired in as root
`devDependencies` pointing at a `file:` path, which makes npm link the stub
into `node_modules/<name>` and dedupe the real dependents onto it.

Each stub keeps the real package's name and a version that satisfies its
dependents' ranges, so npm resolves it in place of the real thing.

## Why `devDependencies` and not `overrides`

`overrides` is the obvious home for this and it does not work here. npm
resolves a relative `file:` spec inside `overrides` against the **dependent's**
directory during `npm install`, but against the **repo root** when `npm ci`
validates the lockfile. Every relative form fails one side or the other:

- `file:./ops/stubs/...` installs a link that npm ci then rejects with
  `Missing: @octokit/plugin-enterprise-rest@ from lock file`
- `file:../../../ops/stubs/...` (relative to the dependent) installs fine, but
  npm ci resolves it from the root and fails the same way

A root `devDependency` has no such split: both code paths resolve it from the
root, the lockfile gets a real `name`/`version` entry, and `npm ci` is happy.
Making the stub a workspace would also work, but `ops/scripts/` enumerates
`workspaces` for the compatibility and release checks — including an exact
workspace count — so a stub workspace would break them.

## `octokit-plugin-enterprise-rest`

Replaces `@octokit/plugin-enterprise-rest`, a hard dependency of
`@lerna-lite/version`.

The real package is 8.7MB, of which 7.7MB is its own `scripts/` build tooling
that it accidentally publishes. `@lerna-lite/version` only touches it from a
dynamic `import()` in `dist/git-clients/github-client.js`, guarded on the
`GHE_VERSION` environment variable. We release to github.com and npm, never to
a GitHub Enterprise instance, so that code path is unreachable.

Note that the import is of the `ghe-<GHE_VERSION>/index.js` **subpath**, not of
the package root, so the stub declares an `exports` wildcard routing every
subpath to `index.js`. Without it a GHE release would fail on an opaque
`ERR_MODULE_NOT_FOUND` instead of the stub's explanation.

The package has also been deprecated upstream since 2020.

**To restore GitHub Enterprise support:** delete the
`@octokit/plugin-enterprise-rest` entry from `devDependencies` in the root
`package.json` and re-run `npm install`.
