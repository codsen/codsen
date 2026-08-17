# npm releases

The release process is split into a version-preparation pull request and an
OIDC-authenticated publish of the exact commit that passed CI. Publishing does
not use a long-lived npm token.

The only supported production path is **Prepare npm release** → reviewed
release PR → protected `ci.yml`. Workspace manifests intentionally expose
no local or emergency publish alias.

`ci.yml` is the publishing lane and `verify.yml` is the pull-request lane. The
names read backwards on purpose: npm pins one workflow filename per trusted
publisher, every package in this repository is registered against `ci.yml`, and
renaming the publishing workflow breaks OIDC publishing for all of them at once.
Re-registering instead would mean editing every package by hand on npmjs.com.

## One-time setup

### GitHub

1. In **Settings → Environments**, create an environment named exactly
   `npm-production`.
2. Protect it with required reviewers and restrict deployments to `main`.
   Approval gates the publish job, not the build and test jobs.
3. In **Settings → Actions → General → Workflow permissions**, enable
   **Allow GitHub Actions to create and approve pull requests**. The preparation
   workflow needs this permission to open its release PR.
4. Protect `main` (or add an equivalent ruleset), require the `verify.yml`
   checks, and require release branches to be up to date before merging. Do not use GitHub's
   **Update branch** button on a generated release PR; regenerate it instead.

### npm

Configure a GitHub Actions trusted publisher separately for every npm package
in this repository, including `@codsen/data`. Use these exact values:

- Organization or user: `codsen`
- Repository: `codsen`
- Workflow filename: `ci.yml`
- Environment: `npm-production`

Repeat this setup whenever a new package is added. Do not create an `NPM_TOKEN`
repository secret for this flow: the release job receives short-lived npm
credentials through GitHub OIDC and the trusted-publisher configuration.

## Prepare and release

1. From the `main` branch, manually run **Prepare npm release** in GitHub
   Actions.
2. Leave `force_all` disabled for a normal release. Only packages selected by
   the independent conventional-commit version calculation are given new
   versions, while `@codsen/data` is always bumped because it aggregates their
   metadata. Enable `force_all` only when every publishable workspace must
   receive a fresh version, including packages with no changes; it does not
   republish an existing `name@version`.
3. Review the generated release PR, including its versions, changelogs, lockfile,
   generated data, and build output. Its description and the preparation run's
   job summary show a table with every selected package, its current and proposed
   versions, semantic bump, and dependency-ordered publish layer. Merge it only
   after all CI checks pass. Preparation also verifies that every proposed
   `name@version` is still available on npm, and validates that the compiled
   `@codsen/data` exports exactly match every generated source payload and all
   package changelogs. The plan binds the complete reviewed tree: if `main`
   advances or the proposal is edited after generation, close it and run
   **Prepare npm release** again from the new `main` instead of updating or
   merging the stale proposal.
4. Merging the release plan starts `ci.yml`. Its unprivileged job repeats
   the exact-commit build and verification before creating the tarballs.
   Approve the protected `npm-production` deployment when ready. The workflow
   publishes only registry-pending versions, verifies them on npm, and then
   pushes their Git tags.

## Recover a failed publish

Open the failed GitHub Actions release run and use **Re-run jobs** (or
**Re-run failed jobs**) on that same run. The publisher skips exact versions
already present on npm, so this safely resumes a partial release.

Never recover by dispatching a new release, rerunning **Prepare npm release**, or
publishing from a newer SHA. A retry must retain the original release run and
its exact commit; otherwise the package contents, provenance, versions, and Git
tags can disagree.
