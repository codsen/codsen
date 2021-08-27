import tap from "tap";
import {
  notEmailFriendly,
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
} from "../dist/html-entities-not-email-friendly.esm.js";

tap.test(`01 - notEmailFriendly is set`, (t) => {
  t.ok(notEmailFriendly.Abreve === "#x102", "01");
  t.end();
});

tap.test(`02 - notEmailFriendlySetOnly is set`, (t) => {
  t.ok(notEmailFriendlySetOnly.size > 0, "02");
  t.end();
});

tap.test(`03 - notEmailFriendlyLowercaseSetOnly is set`, (t) => {
  t.ok(notEmailFriendlyLowercaseSetOnly.size > 0, "03");
  t.end();
});

tap.test(`04 - notEmailFriendlyMinLength is set`, (t) => {
  t.ok(notEmailFriendlyMinLength > 0, "04");
  t.end();
});

tap.test(`05 - notEmailFriendlyMaxLength is set`, (t) => {
  t.ok(notEmailFriendlyMaxLength > 0, "05");
  t.end();
});
