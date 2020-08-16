/**
 * email-all-chars-within-ascii
 * Scans all characters within a string and checks are they within ASCII range
 * Version: 2.9.66
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/email-all-chars-within-ascii
 */

import isObj from 'lodash.isplainobject';

function within(str, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (typeof str !== "string") {
    throw new Error(
      `email-all-chars-within-ascii/within(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      `email-all-chars-within-ascii/within(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const defaults = {
    messageOnly: false,
    checkLineLength: true,
  };
  const opts = { ...defaults, ...originalOpts };
  let counter = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    counter += 1;
    if (
      str[i].codePointAt(0) > 126 ||
      str[i].codePointAt(0) < 9 ||
      str[i].codePointAt(0) === 11 ||
      str[i].codePointAt(0) === 12 ||
      (str[i].codePointAt(0) > 13 && str[i].codePointAt(0) < 32)
    ) {
      throw new Error(
        `${
          opts.messageOnly ? "" : "email-all-chars-within-ascii: "
        }Non ascii character found at index ${i}, equal to: ${JSON.stringify(
          str[i],
          null,
          4
        )}, its decimal code point is ${str[i].codePointAt(0)}.`
      );
    }
    if (counter > 997 && opts.checkLineLength) {
      throw new Error(
        `${
          opts.messageOnly ? "" : "email-all-chars-within-ascii: "
        }Line length is beyond 999 characters!`
      );
    }
    if (str[i] === "\r" || str[i] === "\n") {
      counter = 0;
    }
  }
}

export default within;
