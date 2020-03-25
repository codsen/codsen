const t = require("tap");
const { pathNext, pathPrev, pathUp } = require("../dist/ast-monkey-util.cjs");

// -----------------------------------------------------------------------------
// 01. pathNext
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - empty str`,
  (t) => {
    t.same(pathNext(""), "", "01.01");
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.same(pathNext("0"), "1", "01.02");
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.same(pathNext("1"), "2", "01.03");
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - theoretically, not possible but, last chunk is not numeric string`,
  (t) => {
    t.same(pathNext("1.z"), "1.z", "01.04");
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - theoretically, not possible but, one level deep, no .children`,
  (t) => {
    t.same(pathNext("9.children.3"), "9.children.4", "01.05");
    t.end();
  }
);

t.test(
  `01.06 - ${`\u001b[${36}m${`pathNext`}\u001b[${39}m`} - theoretically, not possible but, one level deep, no .children`,
  (t) => {
    t.same(
      pathNext("9.children.1.children.0"),
      "9.children.1.children.1",
      "01.06"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. pathPrev
// -----------------------------------------------------------------------------

t.test(
  "02.01 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - empty str",
  (t) => {
    t.same(pathPrev(""), null, "02.01");
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.same(pathPrev("0"), null, "02.02");
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.same(pathPrev("1"), "0", "02.03");
    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - theoretically, not possible but, last chunk is not numeric string`,
  (t) => {
    t.same(pathPrev("1.z"), null, "02.04");
    t.end();
  }
);

t.test(`02.05 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - usual`, (t) => {
  t.same(pathPrev("9.children.33"), "9.children.32", "02.05");
  t.end();
});

t.test(
  `02.06 - ${`\u001b[${35}m${`pathPrev`}\u001b[${39}m`} - usual, two levels`,
  (t) => {
    t.same(
      pathPrev("9.children.1.children.2"),
      "9.children.1.children.1",
      "02.06"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 03. pathUp
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - empty str`,
  (t) => {
    t.same(pathUp(""), null, "03.01");
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - upon first element`,
  (t) => {
    t.same(pathUp("0"), null, "03.02");
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - upon second element`,
  (t) => {
    t.same(pathUp("1"), null, "03.03");
    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - non-numeric`,
  (t) => {
    t.same(pathUp("1.z"), null, "03.04");
    t.end();
  }
);

t.test(`03.05 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - usual`, (t) => {
  t.same(pathUp("9.children.3"), "9", "03.05");
  t.end();
});

t.test(
  `03.06 - ${`\u001b[${34}m${`pathUp`}\u001b[${39}m`} - usual, two levels`,
  (t) => {
    t.same(pathUp("9.children.1.children.2"), "9.children.1", "03.06");
    t.end();
  }
);
