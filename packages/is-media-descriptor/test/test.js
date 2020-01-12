const t = require("tap");
const isMediaD = require("../dist/is-media-descriptor.cjs");
const { applyFixes } = require("../t-util/util");

// ///

// 00. API bits
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - non-string`,
  t => {
    t.match(isMediaD(), []);
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - empty string`,
  t => {
    t.match(isMediaD(""), []);
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - space character`,
  t => {
    t.match(isMediaD(" "), []);
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - trimmable to zero`,
  t => {
    t.match(isMediaD("\n\n\n"), []);
    t.end();
  }
);

t.test(
  `00.05 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - weird offset`,
  t => {
    t.throws(() => {
      isMediaD("", { offset: true });
    }, /THROW_ID_01/gm);
    t.end();
  }
);

// 01. single-string values
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${32}m${`single-string values`}\u001b[${39}m`}`,
  t => {
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
  }
);

t.test(
  `01.02 - ${`\u001b[${32}m${`single-string values`}\u001b[${39}m`} - with offset`,
  t => {
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
      t.match(isMediaD(val, { offset: 999 }), []);
    });
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - unrecognised string`,
  t => {
    const str = ` zzz`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.match(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 1 + offset,
        message: "Remove whitespace.",
        fix: {
          ranges: [[0 + offset, 1 + offset]]
        }
      },
      {
        idxFrom: 1 + offset,
        idxTo: 4 + offset,
        message: `Unrecognised media type "zzz".`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), `zzz`);
    t.end();
  }
);

// 02. whitespace related errors
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${36}m${`bad whitespace`}\u001b[${39}m`} - leading`,
  t => {
    const str = `\tall`;
    const offset = 90;
    const res = isMediaD(str, { offset });
    // t.equal(applyFixes(str, res, offset), `all`);
    t.match(res, [
      {
        idxFrom: 90,
        idxTo: 91,
        message: "Remove whitespace.",
        fix: {
          ranges: [[90, 91]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${36}m${`bad whitespace`}\u001b[${39}m`} - trailing`,
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
  `02.03 - ${`\u001b[${36}m${`bad whitespace`}\u001b[${39}m`} - leading and trailing`,
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

// 03. levenshtein distance 1 on single-string values
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${31}m${`levenshtein`}\u001b[${39}m`} - minimal case`,
  t => {
    const str = `screeen`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), `screen`);
    t.match(res, [
      {
        idxFrom: 10,
        idxTo: 17,
        message: `Did you mean "screen"?`,
        fix: {
          ranges: [[10, 17]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${31}m${`levenshtein`}\u001b[${39}m`} - leading and trailing`,
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

// 04. composed values
// -----------------------------------------------------------------------------

// t.only(
//   `04.01 - ${`\u001b[${31}m${`composed`}\u001b[${39}m`} - composed of one, healthy "only"`,
//   t => {
//     const str = `only screen`;
//     const offset = 10;
//     const res = isMediaD(str, { offset });
//     t.is(res, []);
//     t.equal(applyFixes(str, res, offset), str);
//     t.end();
//   }
// );
//
// t.test(
//   `04.02 - ${`\u001b[${31}m${`composed`}\u001b[${39}m`} - composed of one, healthy "not"`,
//   t => {
//     const str = `not (color)`;
//     const offset = 10;
//     const res = isMediaD(str, { offset });
//     t.match(res, []);
//     t.equal(applyFixes(str, res, offset), str);
//     t.end();
//   }
// );
//
// t.test(
//   `04.02 - ${`\u001b[${31}m${`composed`}\u001b[${39}m`} - composed of two, healthy`,
//   t => {
//     const str = `screen and (color)`;
//     const offset = 10;
//     const res = isMediaD(str, { offset });
//     t.match(res, []);
//     t.equal(applyFixes(str, res, offset), str);
//     t.end();
//   }
// );

// t.test(
//   `04.03 - ${`\u001b[${31}m${`composed`}\u001b[${39}m`} - composed of two, missing brackets`,
//   t => {
//     const str = `screen and color`;
//     const offset = 10;
//     const res = isMediaD(str, { offset });
//     t.match(res, [
//       {
//         idxFrom: 10,
//         idxTo: 17,
//         message: `Brackets missing around "color".`,
//         fix: {
//           ranges: [
//             [11, 11, `(`],
//             [16, 16, ")"]
//           ]
//         }
//       }
//     ]);
//     t.equal(applyFixes(str, res, offset), `screen and (color)`);
//     t.end();
//   }
// );
