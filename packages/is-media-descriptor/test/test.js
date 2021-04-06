import fs from "fs";
import path from "path";

import tap from "tap";
import { isMediaD } from "../dist/is-media-descriptor.esm";
import { applyFixes, writeSample } from "../t-util/util";

// first, remove all files from test/samples subfolder - think of test renames
// and tests being shuffled - this will guarantee that all sample files
// are always fresh
const filesInSamples = fs.readdirSync("test/samples");
for (let i = 0, len = filesInSamples.length; i < len; i++) {
  // _red.css and _green.css are stationary, they're not deleted
  if (!filesInSamples[i].startsWith("_")) {
    fs.unlink(path.join("test/samples", filesInSamples[i]), (err) => {
      if (err) {
        throw err;
      }
    });
  }
}

// 00. API bits
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - non-string`,
  (t) => {
    t.strictSame(isMediaD(), [], "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - empty string`,
  (t) => {
    const str = "";
    t.strictSame(isMediaD(str), [], "02");
    writeSample({
      id: "00.02",
      str,
      // fixed
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - space character`,
  (t) => {
    const str = " ";
    t.strictSame(isMediaD(str), [], "03");
    writeSample({
      id: "00.03",
      str,
      // fixed
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - trimmable to zero`,
  (t) => {
    const str = "\n\n\n";
    t.strictSame(isMediaD(str), [], "04");
    writeSample({
      id: "00.04",
      str,
      // fixed
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${`api bits`}\u001b[${39}m`} - weird offset`,
  (t) => {
    t.throws(() => {
      isMediaD("", { offset: true });
    }, /THROW_ID_01/gm);
    t.end();
  }
);

// 01. single-string values
// -----------------------------------------------------------------------------

tap.test(
  `06 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`}`,
  (t) => {
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
      "tv",
    ].forEach((val) => {
      t.strictSame(isMediaD(val), []);
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - with offset`,
  (t) => {
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
      "tv",
    ].forEach((val) => {
      t.strictSame(isMediaD(val, { offset: 999 }), []);
    });
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - unrecognised string`,
  (t) => {
    const str = ` zzz`;
    writeSample({
      id: "01.03",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 1 + offset,
          message: "Remove whitespace.",
          fix: {
            ranges: [[0 + offset, 1 + offset]],
          },
        },
        {
          idxFrom: 1 + offset,
          idxTo: 4 + offset,
          message: `Unrecognised media type "zzz".`,
          fix: null,
        },
      ],
      "08.01"
    );
    t.equal(applyFixes(str, res, offset), `zzz`, "08.02");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - unrecognised string`,
  (t) => {
    const str = `only`;
    writeSample({
      id: "01.04",
      str,
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), str, "09.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 0,
          idxTo: 4,
          message: "Missing media type or condition.",
          fix: null,
        },
      ],
      "09.02"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${31}m${`single-string values`}\u001b[${39}m`} - unrecognised string`,
  (t) => {
    const str = `not`;
    writeSample({
      id: "01.05",
      str,
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), str, "10.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 0,
          idxTo: 3,
          message: "Missing media type or condition.",
          fix: null,
        },
      ],
      "10.02"
    );
    t.end();
  }
);

// 02. whitespace related errors
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - leading`,
  (t) => {
    const str = `\tall`;
    const fixed = `all`;
    writeSample({
      id: "02.01",
      str,
      fixed,
    });
    const offset = 90;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), fixed, "11.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 90,
          idxTo: 91,
          message: "Remove whitespace.",
          fix: {
            ranges: [[90, 91]],
          },
        },
      ],
      "11.02"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - trailing`,
  (t) => {
    const str = `all\t`;
    const fixed = `all`;
    writeSample({
      id: "02.02",
      str,
      fixed,
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), fixed, "12.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 3,
          idxTo: 4,
          message: "Remove whitespace.",
          fix: {
            ranges: [[3, 4]],
          },
        },
      ],
      "12.02"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed, leading and trailing`,
  (t) => {
    const str = `\t\t\tall\t\n`;
    const fixed = `all`;
    writeSample({
      id: "02.03",
      str,
      fixed,
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), fixed, "13.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 0, // first element of the first range
          idxTo: 8, // last element of the last range
          message: "Remove whitespace.",
          fix: {
            ranges: [
              [0, 3],
              [6, 8],
            ],
          },
        },
      ],
      "13.02"
    );
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - single tab whitespace chunk`,
  (t) => {
    const str = `only\tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.04",
      str,
      fixed,
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 5 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4 + offset, 5 + offset, " "]],
          },
        },
      ],
      "14.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "14.02");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - multiple tab whitespace chunk`,
  (t) => {
    const str = `only\t\tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.05",
      str,
      fixed,
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 6 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4 + offset, 6 + offset, " "]],
          },
        },
      ],
      "15.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "15.02");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab end`,
  (t) => {
    const str = `only  \tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.06",
      str,
      fixed,
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 7 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[5 + offset, 7 + offset]],
          },
        },
      ],
      "16.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "16.02");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab start and end`,
  (t) => {
    const str = `only\t \tscreen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.07",
      str,
      fixed,
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 7 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4 + offset, 7 + offset, " "]],
          },
        },
      ],
      "17.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "17.02");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - mixed whitespace chunk, tab start`,
  (t) => {
    const str = `only\t  screen`;
    const fixed = `only screen`;
    writeSample({
      id: "02.08",
      str,
      fixed,
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 7 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[4 + offset, 6 + offset]],
          },
        },
      ],
      "18.01"
    );
    t.equal(applyFixes(str, res, offset), `only screen`, "18.02");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - not, missing type`,
  (t) => {
    const str = `not (monochrome)`;
    writeSample({
      id: "02.09",
      str,
      // fixed
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 16 + offset,
          message: `"not" can be only in front of media type.`,
          fix: null,
        },
      ],
      "19.01"
    );
    t.equal(applyFixes(str, res, offset), str, "19.02");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - not, missing type`,
  (t) => {
    const str = `not (width <= -100px)`;
    writeSample({
      id: "02.10",
      str,
      // fixed
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 21 + offset,
          message: `"not" can be only in front of media type.`,
          fix: null,
        },
      ],
      "20.01"
    );
    t.equal(applyFixes(str, res, offset), str, "20.02");
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - not, missing type, whitespace`,
  (t) => {
    const str = `not ( monochrome )`;
    const fixed = `not (monochrome)`;
    writeSample({
      id: "02.10",
      str,
      fixed,
    });
    const offset = 1;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 5 + offset,
          idxTo: 6 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[5 + offset, 6 + offset]],
          },
        },
        {
          idxFrom: 16 + offset,
          idxTo: 17 + offset,
          message: "Bad whitespace.",
          fix: {
            ranges: [[16 + offset, 17 + offset]],
          },
        },
        {
          idxFrom: 4 + offset,
          idxTo: 18 + offset,
          message: `"not" can be only in front of media type.`,
          fix: null,
        },
      ],
      "21.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "21.02");
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`bad whitespace`}\u001b[${39}m`} - trailing space`,
  (t) => {
    const str = `screen `;
    const fixed = `screen`;
    writeSample({
      id: "02.12",
      str,
      fixed,
    });
    const res = isMediaD(str);
    t.strictSame(
      res,
      [
        {
          idxFrom: 6,
          idxTo: 7,
          message: "Remove whitespace.",
          fix: {
            ranges: [[6, 7]],
          },
        },
      ],
      "22.01"
    );
    t.equal(applyFixes(str, res), fixed, "22.02");
    t.end();
  }
);

// 03. levenshtein distance 1 on single-string values
// -----------------------------------------------------------------------------

tap.test(
  `23 - ${`\u001b[${36}m${`levenshtein`}\u001b[${39}m`} - minimal case`,
  (t) => {
    const str = `screeen`;
    const fixed = `screen`;
    writeSample({
      id: "03.01",
      str,
      fixed,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.equal(applyFixes(str, res, offset), fixed, "23.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 10,
          idxTo: 17,
          message: `Did you mean "screen"?`,
          fix: {
            ranges: [[10, 17, "screen"]],
          },
        },
      ],
      "23.02"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${36}m${`levenshtein`}\u001b[${39}m`} - leading and trailing`,
  (t) => {
    const str = `\t\t\tal\t\n`;
    const fixed = `all`;
    writeSample({
      id: "03.02",
      str,
      fixed,
    });
    const res = isMediaD(str);
    t.equal(applyFixes(str, res), fixed, "24.01");
    t.strictSame(
      res,
      [
        {
          idxFrom: 0, // first element of the first range
          idxTo: 7, // last element of the last range
          message: "Remove whitespace.",
          fix: {
            ranges: [
              [0, 3],
              [5, 7],
            ],
          },
        },
        {
          idxFrom: 3, // first element of the first range
          idxTo: 5, // last element of the last range
          message: `Did you mean "all"?`,
          fix: {
            ranges: [[3, 5, "all"]],
          },
        },
      ],
      "24.02"
    );
    t.end();
  }
);

// 04. preliminary checks
// -----------------------------------------------------------------------------

tap.test(
  `25 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - mismatching bracket count 1`,
  (t) => {
    const str = `only (screen))`;
    writeSample({
      id: "04.01",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 14 + offset,
          message: "More closing brackets than opening.",
          fix: null,
        },
      ],
      "25.01"
    );
    t.equal(applyFixes(str, res, offset), str, "25.02");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - mismatching bracket count 2`,
  (t) => {
    const str = `only ((screen)`;
    writeSample({
      id: "04.02",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 14 + offset,
          message: "More opening brackets than closing.",
          fix: null,
        },
      ],
      "26.01"
    );
    t.equal(applyFixes(str, res, offset), str, "26.02");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  (t) => {
    const str = `only ())screen(()`;
    writeSample({
      id: "04.03",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 17 + offset,
          message:
            "Some closing brackets are before their opening counterparts.",
          fix: null,
        },
      ],
      "27.01"
    );
    t.equal(applyFixes(str, res, offset), str, "27.02");
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  (t) => {
    const str = `only )))))`;
    writeSample({
      id: "04.04",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 10 + offset,
          message: "More closing brackets than opening.",
          fix: null,
        },
      ],
      "28.01"
    );
    t.equal(applyFixes(str, res, offset), str, "28.02");
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - semicolon present`,
  (t) => {
    // for example
    // @media test;,all { body { background:lime } }
    const str = `test;,all`;
    writeSample({
      id: "04.05",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 5 + offset,
          message: "Semicolon found!",
          fix: null,
        },
      ],
      "29.01"
    );
    t.equal(applyFixes(str, res, offset), str, "29.02");
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - empty pair`,
  (t) => {
    const str = `screen and ()`;
    writeSample({
      id: "04.06",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 11 + offset,
          idxTo: 13 + offset,
          message: "Empty bracket pair.",
          fix: null,
        },
      ],
      "30.01"
    );
    t.equal(applyFixes(str, res, offset), str, "30.02");
    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${34}m${`preliminary checks`}\u001b[${39}m`} - three brackets of each type, but wrong order`,
  (t) => {
    const str = `screen and (\t\r)`;
    writeSample({
      id: "04.07",
      str,
    });
    const offset = 10;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 11 + offset,
          idxTo: 15 + offset,
          message: "Empty bracket pair.",
          fix: null,
        },
      ],
      "31.01"
    );
    t.equal(applyFixes(str, res, offset), str, "31.02");
    t.end();
  }
);

