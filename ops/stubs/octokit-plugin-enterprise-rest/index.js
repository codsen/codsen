// Stub. The real @octokit/plugin-enterprise-rest is only ever reached by
// @lerna-lite/version, which imports `ghe-<GHE_VERSION>/index.js` out of it
// from its github-client.js, and only when the GHE_VERSION env var is set
// (i.e. releasing against a GitHub Enterprise instance). We release against
// github.com, so that import never fires and the package's 8.7MB is dead
// weight in every install.
//
// The `exports` wildcard in package.json routes every `ghe-*` subpath here, so
// that a GHE release fails on this message instead of a bare
// ERR_MODULE_NOT_FOUND against a path that looks like it should exist.
//
// If you ever do need GHE releases, see ops/stubs/README.md.

throw new Error(
  "@octokit/plugin-enterprise-rest is stubbed out in this monorepo. " +
    "GitHub Enterprise releases are not supported. Drop the " +
    "@octokit/plugin-enterprise-rest devDependency from the root package.json " +
    "and re-run `npm install` to restore the real package.",
);
