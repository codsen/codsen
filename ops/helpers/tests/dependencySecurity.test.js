import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { equal, match } from "uvu/assert";
import {
  locatePairedNpmCli,
  runDependencyAudit,
} from "../../scripts/audit-production-dependencies.js";
import {
  evaluateDependencySecurity,
  normalizeAuditReport,
  npmAuditInvocation,
  pairedNpmCliCandidates,
  validateWaiverPolicy,
} from "../dependencySecurity.js";

const ADVISORY_A = "GHSA-2345-6789-cfgh";
const ADVISORY_B = "GHSA-jmpq-rvwx-2345";
const ADVISORY_C = "GHSA-6789-cfgh-jmpq";
const ADVISORY_D = "GHSA-rvwx-2345-6789";
const TODAY = "2026-08-14";

function advisory(id, severity) {
  return {
    name: id,
    severity,
    url: `https://github.com/advisories/${id}`,
  };
}

function auditReport(vulnerabilities = {}) {
  const counts = {
    critical: 0,
    high: 0,
    info: 0,
    low: 0,
    moderate: 0,
    total: Object.keys(vulnerabilities).length,
  };
  for (const vulnerability of Object.values(vulnerabilities)) {
    if (
      vulnerability &&
      Object.hasOwn(counts, vulnerability.severity) &&
      vulnerability.severity !== "total"
    ) {
      counts[vulnerability.severity] += 1;
    }
  }
  return {
    auditReportVersion: 2,
    metadata: { vulnerabilities: counts },
    vulnerabilities,
  };
}

function waiver(overrides = {}) {
  return {
    expires: "2026-09-01",
    id: ADVISORY_A,
    package: "affected-package",
    reason: "No reachable vulnerable execution path exists.",
    trackingIssue: "https://github.com/codsen/codsen/issues/123",
    ...overrides,
  };
}

function policy(waivers = []) {
  return { schemaVersion: 1, waivers };
}

test("01 - accepts an empty audit and waiver policy", () => {
  const result = evaluateDependencySecurity({
    auditReport: auditReport(),
    today: TODAY,
    waiverPolicy: policy(),
  });

  equal(result.ok, true, "01.01");
  equal(result.errors, [], "01.02");
  equal(result.findings, [], "01.03");
  equal(result.warnings, [], "01.04");
});

test("02 - blocks high and critical but reports lower severities", () => {
  const result = evaluateDependencySecurity({
    auditReport: auditReport({
      criticalPackage: {
        severity: "critical",
        via: [advisory(ADVISORY_D, "critical")],
      },
      highPackage: {
        severity: "high",
        via: [advisory(ADVISORY_A, "low"), advisory(ADVISORY_C, "high")],
      },
      lowPackage: {
        severity: "low",
        via: [advisory(ADVISORY_A, "low")],
      },
      moderatePackage: {
        severity: "moderate",
        via: [advisory(ADVISORY_B, "moderate")],
      },
    }),
    today: TODAY,
    waiverPolicy: policy(),
  });

  equal(result.ok, false, "02.01");
  equal(
    result.blockers.map(({ package: packageName, severity }) => ({
      package: packageName,
      severity,
    })),
    [
      { package: "criticalPackage", severity: "critical" },
      { package: "highPackage", severity: "high" },
    ],
    "02.02",
  );
  equal(
    result.informational.map(({ id, package: packageName, severity }) => ({
      id,
      package: packageName,
      severity,
    })),
    [
      { id: ADVISORY_A, package: "highPackage", severity: "low" },
      { id: ADVISORY_A, package: "lowPackage", severity: "low" },
      {
        id: ADVISORY_B,
        package: "moderatePackage",
        severity: "moderate",
      },
    ],
    "02.03",
  );
});

test("03 - applies only exact waivers and warns about unused ones", () => {
  const result = evaluateDependencySecurity({
    auditReport: auditReport({
      "affected-package": {
        severity: "high",
        via: [advisory(ADVISORY_A, "high")],
      },
      "other-package": {
        severity: "high",
        via: [advisory(ADVISORY_A, "high")],
      },
    }),
    today: TODAY,
    waiverPolicy: policy([
      waiver(),
      waiver({ id: ADVISORY_B, package: "unused-package" }),
    ]),
  });

  equal(result.waived.length, 1, "03.01");
  equal(result.waived[0].package, "affected-package", "03.02");
  equal(result.blockers[0].package, "other-package", "03.03");
  equal(
    result.warnings,
    [`unused waiver: unused-package ${ADVISORY_B}`],
    "03.04",
  );
});

