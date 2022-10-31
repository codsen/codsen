/* eslint no-param-reassign:0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { processCommaSep } from "../dist/string-process-comma-separated.esm.js";

const rawnbsp = "\u00a0";

// helper functions
// -----------------------------------------------------------------------------

function helper(str, opts, gatheredChunks, gatheredErrors) {
  opts.cb = (idxFrom, idxTo) => {
    // console.log(
    //   `012 test/helper(): opts.cb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}`
    // );
    gatheredChunks.push([idxFrom, idxTo]);
  };
  opts.errCb = (ranges, message, fixable) => {
    // console.log(
    //   `018 test/helper(): opts.errCb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}; errName = ${errName}`
    // );
    gatheredErrors.push({ ranges, message, fixable });
  };

  processCommaSep(str, opts);
}

// 01. edge cases - unusual, broken or strange inputs
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${36}m${`edge cases`}\u001b[${39}m`} - empty string`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    "",
    {
      from: null, // <-- implied to process the whole string
      to: null, // <-- implied to process the whole string
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks.length, 0, "01.01");
  equal(gatheredErrors.length, 0, "01.02");
});

test(`02 - ${`\u001b[${36}m${`edge cases`}\u001b[${39}m`} - empty string, empty opts`, () => {
  not.throws(() => {
    processCommaSep("");
  }, "02.01");
});

test(`03 - ${`\u001b[${36}m${`edge cases`}\u001b[${39}m`} - not a string`, () => {
  throws(() => {
    processCommaSep(true);
  }, /THROW_ID_01/);
});

// 02. B.A.U
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - one chunk`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    "abc",
    {
      from: null, // <-- implied to process the whole string
      to: null, // <-- implied to process the whole string
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[0, 3]], "04.01");
  equal(gatheredErrors.length, 0, "04.02");
});

test(`05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - two chunks`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    "abc,def",
    {
      from: null, // <-- implied to process the whole string
      to: null, // <-- implied to process the whole string
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [0, 3],
      [4, 7],
    ],
    "05.01"
  );
  equal(gatheredErrors, [], "05.02");
});

test(`06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - space after comma, default`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<FRAMESET rows="50%, 50%">`,
    {
      from: 16,
      to: 24,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [16, 19],
      [21, 24],
    ],
    "06.01"
  );
  equal(
    gatheredErrors,
    [{ ranges: [[20, 21]], message: "Remove whitespace.", fixable: true }],
    "06.02"
  );
});

test(`07 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - starts with separator, ends with separator`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<FRAMESET rows=".50%.50%.\t\t.">`,
    {
      from: 16,
      to: 28,
      separator: ".",
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [17, 20],
      [21, 24],
    ],
    "07.01"
  );
  equal(
    gatheredErrors,
    [
      { ranges: [[16, 17]], message: "Remove separator.", fixable: true },
      { ranges: [[25, 27]], message: "Remove whitespace.", fixable: true },
      { ranges: [[24, 25]], message: "Remove separator.", fixable: true },
      { ranges: [[27, 28]], message: "Remove separator.", fixable: true },
    ],
    "07.02"
  );
});

test(`08 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - starts with separator, ends with separator`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<FRAMESET rows=" ,,\t50% ,${rawnbsp} 50% ,\t\t,">`,
    {
      from: 16,
      to: 35,
      separator: ",",
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [20, 23],
      [27, 30],
    ],
    "08.01"
  );
  equal(
    gatheredErrors,
    [
      { ranges: [[16, 17]], message: "Remove whitespace.", fixable: true },
      { ranges: [[17, 18]], message: "Remove separator.", fixable: true },
      { ranges: [[18, 19]], message: "Remove separator.", fixable: true },
      { ranges: [[19, 20]], message: "Remove whitespace.", fixable: true },
      { ranges: [[23, 24]], message: "Remove whitespace.", fixable: true },
      { ranges: [[25, 27]], message: "Remove whitespace.", fixable: true },
      { ranges: [[30, 31]], message: "Remove whitespace.", fixable: true },
      { ranges: [[32, 34]], message: "Remove whitespace.", fixable: true },
      { ranges: [[31, 32]], message: "Remove separator.", fixable: true },
      { ranges: [[34, 35]], message: "Remove separator.", fixable: true },
    ],
    "08.02"
  );
});

test(`09 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - 2 spaces after comma, default`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<FRAMESET rows="50%,  50%">`,
    {
      from: 16,
      to: 25,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [16, 19],
      [22, 25],
    ],
    "09.01"
  );
  equal(
    gatheredErrors,
    [
      {
        message: "Remove whitespace.",
        ranges: [[20, 22]],
        fixable: true,
      },
    ],
    "09.02"
  );
});

test(`10 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - 2 spaces after comma, oneSpaceAfterCommaOK = true`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<FRAMESET rows="50%,  50%">`,
    {
      from: 16,
      to: 25,
      oneSpaceAfterCommaOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [16, 19],
      [22, 25],
    ],
    "10.01"
  );
  // not indexes 20-22 but 21-22 because of opts.oneSpaceAfterCommaOK
  equal(
    gatheredErrors,
    [
      {
        message: "Remove whitespace.",
        ranges: [[21, 22]],
        fixable: true,
      },
    ],
    "10.02"
  );
});

test(`11 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - 2 spaces after comma, oneSpaceAfterCommaOK = true`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<FRAMESET rows="50%,\t\t50%">`,
    {
      from: 16,
      to: 25,
      oneSpaceAfterCommaOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [16, 19],
      [22, 25],
    ],
    "11.01"
  );
  // not indexes 20-22 but 21-22 because of opts.oneSpaceAfterCommaOK
  equal(
    gatheredErrors,
    [
      {
        message: "Remove whitespace.",
        ranges: [[20, 22, " "]],
        fixable: true,
      },
    ],
    "11.02"
  );
});

test(`12 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - with URL, offset`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<applet archive=",http://codsen.com, tralala , ">`,
    {
      from: 17,
      to: 46,
      oneSpaceAfterCommaOK: false,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [18, 35],
      [37, 44],
    ],
    "12.01"
  );
  equal(
    gatheredErrors,
    [
      {
        message: "Remove separator.",
        ranges: [[17, 18]],
        fixable: true,
      },
      {
        message: "Remove whitespace.",
        ranges: [[36, 37]],
        fixable: true,
      },
      {
        message: "Remove whitespace.",
        ranges: [[44, 45]],
        fixable: true,
      },
      {
        message: "Remove separator.",
        ranges: [[45, 46]],
        fixable: true,
      },
    ],
    "12.02"
  );
});

test(`13 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - with URL, offset`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `,http://codsen.com, tralala ,`,
    {
      oneSpaceAfterCommaOK: false,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [1, 18],
      [20, 27],
    ],
    "13.01"
  );
  equal(
    gatheredErrors,
    [
      {
        message: "Remove separator.",
        ranges: [[0, 1]],
        fixable: true,
      },
      {
        message: "Remove whitespace.",
        ranges: [[19, 20]],
        fixable: true,
      },
      {
        message: "Remove whitespace.",
        ranges: [[27, 28]],
        fixable: true,
      },
      {
        message: "Remove separator.",
        ranges: [[28, 29]],
        fixable: true,
      },
    ],
    "13.02"
  );
});

// 03. opts.leadingWhitespaceOK
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - from-to ranges`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept=" .jpg">`,
    {
      from: 15,
      to: 20,
      leadingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[16, 20]], "14.01");
  equal(gatheredErrors, [], "14.02");
});

test(`15 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - whole string`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    ` .jpg`,
    {
      leadingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[1, 5]], "15.01");
  equal(gatheredErrors, [], "15.02");
});

test(`16 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - whole string + offset`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    ` .jpg`,
    {
      leadingWhitespaceOK: true,
      offset: 15,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[16, 20]], "16.01");
  equal(gatheredErrors, [], "16.02");
});

test(`17 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept=" .jpg ">`,
    {
      from: 15,
      to: 21,
      leadingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[16, 20]], "17.01");
  equal(
    gatheredErrors,
    [
      {
        ranges: [[20, 21]],
        message: "Remove whitespace.",
        fixable: true,
      },
    ],
    "17.02"
  );
});

test(`18 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept=" .jpg ">`,
    {
      from: 15,
      to: 21,
      leadingWhitespaceOK: true,
      trailingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[16, 20]], "18.01");
  equal(gatheredErrors, [], "18.02"); // <--- none
});

test(`19 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept=" .jpg ">`,
    {
      from: 15,
      to: 21,
      trailingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[16, 20]], "19.01");
  equal(
    gatheredErrors,
    [
      {
        ranges: [[15, 16]],
        message: "Remove whitespace.",
        fixable: true,
      },
    ],
    "19.02"
  );
});

test(`20 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept=" .jpg  ">`,
    {
      from: 15,
      to: 22,
      leadingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(gatheredChunks, [[16, 20]], "20.01");
  equal(
    gatheredErrors,
    [
      {
        ranges: [[20, 22]],
        message: "Remove whitespace.",
        fixable: true,
      },
    ],
    "20.02"
  );
});

test(`21 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - more complex`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  let offset = 17;
  helper(
    `,http://codsen.com, tralala , `,
    {
      offset,
      leadingWhitespaceOK: true,
      trailingWhitespaceOK: true,
      oneSpaceAfterCommaOK: false,
      innerWhitespaceAllowed: false,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [offset + 1, offset + 18],
      [offset + 20, offset + 27],
    ],
    "21.01"
  );
  equal(
    gatheredErrors,
    [
      {
        ranges: [[offset + 0, offset + 1]],
        message: "Remove separator.",
        fixable: true,
      },
      {
        ranges: [[offset + 19, offset + 20]],
        message: "Remove whitespace.",
        fixable: true,
      },
      {
        ranges: [[offset + 27, offset + 28]],
        message: "Remove whitespace.",
        fixable: true,
      },
      {
        ranges: [[offset + 28, offset + 29]],
        message: "Remove separator.",
        fixable: true,
      },
    ],
    "21.02"
  );
});

// 04. opts.innerWhitespaceAllowed
// -----------------------------------------------------------------------------

test(`22 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept="abc,def ghi, jkl ">`,
    {
      from: 15,
      to: 32,
      truetrailingWhitespaceOK: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [15, 18],
      [19, 26],
      [28, 31],
    ],
    "22.01"
  );
  equal(
    gatheredErrors,
    [
      {
        ranges: [[22, 23]],
        message: "Bad whitespace.",
        fixable: false,
      },
      {
        ranges: [[27, 28]],
        message: "Remove whitespace.",
        fixable: true,
      },
      {
        ranges: [[31, 32]],
        message: "Remove whitespace.",
        fixable: true,
      },
    ],
    "22.02"
  );
});

test(`23 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`, () => {
  let gatheredChunks = [];
  let gatheredErrors = [];
  helper(
    `<input accept="abc,def ghi, jkl ">`,
    {
      from: 15,
      to: 32,
      truetrailingWhitespaceOK: true,
      innerWhitespaceAllowed: true,
    },
    gatheredChunks,
    gatheredErrors
  );

  equal(
    gatheredChunks,
    [
      [15, 18],
      [19, 26],
      [28, 31],
    ],
    "23.01"
  );
  equal(
    gatheredErrors,
    [
      {
        ranges: [[27, 28]],
        message: "Remove whitespace.",
        fixable: true,
      },
      {
        ranges: [[31, 32]],
        message: "Remove whitespace.",
        fixable: true,
      },
    ],
    "23.02"
  );
});

test.run();
