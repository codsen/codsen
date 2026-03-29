// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  notEmailFriendly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMaxLength,
  notEmailFriendlyMinLength,
  notEmailFriendlySetOnly,
} from "../dist/html-entities-not-email-friendly.esm.js";

test("01 - notEmailFriendly is set", () => {
  ok(notEmailFriendly.Abreve === "#x102", "01.01");
});

test("02 - notEmailFriendlySetOnly is set", () => {
  ok(notEmailFriendlySetOnly.size > 0, "02.01");
});

test("03 - notEmailFriendlyLowercaseSetOnly is set", () => {
  ok(notEmailFriendlyLowercaseSetOnly.size > 0, "03.01");
});

test("04 - notEmailFriendlyMinLength is set", () => {
  ok(notEmailFriendlyMinLength > 0, "04.01");
});

test("05 - notEmailFriendlyMaxLength is set", () => {
  ok(notEmailFriendlyMaxLength > 0, "05.01");
});

test.run();