test("04 - carries severity through meta-vulnerability chains", () => {
  const result = normalizeAuditReport(
    auditReport({
      leaf: {
        severity: "high",
        via: [advisory(ADVISORY_A, "low"), advisory(ADVISORY_B, "high")],
      },
      middle: { severity: "high", via: ["leaf"] },
      top: {
        severity: "high",
        via: ["middle", advisory(ADVISORY_A, "low")],
      },
    }),
  );

  equal(result.errors, [], "04.01");
  equal(
    result.findings,
    [
      { id: ADVISORY_A, package: "leaf", severity: "low" },
      { id: ADVISORY_B, package: "leaf", severity: "high" },
      { id: ADVISORY_A, package: "middle", severity: "low" },
      { id: ADVISORY_B, package: "middle", severity: "high" },
      { id: ADVISORY_A, package: "top", severity: "low" },
      { id: ADVISORY_B, package: "top", severity: "high" },
    ],
    "04.02",
  );
});

test("05 - fails closed on unknown severities and report versions", () => {
  const unknown = normalizeAuditReport(
    auditReport({
      mystery: {
        severity: "unknown",
        via: [advisory(ADVISORY_A, "unknown")],
      },
    }),
  );
  const obsolete = normalizeAuditReport({
    auditReportVersion: 1,
    vulnerabilities: {},
  });

  match(unknown.errors.join("\n"), /unknown severity/, "05.01");
  equal(unknown.findings[0].severity, "critical", "05.02");
  match(obsolete.errors.join("\n"), /auditReportVersion 2/, "05.03");
});

test("06 - fails closed on broken meta-vulnerability chains", () => {
  const result = normalizeAuditReport(
    auditReport({
      cycleA: { severity: "high", via: ["cycleB"] },
      cycleB: { severity: "high", via: ["cycleA"] },
      missing: { severity: "high", via: ["not-present"] },
    }),
  );
  const message = result.errors.join("\n");

  match(message, /cyclic meta-vulnerability chain/, "06.01");
  match(message, /references missing package not-present/, "06.02");
  match(message, /did not resolve to an exact GHSA/, "06.03");
});

test("07 - rejects malformed, duplicate, and unsorted waivers", () => {
  const malformed = validateWaiverPolicy(
    {
      extra: true,
      schemaVersion: 2,
      waivers: [waiver({ package: "wild*" })],
    },
    TODAY,
  );
  const duplicateAndUnsorted = validateWaiverPolicy(
    policy([
      waiver({ id: ADVISORY_B, package: "z-package" }),
      waiver({ package: "a-package" }),
      waiver({ package: "a-package" }),
    ]),
    TODAY,
  );
  const malformedMessage = malformed.errors.join("\n");
  const orderingMessage = duplicateAndUnsorted.errors.join("\n");

  match(malformedMessage, /exactly schemaVersion and waivers/, "07.01");
  match(malformedMessage, /schemaVersion must be 1/, "07.02");
  match(malformedMessage, /exact npm package name/, "07.03");
  match(orderingMessage, /sorted by id and then package/, "07.04");
  match(orderingMessage, /duplicates a-package/, "07.05");
});

test("08 - enforces strict, short-lived waiver expiry dates", () => {
  const expired = validateWaiverPolicy(
    policy([waiver({ expires: TODAY })]),
    TODAY,
  );
  const invalid = validateWaiverPolicy(
    policy([waiver({ expires: "2026-02-30" })]),
    TODAY,
  );
  const tooLong = validateWaiverPolicy(
    policy([waiver({ expires: "2026-11-13" })]),
    TODAY,
  );

  match(expired.errors.join("\n"), /strictly after/, "08.01");
  match(invalid.errors.join("\n"), /valid YYYY-MM-DD/, "08.02");
  match(tooLong.errors.join("\n"), /at most 90 days/, "08.03");
});

test("09 - requires a substantive reason and same-repository issue", () => {
  const result = validateWaiverPolicy(
    policy([
      waiver({
        reason: "TODO",
        trackingIssue: "https://github.com/other/project/issues/1",
      }),
    ]),
    TODAY,
  );
  const message = result.errors.join("\n");

  match(message, /substantively explain/, "09.01");
  match(message, /exact codsen\/codsen GitHub issue URL/, "09.02");
});

