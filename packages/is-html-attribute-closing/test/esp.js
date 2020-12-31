import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
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
