import tap from "tap";
import { pathNext, pathPrev, pathUp } from "../dist/ast-monkey-util.esm";

// -----------------------------------------------------------------------------
// 01. pathNext
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - empty str`,
  (t) => {
    t.same(pathNext(""), "", "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.same(pathNext("0"), "1", "02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.same(pathNext("1"), "2", "03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - theoretically, not possible but, last chunk is not numeric string`,
  (t) => {
    t.same(pathNext("1.z"), "1.z", "04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - theoretically, not possible but, one level deep, no .children`,
  (t) => {
    t.same(pathNext("9.children.3"), "9.children.4", "05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - theoretically, not possible but, one level deep, no .children`,
  (t) => {
    t.same(
      pathNext("9.children.1.children.0"),
      "9.children.1.children.1",
      "06"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. pathPrev
// -----------------------------------------------------------------------------

tap.test(
  `07 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - empty str`,
  (t) => {
    t.same(pathPrev(""), null, "07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.same(pathPrev("0"), null, "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.same(pathPrev("1"), "0", "09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - theoretically, not possible but, last chunk is not numeric string`,
  (t) => {
    t.same(pathPrev("1.z"), null, "10");
    t.end();
  }
);

tap.test(`11 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - usual`, (t) => {
  t.same(pathPrev("9.children.33"), "9.children.32", "11");
  t.end();
});

tap.test(
  `12 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - usual, two levels`,
  (t) => {
    t.same(
      pathPrev("9.children.1.children.2"),
      "9.children.1.children.1",
      "12"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 03. pathUp
// -----------------------------------------------------------------------------

tap.test(`13 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - empty str`, (t) => {
  t.same(pathUp(""), "0", "13");
  t.end();
});

tap.test(
  `14 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.same(pathUp("0"), "0", "14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.same(pathUp("1"), "0", "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - non-numeric`,
  (t) => {
    t.same(pathUp("1.z"), "0", "16");
    t.end();
  }
);

tap.test(`17 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - usual`, (t) => {
  t.same(pathUp("9.children.3"), "9", "17");
  t.end();
});

tap.test(
  `18 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - usual, two levels`,
  (t) => {
    t.same(pathUp("9.children.1.children.2"), "9.children.1", "18");
    t.end();
  }
);
