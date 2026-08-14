# Dependency security policy

This repository checks dependency risk at two boundaries:

- **Dependency review** runs on every pull request. It rejects newly introduced
  high- or critical-severity vulnerabilities in runtime dependencies. Pull
  request findings are not waived in this repository's workflow configuration.
- **Production dependency audit** checks the complete committed npm lockfile on
  a weekly schedule, on demand, and when dependency-policy inputs change on
  `main`. It reports lower-severity findings and rejects unwaived high- or
  critical-severity findings.

Repository maintainers own alert triage. Prefer upgrading, replacing, or
removing an affected dependency. Never run `npm audit fix` as an automated
remediation step: review each dependency and lockfile change through the normal
pull request checks and packed-runtime compatibility matrix.

Dependabot waits three days before proposing ordinary version updates; its
cooldown does not delay security updates. npm's separate two-day
`min-release-age` can still constrain which releases the install solver can
select.

## Run the production audit

Use the repository's pinned Node and npm versions, then run:

```sh
npm run ci:audit:production
```

The command audits the lockfile only. It includes the workspace root and every
workspace, omits development-only dependencies, and does not install packages
or modify repository files. Like every `npm audit`, it sends package names and
versions to the configured registry's Bulk Advisory endpoint. If that endpoint
cannot process the request, npm may fall back to sending the full lockfile
dependency tree to the Quick Audit endpoint.

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

Dependabot may update dependencies and the lockfile, but it must not add,
remove, or change any root or workspace `engines.node` declaration. Bot pull
requests enforce this by comparing every manifest with the pull request's base
commit. The existing exact Node 18, 20, 22, 24, and 26 packed-artifact matrix
then checks the updated runtime dependency closure.

A human-authored Node-floor change still requires the compatibility evidence
documented in `AGENTS.md`; dependency automation is never evidence for raising a
published package's floor.

## Repository settings

After this policy reaches the default branch, an administrator must enable the
dependency graph, Dependabot alerts, and Dependabot security updates. Make the
**Dependency review** workflow a required pull request check. Keep automated
merge disabled initially so each update's compatibility results remain
attributable and reviewable.
