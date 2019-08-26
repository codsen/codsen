import test from "ava";
import { notEmailFriendly } from "../dist/html-entities-not-email-friendly.esm";

test(`1 - notEmailFriendly is set`, t => {
  t.true(notEmailFriendly.Abreve === "#x102");
});
