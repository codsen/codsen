const t = require("tap");
const {
  notEmailFriendly
} = require("../dist/html-entities-not-email-friendly.cjs");

t.test(`1 - notEmailFriendly is set`, t => {
  t.ok(notEmailFriendly.Abreve === "#x102");
  t.end();
});
