import { createHash } from "node:crypto";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { raw } from "hast-util-raw";
import ts from "typescript";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

function indexById(records, label, key = "id") {
  const result = new Map();
  for (const record of records) {
    const id = record?.[key];
    requireValue(
      typeof id === "string" &&
        id.trim() === id &&
        /^[a-z][a-z0-9-]*$/.test(id),
      `Invalid ${label} identifier: ${id}`,
    );
    requireValue(
      !result.has(record[key]),
      `Duplicate ${label}: ${record[key]}`,
    );
    result.set(record[key], record);
  }
  return result;
}

// Validate the complete source inventory before any refresh downloads or writes.
// Shared licence files are intentional only when they pin identical material.
function validateStandardsSources(sources) {
  requireValue(Array.isArray(sources), "Standards sources must be an array");
  indexById(sources, "source");
  const destinations = new Map();

  function isHttpsUrl(value) {
    if (typeof value !== "string") return false;
    try {
      const url = new URL(value);
      return url.protocol === "https:" && !!url.hostname;
    } catch {
      return false;
    }
  }

  function checkDestination(relative, suffix, kind, source) {
    const existing = destinations.get(relative);
    requireValue(
      !existing ||
        (kind === "licence" &&
          existing.kind === "licence" &&
          existing.url === source.license.url &&
          existing.sha256 === source.license.sha256),
      `Conflicting source destination: ${relative} (${source.id})`,
    );
    requireValue(
      typeof relative === "string" &&
        relative.startsWith("upstream/") &&
        relative.endsWith(suffix) &&
        relative
          .split("/")
          .every(
            (part) =>
              part.trim() === part &&
              /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/u.test(part),
          ),
      `Invalid ${kind} path: ${source.id}`,
    );
    destinations.set(relative, {
      kind,
      url: source.license.url,
      sha256: source.license.sha256,
    });
  }

  for (const source of sources) {
    requireValue(isHttpsUrl(source.url), `Invalid source URL: ${source.id}`);
    requireValue(
      source.license && isHttpsUrl(source.license.url),
      `Invalid licence URL: ${source.id}`,
    );
    for (const [field, value] of [
      ["source", source.sha256],
      ["archive", source.archiveSha256],
      ["licence", source.license.sha256],
    ]) {
      requireValue(
        typeof value === "string" &&
          value.length === 64 &&
          /^[a-f0-9]{64}$/u.test(value),
        `Invalid ${field} SHA-256: ${source.id}`,
      );
    }
    const date =
      typeof source.retrieved === "string" &&
      /^\d{4}-\d{2}-\d{2}$/u.test(source.retrieved)
        ? new Date(`${source.retrieved}T00:00:00.000Z`)
        : null;
    requireValue(
      date &&
        Number.isFinite(date.getTime()) &&
        date.toISOString().slice(0, 10) === source.retrieved,
      `Invalid source retrieval date: ${source.id}`,
    );
    requireValue(
      Array.isArray(source.anchors) &&
        source.anchors.length > 0 &&
        source.anchors.every(
          (anchor) =>
            typeof anchor === "string" &&
            anchor.length > 0 &&
            !/\s/u.test(anchor),
        ) &&
        new Set(source.anchors).size === source.anchors.length,
      `Invalid source anchors: ${source.id}`,
    );
    checkDestination(source.snapshot, ".html.gz", "snapshot", source);
    checkDestination(source.license.path, ".txt", "licence", source);
  }
}

