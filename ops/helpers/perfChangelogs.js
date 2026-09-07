import { remark } from "remark";

import {
  compareSemver,
  parseSemver,
} from "../lect/common/cliUpdateNotifier.js";

const parser = remark();
const BOOKKEEPING = new Set(["lastVersion", "lastSlowerRun"]);
const PERFORMANCE_HEADING = "Performance Improvements";

function nodeText(node) {
  return node.value ?? node.children?.map(nodeText).join("") ?? "";
}

function releaseVersion(node) {
  if (node.type !== "heading") {
    return null;
  }
  const candidate = nodeText(node).trim().split(/\s/, 1)[0].replace(/^v/, "");
  return parseSemver(candidate) ? candidate : null;
}

function validReleaseDate(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(`${value}T00:00:00Z`)) &&
    new Date(`${value}T00:00:00Z`).toISOString().startsWith(value)
  );
}

function changelogReleases(source) {
  return parser.parse(source).children.flatMap((node) => {
    const version = releaseVersion(node);
    if (!version) {
      return [];
    }
    const date = nodeText(node).match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0];
    return [{ version, date: validReleaseDate(date) ? date : null }];
  });
}

// Only retained, version-keyed scores define comparable releases. A rejected
// measurement and the duplicated latest score never create another version.
function perfVersionComparisons(
  history,
  { unchangedTolerancePercent = 2 } = {},
) {
  if (!history || typeof history !== "object" || Array.isArray(history)) {
    throw new Error("Performance history must be an object");
  }
  if (
    !Number.isFinite(unchangedTolerancePercent) ||
    unchangedTolerancePercent < 0
  ) {
    throw new Error(
      "Performance tolerance must be a non-negative finite number",
    );
  }
  const entries = [];
  for (const [version, score] of Object.entries(history)) {
    if (BOOKKEEPING.has(version)) {
      continue;
    }
    if (!parseSemver(version)) {
      throw new Error(`Invalid performance history version: ${version}`);
    }
    if (typeof score !== "number" || !Number.isFinite(score) || score <= 0) {
      throw new Error(`Invalid normalized score for ${version}`);
    }
    entries.push({ version, score });
  }
  entries.sort((left, right) => compareSemver(left.version, right.version));
  return entries.slice(1).map((entry, index) => {
    const previous = entries[index];
    if (compareSemver(previous.version, entry.version) === 0) {
      throw new Error(
        `Ambiguous performance versions: ${previous.version} and ${entry.version}`,
      );
    }
    const changePercent =
      ((entry.score - previous.score) / previous.score) * 100;
    if (!Number.isFinite(changePercent)) {
      throw new Error(
        `Unrepresentable performance change for ${entry.version}`,
      );
    }
    return {
      ...entry,
      baselineVersion: previous.version,
      baselineScore: previous.score,
      changePercent,
      materialGain: changePercent > unchangedTolerancePercent,
      unchangedTolerancePercent,
    };
  });
}

function percentage(value, tolerance) {
  // Keep the usual two decimal places, but do not round a material gain down
  // into the noise band in the uncommon case just above its boundary.
  for (let digits = 2; digits <= 12; digits += 1) {
    const rounded = Number(value.toFixed(digits));
    if (rounded > tolerance) {
      return String(rounded);
    }
  }
  return String(value);
}

function groupQuantity(value) {
  // Group only the integer portion; retain the existing decimal precision.
  return String(value).replace(/^\d+/, (integer) =>
    integer.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  );
}

function perfGainBullet(comparison) {
  const {
    changePercent,
    baselineVersion,
    baselineScore,
    score,
    unchangedTolerancePercent = 2,
  } = comparison;
  return `- Recorded a ${groupQuantity(percentage(changePercent, unchangedTolerancePercent))}% higher normalized benchmark score than v${baselineVersion} (${groupQuantity(baselineScore)} → ${groupQuantity(score)}).`;
}

function isManagedItem(node) {
  if (node.type !== "listItem") {
    return false;
  }
  const match = nodeText(node)
    .replace(/\s+/g, " ")
    .trim()
    .match(
      /^Recorded a [\d,.e+-]+% higher normalized benchmark score than v(\S+?)(?: \([\d,.e+-]+ → [\d,.e+-]+\))?\.$/,
    );
  return !!match && !!parseSemver(match[1]);
}

function applyEdits(source, edits) {
  return edits
    .sort((left, right) => right.start - left.start)
    .reduce(
      (result, { start, end, text }) =>
        result.slice(0, start) + text + result.slice(end),
      source,
    );
}

