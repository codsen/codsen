/* eslint-disable no-prototype-builtins */
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import api from "../dist/remark-conventional-commit-changelog-timeline.esm.js";

// API wirings
// -----------------------------------------------------------------------------

test(`01 - a function is exported`, () => {
  equal(typeof api, "function", "01.01");
});

test.run();
