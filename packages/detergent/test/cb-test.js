const t = require("tap");
const detergent = require("../dist/detergent.cjs");
const det1 = detergent.det;
const { det, mixer, allCombinations } = require("../t-util/util");

// ==============================
// 01. main functionality
// ==============================

t.test(
  `01.01 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - baseline`,
  (t) => {
    t.equal(
      det(t, 0, `aAa\n\nbBb\n\ncCc`).res,
      "aAa<br/>\n<br/>\nbBb<br/>\n<br/>\ncCc",
      "01.01"
    );
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - turns into an uppercase`,
  (t) => {
    t.equal(
      det(t, 0, `aAa\n\nbBb\n\ncCc`, {
        cb: (str) => str.toUpperCase(),
      }).res,
      "AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC",
      "01.02"
    );
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - opts.cb changes the case - baseline`,
  (t) => {
    t.equal(
      det1(`<b>aAa\n\nbBb\n\ncCc</b>`, {
        cb: (str) => str.toUpperCase(),
      }).res,
      "<b>AAA<br/>\n<br/>\nBBB<br/>\n<br/>\nCCC</b>",
      "01.03"
    );
    t.end();
  }
);

t.test(
  `01.04 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - with strip HTML option`,
  (t) => {
    allCombinations.forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `<b>aBc</b>`,
          Object.assign(opt, {
            cb: (str) => str.toUpperCase(),
          })
        ).res,
        "<b>ABC</b>",
        `01.04`
      );
    });
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${33}m${`change letter case`}\u001b[${39}m`} - with strip HTML option`,
  (t) => {
    // warmup:
    t.equal(
      det1(
        `AbC<z>dEf`,
        Object.assign(
          {
            stripHtml: true,
          },
          {
            cb: (str) => str.toUpperCase(),
          }
        )
      ).res,
      "ABC DEF"
    );
    // now mixer:
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `AbC<z>dEf`,
          Object.assign(opt, {
            cb: (str) => str.toUpperCase(),
          })
        ).res,
        "ABC DEF",
        `01.04`
      );
    });
    t.end();
  }
);
