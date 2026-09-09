import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
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
} from "../npmDownloads.js";

test("01 - dates are strict UTC calendar days", () => {
  equal(NPM_HISTORY_START, "2015-01-10", "01.01");
  equal(assertDay("2024-02-29"), "2024-02-29", "01.02");
  for (const value of [
    "2023-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-01-00",
    "2026-1-01",
    "2026-01-01T00:00:00Z",
    " 2026-01-01",
    null,
    20260101,
  ]) {
    throws(() => assertDay(value), /Invalid UTC calendar day/);
  }
});

test("02 - day offsets cross leap days and year boundaries in UTC", () => {
  equal(addDays("2024-02-28", 2), "2024-03-01", "02.01");
  equal(addDays("2026-01-01", -1), "2025-12-31", "02.02");
  equal(addDays("2026-03-29", 1), "2026-03-30", "02.03");
  equal(addDays("2026-09-09", 0), "2026-09-09", "02.04");
  for (const offset of [0.5, NaN, Infinity, "1", Number.MAX_SAFE_INTEGER]) {
    throws(() => addDays("2026-09-09", offset));
  }
  throws(() => addDays("9999-12-31", 1), /Invalid UTC calendar day/);
  throws(() => addDays("0000-01-01", -1), /Invalid UTC calendar day/);
});

test("03 - package filenames preserve scopes and reject unsafe names", () => {
  equal(
    packageFile("string-strip-html"),
    "packages/string-strip-html.ndjson",
    "03.01",
  );
  equal(packageFile("@codsen/data"), "packages/@codsen/data.ndjson", "03.02");
  for (const name of [
    "../escape",
    "/absolute",
    "a/b",
    "@scope/../escape",
    "@scope/..",
    "@scope/name/extra",
    "a\\b",
    "%2e%2e",
    "",
    "__proto__",
    "constructor",
    "prototype",
    "toString",
    "@constructor/name",
    "@scope/constructor",
    "a".repeat(215),
    null,
  ]) {
    throws(() => packageFile(name), /Invalid npm archive package name/);
  }
});

test("04 - inclusive range planning splits at the day limit", () => {
  equal(
    planRanges("2024-02-28", "2024-03-03", 2),
    [
      { start: "2024-02-28", end: "2024-02-29" },
      { start: "2024-03-01", end: "2024-03-02" },
      { start: "2024-03-03", end: "2024-03-03" },
    ],
    "04.01",
  );
  equal(
    planRanges("2024-01-01", "2024-12-31"),
    [
      { start: "2024-01-01", end: "2024-12-30" },
      { start: "2024-12-31", end: "2024-12-31" },
    ],
    "04.02",
  );
  equal(
    planRanges("9999-12-31", "9999-12-31", Number.MAX_SAFE_INTEGER),
    [{ start: "9999-12-31", end: "9999-12-31" }],
    "04.03",
  );
  throws(() => planRanges("2026-09-09", "2026-09-08"), /after end/);
  for (const maxDays of [0, -1, 1.5, Infinity, "365"]) {
    throws(() => planRanges("2026-09-01", "2026-09-09", maxDays));
  }
});

test("05 - NDJSON roundtrips without changing zero or large safe counts", () => {
  const text =
    '{"day":"2026-09-01","downloads":0}\n{"day":"2026-09-02","downloads":9007199254740991}\n';
  equal(
    parseNdjson(text),
    [
      { day: "2026-09-01", downloads: 0 },
      { day: "2026-09-02", downloads: Number.MAX_SAFE_INTEGER },
    ],
    "05.01",
  );
  equal(serializeNdjson(parseNdjson(text)), text, "05.02");
  equal(parseNdjson(""), [], "05.03");
  equal(serializeNdjson([]), "", "05.04");
  equal(
    serializeNdjson(parseNdjson('{ "downloads": 3, "day": "2026-09-01" }\n')),
    '{"day":"2026-09-01","downloads":3}\n',
    "05.05",
  );
});

test("06 - archives reject broken framing and noncanonical day order", () => {
  const row = '{"day":"2026-09-01","downloads":0}';
  for (const text of [
    row,
    `${row}\r\n`,
    `${row}\n\n`,
    "\n",
    `\uFEFF${row}\n`,
    "{bad}\n",
  ]) {
    throws(() => parseNdjson(text, "test fixture"), /test fixture/);
  }
  throws(() => parseNdjson(`${row}\n${row}\n`), /unique/);
  throws(
    () => parseNdjson(`{"day":"2026-09-02","downloads":1}\n${row}\n`),
    /ascending order/,
  );
  throws(() => parseNdjson(null), /must be a string/);
});

