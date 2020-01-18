const t = require("tap");
const isMediaD = require("../dist/is-media-descriptor.cjs");
const { applyFixes } = require("../t-util/util");

// ///

// 00. API bits
// -----------------------------------------------------------------------------

t.test(
  `00.01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - non-string`,
  t => {
    t.same(isMediaD(), []);
    t.end();
  }
);

t.test(
  `00.02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - empty string`,
  t => {
    t.same(isMediaD(""), []);
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - space character`,
  t => {
    t.same(isMediaD(" "), []);
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - trimmable to zero`,
  t => {
    t.same(isMediaD("\n\n\n"), []);
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
  `01.01 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`}`,
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
      t.same(isMediaD(val), []);
    });
    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - with offset`,
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
      t.same(isMediaD(val, { offset: 999 }), []);
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
    t.same(res, [
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

t.test(
  `01.04 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - unrecognised string`,
  t => {
    const str = `only`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), str);
    t.same(res, [
      {
        idxFrom: 0,
        idxTo: 4,
        message: "Missing media type or condition.",
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `01.05 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - unrecognised string`,
  t => {
    const str = `not`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), str);
    t.same(res, [
      {
        idxFrom: 0,
        idxTo: 3,
        message: "Missing media type or condition.",
        fix: null
      }
    ]);
    t.end();
  }
);

// 02. whitespace related errors
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - leading`,
  t => {
    const str = `\tall`;
    const offset = 90;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), `all`);
    t.same(res, [
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
  `02.02 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - trailing`,
  t => {
    const str = `all\t`;
    const res = isMediaD(str);
    // t.equal(applyFixes(str, res), `all`);
    t.same(res, [
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
  `02.03 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed, leading and trailing`,
  t => {
    const str = `\t\t\tall\t\n`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), `all`);
    t.same(res, [
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

t.test(
  `02.04 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - single tab whitespace chunk`,
  t => {
    const str = `only\tscreen`;
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 5 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[4 + offset, 5 + offset, " "]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), `only screen`);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - multiple tab whitespace chunk`,
  t => {
    const str = `only\t\tscreen`;
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 6 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[4 + offset, 6 + offset, " "]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), `only screen`);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab end`,
  t => {
    const str = `only  \tscreen`;
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 7 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[5 + offset, 7 + offset]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), `only screen`);
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab start and end`,
  t => {
    const str = `only\t \tscreen`;
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 7 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[4 + offset, 7 + offset, " "]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), `only screen`);
    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab start`,
  t => {
    const str = `only\t  screen`;
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 7 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[4 + offset, 6 + offset]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), `only screen`);
    t.end();
  }
);

t.test(
  `02.09 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - spaces inside brackets`,
  t => {
    const str = `not ( color )`;
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 5 + offset,
        idxTo: 6 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[5 + offset, 6 + offset]]
        }
      },
      {
        idxFrom: 11 + offset,
        idxTo: 12 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[11 + offset, 12 + offset]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), `not (color)`);
    t.end();
  }
);

// 03. levenshtein distance 1 on single-string values
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${36}m${`levenshtein`}\u001b[${39}m`} - minimal case`,
  t => {
    const str = `screeen`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), `screen`);
    t.same(res, [
      {
        idxFrom: 10,
        idxTo: 17,
        message: `Did you mean "screen"?`,
        fix: {
          ranges: [[10, 17, "screen"]]
        }
      }
    ]);
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${36}m${`levenshtein`}\u001b[${39}m`} - leading and trailing`,
  t => {
    const str = `\t\t\tal\t\n`;
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), `all`);
    t.same(res, [
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

// 04. preliminary checks
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - mismatching bracket count 1`,
  t => {
    const str = `only (screen))`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 14 + offset,
        message: "More closing brackets than opening.",
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - mismatching bracket count 2`,
  t => {
    const str = `only ((screen)`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 14 + offset,
        message: "More opening brackets than closing.",
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `04.03 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  t => {
    const str = `only ())screen(()`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 17 + offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `04.04 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  t => {
    const str = `only )))))`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 10 + offset,
        message: "More closing brackets than opening.",
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `04.05 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - semicolon present`,
  t => {
    // for example
    // @media test;,all { body { background:lime } }
    const str = `test;,all`;
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 5 + offset,
        message: "Semicolon found!",
        fix: null
      }
    ]);
    t.end();
  }
);

// 05. composed values
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "only"`,
  t => {
    const str = `only screen`;
    const offset = 60;
    const res = isMediaD(str, { offset });
    t.same(res, []);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `05.02 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "only"`,
  t => {
    const str = `onlies screen`;
    const offset = 50;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 6 + offset,
        message: `Unrecognised "onlies".`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `05.03 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "not"`,
  t => {
    const str = `not (color)`;
    const offset = 40;
    const res = isMediaD(str, { offset });
    t.same(res, []);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(`05.04 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only dot`, t => {
  const str = `only .`;
  const offset = 30;
  const res = isMediaD(str, { offset });
  t.same(res, [
    {
      idxFrom: 5 + offset,
      idxTo: 6 + offset,
      message: `Strange symbol ".".`,
      fix: null
    }
  ]);
  t.equal(applyFixes(str, res, offset), str);
  t.end();
});

t.test(`05.05 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`, t => {
  ["and", "only", "not"].forEach(val => {
    const str = `only ${val}`;
    const offset = 30;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 5 + offset,
        idxTo: 5 + val.length + offset,
        message: `"${val}" instead of a media type.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
  });
  t.end();
});

t.test(
  `05.06 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, healthy`,
  t => {
    const str = `screen and (color)`;
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, []);
    t.end();
  }
);

// TODO: add fix later when we'll have the list of recognised conditions
// fix: {
//   ranges: [
//     [11 + offset, 11 + offset, `(`],
//     [16 + offset, 16 + offset, `)`]
//   ]
// }
t.test(
  `05.07 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, missing brackets`,
  t => {
    const str = `screen and color`;
    const offset = 88;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 16 + offset,
        message: `Unrecognised "color".`,
        fix: null
      }
    ]);
    t.end();
  }
);

// 06. brackets
// -----------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${35}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, healthy`,
  t => {
    const str = `speech and (device-aspect-ratio: 16/9)`;
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, []);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${35}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, no brackets`,
  t => {
    const str = `speech and device-aspect-ratio: 16/9`;
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 30 + offset,
        message: `Brackets missing around "device-aspect-ratio" and its value.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${35}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, no brackets`,
  t => {
    const str = `speech and device-aspect-ratio`;
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 30 + offset,
        message: `Brackets missing around "device-aspect-ratio".`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);
