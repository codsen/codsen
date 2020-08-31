import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

// false positives
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    const str = `> b`;
    t.false(is(str, 2), "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    const str = `> b`;
    t.false(
      is(str, 2, {
        skipOpeningBracket: true,
      }),
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`false positives`}\u001b[${39}m`} - last letter`,
  (t) => {
    const str = `bc img src="z"/>`;
    t.false(
      is(str, 0, {
        allowCustomTagNames: false,
        skipOpeningBracket: true,
      }),
      "03"
    );
    t.end();
  }
);
