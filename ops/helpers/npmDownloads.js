const NPM_HISTORY_START = "2015-01-10";
const DAY_MS = 86_400_000;
const RESERVED_NAMES = new Set([
  ...Object.getOwnPropertyNames(Object.prototype),
  "prototype",
]);

function assertDay(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(Date.parse(`${value}T00:00:00.000Z`)) ||
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`Invalid UTC calendar day: ${String(value)}`);
  }
  return value;
}

function addDays(day, count) {
  assertDay(day);
  if (!Number.isSafeInteger(count)) {
    throw new Error("Day offset must be a safe integer");
  }
  const time = Date.parse(`${day}T00:00:00.000Z`) + count * DAY_MS;
  if (!Number.isFinite(time) || Math.abs(time) > 8.64e15) {
    throw new Error("Day offset exceeds the supported calendar");
  }
  return assertDay(new Date(time).toISOString().slice(0, 10));
}

function packageFile(name) {
  if (
    typeof name !== "string" ||
    name.length > 214 ||
    !/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name) ||
    name
      .replace(/^@/, "")
      .split("/")
      .some((part) => RESERVED_NAMES.has(part))
  ) {
    throw new Error(`Invalid npm archive package name: ${String(name)}`);
  }
  return `packages/${name}.ndjson`;
}

function assertBounds(start, end) {
  assertDay(start);
  assertDay(end);
  if (start > end) {
    throw new Error(`Range start ${start} is after end ${end}`);
  }
}

function planRanges(start, end, maxDays = 365) {
  assertBounds(start, end);
  if (!Number.isSafeInteger(maxDays) || maxDays < 1) {
    throw new Error("Maximum range days must be a positive safe integer");
  }
  const ranges = [];
  let cursor = start;
  while (cursor <= end) {
    const remaining =
      (Date.parse(`${end}T00:00:00.000Z`) -
        Date.parse(`${cursor}T00:00:00.000Z`)) /
        DAY_MS +
      1;
    const rangeEnd = addDays(cursor, Math.min(maxDays, remaining) - 1);
    ranges.push({ start: cursor, end: rangeEnd });
    if (rangeEnd === end) {
      break;
    }
    cursor = addDays(rangeEnd, 1);
  }
  return ranges;
}

function plainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

function canonicalRow(row, context) {
  if (
    !plainObject(row) ||
    Reflect.ownKeys(row).length !== 2 ||
    !Object.hasOwn(row, "day") ||
    !Object.hasOwn(row, "downloads")
  ) {
    throw new Error(`${context}: each row must contain only day and downloads`);
  }
  assertDay(row.day);
  if (!Number.isSafeInteger(row.downloads) || row.downloads < 0) {
    throw new Error(`${context}: downloads must be a nonnegative safe integer`);
  }
  return { day: row.day, downloads: row.downloads };
}

function canonicalRows(rows, context, sort = true) {
  if (!Array.isArray(rows)) {
    throw new Error(`${context}: expected an array of daily download rows`);
  }
  const result = Array.from(rows, (row, index) =>
    canonicalRow(row, `${context}, row ${index + 1}`),
  );
  if (sort) {
    result.sort((a, b) => (a.day < b.day ? -1 : a.day > b.day ? 1 : 0));
  }
  for (let index = 1; index < result.length; index++) {
    if (result[index - 1].day >= result[index].day) {
      throw new Error(
        `${context}: dates must be unique${sort ? "" : " and in ascending order"} (${result[index].day})`,
      );
    }
  }
  return result;
}

function parseNdjson(text, context = "archive") {
  if (typeof text !== "string") {
    throw new Error(`${context}: NDJSON must be a string`);
  }
  if (text === "") {
    return [];
  }
  if (!text.endsWith("\n") || text.includes("\r")) {
    throw new Error(`${context}: NDJSON requires LF lines and a final newline`);
  }
  const rows = text
    .slice(0, -1)
    .split("\n")
    .map((line, index) => {
      try {
        return JSON.parse(line);
      } catch {
        throw new Error(`${context}: invalid JSON on line ${index + 1}`);
      }
    });
  return canonicalRows(rows, context, false);
}

function serializeNdjson(rows) {
  return canonicalRows(rows, "archive", false)
    .map((row) => `${JSON.stringify(row)}\n`)
    .join("");
}

function validateRangeResponse(name, start, end, payload) {
  packageFile(name);
  assertBounds(start, end);
  if (
    !plainObject(payload) ||
    payload.package !== name ||
    payload.start !== start ||
    payload.end !== end
  ) {
    throw new Error(
      `${name}: npm response package or date bounds do not match`,
    );
  }
  const rows = canonicalRows(payload.downloads, `${name} npm response`);
  const expectedLength =
    (Date.parse(`${end}T00:00:00.000Z`) -
      Date.parse(`${start}T00:00:00.000Z`)) /
      DAY_MS +
    1;
  if (
    rows.length !== expectedLength ||
    rows.some((row, index) => row.day !== addDays(start, index))
  ) {
    throw new Error(`${name}: npm response must contain every requested day`);
  }
  return rows;
}

function mergeDownloads(previous, incoming) {
  const existing = canonicalRows(previous, "previous archive");
  const updates = canonicalRows(incoming, "incoming downloads");
  const byDay = new Map(existing.map((row) => [row.day, row]));
  let added = 0;
  let corrected = 0;
  for (const row of updates) {
    const old = byDay.get(row.day);
    if (!old) {
      added++;
    } else if (old.downloads !== row.downloads) {
      corrected++;
    }
    byDay.set(row.day, row);
  }
  return {
    rows: [...byDay.values()].sort((a, b) =>
      a.day < b.day ? -1 : a.day > b.day ? 1 : 0,
    ),
    added,
    corrected,
  };
}

function missingRanges(rows, start, end) {
  assertBounds(start, end);
  const existing = canonicalRows(rows, "archive");
  const result = [];
  let cursor = start;
  for (const row of existing) {
    if (row.day < cursor) {
      continue;
    }
    if (row.day > end) {
      break;
    }
    if (row.day > cursor) {
      result.push({ start: cursor, end: addDays(row.day, -1) });
    }
    if (row.day === end) {
      return result;
    }
    cursor = addDays(row.day, 1);
  }
  if (cursor <= end) {
    result.push({ start: cursor, end });
  }
  return result;
}

function findSharedZeroDays(seriesByPackage) {
  if (!plainObject(seriesByPackage)) {
    throw new Error("Download series must be a plain object keyed by package");
  }
  const byDay = new Map();
  for (const [name, values] of Object.entries(seriesByPackage)) {
    packageFile(name);
    const rows = canonicalRows(values, name);
    for (let index = 1; index < rows.length - 1; index++) {
      const row = rows[index];
      const previous = rows[index - 1];
      const next = rows[index + 1];
      if (
        row.downloads === 0 &&
        previous.downloads >= 100 &&
        next.downloads >= 100 &&
        previous.day === addDays(row.day, -1) &&
        next.day === addDays(row.day, 1)
      ) {
        const packages = byDay.get(row.day) ?? [];
        packages.push(name);
        byDay.set(row.day, packages);
      }
    }
  }
  return [...byDay.entries()]
    .filter(([, packages]) => packages.length >= 3)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([day, packages]) => ({ day, packages: packages.sort() }));
}

export {
  addDays,
  assertDay,
  findSharedZeroDays,
  mergeDownloads,
  missingRanges,
  NPM_HISTORY_START,
  packageFile,
  parseNdjson,
  planRanges,
  serializeNdjson,
  validateRangeResponse,
};
