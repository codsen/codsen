const t = require("tap");
const {
  notEmailFriendly,
  notEmailFriendlySetOnly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
} = require("../dist/html-entities-not-email-friendly.cjs");

t.test(`1 - notEmailFriendly is set`, (t) => {
  t.ok(notEmailFriendly.Abreve === "#x102");
  t.end();
});

t.test(`2 - notEmailFriendlySetOnly is set`, (t) => {
  t.ok(notEmailFriendlySetOnly.size > 0);
  t.end();
});

t.test(`3 - notEmailFriendlyLowercaseSetOnly is set`, (t) => {
  t.ok(notEmailFriendlyLowercaseSetOnly.size > 0);
  t.end();
});

t.test(`4 - notEmailFriendlyMinLength is set`, (t) => {
  t.ok(notEmailFriendlyMinLength > 0);
  t.end();
});

t.test(`5 - notEmailFriendlyMaxLength is set`, (t) => {
  t.ok(notEmailFriendlyMaxLength > 0);
  t.end();
});