function validateStandardsTargets(targets) {
  requireValue(Array.isArray(targets), "Standards targets must be an array");
  indexById(targets, "target", "package");
  for (const target of targets) {
    const normalized = new Map();
    for (const field of ["fixture", "tests", "knownFailures"]) {
      const relative = target[field];
      requireValue(
        typeof relative === "string" &&
          !path.posix.isAbsolute(relative) &&
          relative
            .split("/")
            .every(
              (part) =>
                part === "." ||
                (part.trim() === part &&
                  /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/u.test(part)),
            ),
        `Invalid target ${field} path: ${target.package}`,
      );
      normalized.set(field, path.posix.normalize(relative));
    }
    requireValue(
      new Set(normalized.values()).size === normalized.size,
      `Conflicting target destinations: ${target.package}`,
    );
    for (const field of ["fixture", "knownFailures"]) {
      const relative = normalized.get(field);
      requireValue(
        relative.startsWith("test/fixtures/") && relative.endsWith(".json"),
        `Target ${field} must be JSON under test/fixtures: ${target.package}`,
      );
    }
    const tests = normalized.get("tests");
    requireValue(
      tests.startsWith("test/") && tests.endsWith(".js"),
      `Target tests must be JavaScript under test: ${target.package}`,
    );
  }
}

function nodeText(node) {
  return node.type === "text"
    ? node.value
    : (node.children ?? []).map(nodeText).join("");
}

// These are abridged reading aids. The unchanged compressed source remains
// authoritative, including surrounding context, normative status and notices.
function extractStandardsSections(html, anchors) {
  const tree = raw({ type: "root", children: [{ type: "raw", value: html }] });
  const found = new Map();
  function visit(node, parent) {
    if (node.properties?.id)
      found.set(String(node.properties.id), { node, parent });
    for (const child of node.children ?? []) visit(child, node);
  }
  visit(tree, null);
  return anchors.map((anchor) => {
    const match = found.get(anchor);
    requireValue(match, `Missing source anchor: ${anchor}`);
    let nodes = [match.node];
    const heading = /^h([1-6])$/.exec(match.node.tagName);
    if (heading && match.parent) {
      const siblings = match.parent.children;
      const start = siblings.indexOf(match.node);
      let end = start + 1;
      for (; end < siblings.length; end += 1) {
        const next = /^h([1-6])$/.exec(siblings[end].tagName ?? "");
        if (next && Number(next[1]) <= Number(heading[1])) break;
      }
      nodes = siblings.slice(start, end);
    }
    const fullText = nodes.map(nodeText).join(" ").replace(/\s+/gu, " ").trim();
    const examples = [];
    function collect(node) {
      if (node.tagName === "pre" || node.tagName === "emu-grammar") {
        const value = nodeText(node);
        examples.push({
          text: value.slice(0, 2000),
          truncated: value.length > 2000,
        });
        return;
      }
      for (const child of node.children ?? []) collect(child);
    }
    for (const node of nodes) collect(node);
    return {
      anchor,
      text: fullText.slice(0, 4000),
      truncated: fullText.length > 4000,
      examples: examples.slice(0, 4),
      omittedExamples: Math.max(0, examples.length - 4),
    };
  });
}

function verifySourceSnapshot(source, archive, license) {
  requireValue(
    sha256(archive) === source.archiveSha256,
    `Changed archive: ${source.id}`,
  );
  const bytes = gunzipSync(archive);
  requireValue(sha256(bytes) === source.sha256, `Changed source: ${source.id}`);
  requireValue(
    sha256(license) === source.license.sha256,
    `Changed licence: ${source.id}`,
  );
  requireValue(
    /^https:\/\//u.test(source.url),
    `Missing source URL: ${source.id}`,
  );
  requireValue(
    /^\d{4}-\d{2}-\d{2}$/u.test(source.retrieved),
    `Missing source date: ${source.id}`,
  );
  return bytes.toString("utf8");
}

function standardsFixture(cases) {
  return `${JSON.stringify(Object.fromEntries(cases.map(({ id, input }) => [id, input])), null, 2)}\n`;
}

