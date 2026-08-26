// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { mixer } from "../dist/test-mixer.esm.js";

const callerDir = path.resolve(".");

const ref = { stripHtml: true };
const defaultsObj = {
  fixBrokenEntities: true,
  removeWidows: true,
  convertEntities: true,
  convertDashes: true,
  convertApostrophes: true,
  replaceLineBreaks: true,
  stripHtml: false,
  eol: "lf",
  stripHtmlButIgnoreTags: ["b", "strong"],
};
const variedKeys = [
  "fixBrokenEntities",
  "removeWidows",
  "convertEntities",
  "convertDashes",
  "convertApostrophes",
  "replaceLineBreaks",
];

const testme = () => mixer(ref, defaultsObj);

// Audit the representative workload once, outside the timed callback.
{
  const rows = testme();
  assert.equal(rows.length, 64);
  assert.equal(
    new Set(
      rows.map((row) => variedKeys.map((key) => Number(row[key])).join("")),
    ).size,
    64,
  );
  assert.ok(rows.every((row) => row.stripHtml && row.eol === "lf"));
  assert.ok(
    rows.every(
      (row) =>
        row.stripHtmlButIgnoreTags !== defaultsObj.stripHtmlButIgnoreTags,
    ),
  );
  assert.equal(
    new Set(rows.map((row) => row.stripHtmlButIgnoreTags)).size,
    rows.length,
  );
}

// action
runPerf(testme, callerDir);
