import fs from "fs";
import path from "path";
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { isMediaD } from "../dist/is-media-descriptor.esm.js";
import { applyFixes, writeSample } from "../t-util/util.js";

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

test(`01 - ${`\u001b[${33}m${"api bits"}\u001b[${39}m`} - non-string`, () => {
  equal(isMediaD(), [], "01.01");
});

test(`02 - ${`\u001b[${33}m${"api bits"}\u001b[${39}m`} - empty string`, () => {
  let str = "";
  equal(isMediaD(str), [], "02.01");
  writeSample({
    id: "00.02",
    str,
    // fixed
  });
});

test(`03 - ${`\u001b[${33}m${"api bits"}\u001b[${39}m`} - space character`, () => {
  let str = " ";
  equal(isMediaD(str), [], "03.01");
  writeSample({
    id: "00.03",
    str,
    // fixed
  });
});

test(`04 - ${`\u001b[${33}m${"api bits"}\u001b[${39}m`} - trimmable to zero`, () => {
  let str = "\n\n\n";
  equal(isMediaD(str), [], "04.01");
  writeSample({
    id: "00.04",
    str,
    // fixed
  });
});

test(`05 - ${`\u001b[${33}m${"api bits"}\u001b[${39}m`} - weird offset`, () => {
  throws(
    () => {
      isMediaD("", { offset: true });
    },
    /THROW_ID_01/gm,
    "05.01"
  );
});

// 01. single-string values
// -----------------------------------------------------------------------------

test(`06 - ${`\u001b[${31}m${"single-string values"}\u001b[${39}m`}`, () => {
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
    equal(isMediaD(val), []);
  });
});

test(`07 - ${`\u001b[${31}m${"single-string values"}\u001b[${39}m`} - with offset`, () => {
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
    equal(isMediaD(val, { offset: 999 }), []);
  });
});

test(`08 - ${`\u001b[${31}m${"single-string values"}\u001b[${39}m`} - unrecognised string`, () => {
  let str = " zzz";
  writeSample({
    id: "01.03",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
        message: 'Unrecognised media type "zzz".',
        fix: null,
      },
    ],
    "08.01"
  );
  equal(applyFixes(str, res, offset), "zzz", "08.02");
});

test(`09 - ${`\u001b[${31}m${"single-string values"}\u001b[${39}m`} - unrecognised string`, () => {
  let str = "only";
  writeSample({
    id: "01.04",
    str,
  });
  let res = isMediaD(str);
  equal(applyFixes(str, res), str, "09.01");
  equal(
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
});

test(`10 - ${`\u001b[${31}m${"single-string values"}\u001b[${39}m`} - unrecognised string`, () => {
  let str = "not";
  writeSample({
    id: "01.05",
    str,
  });
  let res = isMediaD(str);
  equal(applyFixes(str, res), str, "10.01");
  equal(
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
});

// 02. whitespace related errors
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - leading`, () => {
  let str = "\tall";
  let fixed = "all";
  writeSample({
    id: "02.01",
    str,
    fixed,
  });
  let offset = 90;
  let res = isMediaD(str, { offset });
  equal(applyFixes(str, res, offset), fixed, "11.01");
  equal(
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
});

test(`12 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - trailing`, () => {
  let str = "all\t";
  let fixed = "all";
  writeSample({
    id: "02.02",
    str,
    fixed,
  });
  let res = isMediaD(str);
  equal(applyFixes(str, res), fixed, "12.01");
  equal(
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
});

test(`13 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - mixed, leading and trailing`, () => {
  let str = "\t\t\tall\t\n";
  let fixed = "all";
  writeSample({
    id: "02.03",
    str,
    fixed,
  });
  let res = isMediaD(str);
  equal(applyFixes(str, res), fixed, "13.01");
  equal(
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
});

test(`14 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - single tab whitespace chunk`, () => {
  let str = "only\tscreen";
  let fixed = "only screen";
  writeSample({
    id: "02.04",
    str,
    fixed,
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), fixed, "14.02");
});

test(`15 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - multiple tab whitespace chunk`, () => {
  let str = "only\t\tscreen";
  let fixed = "only screen";
  writeSample({
    id: "02.05",
    str,
    fixed,
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), fixed, "15.02");
});

test(`16 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - mixed whitespace chunk, tab end`, () => {
  let str = "only  \tscreen";
  let fixed = "only screen";
  writeSample({
    id: "02.06",
    str,
    fixed,
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), fixed, "16.02");
});

test(`17 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - mixed whitespace chunk, tab start and end`, () => {
  let str = "only\t \tscreen";
  let fixed = "only screen";
  writeSample({
    id: "02.07",
    str,
    fixed,
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), fixed, "17.02");
});

test(`18 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - mixed whitespace chunk, tab start`, () => {
  let str = "only\t  screen";
  let fixed = "only screen";
  writeSample({
    id: "02.08",
    str,
    fixed,
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), "only screen", "18.02");
});

test(`19 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - not, missing type`, () => {
  let str = "not (monochrome)";
  writeSample({
    id: "02.09",
    str,
    // fixed
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 4 + offset,
        idxTo: 16 + offset,
        message: '"not" can be only in front of media type.',
        fix: null,
      },
    ],
    "19.01"
  );
  equal(applyFixes(str, res, offset), str, "19.02");
});

test(`20 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - not, missing type`, () => {
  let str = "not (width <= -100px)";
  writeSample({
    id: "02.10",
    str,
    // fixed
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 4 + offset,
        idxTo: 21 + offset,
        message: '"not" can be only in front of media type.',
        fix: null,
      },
    ],
    "20.01"
  );
  equal(applyFixes(str, res, offset), str, "20.02");
});

test(`21 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - not, missing type, whitespace`, () => {
  let str = "not ( monochrome )";
  let fixed = "not (monochrome)";
  writeSample({
    id: "02.10",
    str,
    fixed,
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(
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
        message: '"not" can be only in front of media type.',
        fix: null,
      },
    ],
    "21.01"
  );
  equal(applyFixes(str, res, offset), fixed, "21.02");
});

test(`22 - ${`\u001b[${32}m${"bad whitespace"}\u001b[${39}m`} - trailing space`, () => {
  let str = "screen ";
  let fixed = "screen";
  writeSample({
    id: "02.12",
    str,
    fixed,
  });
  let res = isMediaD(str);
  equal(
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
  equal(applyFixes(str, res), fixed, "22.02");
});

// 03. levenshtein distance 1 on single-string values
// -----------------------------------------------------------------------------

test(`23 - ${`\u001b[${36}m${"levenshtein"}\u001b[${39}m`} - minimal case`, () => {
  let str = "screeen";
  let fixed = "screen";
  writeSample({
    id: "03.01",
    str,
    fixed,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(applyFixes(str, res, offset), fixed, "23.01");
  equal(
    res,
    [
      {
        idxFrom: 10,
        idxTo: 17,
        message: 'Did you mean "screen"?',
        fix: {
          ranges: [[10, 17, "screen"]],
        },
      },
    ],
    "23.02"
  );
});

test(`24 - ${`\u001b[${36}m${"levenshtein"}\u001b[${39}m`} - leading and trailing`, () => {
  let str = "\t\t\tal\t\n";
  let fixed = "all";
  writeSample({
    id: "03.02",
    str,
    fixed,
  });
  let res = isMediaD(str);
  equal(applyFixes(str, res), fixed, "24.01");
  equal(
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
        message: 'Did you mean "all"?',
        fix: {
          ranges: [[3, 5, "all"]],
        },
      },
    ],
    "24.02"
  );
});

// 04. preliminary checks
// -----------------------------------------------------------------------------

test(`25 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - mismatching bracket count 1`, () => {
  let str = "only (screen))";
  writeSample({
    id: "04.01",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "25.02");
});

test(`26 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - mismatching bracket count 2`, () => {
  let str = "only ((screen)";
  writeSample({
    id: "04.02",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "26.02");
});

test(`27 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - three brackets of each type, but wrong order`, () => {
  let str = "only ())screen(()";
  writeSample({
    id: "04.03",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 0 + offset,
        idxTo: 17 + offset,
        message: "Some closing brackets are before their opening counterparts.",
        fix: null,
      },
    ],
    "27.01"
  );
  equal(applyFixes(str, res, offset), str, "27.02");
});

test(`28 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - three brackets of each type, but wrong order`, () => {
  let str = "only )))))";
  writeSample({
    id: "04.04",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "28.02");
});

test(`29 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - semicolon present`, () => {
  // for example
  // @media test;,all { body { background:lime } }
  let str = "test;,all";
  writeSample({
    id: "04.05",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "29.02");
});

test(`30 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - empty pair`, () => {
  let str = "screen and ()";
  writeSample({
    id: "04.06",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "30.02");
});

test(`31 - ${`\u001b[${34}m${"preliminary checks"}\u001b[${39}m`} - three brackets of each type, but wrong order`, () => {
  let str = "screen and (\t\r)";
  writeSample({
    id: "04.07",
    str,
  });
  let offset = 10;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "31.02");
});

// 05. composed values
// -----------------------------------------------------------------------------

test(`32 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of one, healthy "only"`, () => {
  let str = "only screen";
  writeSample({
    id: "05.01",
    str,
  });
  let offset = 60;
  let res = isMediaD(str, { offset });
  equal(res, [], "32.01");
  equal(applyFixes(str, res, offset), str, "32.02");
});

test(`33 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of one, healthy "only"`, () => {
  let str = "onlies screen";
  writeSample({
    id: "05.02",
    str,
  });
  let offset = 50;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 0 + offset,
        idxTo: 6 + offset,
        message: 'Unrecognised "onlies".',
        fix: null,
      },
    ],
    "33.01"
  );
  equal(applyFixes(str, res, offset), str, "33.02");
});

test(`34 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of one, healthy "not"`, () => {
  let str = "not (monochrome)";
  writeSample({
    id: "05.03",
    str,
  });
  let offset = 40;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 4 + offset,
        idxTo: 16 + offset,
        message: '"not" can be only in front of media type.',
        fix: null,
      },
    ],
    "34.01"
  );
  equal(applyFixes(str, res, offset), str, "34.02");
});

test(`35 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - only dot`, () => {
  let str = "only .";
  writeSample({
    id: "05.04",
    str,
  });
  let offset = 30;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 5 + offset,
        idxTo: 6 + offset,
        message: 'Strange symbol ".".',
        fix: null,
      },
    ],
    "35.01"
  );
  equal(applyFixes(str, res, offset), str, "35.02");
});

test(`36 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - only dot`, () => {
  let str = "only --";
  writeSample({
    id: "05.05",
    str,
  });
  let offset = 30;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 5 + offset,
        idxTo: 7 + offset,
        message: 'Strange symbols "--".',
        fix: null,
      },
    ],
    "36.01"
  );
  equal(applyFixes(str, res, offset), str, "36.02");
});

test(`37 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - only and`, () => {
  let str = "only and";
  writeSample({
    id: "05.06",
    str,
  });
  let offset = 30;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 5 + offset,
        idxTo: 8 + offset,
        message: '"and" instead of a media type.',
        fix: null,
      },
    ],
    "37.01"
  );
  equal(applyFixes(str, res, offset), str, "37.02");
});

test(`38 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - only and`, () => {
  let str = "only only";
  writeSample({
    id: "05.07",
    str,
  });
  let offset = 30;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 5 + offset,
        idxTo: 9 + offset,
        message: '"only" instead of a media type.',
        fix: null,
      },
    ],
    "38.01"
  );
  equal(applyFixes(str, res, offset), str, "38.02");
});

test(`39 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - only and`, () => {
  let str = "only not";
  writeSample({
    id: "05.08",
    str,
  });
  let offset = 30;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 5 + offset,
        idxTo: 8 + offset,
        message: '"not" instead of a media type.',
        fix: null,
      },
    ],
    "39.01"
  );
  equal(applyFixes(str, res, offset), str, "39.02");
});

test(`40 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of two, healthy`, () => {
  // const str = `screen and (color)`;
  let str = "screen and (max-width: 100px)";
  writeSample({
    id: "05.09",
    str,
  });
  let offset = 20;
  let res = isMediaD(str, { offset });
  equal(res, [], "40.01");
});

test(`41 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of two, healthy`, () => {
  let str = "not (monochrome)";
  writeSample({
    id: "05.10",
    str,
  });
  let offset = 20;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 4 + offset,
        idxTo: 16 + offset,
        message: '"not" can be only in front of media type.',
        fix: null,
      },
    ],
    "41.01"
  );
});

test(`42 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of two, missing brackets`, () => {
  let str = "not screen and color";
  let fixed = "not screen and (color)";
  writeSample({
    id: "05.11",
    str,
    fixed,
  });
  let offset = 88;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 15 + offset,
        idxTo: 20 + offset,
        message: "Missing brackets.",
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
  equal(applyFixes(str, res, offset), fixed, "42.02");
});

test(`43 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - composed of two, missing brackets`, () => {
  let str = "not screen and screen";
  writeSample({
    id: "05.12",
    str,
    // fixed
  });
  let offset = 88;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 15 + offset,
        idxTo: 21 + offset,
        message: "Unexpected media type, try using a comma.",
        fix: null,
      },
    ],
    "43.01"
  );
  equal(applyFixes(str, res, offset), str, "43.02");
});

test(`44 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - dangling "and"`, () => {
  let str = "not screen and (monochrome) \tand";
  let fixed = "not screen and (monochrome)";
  writeSample({
    id: "05.13",
    str,
    fixed,
  });
  let offset = 0;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 27 + offset,
        idxTo: 29 + offset,
        message: "Bad whitespace.",
        fix: {
          ranges: [[28 + offset, 29 + offset]],
        },
      },
      {
        idxFrom: 29 + offset,
        idxTo: 32 + offset,
        message: 'Dangling "and".',
        fix: {
          ranges: [[27 + offset, 32 + offset]],
        },
      },
    ],
    "44.01"
  );
  equal(applyFixes(str, res, offset), fixed, "44.02");
});

test(`45 - ${`\u001b[${35}m${"composed"}\u001b[${39}m`} - dangling "and"`, () => {
  let str = "screeen and (color), projection and (color)";
  writeSample({
    id: "05.14",
    str,
    // fixed
  });
  let offset = 0;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 0 + offset,
        idxTo: 7 + offset,
        message: 'Unrecognised "screeen".',
        fix: null,
      },
    ],
    "45.01"
  );
  equal(applyFixes(str, res, offset), str, "45.02");
});

// 06. brackets
// -----------------------------------------------------------------------------

test(`46 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - composed of one type and one condition, healthy`, () => {
  let str = "speech and (device-aspect-ratio: 16/9)";
  writeSample({
    id: "06.01",
    str,
    // fixed
  });
  let offset = 20;
  let res = isMediaD(str, { offset });
  equal(res, [], "46.01");
  equal(applyFixes(str, res, offset), str, "46.02");
});

test(`47 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - composed of one type and one condition, no brackets`, () => {
  let str = "speech and device-aspect-ratio : 16/9";
  writeSample({
    id: "06.02",
    str,
    // fixed
  });
  let offset = 20;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 11 + offset,
        idxTo: 30 + offset,
        message: 'Expected brackets on "device-aspect-ratio" and its value.',
        fix: null,
      },
    ],
    "47.01"
  );
  equal(applyFixes(str, res, offset), str, "47.02");
});

test(`48 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - composed of one type and one condition, no brackets`, () => {
  let str = "speech and device-aspect-ratio";
  writeSample({
    id: "06.03",
    str,
    // fixed
  });
  let offset = 20;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 11 + offset,
        idxTo: 30 + offset,
        message: 'Expected brackets on "device-aspect-ratio".',
        fix: null,
      },
    ],
    "48.01"
  );
  equal(applyFixes(str, res, offset), str, "48.02");
});

test(`49 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - nested brackets, one condition is unrecognised`, () => {
  let str = "screen and not (print)";
  writeSample({
    id: "06.04",
    str,
    // fixed
  });
  let offset = 0;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 11 + offset,
        idxTo: 14 + offset,
        message: '"not" can\'t be here.',
        fix: null,
      },
    ],
    "49.01"
  );
  equal(applyFixes(str, res, offset), str, "49.02");
});

test(`50 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - nested brackets, one condition is unrecognised`, () => {
  let str = "screen and (not print)";
  writeSample({
    id: "06.05",
    str,
    // fixed
  });
  let offset = 0;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 16 + offset,
        idxTo: 21 + offset,
        message: 'Media type "print" inside brackets.',
        fix: null,
      },
    ],
    "50.01"
  );
  equal(applyFixes(str, res, offset), str, "50.02");
});

test(`51 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - nested brackets, one condition is unrecognised`, () => {
  let str = "screen and (print and (zzz))";
  writeSample({
    id: "06.06",
    str,
    // fixed
  });
  let offset = 9;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 23 + offset,
        idxTo: 26 + offset,
        message: 'Unrecognised "zzz".',
        fix: null,
      },
      {
        idxFrom: 12 + offset,
        idxTo: 17 + offset,
        message: 'Media type "print" inside brackets.',
        fix: null,
      },
    ],
    "51.01"
  );
  equal(applyFixes(str, res, offset), str, "51.02");
});

test(`52 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - nested brackets, one condition is unrecognised`, () => {
  let str = "screen and not (print and (zzz))";
  writeSample({
    id: "06.07",
    str,
    // fixed
  });
  let offset = 0;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 11 + offset,
        idxTo: 14 + offset,
        message: '"not" can\'t be here.',
        fix: null,
      },
    ],
    "52.01"
  );
  equal(applyFixes(str, res, offset), str, "52.02");
});

test(`53 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - everything in brackets`, () => {
  let str = "(screen and (color))";
  writeSample({
    id: "06.08",
    str,
    // fixed
  });
  let offset = 20;
  let res = isMediaD(str, { offset });
  equal(
    res,
    [
      {
        idxFrom: 1 + offset,
        idxTo: 7 + offset,
        message: 'Media type "screen" inside brackets.',
        fix: null,
      },
    ],
    "53.01"
  );
  equal(applyFixes(str, res, offset), str, "53.02");
});

test(`54 - ${`\u001b[${90}m${"brackets"}\u001b[${39}m`} - everything in brackets, chained`, () => {
  let str =
    "(screen and (color)) and (print and (color)) and (speech and (update))";
  writeSample({
    id: "06.09",
    str,
    // fixed
  });
  let offset = 99;
  let res = isMediaD(str, { offset });
  equal(
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
  equal(applyFixes(str, res, offset), str, "54.02");
});

// 07. comma
// -----------------------------------------------------------------------------

test(`55 - ${`\u001b[${36}m${"comma"}\u001b[${39}m`} - healthy`, () => {
  let str = "screen, print";
  writeSample({
    id: "07.01",
    str,
    // fixed
  });
  let offset = 1;
  let res = isMediaD(str, { offset });
  equal(res, [], "55.01");
  equal(applyFixes(str, res, offset), str, "55.02");
});

// 08. space missing
// -----------------------------------------------------------------------------

test('56 - space after "and" missing', () => {
  let str = "screen and(min-width: 100px)";
  let fixed = "screen and (min-width: 100px)";
  writeSample({
    id: "08.01",
    str,
    // fixed
  });
  let res = isMediaD(str);
  equal(
    res,
    [
      {
        idxFrom: 7,
        idxTo: 10,
        message: 'Space after "and" missing.',
        fix: { ranges: [[10, 10, " "]] },
      },
    ],
    "56.01"
  );
  equal(applyFixes(str, res), fixed, "56.02");
});

test.run();