function syncPerfChangelog({
  changelog,
  history,
  versionDates = {},
  unchangedTolerancePercent = 2,
}) {
  if (typeof changelog !== "string") {
    throw new Error("Changelog must be a string");
  }
  const comparisons = perfVersionComparisons(history, {
    unchangedTolerancePercent,
  });
  const eol = changelog.includes("\r\n") ? "\r\n" : "\n";
  let result = changelog;
  const changes = [];
  const unresolved = [];

  for (const comparison of [...comparisons].reverse()) {
    const { version, materialGain } = comparison;
    const nodes = parser.parse(result).children;
    const releases = nodes.filter((node) => releaseVersion(node));
    const matches = releases.filter((node) => releaseVersion(node) === version);
    if (matches.length > 1) {
      throw new Error(`Duplicate changelog release heading for ${version}`);
    }
    const release = matches[0];
    const bullet = materialGain ? perfGainBullet(comparison) : null;

    if (!release) {
      if (!materialGain) {
        continue;
      }
      const evidence = versionDates[version];
      const date = typeof evidence === "string" ? evidence : evidence?.date;
      if (!validReleaseDate(date)) {
        unresolved.push({
          ...comparison,
          reason: "Missing verified release date",
        });
        continue;
      }
      const nextRelease = releases.find(
        (node) => compareSemver(releaseVersion(node), version) < 0,
      );
      const insertion = nextRelease?.position.start.offset ?? result.length;
      const prefix =
        insertion && !result.slice(0, insertion).endsWith(`${eol}${eol}`)
          ? result.slice(0, insertion).endsWith(eol)
            ? eol
            : `${eol}${eol}`
          : "";
      const section = `## ${version} (${date})${eol}${eol}### ${PERFORMANCE_HEADING}${eol}${eol}${bullet}${eol}${eol}`;
      result =
        result.slice(0, insertion) + prefix + section + result.slice(insertion);
      changes.push({ ...comparison, kind: "release", date, evidence });
      continue;
    }

    const releaseIndex = releases.indexOf(release);
    const end =
      releases[releaseIndex + 1]?.position.start.offset ?? result.length;
    const body = nodes.filter(
      (node) =>
        node.position.start.offset > release.position.start.offset &&
        node.position.start.offset < end,
    );
    const performance = body.find(
      (node) =>
        node.type === "heading" && nodeText(node) === PERFORMANCE_HEADING,
    );
    const performanceEnd = performance
      ? (body.find(
          (node) =>
            node.type === "heading" &&
            node.position.start.offset > performance.position.start.offset &&
            node.depth <= performance.depth,
        )?.position.start.offset ?? end)
      : null;
    const managed = body.flatMap((node) =>
      node.type === "list" ? node.children.filter(isManagedItem) : [],
    );
    const first = performance
      ? managed.find(
          (node) =>
            node.position.start.offset > performance.position.start.offset &&
            node.position.start.offset < performanceEnd,
        )
      : null;
    // The cleaner removes a leading bump-only note together with the release
    // heading. Keep the note, but move it behind the substantive gain when an
    // existing performance section would otherwise leave it first.
    const leadingNote =
      bullet &&
      performance &&
      body[0]?.type === "paragraph" &&
      result
        .slice(body[0].position.start.offset, body[0].position.end.offset)
        .startsWith("**Note:** Version bump only")
        ? body[0]
        : null;
    const note = leadingNote
      ? `${eol}${eol}${result.slice(leadingNote.position.start.offset, leadingNote.position.end.offset)}`
      : "";
    const edits = managed.map((node) => ({
      start: node.position.start.offset,
      end: node.position.end.offset,
      text: node === first && bullet ? bullet + note : "",
    }));
    if (leadingNote) {
      edits.push({
        start: leadingNote.position.start.offset,
        end: leadingNote.position.end.offset,
        text: "",
      });
    }
    if (bullet && !first) {
      const heading = performance ?? release;
      const suffix = result.slice(heading.position.end.offset);
      const separator = suffix.startsWith(`${eol}${eol}`)
        ? ""
        : suffix.startsWith(eol)
          ? eol
          : `${eol}${eol}`;
      edits.push({
        start: heading.position.end.offset,
        end: heading.position.end.offset,
        text: `${eol}${eol}${performance ? "" : `### ${PERFORMANCE_HEADING}${eol}${eol}`}${bullet}${note}${separator}`,
      });
    }
    const updated = applyEdits(result, edits);
    if (updated !== result) {
      changes.push({ ...comparison, kind: bullet ? "bullet" : "remove-stale" });
      result = updated;
    }
  }
  return { result, changes, unresolved, comparisons };
}

export {
  changelogReleases,
  perfGainBullet,
  perfVersionComparisons,
  syncPerfChangelog,
  validReleaseDate,
};