function standardsTestCases(source, filename) {
  const tree = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  );
  requireValue(
    tree.parseDiagnostics.length === 0,
    `Cannot parse standards tests: ${filename}`,
  );
  const tests = [];
  const imports = new Map();
  for (const statement of tree.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      ts.isStringLiteral(statement.moduleSpecifier) &&
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings)
    ) {
      for (const element of statement.importClause.namedBindings.elements) {
        imports.set(element.name.text, {
          exportName: (element.propertyName ?? element.name).text,
          module: statement.moduleSpecifier.text,
        });
      }
    }
  }
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === "test" &&
      ts.isStringLiteralLike(node.arguments[0]) &&
      node.arguments[1]
    ) {
      const ids = new Set();
      let assertions = 0;
      const calls = [];
      function inspect(child) {
        if (
          ts.isElementAccessExpression(child) &&
          ts.isIdentifier(child.expression) &&
          child.expression.text === "cases" &&
          ts.isStringLiteralLike(child.argumentExpression)
        )
          ids.add(child.argumentExpression.text);
        if (
          ts.isCallExpression(child) &&
          ts.isIdentifier(child.expression) &&
          child.expression.text === "equal"
        )
          assertions += 1;
        if (
          ts.isCallExpression(child) &&
          ts.isIdentifier(child.expression) &&
          child.arguments[0] &&
          ts.isElementAccessExpression(child.arguments[0]) &&
          ts.isIdentifier(child.arguments[0].expression) &&
          child.arguments[0].expression.text === "cases" &&
          ts.isStringLiteralLike(child.arguments[0].argumentExpression)
        ) {
          const options = child.arguments[1];
          calls.push({
            callee: child.expression.text,
            caseId: child.arguments[0].argumentExpression.text,
            defaultOptions:
              child.arguments.length <= 2 &&
              (!options ||
                (ts.isObjectLiteralExpression(options) &&
                  options.properties.length === 0)),
            ...imports.get(child.expression.text),
          });
        }
        ts.forEachChild(child, inspect);
      }
      inspect(node.arguments[1]);
      tests.push({ title: node.arguments[0].text, ids, assertions, calls });
    }
    ts.forEachChild(node, visit);
  }
  visit(tree);
  return tests;
}

