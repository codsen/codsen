import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import fix from "./util/util.js";
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

test(`01 - ${`\u001b[${36}m${"false positives"}\u001b[${39}m`} - legit pound, no decode`, () => {
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

test(`02 - ${`\u001b[${36}m${"false positives"}\u001b[${39}m`} - legit pound, no decode`, () => {
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
