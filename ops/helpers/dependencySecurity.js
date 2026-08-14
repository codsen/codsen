import path from "node:path";

const AUDIT_SEVERITIES = Object.freeze([
  "info",
  "low",
  "moderate",
  "high",
  "critical",
]);
const BLOCKING_SEVERITIES = new Set(["high", "critical"]);
const GHSA_PATTERN =
  /^GHSA-[23456789cfghjmpqrvwx]{4}(?:-[23456789cfghjmpqrvwx]{4}){2}$/u;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/u;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const NPM_AUDIT_ARGUMENTS = Object.freeze([
  "audit",
  "--json",
  "--package-lock-only",
  "--workspaces",
  "--include-workspace-root",
  "--omit=dev",
  "--audit-level=none",
  "--ignore-scripts",
]);
const PACKAGE_PATTERN = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/u;
const REASON_MINIMUM_LENGTH = 20;
const TRACKING_ISSUE_PATTERN =
  /^https:\/\/github\.com\/codsen\/codsen\/issues\/[1-9]\d*$/u;
const WAIVER_KEYS = Object.freeze([
  "expires",
  "id",
  "package",
  "reason",
  "trackingIssue",
]);

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function rendered(value) {
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function severityRank(severity) {
  return AUDIT_SEVERITIES.indexOf(severity);
}

function maximumSeverity(...severities) {
  return severities.reduce(
    (highest, severity) =>
      severityRank(severity) > severityRank(highest) ? severity : highest,
    "info",
  );
}

function parseIsoDate(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  const match = ISO_DATE_PATTERN.exec(value);
  if (!match) {
    return undefined;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const parsed = new Date(timestamp);
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return undefined;
  }
  return timestamp;
}

function advisoryId(advisory) {
  const candidates = [];
  if (GHSA_PATTERN.test(advisory.id)) {
    candidates.push(advisory.id);
  }
  if (GHSA_PATTERN.test(advisory.name)) {
    candidates.push(advisory.name);
  }
  if (typeof advisory.url === "string") {
    try {
      const url = new URL(advisory.url);
      if (url.protocol === "https:" && url.hostname === "github.com") {
        const match = /^\/advisories\/(GHSA-[^/]+)\/?$/u.exec(url.pathname);
        if (match && GHSA_PATTERN.test(match[1])) {
          candidates.push(match[1]);
        }
      }
    } catch {
      // A malformed URL is reported below when no exact GHSA can be recovered.
    }
  }
  return new Set(candidates).size === 1 ? candidates[0] : undefined;
}

function normalizeAuditReport(report) {
  const errors = [];
  const findings = [];

  if (!isPlainObject(report)) {
    return {
      errors: ["npm audit output must be a JSON object"],
      findings,
    };
  }
  if (report.auditReportVersion !== 2) {
    errors.push(
      `npm audit output must use auditReportVersion 2; received ${rendered(report.auditReportVersion)}`,
    );
  }
  if (!isPlainObject(report.vulnerabilities)) {
    errors.push("npm audit output must contain a vulnerabilities object");
    return { errors, findings };
  }

  const vulnerabilities = new Map();
  const summaryCounts = Object.fromEntries(
    AUDIT_SEVERITIES.map((severity) => [severity, 0]),
  );
  for (const [packageName, vulnerability] of Object.entries(
    report.vulnerabilities,
  )) {
    if (!isPlainObject(vulnerability)) {
      errors.push(`vulnerability ${packageName} must be an object`);
      continue;
    }
    const severity = vulnerability.severity;
    if (!AUDIT_SEVERITIES.includes(severity)) {
      errors.push(
        `vulnerability ${packageName} has unknown severity ${rendered(severity)}`,
      );
    } else {
      summaryCounts[severity] += 1;
    }
    if (!Array.isArray(vulnerability.via) || vulnerability.via.length === 0) {
      errors.push(
        `vulnerability ${packageName} must have a non-empty via array`,
      );
      continue;
    }
    vulnerabilities.set(packageName, {
      severity: AUDIT_SEVERITIES.includes(severity) ? severity : "critical",
      via: vulnerability.via,
    });
  }

  const metadataCounts = report.metadata?.vulnerabilities;
  if (!isPlainObject(metadataCounts)) {
    errors.push(
      "npm audit output must contain a metadata.vulnerabilities object",
    );
  } else {
    const expectedKeys = [...AUDIT_SEVERITIES, "total"].sort();
    const actualKeys = Object.keys(metadataCounts).sort();
    if (
      actualKeys.length !== expectedKeys.length ||
      actualKeys.some((key, index) => key !== expectedKeys[index])
    ) {
      errors.push(
        `npm audit metadata.vulnerabilities must contain exactly ${expectedKeys.join(", ")}`,
      );
    }
    for (const key of expectedKeys) {
      if (
        !Number.isSafeInteger(metadataCounts[key]) ||
        metadataCounts[key] < 0
      ) {
        errors.push(
          `npm audit metadata.vulnerabilities.${key} must be a non-negative integer`,
        );
      }
    }
    if (
      Number.isSafeInteger(metadataCounts.total) &&
      metadataCounts.total !==
        AUDIT_SEVERITIES.reduce(
          (total, severity) => total + (metadataCounts[severity] ?? 0),
          0,
        )
    ) {
      errors.push(
        "npm audit metadata.vulnerabilities.total must equal its severity counts",
      );
    }
    for (const severity of AUDIT_SEVERITIES) {
      if (
        Number.isSafeInteger(metadataCounts[severity]) &&
        metadataCounts[severity] !== summaryCounts[severity]
      ) {
        errors.push(
          `npm audit metadata ${severity} count ${metadataCounts[severity]} does not match ${summaryCounts[severity]} package summaries`,
        );
      }
    }
    const packageCount = Object.keys(report.vulnerabilities).length;
    if (
      Number.isSafeInteger(metadataCounts.total) &&
      metadataCounts.total !== packageCount
    ) {
      errors.push(
        `npm audit metadata total count ${metadataCounts.total} does not match ${packageCount} vulnerability packages`,
      );
    }
  }

  const resolutionCache = new Map();
  const resolveAdvisories = (packageName, ancestors = new Set()) => {
    if (resolutionCache.has(packageName)) {
      return resolutionCache.get(packageName);
    }
    if (ancestors.has(packageName)) {
      errors.push(
        `vulnerability ${packageName} contains a cyclic meta-vulnerability chain`,
      );
      return [];
    }
    const vulnerability = vulnerabilities.get(packageName);
    if (!vulnerability) {
      errors.push(
        `meta-vulnerability chain references missing package ${packageName}`,
      );
      return [];
    }

    const nextAncestors = new Set(ancestors);
    nextAncestors.add(packageName);
    const resolved = [];
    for (const via of vulnerability.via) {
      if (typeof via === "string") {
        if (GHSA_PATTERN.test(via)) {
          resolved.push({ id: via, severity: vulnerability.severity });
          continue;
        }
        if (!via) {
          errors.push(
            `vulnerability ${packageName} has an empty via reference`,
          );
          continue;
        }
        for (const advisory of resolveAdvisories(via, nextAncestors)) {
          resolved.push(advisory);
        }
        continue;
      }
      if (!isPlainObject(via)) {
        errors.push(
          `vulnerability ${packageName} has a malformed via entry ${rendered(via)}`,
        );
        continue;
      }
      const id = advisoryId(via);
      if (!id) {
        errors.push(
          `vulnerability ${packageName} has a via advisory without one exact GHSA identifier`,
        );
      }
      if (!AUDIT_SEVERITIES.includes(via.severity)) {
        errors.push(
          `advisory ${id ?? `for ${packageName}`} has unknown severity ${rendered(via.severity)}`,
        );
      }
      if (id) {
        resolved.push({
          id,
          severity: AUDIT_SEVERITIES.includes(via.severity)
            ? via.severity
            : "critical",
        });
      }
    }
    if (resolved.length > 0) {
      const resolvedSeverity = maximumSeverity(
        ...resolved.map(({ severity }) => severity),
      );
      if (vulnerability.severity !== resolvedSeverity) {
        errors.push(
          `vulnerability ${packageName} summary severity ${vulnerability.severity} does not match resolved severity ${resolvedSeverity}`,
        );
      }
    }
    resolutionCache.set(packageName, resolved);
    return resolved;
  };

  const merged = new Map();
  for (const packageName of vulnerabilities.keys()) {
    const resolved = resolveAdvisories(packageName);
    if (resolved.length === 0) {
      errors.push(
        `vulnerability ${packageName} did not resolve to an exact GHSA advisory`,
      );
    }
    for (const advisory of resolved) {
      const key = `${packageName}\0${advisory.id}`;
      const previous = merged.get(key);
      merged.set(key, {
        id: advisory.id,
        package: packageName,
        severity: previous
          ? maximumSeverity(previous.severity, advisory.severity)
          : advisory.severity,
      });
    }
  }
  findings.push(...merged.values());
  findings.sort(
    (left, right) =>
      left.package.localeCompare(right.package) ||
      left.id.localeCompare(right.id),
  );

  return { errors: [...new Set(errors)], findings };
}

function validateWaiverPolicy(policy, today) {
  const errors = [];
  const waivers = [];
  const todayTimestamp = parseIsoDate(today);
  if (todayTimestamp === undefined) {
    errors.push(
      `policy date must be a valid YYYY-MM-DD date; received ${rendered(today)}`,
    );
  }

  if (!isPlainObject(policy)) {
    return {
      errors: [...errors, "security waiver policy must be a JSON object"],
      waivers,
    };
  }
  const rootKeys = Object.keys(policy).sort();
  if (
    rootKeys.length !== 2 ||
    rootKeys[0] !== "schemaVersion" ||
    rootKeys[1] !== "waivers"
  ) {
    errors.push(
      "security waiver policy must contain exactly schemaVersion and waivers",
    );
  }
  if (policy.schemaVersion !== 1) {
    errors.push(
      `security waiver policy schemaVersion must be 1; received ${rendered(policy.schemaVersion)}`,
    );
  }
  if (!Array.isArray(policy.waivers)) {
    errors.push("security waiver policy waivers must be an array");
    return { errors, waivers };
  }

  const seen = new Set();
  let previousKey;
  for (const [index, waiver] of policy.waivers.entries()) {
    const label = `waiver ${index + 1}`;
    if (!isPlainObject(waiver)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    const keys = Object.keys(waiver).sort();
    if (
      keys.length !== WAIVER_KEYS.length ||
      keys.some((key, keyIndex) => key !== WAIVER_KEYS[keyIndex])
    ) {
      errors.push(`${label} must contain exactly ${WAIVER_KEYS.join(", ")}`);
    }

    if (typeof waiver.id !== "string" || !GHSA_PATTERN.test(waiver.id)) {
      errors.push(`${label} id must be one exact GHSA identifier`);
    }
    if (
      typeof waiver.package !== "string" ||
      !PACKAGE_PATTERN.test(waiver.package)
    ) {
      errors.push(`${label} package must be one exact npm package name`);
    }

    const expiresTimestamp = parseIsoDate(waiver.expires);
    if (expiresTimestamp === undefined) {
      errors.push(`${label} expires must be a valid YYYY-MM-DD date`);
    } else if (todayTimestamp !== undefined) {
      const lifetime =
        (expiresTimestamp - todayTimestamp) / MILLISECONDS_PER_DAY;
      if (lifetime <= 0) {
        errors.push(`${label} expires must be strictly after ${today}`);
      } else if (lifetime > 90) {
        errors.push(`${label} expires must be at most 90 days after ${today}`);
      }
    }

    if (
      typeof waiver.reason !== "string" ||
      waiver.reason.trim().length < REASON_MINIMUM_LENGTH ||
      /^(?:n\/?a|none|tbd|todo|temporary)(?:[.!])?$/iu.test(
        waiver.reason.trim(),
      )
    ) {
      errors.push(
        `${label} reason must substantively explain the accepted impact`,
      );
    }
    if (
      typeof waiver.trackingIssue !== "string" ||
      !TRACKING_ISSUE_PATTERN.test(waiver.trackingIssue)
    ) {
      errors.push(
        `${label} trackingIssue must be an exact codsen/codsen GitHub issue URL`,
      );
    }

    const key = `${String(waiver.id)}\0${String(waiver.package)}`;
    if (seen.has(key)) {
      errors.push(`${label} duplicates ${waiver.package} ${waiver.id}`);
    }
    seen.add(key);
    if (previousKey !== undefined && previousKey.localeCompare(key) > 0) {
      errors.push("security waivers must be sorted by id and then package");
    }
    previousKey = key;
    waivers.push(waiver);
  }

  return { errors: [...new Set(errors)], waivers };
}

function evaluateDependencySecurity({ auditReport, today, waiverPolicy }) {
  const audit = normalizeAuditReport(auditReport);
  const policy = validateWaiverPolicy(waiverPolicy, today);
  const errors = [...audit.errors, ...policy.errors];
  const blockers = [];
  const informational = [];
  const waived = [];
  const usedWaivers = new Set();
  const waiverByFinding = new Map();

  if (policy.errors.length === 0) {
    for (const waiver of policy.waivers) {
      waiverByFinding.set(`${waiver.package}\0${waiver.id}`, waiver);
    }
  }

  for (const finding of audit.findings) {
    if (!BLOCKING_SEVERITIES.has(finding.severity)) {
      informational.push(finding);
      continue;
    }
    const key = `${finding.package}\0${finding.id}`;
    const waiver = waiverByFinding.get(key);
    if (waiver) {
      usedWaivers.add(key);
      waived.push({ ...finding, waiver });
    } else {
      blockers.push(finding);
    }
  }

  const warnings = [];
  if (policy.errors.length === 0) {
    for (const waiver of policy.waivers) {
      const key = `${waiver.package}\0${waiver.id}`;
      if (!usedWaivers.has(key)) {
        warnings.push(`unused waiver: ${waiver.package} ${waiver.id}`);
      }
    }
  }

  return {
    blockers,
    errors,
    findings: audit.findings,
    informational,
    ok: errors.length === 0 && blockers.length === 0,
    waived,
    warnings,
  };
}

function pairedNpmCliCandidates(nodeExecutable, platform = process.platform) {
  if (typeof nodeExecutable !== "string" || nodeExecutable.length === 0) {
    throw new TypeError("nodeExecutable must be a non-empty path");
  }
  const paths = platform === "win32" ? path.win32 : path.posix;
  const directory = paths.dirname(nodeExecutable);
  if (platform === "win32") {
    return [
      paths.resolve(directory, "node_modules/npm/bin/npm-cli.js"),
      paths.resolve(directory, "../lib/node_modules/npm/bin/npm-cli.js"),
    ];
  }
  return [
    paths.resolve(directory, "../lib/node_modules/npm/bin/npm-cli.js"),
    paths.resolve(directory, "node_modules/npm/bin/npm-cli.js"),
  ];
}

function npmAuditInvocation(nodeExecutable, npmCli) {
  if (typeof nodeExecutable !== "string" || nodeExecutable.length === 0) {
    throw new TypeError("nodeExecutable must be a non-empty path");
  }
  if (typeof npmCli !== "string" || npmCli.length === 0) {
    throw new TypeError("npmCli must be a non-empty path");
  }
  return {
    args: [npmCli, ...NPM_AUDIT_ARGUMENTS],
    command: nodeExecutable,
    shell: false,
  };
}

export {
  AUDIT_SEVERITIES,
  evaluateDependencySecurity,
  normalizeAuditReport,
  npmAuditInvocation,
  pairedNpmCliCandidates,
  validateWaiverPolicy,
};