// 05. composed values
// -----------------------------------------------------------------------------

tap.test(
  `32 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "only"`,
  (t) => {
    const str = `only screen`;
    writeSample({
      id: "05.01",
      str,
    });
    const offset = 60;
    const res = isMediaD(str, { offset });
    t.strictSame(res, [], "32.01");
    t.equal(applyFixes(str, res, offset), str, "32.02");
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "only"`,
  (t) => {
    const str = `onlies screen`;
    writeSample({
      id: "05.02",
      str,
    });
    const offset = 50;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 6 + offset,
          message: `Unrecognised "onlies".`,
          fix: null,
        },
      ],
      "33.01"
    );
    t.equal(applyFixes(str, res, offset), str, "33.02");
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of one, healthy "not"`,
  (t) => {
    const str = `not (monochrome)`;
    writeSample({
      id: "05.03",
      str,
    });
    const offset = 40;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 16 + offset,
          message: `"not" can be only in front of media type.`,
          fix: null,
        },
      ],
      "34.01"
    );
    t.equal(applyFixes(str, res, offset), str, "34.02");
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `only .`;
    writeSample({
      id: "05.04",
      str,
    });
    const offset = 30;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 5 + offset,
          idxTo: 6 + offset,
          message: `Strange symbol ".".`,
          fix: null,
        },
      ],
      "35.01"
    );
    t.equal(applyFixes(str, res, offset), str, "35.02");
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only dot`,
  (t) => {
    const str = `only --`;
    writeSample({
      id: "05.05",
      str,
    });
    const offset = 30;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 5 + offset,
          idxTo: 7 + offset,
          message: `Strange symbols "--".`,
          fix: null,
        },
      ],
      "36.01"
    );
    t.equal(applyFixes(str, res, offset), str, "36.02");
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`,
  (t) => {
    const str = `only and`;
    writeSample({
      id: "05.06",
      str,
    });
    const offset = 30;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 5 + offset,
          idxTo: 8 + offset,
          message: `"and" instead of a media type.`,
          fix: null,
        },
      ],
      "37.01"
    );
    t.equal(applyFixes(str, res, offset), str, "37.02");
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`,
  (t) => {
    const str = `only only`;
    writeSample({
      id: "05.07",
      str,
    });
    const offset = 30;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 5 + offset,
          idxTo: 9 + offset,
          message: `"only" instead of a media type.`,
          fix: null,
        },
      ],
      "38.01"
    );
    t.equal(applyFixes(str, res, offset), str, "38.02");
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - only and`,
  (t) => {
    const str = `only not`;
    writeSample({
      id: "05.08",
      str,
    });
    const offset = 30;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 5 + offset,
          idxTo: 8 + offset,
          message: `"not" instead of a media type.`,
          fix: null,
        },
      ],
      "39.01"
    );
    t.equal(applyFixes(str, res, offset), str, "39.02");
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, healthy`,
  (t) => {
    // const str = `screen and (color)`;
    const str = `screen and (max-width: 100px)`;
    writeSample({
      id: "05.09",
      str,
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.strictSame(res, [], "40");
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, healthy`,
  (t) => {
    const str = `not (monochrome)`;
    writeSample({
      id: "05.10",
      str,
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 4 + offset,
          idxTo: 16 + offset,
          message: `"not" can be only in front of media type.`,
          fix: null,
        },
      ],
      "41"
    );
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, missing brackets`,
  (t) => {
    const str = `not screen and color`;
    const fixed = `not screen and (color)`;
    writeSample({
      id: "05.11",
      str,
      fixed,
    });
    const offset = 88;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 15 + offset,
          idxTo: 20 + offset,
          message: `Missing brackets.`,
          fix: {
            ranges: [
              [15 + offset, 15 + offset, "("],
              [20 + offset, 20 + offset, ")"],
            ],
          },
        },
      ],
      "42.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "42.02");
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - composed of two, missing brackets`,
  (t) => {
    const str = `not screen and screen`;
    writeSample({
      id: "05.12",
      str,
      // fixed
    });
    const offset = 88;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 15 + offset,
          idxTo: 21 + offset,
          message: `Unexpected media type, try using a comma.`,
          fix: null,
        },
      ],
      "43.01"
    );
    t.equal(applyFixes(str, res, offset), str, "43.02");
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - dangling "and"`,
  (t) => {
    const str = `not screen and (monochrome) \tand`;
    const fixed = `not screen and (monochrome)`;
    writeSample({
      id: "05.13",
      str,
      fixed,
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 27 + offset,
          idxTo: 29 + offset,
          message: `Bad whitespace.`,
          fix: {
            ranges: [[28 + offset, 29 + offset]],
          },
        },
        {
          idxFrom: 29 + offset,
          idxTo: 32 + offset,
          message: `Dangling "and".`,
          fix: {
            ranges: [[27 + offset, 32 + offset]],
          },
        },
      ],
      "44.01"
    );
    t.equal(applyFixes(str, res, offset), fixed, "44.02");
    t.end();
  }
);

tap.test(
  `45 - ${`\u001b[${35}m${`composed`}\u001b[${39}m`} - dangling "and"`,
  (t) => {
    const str = `screeen and (color), projection and (color)`;
    writeSample({
      id: "05.14",
      str,
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 0 + offset,
          idxTo: 7 + offset,
          message: `Unrecognised "screeen".`,
          fix: null,
        },
      ],
      "45.01"
    );
    t.equal(applyFixes(str, res, offset), str, "45.02");
    t.end();
  }
);

// 06. brackets
// -----------------------------------------------------------------------------

tap.test(
  `46 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, healthy`,
  (t) => {
    const str = `speech and (device-aspect-ratio: 16/9)`;
    writeSample({
      id: "06.01",
      str,
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.strictSame(res, [], "46.01");
    t.equal(applyFixes(str, res, offset), str, "46.02");
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, no brackets`,
  (t) => {
    const str = `speech and device-aspect-ratio : 16/9`;
    writeSample({
      id: "06.02",
      str,
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 11 + offset,
          idxTo: 30 + offset,
          message: `Expected brackets on "device-aspect-ratio" and its value.`,
          fix: null,
        },
      ],
      "47.01"
    );
    t.equal(applyFixes(str, res, offset), str, "47.02");
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - composed of one type and one condition, no brackets`,
  (t) => {
    const str = `speech and device-aspect-ratio`;
    writeSample({
      id: "06.03",
      str,
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 11 + offset,
          idxTo: 30 + offset,
          message: `Expected brackets on "device-aspect-ratio".`,
          fix: null,
        },
      ],
      "48.01"
    );
    t.equal(applyFixes(str, res, offset), str, "48.02");
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  (t) => {
    const str = `screen and not (print)`;
    writeSample({
      id: "06.04",
      str,
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 11 + offset,
          idxTo: 14 + offset,
          message: `"not" can't be here.`,
          fix: null,
        },
      ],
      "49.01"
    );
    t.equal(applyFixes(str, res, offset), str, "49.02");
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  (t) => {
    const str = `screen and (not print)`;
    writeSample({
      id: "06.05",
      str,
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 16 + offset,
          idxTo: 21 + offset,
          message: `Media type "print" inside brackets.`,
          fix: null,
        },
      ],
      "50.01"
    );
    t.equal(applyFixes(str, res, offset), str, "50.02");
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  (t) => {
    const str = `screen and (print and (zzz))`;
    writeSample({
      id: "06.06",
      str,
      // fixed
    });
    const offset = 9;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 23 + offset,
          idxTo: 26 + offset,
          message: `Unrecognised "zzz".`,
          fix: null,
        },
        {
          idxFrom: 12 + offset,
          idxTo: 17 + offset,
          message: `Media type "print" inside brackets.`,
          fix: null,
        },
      ],
      "51.01"
    );
    t.equal(applyFixes(str, res, offset), str, "51.02");
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - nested brackets, one condition is unrecognised`,
  (t) => {
    const str = `screen and not (print and (zzz))`;
    writeSample({
      id: "06.07",
      str,
      // fixed
    });
    const offset = 0;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 11 + offset,
          idxTo: 14 + offset,
          message: `"not" can't be here.`,
          fix: null,
        },
      ],
      "52.01"
    );
    t.equal(applyFixes(str, res, offset), str, "52.02");
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - everything in brackets`,
  (t) => {
    const str = `(screen and (color))`;
    writeSample({
      id: "06.08",
      str,
      // fixed
    });
    const offset = 20;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 1 + offset,
          idxTo: 7 + offset,
          message: `Media type "screen" inside brackets.`,
          fix: null,
        },
      ],
      "53.01"
    );
    t.equal(applyFixes(str, res, offset), str, "53.02");
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${90}m${`brackets`}\u001b[${39}m`} - everything in brackets, chained`,
  (t) => {
    const str = `(screen and (color)) and (print and (color)) and (speech and (update))`;
    writeSample({
      id: "06.09",
      str,
      // fixed
    });
    const offset = 99;
    const res = isMediaD(str, { offset });
    t.strictSame(
      res,
      [
        {
          idxFrom: 1 + offset,
          idxTo: 7 + offset,
          message: 'Media type "screen" inside brackets.',
          fix: null,
        },
        {
          idxFrom: 26 + offset,
          idxTo: 31 + offset,
          message: 'Media type "print" inside brackets.',
          fix: null,
        },
        {
          idxFrom: 50 + offset,
          idxTo: 56 + offset,
          message: 'Media type "speech" inside brackets.',
          fix: null,
        },
      ],
      "54.01"
    );
    t.equal(applyFixes(str, res, offset), str, "54.02");
    t.end();
  }
);

// 07. comma
// -----------------------------------------------------------------------------

tap.test(`55 - ${`\u001b[${36}m${`comma`}\u001b[${39}m`} - healthy`, (t) => {
  const str = `screen, print`;
  writeSample({
    id: "07.01",
    str,
    // fixed
  });
  const offset = 1;
  const res = isMediaD(str, { offset });
  t.strictSame(res, [], "55.01");
  t.equal(applyFixes(str, res, offset), str, "55.02");
  t.end();
});

// 08. space missing
// -----------------------------------------------------------------------------

tap.test(`56 - space after "and" missing`, (t) => {
  const str = `screen and(min-width: 100px)`;
  const fixed = `screen and (min-width: 100px)`;
  writeSample({
    id: "08.01",
    str,
    // fixed
  });
  const res = isMediaD(str);
  t.strictSame(
    res,
    [
      {
        idxFrom: 7,
        idxTo: 10,
        message: `Space after "and" missing.`,
        fix: { ranges: [[10, 10, " "]] },
      },
    ],
    "56.01"
  );
  t.equal(applyFixes(str, res), fixed, "56.02");
  t.end();
});
