const fs = require("fs");
const path = require("path");

const t = require("tap");
const isMediaD = require("../dist/is-media-descriptor.cjs");
const { applyFixes, writeSample } = require("../t-util/util");

// first, remove all files from test/samples subfolder - think of test renames
// and tests being shuffled - this will guarantee that all sample files
// are always fresh
const filesInSamples = fs.readdirSync("test/samples");
for (const file of filesInSamples) {
  // _red.css and _green.css are stationary, they're not deleted
  if (!file.startsWith("_")) {
    fs.unlink(path.join("test/samples", file), err => {
      if (err) {
        throw err;
      }
    });
  }
}

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
    const str = "";
    t.same(isMediaD(str), []);
    writeSample({
      id: "00.02",
      str
      // fixed
    });
    t.end();
  }
);

t.test(
  `00.03 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - space character`,
  t => {
    const str = " ";
    t.same(isMediaD(str), []);
    writeSample({
      id: "00.03",
      str
      // fixed
    });
    t.end();
  }
);

t.test(
  `00.04 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - trimmable to zero`,
  t => {
    const str = "\n\n\n";
    t.same(isMediaD(str), []);
    writeSample({
      id: "00.04",
      str
      // fixed
    });
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
    writeSample({
      id: "01.03",
      str
    });
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
    writeSample({
      id: "01.04",
      str
    });
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
    writeSample({
      id: "01.05",
      str
    });
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
    const fixed = `all`;
    writeSample({
      id: "02.01",
      str,
      fixed
    });
    const offset = 90;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), fixed);
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
    const fixed = `all`;
    writeSample({
      id: "02.02",
      str,
      fixed
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), fixed);
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
    const fixed = `all`;
    writeSample({
      id: "02.03",
      str,
      fixed
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), fixed);
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
    const fixed = `only screen`;
    writeSample({
      id: "02.04",
      str,
      fixed
    });
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
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - multiple tab whitespace chunk`,
  t => {
    const str = `only\t\tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.05",
      str,
      fixed
    });
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
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab end`,
  t => {
    const str = `only  \tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.06",
      str,
      fixed
    });
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
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab start and end`,
  t => {
    const str = `only\t \tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.07",
      str,
      fixed
    });
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
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab start`,
  t => {
    const str = `only\t  screen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.08",
      str,
      fixed
    });
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
  `02.09 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - not, missing type`,
  t => {
    const str = `not (monochrome)`;
    writeSample({
      id: "02.09",
      str
      // fixed
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 16 + offset,
        message: `"not" can be only in front of media type.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - not, missing type`,
  t => {
    const str = `not (width <= -100px)`;
    writeSample({
      id: "02.10",
      str
      // fixed
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 21 + offset,
        message: `"not" can be only in front of media type.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `02.11 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - not, missing type, whitespace`,
  t => {
    const str = `not ( monochrome )`;
    const fixed = `not (monochrome)`;
    writeSample({
      id: "02.10",
      str,
      fixed
    });
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
        idxFrom: 16 + offset,
        idxTo: 17 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[16 + offset, 17 + offset]]
        }
      },
      {
        idxFrom: 4 + offset,
        idxTo: 18 + offset,
        message: `"not" can be only in front of media type.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.only(
  `02.12 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - trailing space`,
  t => {
    const str = `screen `;
    const fixed = `screen`;
    writeSample({
      id: "02.12",
      str,
      fixed
    });
    const res = isMediaD(str);
    t.same(res, [
      {
        idxFrom: 6,
        idxTo: 7,
        message: "Remove whitespace.",
        fix: {
          ranges: [[6, 7]]
        }
      }
    ]);
    t.equal(applyFixes(str, res), fixed);
    t.end();
  }
);

// 03. levenshtein distance 1 on single-string values
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${36}m${`levenshtein`}\u001b[${39}m`} - minimal case`,
  t => {
    const str = `screeen`;
    const fixed = `screen`;
    writeSample({
      id: "03.01",
      str,
      fixed
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), fixed);
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
    const fixed = `all`;
    writeSample({
      id: "03.02",
      str,
      fixed
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), fixed);
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
    writeSample({
      id: "04.01",
      str
    });
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
    writeSample({
      id: "04.02",
      str
    });
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
    writeSample({
      id: "04.03",
      str
    });
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
    writeSample({
      id: "04.04",
      str
    });
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
    writeSample({
      id: "04.05",
      str
    });
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
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `04.06 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  t => {
    const str = `screen and ()`;
    writeSample({
      id: "04.06",
      str
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 13 + offset,
        message: "Empty bracket pair.",
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `04.07 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  t => {
    const str = `screen and (\t\r)`;
    writeSample({
      id: "04.07",
      str
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 15 + offset,
        message: "Empty bracket pair.",
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

// 05. composed values
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "only"`,
  t => {
    const str = `only screen`;
    writeSample({
      id: "05.01",
      str
    });
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
    writeSample({
      id: "05.02",
      str
    });
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
    const str = `not (monochrome)`;
    writeSample({
      id: "05.03",
      str
    });
    const offset = 40;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 16 + offset,
        message: `"not" can be only in front of media type.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(`05.04 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only dot`, t => {
  const str = `only .`;
  writeSample({
    id: "05.04",
    str
  });
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

t.test(`05.05 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only dot`, t => {
  const str = `only --`;
  writeSample({
    id: "05.05",
    str
  });
  const offset = 30;
  const res = isMediaD(str, { offset });
  t.same(res, [
    {
      idxFrom: 5 + offset,
      idxTo: 7 + offset,
      message: `Strange symbols "--".`,
      fix: null
    }
  ]);
  t.equal(applyFixes(str, res, offset), str);
  t.end();
});

t.test(`05.06 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`, t => {
  const str = `only and`;
  writeSample({
    id: "05.06",
    str
  });
  const offset = 30;
  const res = isMediaD(str, { offset });
  t.same(res, [
    {
      idxFrom: 5 + offset,
      idxTo: 8 + offset,
      message: `"and" instead of a media type.`,
      fix: null
    }
  ]);
  t.equal(applyFixes(str, res, offset), str);
  t.end();
});

t.test(`05.07 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`, t => {
  const str = `only only`;
  writeSample({
    id: "05.07",
    str
  });
  const offset = 30;
  const res = isMediaD(str, { offset });
  t.same(res, [
    {
      idxFrom: 5 + offset,
      idxTo: 9 + offset,
      message: `"only" instead of a media type.`,
      fix: null
    }
  ]);
  t.equal(applyFixes(str, res, offset), str);
  t.end();
});

t.test(`05.08 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`, t => {
  const str = `only not`;
  writeSample({
    id: "05.08",
    str
  });
  const offset = 30;
  const res = isMediaD(str, { offset });
  t.same(res, [
    {
      idxFrom: 5 + offset,
      idxTo: 8 + offset,
      message: `"not" instead of a media type.`,
      fix: null
    }
  ]);
  t.equal(applyFixes(str, res, offset), str);
  t.end();
});

t.test(
  `05.09 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, healthy`,
  t => {
    // const str = `screen and (color)`;
    const str = `screen and (max-width: 100px)`;
    writeSample({
      id: "05.09",
      str
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, []);
    t.end();
  }
);

t.test(
  `05.10 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, healthy`,
  t => {
    const str = `not (monochrome)`;
    writeSample({
      id: "05.10",
      str
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 4 + offset,
        idxTo: 16 + offset,
        message: `"not" can be only in front of media type.`,
        fix: null
      }
    ]);
    t.end();
  }
);

t.test(
  `05.11 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, missing brackets`,
  t => {
    const str = `not screen and color`;
    const fixed = `not screen and (color)`;
    writeSample({
      id: "05.11",
      str,
      fixed
    });
    const offset = 88;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 15 + offset,
        idxTo: 20 + offset,
        message: `Missing brackets.`,
        fix: {
          ranges: [
            [15 + offset, 15 + offset, "("],
            [20 + offset, 20 + offset, ")"]
          ]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.test(
  `05.12 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, missing brackets`,
  t => {
    const str = `not screen and screen`;
    writeSample({
      id: "05.12",
      str
      // fixed
    });
    const offset = 88;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 15 + offset,
        idxTo: 21 + offset,
        message: `Unexpected media type, try using a comma.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `05.13 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - dangling "and"`,
  t => {
    const str = `not screen and (monochrome) \tand`;
    const fixed = `not screen and (monochrome)`;
    writeSample({
      id: "05.13",
      str,
      fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 27 + offset,
        idxTo: 29 + offset,
        message: `Bad whitespace.`,
        fix: {
          ranges: [[28 + offset, 29 + offset]]
        }
      },
      {
        idxFrom: 29 + offset,
        idxTo: 32 + offset,
        message: `Dangling "and".`,
        fix: {
          ranges: [[27 + offset, 32 + offset]]
        }
      }
    ]);
    t.equal(applyFixes(str, res, offset), fixed);
    t.end();
  }
);

t.test(
  `05.14 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - dangling "and"`,
  t => {
    const str = `screeen and (color), projection and (color)`;
    writeSample({
      id: "05.14",
      str
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 0 + offset,
        idxTo: 7 + offset,
        message: `Unrecognised "screeen".`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

// 06. brackets
// -----------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, healthy`,
  t => {
    const str = `speech and (device-aspect-ratio: 16/9)`;
    writeSample({
      id: "06.01",
      str
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, []);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.02 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, no brackets`,
  t => {
    const str = `speech and device-aspect-ratio : 16/9`;
    writeSample({
      id: "06.02",
      str
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 30 + offset,
        message: `Expected brackets on "device-aspect-ratio" and its value.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.03 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, no brackets`,
  t => {
    const str = `speech and device-aspect-ratio`;
    writeSample({
      id: "06.03",
      str
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 30 + offset,
        message: `Expected brackets on "device-aspect-ratio".`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.04 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  t => {
    const str = `screen and not (print)`;
    writeSample({
      id: "06.04",
      str
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 14 + offset,
        message: `"not" can't be here.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.05 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  t => {
    const str = `screen and (not print)`;
    writeSample({
      id: "06.05",
      str
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 16 + offset,
        idxTo: 21 + offset,
        message: `Media type "print" inside brackets.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.06 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  t => {
    const str = `screen and (print and (zzz))`;
    writeSample({
      id: "06.06",
      str
      // fixed
    });
    const offset = 9;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 23 + offset,
        idxTo: 26 + offset,
        message: `Unrecognised "zzz".`,
        fix: null
      },
      {
        idxFrom: 12 + offset,
        idxTo: 17 + offset,
        message: `Media type "print" inside brackets.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.07 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  t => {
    const str = `screen and not (print and (zzz))`;
    writeSample({
      id: "06.07",
      str
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 11 + offset,
        idxTo: 14 + offset,
        message: `"not" can't be here.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.08 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - everything in brackets`,
  t => {
    const str = `(screen and (color))`;
    writeSample({
      id: "06.08",
      str
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 1 + offset,
        idxTo: 7 + offset,
        message: `Media type "screen" inside brackets.`,
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

t.test(
  `06.09 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - everything in brackets, chained`,
  t => {
    const str = `(screen and (color)) and (print and (color)) and (speech and (update))`;
    writeSample({
      id: "06.09",
      str
      // fixed
    });
    const offset = 99;
    const res = isMediaD(str, { offset });
    t.same(res, [
      {
        idxFrom: 1 + offset,
        idxTo: 7 + offset,
        message: 'Media type "screen" inside brackets.',
        fix: null
      },
      {
        idxFrom: 26 + offset,
        idxTo: 31 + offset,
        message: 'Media type "print" inside brackets.',
        fix: null
      },
      {
        idxFrom: 50 + offset,
        idxTo: 56 + offset,
        message: 'Media type "speech" inside brackets.',
        fix: null
      }
    ]);
    t.equal(applyFixes(str, res, offset), str);
    t.end();
  }
);

// 07. comma
// -----------------------------------------------------------------------------

t.test(`07.01 - ${`\u001b[${36}m${`comma`}\u001b[${39}m`} - healthy`, t => {
  const str = `screen, print`;
  writeSample({
    id: "07.01",
    str
    // fixed
  });
  const offset = 1;
  const res = isMediaD(str, { offset });
  t.same(res, []);
  t.equal(applyFixes(str, res, offset), str);
  t.end();
});
