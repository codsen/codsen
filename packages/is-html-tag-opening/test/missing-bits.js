import tap from "tap";
import { isOpening as is } from "../dist/is-html-tag-opening.esm";

// missing bits
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`broken code`}\u001b[${39}m`} - quotes missing`,
  (t) => {
    const s1 = `<abc de=fg hi="jkl">`;
    t.false(is(s1, 0), "01.01");
    t.true(
      is(s1, 0, {
        allowCustomTagNames: true,
      }),
      "01.02"
    );
    t.end();
  }
);