test("10 - constructs the exact no-fix npm audit invocation", () => {
  const invocation = npmAuditInvocation("/runtime/bin/node", "/runtime/npm.js");
  const posixCandidates = pairedNpmCliCandidates("/runtime/bin/node", "linux");
  const windowsCandidates = pairedNpmCliCandidates(
    "C:\\runtime\\node.exe",
    "win32",
  );

  equal(invocation.command, "/runtime/bin/node", "10.01");
  equal(
    invocation.args,
    [
      "/runtime/npm.js",
      "audit",
      "--json",
      "--package-lock-only",
      "--workspaces",
      "--include-workspace-root",
      "--omit=dev",
      "--audit-level=none",
      "--ignore-scripts",
    ],
    "10.02",
  );
  equal(invocation.shell, false, "10.03");
  equal(invocation.args.includes("fix"), false, "10.04");
  equal(
    posixCandidates[0],
    path.posix.resolve(
      "/runtime/bin",
      "../lib/node_modules/npm/bin/npm-cli.js",
    ),
    "10.05",
  );
  equal(
    windowsCandidates[0],
    path.win32.resolve("C:\\runtime", "node_modules/npm/bin/npm-cli.js"),
    "10.06",
  );
});

test("11 - recognizes advisory ids and rejects identifier conflicts", () => {
  const result = normalizeAuditReport(
    auditReport({
      conflict: {
        severity: "high",
        via: [
          {
            id: ADVISORY_A,
            severity: "high",
            url: `https://github.com/advisories/${ADVISORY_B}`,
          },
        ],
      },
      idOnly: {
        severity: "moderate",
        via: [{ id: ADVISORY_C, severity: "moderate" }],
      },
      malformed: { severity: "high", via: [42] },
      numericId: {
        severity: "low",
        via: [
          {
            id: 123,
            severity: "low",
            url: `https://github.com/advisories/${ADVISORY_D}`,
          },
        ],
      },
    }),
  );
  const message = result.errors.join("\n");

  match(message, /without one exact GHSA identifier/, "11.01");
  match(message, /malformed via entry 42/, "11.02");
  equal(
    result.findings,
    [
      { id: ADVISORY_C, package: "idOnly", severity: "moderate" },
      { id: ADVISORY_D, package: "numericId", severity: "low" },
    ],
    "11.03",
  );
});

test("12 - checks waiver policy without locating or spawning npm", () => {
  let locateCalls = 0;
  let spawnCalls = 0;
  const messages = [];
  const status = runDependencyAudit({
    args: ["--check-policy"],
    loadPolicy: () => policy(),
    locateNpm: () => {
      locateCalls += 1;
      return "/must-not-run/npm-cli.js";
    },
    logger: {
      error: (message) => messages.push(`error:${message}`),
      log: (message) => messages.push(`log:${message}`),
      warn: (message) => messages.push(`warn:${message}`),
    },
    spawn: () => {
      spawnCalls += 1;
      return { status: 0, stderr: "", stdout: "" };
    },
    today: TODAY,
  });

  equal(status, 0, "12.01");
  equal(locateCalls, 0, "12.02");
  equal(spawnCalls, 0, "12.03");
  equal(messages, ["log:Security waiver policy passed: 0 waivers."], "12.04");
});

test("13 - requires complete and matching audit metadata counts", () => {
  const missing = normalizeAuditReport({
    auditReportVersion: 2,
    vulnerabilities: {},
  });
  const malformedReport = auditReport();
  malformedReport.metadata.vulnerabilities = { total: 0 };
  const malformed = normalizeAuditReport(malformedReport);
  const mismatchedReport = auditReport();
  mismatchedReport.metadata.vulnerabilities.high = 1;
  mismatchedReport.metadata.vulnerabilities.total = 1;
  const mismatched = normalizeAuditReport(mismatchedReport);

  match(missing.errors.join("\n"), /metadata\.vulnerabilities object/, "13.01");
  match(
    malformed.errors.join("\n"),
    /must contain exactly critical, high, info, low, moderate, total/,
    "13.02",
  );
  match(
    mismatched.errors.join("\n"),
    /high count 1 does not match 0 package summaries/,
    "13.03",
  );
  match(
    mismatched.errors.join("\n"),
    /total count 1 does not match 0 vulnerability packages/,
    "13.04",
  );
});

