import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { createRequire } from "module";

const require1 = createRequire(import.meta.url);
const all = require1("../../src/rules/all.json");
const allWithEnt = require1("../../src/rules/all-with-ent.json");

// some sanity checks, are all external rules really inserted

test("01 - allWithEnt", () => {
  ok(allWithEnt.includes("bad-html-entity-malformed-quot"), "01.01");
  ok(allWithEnt.includes("bad-html-entity-malformed-numeric"), "01.02");
  ok(allWithEnt.includes("bad-html-entity-encoded-quot"), "01.03");
  ok(allWithEnt.includes("bad-html-entity-unrecognised"), "01.04");
  ok(allWithEnt.includes("bad-html-entity-multiple-encoding"), "01.05");
});

test("02 - all", () => {
  not.ok(all.includes("bad-html-entity-malformed-quot"), "02.01");
  ok(all.includes("bad-html-entity-malformed-numeric"), "02.02");
  not.ok(all.includes("bad-html-entity-encoded-quot"), "02.03");
  ok(all.includes("bad-html-entity-unrecognised"), "02.04");
  ok(all.includes("bad-html-entity-multiple-encoding"), "02.05");
});

test.run();
