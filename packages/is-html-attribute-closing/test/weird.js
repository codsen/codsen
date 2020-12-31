import tap from "tap";
import { isAttrClosing as is } from "../dist/is-html-attribute-closing.esm";
// const BACKSLASH = "\u005C";

// Weird cases
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no input`,
  (t) => {
    t.false(is(), "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is not a string`,
  (t) => {
    t.false(is(2), "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - input is empty string`,
  (t) => {
    t.false(is(""), "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 2nd arg is missing`,
  (t) => {
    t.false(is("a"), "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 2nd arg is not integer`,
  (t) => {
    t.false(is("a", "a"), "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd arg is missing`,
  (t) => {
    t.false(is("a", 0), "06");
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd arg is not integer`,
  (t) => {
    t.false(is("a", 0, "a"), "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 2nd arg`,
  (t) => {
    t.false(is("a", 99, 100), "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - no character in string at what's given by 3rd arg`,
  (t) => {
    t.false(is("a", 0, 100), "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - indexes equal`,
  (t) => {
    t.false(is("abcde", 2, 2), "10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${34}m${`weird cases`}\u001b[${39}m`} - 3rd > 2nd`,
  (t) => {
    t.false(is("abcde", 2, 1), "11");
    t.end();
  }
);
