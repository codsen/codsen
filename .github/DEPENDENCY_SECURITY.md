# Dependency security policy

This repository checks dependency risk at two boundaries:

- **Dependency review** runs on every pull request. It rejects newly introduced
  high- or critical-severity vulnerabilities in runtime, development, and
  unknown dependency scopes. Pull request findings are not waived in this
  repository's workflow configuration.
- **Dependency audit** checks the complete committed npm lockfile on
  a weekly schedule, on demand, and when dependency-policy inputs change on
  `main`. It reports lower-severity findings and rejects unwaived high- or
  critical-severity findings, including those in build and release tools.

Repository maintainers own alert triage. Prefer upgrading, replacing, or
removing an affected dependency. Never run `npm audit fix` as an automated
remediation step: review each dependency and lockfile change through the normal
pull request checks and packed-runtime compatibility matrix.

Dependency updates are manual while Dependabot is disabled. Re-enable it only
when the maintainer approves, as documented in `AGENTS.md`. npm's two-day
`min-release-age` can constrain which releases the install solver can select.

## Run the dependency audit

Use Node and npm versions that satisfy the root `engines` ranges, then run:

```sh
npm run ci:audit:production
```

The command retains its existing name for compatibility. It audits the lockfile
only, including the workspace root, every workspace, and runtime, development,
optional, and peer dependencies. Explicit inclusion prevents a production
environment or npm's `omit` settings from excluding development tools. It does
not install packages or modify repository files. Like every `npm audit`, it
sends package names and versions to the configured registry's Bulk Advisory
endpoint. If that endpoint cannot process the request, npm may fall back to
sending the full lockfile dependency tree to the Quick Audit endpoint.

## Exceptional waivers

Waivers live in `ops/security-advisory-waivers.json`. They apply only to the
complete-lockfile audit; the pull request dependency review does not consume
them. Each waiver must identify exactly one GitHub Security Advisory and npm
package, explain reachability or impact and a compensating control, link to a
tracking issue in `codsen/codsen`, and expire within 90 days.

Use this exact shape:

```json
{
  "id": "GHSA-xxxx-xxxx-xxxx",
  "package": "exact-npm-package-name",
  "expires": "2026-09-01",
  "reason": "Why the vulnerable path is unreachable and what limits exposure.",
  "trackingIssue": "https://github.com/codsen/codsen/issues/123"
}
```

Keep entries sorted by advisory ID and then package name. Wildcards, expired
waivers, duplicate entries, blank explanations, invalid issue links, and expiry
dates more than 90 days away make the audit fail. Remove a waiver when its
finding disappears; an unused but unexpired waiver is reported as a warning.

## Node support

Dependency updates must preserve each published package's supported Node floor
unless a human-reviewed change includes the compatibility evidence required by
`AGENTS.md`. The exact Node 18, 20, 22, 24, and 26 packed-artifact matrix checks
the updated runtime dependency closure.

The Dependabot engine guard remains in place while the bot is disabled. If the
maintainer re-enables it, bot pull requests compare every manifest with the pull
request's base commit and reject changes to `engines.node`. Dependency
automation is never evidence for raising a published package's floor.

## Repository settings

Keep the dependency graph and Dependabot alerts available for triage. Enabling
automated dependency pull requests requires the maintainer's approval under the
manual-update policy in `AGENTS.md`.
