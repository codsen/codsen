import tap from "tap";
import { pathUp } from "../dist/ast-monkey-util.esm.js";

tap.test(`01 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - empty str`, (t) => {
  t.strictSame(pathUp(""), "0", "01");
  t.end();
});

tap.test(
  `02 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.strictSame(pathUp("0"), "0", "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.strictSame(pathUp("1"), "0", "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - non-numeric`,
  (t) => {
    t.strictSame(pathUp("1.z"), "0", "04");
    t.end();
  }
);

tap.test(`05 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - usual`, (t) => {
  t.strictSame(pathUp("9.children.3"), "9", "05");
  t.end();
});

tap.test(
  `06 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - usual, two levels`,
  (t) => {
    t.strictSame(pathUp("9.children.1.children.2"), "9.children.1", "06");
    t.end();
  }
);
