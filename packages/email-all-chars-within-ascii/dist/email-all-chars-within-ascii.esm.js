/**
 * email-all-chars-within-ascii
 * Scans all characters within a string and checks are they within ASCII range
 * Version: 3.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/email-all-chars-within-ascii/
 */

var version$1 = "3.0.10";

const version = version$1;
const defaults = {
  lineLength: 500
};
function within(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (!str.length) {
    return [];
  }
  const opts = { ...defaults,
    ...originalOpts
  };
  let column = 0;
  let currLine = 1;
  const res = [];
  for (let i = 0, len = str.length; i <= len; i++) {
    if (opts.lineLength && (!str[i] || str[i] === "\r" || str[i] === "\n") && column > opts.lineLength) {
      res.push({
        type: "line length",
        line: currLine,
        column: column,
        positionIdx: i,
        value: column
      });
    }
    if (str[i] === "\r" || str[i] === "\n") {
      column = 0;
      if (str[i] === "\n" || str[i + 1] !== "\n") {
        currLine += 1;
      }
    } else {
      column += 1;
    }
    if (str[i]) {
      const currCodePoint = str[i].codePointAt(0);
      if (currCodePoint === undefined || currCodePoint > 126 || currCodePoint < 9 || currCodePoint === 11 || currCodePoint === 12 || currCodePoint > 13 && currCodePoint < 32) {
        res.push({
          type: "character",
          line: currLine,
          column,
          positionIdx: i,
          value: str[i],
          codePoint: currCodePoint,
          UTF32Hex: str[i].charCodeAt(0).toString(16).padStart(4, "0").toLowerCase()
        });
      }
    }
  }
  return res;
}

export { defaults, version, within };