test("14 - runs the normal CLI boundary with an injected npm process", () => {
  const messages = [];
  let locatedNode;
  let spawnCall;
  const status = runDependencyAudit({
    args: [],
    loadPolicy: () => policy(),
    locateNpm: (nodeExecutable) => {
      locatedNode = nodeExecutable;
      return "/runtime/npm-cli.js";
    },
    logger: {
      error: (message) => messages.push(`error:${message}`),
      log: (message) => messages.push(`log:${message}`),
      warn: (message) => messages.push(`warn:${message}`),
    },
    nodeExecutable: "/runtime/node",
    spawn: (command, args, options) => {
      spawnCall = { args, command, options };
      return {
        error: undefined,
        signal: null,
        status: 0,
        stderr: "",
        stdout: JSON.stringify(auditReport()),
      };
    },
    today: TODAY,
  });
  const expectedRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../..",
  );

  equal(status, 0, "14.01");
  equal(locatedNode, "/runtime/node", "14.02");
  equal(spawnCall.command, "/runtime/node", "14.03");
  equal(
    spawnCall.args,
    npmAuditInvocation("/runtime/node", "/runtime/npm-cli.js").args,
    "14.04",
  );
  equal(spawnCall.options.cwd, expectedRoot, "14.05");
  equal(spawnCall.options.shell, false, "14.06");
  equal(
    messages,
    [
      "log:Production dependency audit passed: 0 waived high/critical, 0 informational.",
    ],
    "14.07",
  );
});

test("15 - parses finding exits and distinguishes malformed JSON", () => {
  const findingMessages = [];
  const findingStatus = runDependencyAudit({
    args: [],
    loadPolicy: () => policy(),
    locateNpm: () => "/runtime/npm-cli.js",
    logger: {
      error: (message) => findingMessages.push(message),
      log: (message) => findingMessages.push(message),
      warn: (message) => findingMessages.push(message),
    },
    nodeExecutable: "/runtime/node",
    spawn: () => ({
      error: undefined,
      signal: null,
      status: 1,
      stderr: "",
      stdout: JSON.stringify(
        auditReport({
          dependency: {
            severity: "high",
            via: [advisory(ADVISORY_A, "high")],
          },
        }),
      ),
    }),
    today: TODAY,
  });
  const malformedMessages = [];
  const malformedStatus = runDependencyAudit({
    args: [],
    loadPolicy: () => policy(),
    locateNpm: () => "/runtime/npm-cli.js",
    logger: {
      error: (message) => malformedMessages.push(message),
      log: (message) => malformedMessages.push(message),
      warn: (message) => malformedMessages.push(message),
    },
    nodeExecutable: "/runtime/node",
    spawn: () => ({
      error: undefined,
      signal: null,
      status: 1,
      stderr: "registry unavailable",
      stdout: "not JSON",
    }),
    today: TODAY,
  });

  equal(findingStatus, 1, "15.01");
  match(findingMessages.join("\n"), /Unwaived production/, "15.02");
  equal(
    findingMessages.some((message) => /exited with code/.test(message)),
    false,
    "15.03",
  );
  equal(malformedStatus, 1, "15.04");
  match(
    malformedMessages.join("\n"),
    /could not parse npm JSON.*registry unavailable/,
    "15.05",
  );
});

test("16 - distinguishes structured npm transport errors", () => {
  const messages = [];
  const status = runDependencyAudit({
    args: [],
    loadPolicy: () => policy(),
    locateNpm: () => "/runtime/npm-cli.js",
    logger: {
      error: (message) => messages.push(message),
      log: (message) => messages.push(message),
      warn: (message) => messages.push(message),
    },
    nodeExecutable: "/runtime/node",
    spawn: () => ({
      error: undefined,
      signal: null,
      status: 1,
      stderr: "",
      stdout: JSON.stringify({
        error: {
          code: "ENEEDAUTH",
          summary: "Authentication is required by the audit endpoint.",
        },
      }),
    }),
    today: TODAY,
  });

  equal(status, 1, "16.01");
  equal(
    messages,
    [
      "Production dependency audit npm request failed [ENEEDAUTH]: Authentication is required by the audit endpoint.",
    ],
    "16.02",
  );
});

test("17 - audit npm discovery honors the explicit CLI path first", () => {
  const checked = [];
  const npmCli = locatePairedNpmCli("C:\\runtime\\node.exe", {
    exists: (candidate) => {
      checked.push(candidate);
      return candidate === "D:\\global npm\\npm\\bin\\npm-cli.js";
    },
    explicitNpmCli: "D:\\global npm\\npm\\bin\\npm-cli.js",
    platform: "win32",
  });

  equal(npmCli, "D:\\global npm\\npm\\bin\\npm-cli.js", "17.01");
  equal(checked, [npmCli], "17.02");
});

test.run();