test("07 - rows require exact keys and nonnegative safe integer counts", () => {
  for (const row of [
    null,
    [],
    { day: "2026-09-01" },
    { day: "2026-09-01", downloads: 1, extra: true },
    { day: "2026-09-01", downloads: -1 },
    { day: "2026-09-01", downloads: 1.5 },
    { day: "2026-09-01", downloads: "1" },
    { day: "2026-09-01", downloads: null },
    { day: "2026-09-01", downloads: Number.MAX_SAFE_INTEGER + 1 },
    { day: "2026-02-29", downloads: 1 },
  ]) {
    throws(() => parseNdjson(`${JSON.stringify(row)}\n`));
    throws(() => serializeNdjson([row]));
  }
  throws(() => serializeNdjson([{ day: "2026-09-01", downloads: Infinity }]));
  throws(() => serializeNdjson(new Array(1)));
  throws(() => serializeNdjson(null));
  throws(
    () =>
      serializeNdjson([
        { day: "2026-09-02", downloads: 1 },
        { day: "2026-09-01", downloads: 1 },
      ]),
    /ascending order/,
  );
});

test("08 - npm responses must identify the exact package and full interval", () => {
  const payload = {
    package: "string-strip-html",
    start: "2026-09-01",
    end: "2026-09-02",
    downloads: [
      { day: "2026-09-02", downloads: 0 },
      { day: "2026-09-01", downloads: 101 },
    ],
  };
  const validate = (value) =>
    validateRangeResponse(
      "string-strip-html",
      "2026-09-01",
      "2026-09-02",
      value,
    );
  equal(
    validate(payload),
    [
      { day: "2026-09-01", downloads: 101 },
      { day: "2026-09-02", downloads: 0 },
    ],
    "08.01",
  );
  for (const invalid of [
    null,
    { ...payload, package: "other" },
    { ...payload, start: "2026-08-31" },
    { ...payload, end: "2026-09-03" },
    { ...payload, downloads: [] },
    { ...payload, downloads: [payload.downloads[0]] },
    { ...payload, downloads: [payload.downloads[0], payload.downloads[0]] },
    {
      ...payload,
      downloads: [payload.downloads[0], { day: "2026-08-31", downloads: 101 }],
    },
    {
      ...payload,
      downloads: [...payload.downloads, { day: "2026-09-03", downloads: 0 }],
    },
  ]) {
    throws(() => validate(invalid));
  }
});

test("09 - merges add missing dates and replace source corrections", () => {
  const previous = Object.freeze([
    Object.freeze({ day: "2026-09-01", downloads: 12 }),
    Object.freeze({ day: "2026-09-03", downloads: 0 }),
  ]);
  const incoming = Object.freeze([
    Object.freeze({ day: "2026-09-04", downloads: 7 }),
    Object.freeze({ day: "2026-09-03", downloads: 18 }),
    Object.freeze({ day: "2026-09-01", downloads: 12 }),
    Object.freeze({ day: "2026-09-02", downloads: 0 }),
  ]);
  const result = mergeDownloads(previous, incoming);
  equal(
    result,
    {
      rows: [
        { day: "2026-09-01", downloads: 12 },
        { day: "2026-09-02", downloads: 0 },
        { day: "2026-09-03", downloads: 18 },
        { day: "2026-09-04", downloads: 7 },
      ],
      added: 2,
      corrected: 1,
    },
    "09.01",
  );
  equal(
    mergeDownloads(result.rows, incoming),
    { rows: result.rows, added: 0, corrected: 0 },
    "09.02",
  );
  equal(mergeDownloads([], []), { rows: [], added: 0, corrected: 0 }, "09.03");
  equal(previous[1].downloads, 0, "09.04");
});

test("10 - duplicate or invalid merge observations never win silently", () => {
  const row = { day: "2026-09-01", downloads: 1 };
  throws(() => mergeDownloads([row, row], []), /unique/);
  throws(() => mergeDownloads([], [row, row]), /unique/);
  throws(() => mergeDownloads([], [{ ...row, downloads: -1 }]), /safe integer/);
  throws(() => mergeDownloads(null, []), /expected an array/);
});

