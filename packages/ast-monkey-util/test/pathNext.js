import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { pathNext } from "../dist/ast-monkey-util.esm.js";

test(`01`, () => {
  equal(pathNext("0"), "1", "01");
});

test(`02`, () => {
  equal(pathNext("1"), "2", "02");
});

test(`03`, () => {
  equal(pathNext("1.z"), "1.z", "03");
});

test(`04`, () => {
  equal(pathNext("9.children.3"), "9.children.4", "04");
});

test(`05`, () => {
  equal(pathNext("9.children.1.children.0"), "9.children.1.children.1", "05");
});

test.run();
