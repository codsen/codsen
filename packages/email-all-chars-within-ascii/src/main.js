import isObj from "lodash.isplainobject";

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

  // declare defaults, so we can enforce types later:
  const defaults = {
    messageOnly: false,
    checkLineLength: true,
  };

  // fill any settings with defaults if missing:
  const opts = Object.assign({}, defaults, originalOpts);

  // -----------------------------------------------------------------------------

  // allowed ASCII control characters:
  //
  // #9  - HT, horizontal tab
  // #10 - LF, new line
  // #13 - CR, carriage return
  //
  // the rest, below decimal point #32 are not allowed
  // Naturally, above #126 is not allowed. This concerns #127, DEL too!
  // Often #127, DEL, is overlooked, yet it is not good in email.

  let counter = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    counter += 1;
    // throw if non-ASCII
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
    // check line lengths
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