test("11 - gap detection preserves zero observations and ignores outside days", () => {
  const rows = [
    { day: "2026-08-31", downloads: 10 },
    { day: "2026-09-02", downloads: 0 },
    { day: "2026-09-05", downloads: 10 },
    { day: "2026-09-09", downloads: 10 },
  ];
  equal(
    missingRanges(rows, "2026-09-01", "2026-09-07"),
    [
      { start: "2026-09-01", end: "2026-09-01" },
      { start: "2026-09-03", end: "2026-09-04" },
      { start: "2026-09-06", end: "2026-09-07" },
    ],
    "11.01",
  );
  equal(
    missingRanges([], "2026-09-01", "2026-09-07"),
    [{ start: "2026-09-01", end: "2026-09-07" }],
    "11.02",
  );
  equal(missingRanges(rows, "2026-09-02", "2026-09-02"), [], "11.03");
  equal(
    missingRanges(
      [{ day: "9999-12-31", downloads: 0 }],
      "9999-12-31",
      "9999-12-31",
    ),
    [],
    "11.04",
  );
  throws(
    () => missingRanges([rows[0], rows[0]], "2026-09-01", "2026-09-07"),
    /unique/,
  );
});

test("12 - shared isolated zeros are flagged without modifying source counts", () => {
  const rows = Object.freeze([
    Object.freeze({ day: "2026-09-02", downloads: 100 }),
    Object.freeze({ day: "2026-09-03", downloads: 0 }),
    Object.freeze({ day: "2026-09-04", downloads: 101 }),
  ]);
  equal(
    findSharedZeroDays({ zebra: rows, beta: rows, alpha: rows }),
    [{ day: "2026-09-03", packages: ["alpha", "beta", "zebra"] }],
    "12.01",
  );
  equal(rows[1].downloads, 0, "12.02");
  equal(findSharedZeroDays({ alpha: rows, beta: rows }), [], "12.03");
  equal(findSharedZeroDays({}), [], "12.04");
});

test("13 - anomaly detection excludes low traffic and incomplete adjacent days", () => {
  const cases = [
    [
      { day: "2026-09-02", downloads: 99 },
      { day: "2026-09-03", downloads: 0 },
      { day: "2026-09-04", downloads: 100 },
    ],
    [
      { day: "2026-09-02", downloads: 100 },
      { day: "2026-09-03", downloads: 0 },
      { day: "2026-09-04", downloads: 99 },
    ],
    [
      { day: "2026-09-01", downloads: 100 },
      { day: "2026-09-03", downloads: 0 },
      { day: "2026-09-04", downloads: 100 },
    ],
    [
      { day: "2026-09-02", downloads: 100 },
      { day: "2026-09-03", downloads: 0 },
      { day: "2026-09-05", downloads: 100 },
    ],
    [
      { day: "2026-09-02", downloads: 100 },
      { day: "2026-09-03", downloads: 0 },
    ],
    [
      { day: "2026-09-03", downloads: 0 },
      { day: "2026-09-04", downloads: 100 },
    ],
  ];
  equal(
    cases.map((rows) => findSharedZeroDays({ a: rows, b: rows, c: rows })),
    cases.map(() => []),
    "13.01",
  );
});

test("14 - anomaly results sort days and reject invalid package series", () => {
  const rows = [
    { day: "2026-09-01", downloads: 100 },
    { day: "2026-09-02", downloads: 0 },
    { day: "2026-09-03", downloads: 100 },
    { day: "2026-09-04", downloads: 0 },
    { day: "2026-09-05", downloads: 100 },
  ];
  equal(
    findSharedZeroDays({ c: rows, a: rows, b: rows }),
    [
      { day: "2026-09-02", packages: ["a", "b", "c"] },
      { day: "2026-09-04", packages: ["a", "b", "c"] },
    ],
    "14.01",
  );
  throws(() => findSharedZeroDays(null), /plain object/);
  throws(() => findSharedZeroDays([]), /plain object/);
  throws(
    () => findSharedZeroDays({ constructor: rows }),
    /Invalid npm archive package name/,
  );
  throws(() => findSharedZeroDays({ a: [rows[0], rows[0]] }), /unique/);
});

test.run();
