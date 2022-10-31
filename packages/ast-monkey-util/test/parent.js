import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { parent } from "../dist/ast-monkey-util.esm.js";

test(`01`, () => {
  equal(parent(""), null, "01.01");
});

test(`02`, () => {
  equal(parent("0"), null, "02.01");
});

test(`03`, () => {
  equal(parent("1"), null, "03.01");
});

test(`04`, () => {
  equal(parent("a"), null, "04.01");
});

test(`05`, () => {
  equal(parent("1.z"), "1", "05.01");
});

test(`06`, () => {
  equal(parent("a.b"), "a", "06.01");
});

test(`07`, () => {
  equal(parent("a.b.c"), "b", "07.01");
});

test(`08`, () => {
  equal(parent("a.0.c"), "0", "08.01");
});

test(`09`, () => {
  equal(parent("9.children.3"), "children", "09.01");
});

test(`10`, () => {
  equal(parent("9.children.1.children.2"), "children", "10.01");
});

test.run();
