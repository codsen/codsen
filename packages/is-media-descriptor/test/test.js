const t = require("tap");
const isMediaD = require("../dist/is-media-descriptor.cjs");
const { applyFixes } = require("../t-util/util");

// ///

// 00. API bits
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - non-string`,
  t => {
    t.match(isMediaD(), []);
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - empty string`,
  t => {
    t.match(isMediaD(""), []);
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - space character`,
  t => {
    t.match(isMediaD(" "), []);
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${32}m${`api bits`}\u001b[${39}m`} - trimmable to zero`,
  t => {
    t.match(isMediaD("\n\n\n"), []);
    t.end();
  }
);

// 01. recognised values
// -----------------------------------------------------------------------------

t.test(`01.01 - ${`\u001b[${33}m${`recognised values`}\u001b[${39}m`}`, t => {
  [
    "all",
    "aural",
    "braille",
    "embossed",
    "handheld",
    "print",
    "projection",
    "screen",
    "speech",
    "tty",
    "tv"
  ].forEach(val => {
    t.match(isMediaD(val), []);
  });
  t.end();
});

// 02. whitespace related errors
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - leading`,
  t => {
    const str = `\tall`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), `all`);
    t.match(res, [
      {
        idxFrom: 0,
        idxTo: 1,
        message: "Remove whitespace.",
        fix: {
          ranges: [[0, 1]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - trailing`,
  t => {
    const str = `all\t`;
    const res = isMediaD(str);
    // t.equal(applyFixes(str, res), `all`);
    t.match(res, [
      {
        idxFrom: 3,
        idxTo: 4,
        message: "Remove whitespace.",
        fix: {
          ranges: [[3, 4]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - leading and trailing`,
  t => {
    const str = `\t\t\tall\t\n`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), `all`);
    t.match(res, [
      {
        idxFrom: 0, // first element of the first range
        idxTo: 8, // last element of the last range
        message: "Remove whitespace.",
        fix: {
          ranges: [
            [0, 3],
            [6, 8]
          ]
        }
      }
    ]);
    t.end();
  }
);

// 03. levenshtein distance 1
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - minimal case`,
  t => {
    const str = `screeen`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), `screen`);
    t.match(res, [
      {
        idxFrom: 0,
        idxTo: 7,
        message: `Did you mean "screen"?`,
        fix: {
          ranges: [[0, 7]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - leading and trailing`,
  t => {
    const str = `\t\t\tal\t\n`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), `all`);
    t.match(res, [
      {
        idxFrom: 0, // first element of the first range
        idxTo: 7, // last element of the last range
        message: "Remove whitespace.",
        fix: {
          ranges: [
            [0, 3],
            [5, 7]
          ]
        }
      },
      {
        idxFrom: 3, // first element of the first range
        idxTo: 5, // last element of the last range
        message: `Did you mean "all"?`,
        fix: {
          ranges: [[3, 5, "all"]]
        }
      }
    ]);
    t.end();
  }
);
