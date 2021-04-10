import tap from "tap";

import { createRequire } from "module";
const require1 = createRequire(import.meta.url);
const all = require1("../../src/rules/all.json");
const allWithEnt = require1("../../src/rules/all-with-ent.json");

// some sanity checks, are all external rules really inserted

tap.test("01 - allWithEnt", (t) => {
  t.true(allWithEnt.includes("bad-html-entity-malformed-quot"), "01.01");
  t.true(allWithEnt.includes("bad-html-entity-malformed-numeric"), "01.02");
  t.true(allWithEnt.includes("bad-html-entity-encoded-quot"), "01.03");
  t.true(allWithEnt.includes("bad-html-entity-unrecognised"), "01.04");
  t.true(allWithEnt.includes("bad-html-entity-multiple-encoding"), "01.05");
  t.end();
});

tap.test("02 - all", (t) => {
  t.false(all.includes("bad-html-entity-malformed-quot"), "02.01");
  t.true(all.includes("bad-html-entity-malformed-numeric"), "02.02");
  t.false(all.includes("bad-html-entity-encoded-quot"), "02.03");
  t.true(all.includes("bad-html-entity-unrecognised"), "02.04");
  t.true(all.includes("bad-html-entity-multiple-encoding"), "02.05");
  t.end();
});
