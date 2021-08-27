import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm.js";
// const BACKSLASH = "\u005C";

// ESP code cases
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${`ESP`}\u001b[${39}m`} - the Killer Triplet`,
  (t) => {
    const str = `<a b="c{{ z("'") }}"><b>`;
    t.true(is(str, 5, 19), "01");
    t.end();
  }
);

tap.test(`02 - ${`\u001b[${32}m${`ESP`}\u001b[${39}m`} - Ruby ERB`, (t) => {
  const str = `<a href="https://abc?p1=<%= @p1 %>&p2=<%= @p2 %>">`;
  t.true(is(str, 8, 48), "02");
  t.end();
});