function auditStandardsCatalogue({
  sources,
  requirements,
  targets,
  cases,
  coverage,
  tests,
  failures = new Map(),
}) {
  const sourceIds = indexById(sources, "source");
  const requirementIds = indexById(requirements, "requirement");
  const targetIds = indexById(targets, "target", "package");
  const caseIds = indexById(cases, "case");
  for (const requirement of requirements) {
    requireValue(
      ["pilot", "backlog"].includes(requirement.state),
      `Invalid requirement state: ${requirement.id}`,
    );
    requireValue(
      typeof requirement.summary === "string" && requirement.summary.length > 0,
      `Missing requirement summary: ${requirement.id}`,
    );
    if (requirement.state === "backlog") {
      requireValue(
        requirement.reason,
        `Backlog requirement needs a reason: ${requirement.id}`,
      );
      continue;
    }
    const source = sourceIds.get(requirement.source);
    requireValue(source, `Unknown requirement source: ${requirement.id}`);
    requireValue(
      requirement.anchors?.length,
      `Missing requirement anchors: ${requirement.id}`,
    );
    for (const anchor of requirement.anchors)
      requireValue(
        source.anchors.includes(anchor),
        `Unharvested anchor: ${requirement.id}#${anchor}`,
      );
    requireValue(
      cases.some((item) => item.requirement === requirement.id),
      `Pilot requirement has no case: ${requirement.id}`,
    );
  }
  for (const item of cases) {
    requireValue(
      requirementIds.get(item.requirement)?.state === "pilot",
      `Unmapped case: ${item.id}`,
    );
    requireValue(
      typeof item.input === "string" && item.input.length > 0,
      `Missing case input: ${item.id}`,
    );
    requireValue(
      item.context && item.origin && item.notes,
      `Missing case provenance/context: ${item.id}`,
    );
    requireValue(
      [
        "standard-syntax",
        "specified-recovery",
        "draft-syntax",
        "extension",
      ].includes(item.classification),
      `Invalid case classification: ${item.id}`,
    );
  }
  const pairs = new Set();
  const counts = {
    covered: 0,
    "known-failure": 0,
    deferred: 0,
    "not-applicable": 0,
  };
  for (const record of coverage) {
    const key = `${record.target}/${record.caseId}/${record.profile}`;
    requireValue(!pairs.has(key), `Duplicate coverage: ${key}`);
    pairs.add(key);
    const target = targetIds.get(record.target);
    requireValue(
      target && caseIds.has(record.caseId),
      `Unknown coverage target/case: ${key}`,
    );
    requireValue(
      target.profiles.some(({ id }) => id === record.profile),
      `Unknown option profile: ${key}`,
    );
    requireValue(
      Object.hasOwn(counts, record.status),
      `Invalid coverage status: ${key}`,
    );
    counts[record.status] += 1;
    if (record.status === "covered") {
      const matches = (tests.get(record.target) ?? []).filter(
        ({ title, ids, assertions, calls }) =>
          /^\d{2,3} - /u.test(title) &&
          title.split(" - ")[1]?.split(" ")[0] === record.caseId &&
          ids.has(record.caseId) &&
          assertions > 0 &&
          calls.some(
            (call) =>
              call.caseId === record.caseId &&
              call.defaultOptions &&
              call.callee === target.entrypoint &&
              call.exportName === target.entrypoint &&
              call.module?.startsWith(".") &&
              path.posix.normalize(
                path.posix.join(path.posix.dirname(target.tests), call.module),
              ) === `dist/${target.package}.esm.js`,
          ),
      );
      requireValue(
        matches.length === 1,
        `Expected one numbered test using fixture and equal() with the imported package API and default options for ${key}`,
      );
    } else {
      requireValue(
        typeof record.reason === "string" && record.reason.length > 0,
        `Missing disposition reason: ${key}`,
      );
      if (record.status === "known-failure") {
        const matching = (failures.get(record.target) ?? []).filter(
          (entry) =>
            entry.caseId === record.caseId && entry.profile === record.profile,
        );
        requireValue(
          matching.length === 1 &&
            typeof matching[0].expectedResult === "string",
          `Missing local known-failure expectation: ${key}`,
        );
      }
    }
  }
  for (const target of targets) {
    indexById(target.profiles, `profile for ${target.package}`);
    requireValue(
      target.profiles.length === 1 &&
        target.profiles[0].id === "default" &&
        JSON.stringify(target.profiles[0].options) === "{}",
      `This pilot requires exactly the empty default option profile: ${target.package}`,
    );
    for (const item of cases) {
      for (const profile of target.profiles) {
        requireValue(
          pairs.has(`${target.package}/${item.id}/${profile.id}`),
          `Missing coverage disposition: ${target.package}/${item.id}/${profile.id}`,
        );
      }
    }
    for (const test of tests.get(target.package) ?? []) {
      for (const id of test.ids)
        requireValue(
          caseIds.has(id),
          `Test references unknown case: ${target.package}/${id}`,
        );
    }
    for (const failure of failures.get(target.package) ?? []) {
      requireValue(
        coverage.some(
          (record) =>
            record.target === target.package &&
            record.caseId === failure.caseId &&
            record.profile === failure.profile &&
            record.status === "known-failure",
        ),
        `Orphan known failure: ${target.package}/${failure.caseId}`,
      );
    }
  }
  return {
    cases: cases.length,
    targets: targets.length,
    pilotRequirements: requirements.filter(({ state }) => state === "pilot")
      .length,
    backlogRequirements: requirements.filter(({ state }) => state === "backlog")
      .length,
    ...counts,
  };
}

export {
  auditStandardsCatalogue,
  extractStandardsSections,
  sha256,
  standardsFixture,
  standardsTestCases,
  validateStandardsSources,
  validateStandardsTargets,
  verifySourceSnapshot,
};
