import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";
import {
  // rawnbsp,
  encodedNbspHtml,
  // encodedNbspCss,
  // encodedNbspJs,
  // rawNdash,
  // rawMdash,
} from "./util.js";

// const languages = ["html`, `css`, `js"];
// const encodedNbsps = [encodedNbspHtml, encodedNbspCss, encodedNbspJs];
// const eolTypes = ["LF`, `CR`, `CRLF"];

// opts.tagRanges
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"opts.tagRanges"}\u001b[${39}m`} - accepts known tag ranges and ignores everything`, () => {
  let source =
    '<a href="zzz" target="_blank" style="font-size: 10px; line-height: 14px;">';
  equal(
    removeWidows(source, {
      tagRanges: [[0, 74]],
    }).res,
    source,
    "01.01",
  );
});

test(`02 - ${`\u001b[${33}m${"opts.tagRanges"}\u001b[${39}m`} - widow space between tags`, () => {
  equal(
    removeWidows(
      'something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>',
    ).res,
    `something in front here <a style="display: block;">x</a> <b style="display:${encodedNbspHtml}block;">y</b>`,
    "02.01",
  );
  equal(
    removeWidows(
      'something in front here <a style="display: block;">x</a> <b style="display: block;">y</b>',
      {
        tagRanges: [
          [24, 51],
          [52, 56],
          [57, 84],
          [85, 89],
        ],
      },
    ).res,
    `something in front here <a style="display: block;">x</a>${encodedNbspHtml}<b style="display: block;">y</b>`,
    "02.02",
  );
});

test(`03 - ${`\u001b[${33}m${"opts.tagRanges"}\u001b[${39}m`} - widow space between tags`, () => {
  equal(
    removeWidows(
      "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\n Text.",
    ).res,
    `Very long line, long-enough to trigger widow${encodedNbspHtml}removal.<br/>\n<br/>\n Text.`,
    "03.01",
  );
  equal(
    removeWidows(
      "Very long line, long-enough to trigger widow removal.<br/>\n<br/>\n Text.",
      {
        tagRanges: [
          [53, 58],
          [60, 65],
        ],
      },
    ).res,
    `Very long line, long-enough to trigger widow${encodedNbspHtml}removal.<br/>\n<br/>\n Text.`,
    "03.02",
  );
});

test.run();
