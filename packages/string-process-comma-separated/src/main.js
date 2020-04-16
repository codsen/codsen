function processCommaSeparated(str, originalOpts) {
  console.log(
    `003 processCommaSeparated: INCOMING ${`\u001b[${33}m${`str`}\u001b[${39}m`}: ${JSON.stringify(
      str,
      null,
      0
    )}`
  );
  console.log(
    `010 processCommaSeparated: INCOMING ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} keys: ${JSON.stringify(
      Object.keys(originalOpts),
      null,
      0
    )}`
  );

  // insurance:
  if (typeof str !== "string") {
    throw new Error(
      `string-process-comma-separated: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  } else if (!str.length || (!originalOpts.cb && !originalOpts.errCb)) {
    // if input str is empty or there are no callbacks, exit early
    return;
  }
  // opts preparation:
  const defaults = {
    from: 0,
    to: str.length,
    offset: 0,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false,
    oneSpaceAfterCommaOK: false,
    innerWhitespaceAllowed: false,
    separator: ",",
    cb: null,
    errCb: null,
  };
  const opts = Object.assign({}, defaults, originalOpts);

  // patch from/to values, they might have been given as nulls etc.
  if (!Number.isInteger(originalOpts.from)) {
    opts.from = 0;
  }
  if (!Number.isInteger(originalOpts.to)) {
    opts.to = str.length;
  }
  if (!Number.isInteger(originalOpts.offset)) {
    opts.offset = 0;
  }

  console.log(
    `057 processCommaSeparated: FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}; plus, ${typeof opts.cb} opts.cb; ${typeof opts.errCb} opts.errCb`
  );

  // action:
  let chunkStartsAt = null;
  let whitespaceStartsAt = null;
  let firstNonwhitespaceNonseparatorCharFound = false;
  let separatorsArr = []; // needed to catch trailing separators
  let lastNonWhitespaceCharAt = null;
  let fixable = true;

  for (let i = opts.from; i < opts.to; i++) {
    console.log(
      `${`\u001b[${36}m${`----------------------------------- str[${i}] = ${JSON.stringify(
        str[i],
        null,
        0
      )} -----------------------------------`}\u001b[${39}m`}`
    );

    // catch the last nonwhitespace char
    if (str[i].trim() && str[i] !== opts.separator) {
      lastNonWhitespaceCharAt = i;
      console.log(
        `085 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastNonWhitespaceCharAt`}\u001b[${39}m`} = ${lastNonWhitespaceCharAt}`
      );
    }

    // catch the beginning of a chunk
    if (
      chunkStartsAt === null &&
      str[i].trim() &&
      (!opts.separator || str[i] !== opts.separator)
    ) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        firstNonwhitespaceNonseparatorCharFound = true;
        console.log(
          `098 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonwhitespaceNonseparatorCharFound`}\u001b[${39}m`} = ${firstNonwhitespaceNonseparatorCharFound}`
        );
      }

      // if there was only one separator up to now, wipe it
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          separatorsArr.forEach((separatorsIdx, orderNumber) => {
            if (orderNumber) {
              opts.errCb(
                [
                  [
                    separatorsIdx + opts.offset,
                    separatorsIdx + 1 + opts.offset,
                  ],
                ],
                "Remove separator.",
                fixable
              );
            }
          });
        }
        separatorsArr = [];
        console.log(
          `122 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`separatorsArr`}\u001b[${39}m`}`
        );
      }

      chunkStartsAt = i;
      console.log(
        `128 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
      );
    }

    // catch the ending of a chunk
    if (
      Number.isInteger(chunkStartsAt) &&
      ((i > chunkStartsAt && opts.separator && str[i] === opts.separator) ||
        i + 1 === opts.to)
    ) {
      console.log(`138 chunk ends`);
      const chunk = str.slice(
        chunkStartsAt,
        i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
          ? i + 1
          : i
      );
      console.log(
        `146 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`chunk`}\u001b[${39}m`} = "${`\u001b[${35}m${chunk}\u001b[${39}m`}"`
      );

      // ping the cb
      if (typeof opts.cb === "function") {
        console.log(
          `152 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            [
              chunkStartsAt + opts.offset,
              (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
                ? i + 1
                : lastNonWhitespaceCharAt + 1) + opts.offset,
            ],
            null,
            4
          )}`
        );
        opts.cb(
          chunkStartsAt + opts.offset,
          (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
            ? i + 1
            : lastNonWhitespaceCharAt + 1) + opts.offset
        );
      }

      // reset
      chunkStartsAt = null;
      console.log(
        `174 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
      );
    }

    // catch the beginning of a whitespace
    if (!str[i].trim() && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      console.log(
        `182 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      );
    }

    // catch the ending of a whitespace
    if (whitespaceStartsAt !== null && (str[i].trim() || i + 1 === opts.to)) {
      console.log(`188 whitespace ends`);

      if (whitespaceStartsAt === opts.from) {
        console.log(`191 leading whitespace clauses`);
        if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
          console.log(
            `194 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [
                [
                  whitespaceStartsAt + opts.offset,
                  (i + 1 === opts.to ? i + 1 : i) + opts.offset,
                ],
                "Remove whitespace.",
              ],
              null,
              4
            )}`
          );
          opts.errCb(
            [
              [
                whitespaceStartsAt + opts.offset,
                (i + 1 === opts.to ? i + 1 : i) + opts.offset,
              ],
            ],
            "Remove whitespace.",
            fixable
          );
        }
        // else - fine
      } else if (!str[i].trim() && i + 1 === opts.to) {
        // if it's trailing whitespace, we're on the last character
        // (right before opts.to)
        console.log(`221 trailing whitespace clauses`);
        if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
          console.log(
            `224 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [[whitespaceStartsAt, i + 1], "Remove whitespace."],
              null,
              4
            )}`
          );
          opts.errCb(
            [[whitespaceStartsAt + opts.offset, i + 1 + opts.offset]],
            "Remove whitespace.",
            fixable
          );
        }
        // else - fine
      } else if (
        (!opts.oneSpaceAfterCommaOK ||
          !(
            str[i].trim() &&
            i > opts.from + 1 &&
            str[i - 1] === " " &&
            str[i - 2] === ","
          )) &&
        (!opts.innerWhitespaceAllowed ||
          !(
            firstNonwhitespaceNonseparatorCharFound &&
            str[whitespaceStartsAt - 1] &&
            str[i].trim() &&
            str[i] !== opts.separator &&
            str[whitespaceStartsAt - 1] !== opts.separator
          ))
      ) {
        console.log(
          `255 ███████████████████████████████████████ regular whitespace clauses`
        );
        // exclude single space after a comma, with condition that something
        // non-whitespacey follows

        // maybe opts.oneSpaceAfterCommaOK is on?
        let startingIdx = whitespaceStartsAt;
        let endingIdx = i;
        if (i + 1 === opts.to && str[i] !== opts.separator && !str[i].trim()) {
          endingIdx++;
        }
        // i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
        //   ? i + 1
        //   : i;

        console.log(
          `271 ${`\u001b[${33}m${`endingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            endingIdx,
            null,
            4
          )}`
        );
        let whatToAdd = "";
        if (opts.oneSpaceAfterCommaOK) {
          console.log(`opts.oneSpaceAfterCommaOK is on`);
          if (
            str[whitespaceStartsAt] === " " &&
            str[whitespaceStartsAt - 1] === opts.separator
          ) {
            // if first whitespace chunk's character is a space, leave it
            startingIdx++;
          } else if (str[whitespaceStartsAt] !== " ") {
            // if first whitespace chunk's character is not a space,
            // replace whole chunk with a space
            whatToAdd = " ";
          }
        }

        let message = "Remove whitespace.";

        // What if there's a space in the middle of a value, for example, URL?
        // <input accept="abc,def ghi,jkl">
        //                       ^
        //                     here.
        // We identify it by checking, is there a separator in front.

        console.log(
          `302 ██ str[whitespaceStartsAt - 1] = ${str[whitespaceStartsAt - 1]}`
        );
        if (
          !opts.innerWhitespaceAllowed &&
          firstNonwhitespaceNonseparatorCharFound &&
          str[whitespaceStartsAt - 1] &&
          str[i].trim() &&
          str[i] !== opts.separator &&
          str[whitespaceStartsAt - 1] !== opts.separator
        ) {
          fixable = false;
          message = "Bad whitespace.";
        }

        console.log(
          `317 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            [
              [[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]],
              message,
              fixable,
            ],
            null,
            4
          )}`
        );

        if (whatToAdd.length) {
          opts.errCb(
            [[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]],
            message,
            fixable
          );
        } else {
          opts.errCb(
            [[startingIdx + opts.offset, endingIdx + opts.offset]],
            message,
            fixable
          );
        }

        // reset fixable
        fixable = true;
      }

      // reset
      whitespaceStartsAt = null;
    }

    // catch the separator
    if (str[i] === opts.separator) {
      console.log(`352 separator caught`);
      if (!firstNonwhitespaceNonseparatorCharFound) {
        console.log(
          `355 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            [i, i + 1, "Remove separator."],
            null,
            4
          )}`
        );
        opts.errCb(
          [[i + opts.offset, i + 1 + opts.offset]],
          "Remove separator.",
          fixable
        );
      } else {
        separatorsArr.push(i);
      }
    }

    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                            BOTTOM RULES
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                                  |

    // catch the end of the string
    if (i + 1 === opts.to) {
      separatorsArr.forEach((separatorsIdx) => {
        opts.errCb(
          [[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]],
          "Remove separator.",
          fixable
        );
      });
    }

    // logging
    console.log(`${`\u001b[${90}m${`ENDING`}\u001b[${39}m`}`);
    console.log(
      `${`\u001b[${90}m${`separatorsArr = ${JSON.stringify(
        separatorsArr,
        null,
        0
      )}`}\u001b[${39}m`}`
    );
  }
}

export default processCommaSeparated;
