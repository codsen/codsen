// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";
import fix from "./util/util.js";

test(`01 - false positives - legit pound, no decode`, () => {
  let inp1 = "one pound;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: false,
    }),
    [],
    "01.01",
  );
});

test(`02 - false positives - legit pound, no decode`, () => {
  let inp1 = "one pound;";
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: true,
    }),
    [],
    "02.01",
  );
});

test("03", () => {
  let gathered = [];
  let inp1 =
    '<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>';
  equal(
    fixEnt(inp1, {
      cb: (obj) => obj,
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "03.01",
  );
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: true,
      textAmpersandCatcherCb: () => {
        // nothing
      },
    }),
    [],
    "03.02",
  );
  equal(gathered, [55], "03.03");
});

test("04", () => {
  let gathered = [];
  let inp1 =
    '<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>';
  equal(
    fixEnt(inp1, {
      cb: (obj) => obj,
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "04.01",
  );
  equal(
    fix(ok, inp1, {
      cb: (obj) => obj,
      decode: false,
      textAmpersandCatcherCb: () => {},
    }),
    [],
    "04.02",
  );
  equal(gathered, [55], "04.03");
});

test.run();
