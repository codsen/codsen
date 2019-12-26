function processCommaSeparated(str, originalOpts) {
  console.log(
    `003 INCOMING ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} keys: ${JSON.stringify(
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
    separator: ",",
    cb: null,
    errCb: null
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
    `049 FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
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

  for (let i = opts.from; i < opts.to; i++) {
    console.log(
      `${`\u001b[${36}m${`----------------------------------- str[${i}] = ${JSON.stringify(
        str[i],
        null,
        0
      )} -----------------------------------`}\u001b[${39}m`}`
    );

    // catch the beginning of a chunk
    if (
      chunkStartsAt === null &&
      str[i].trim().length &&
      (!opts.separator || str[i] !== opts.separator)
    ) {
      if (!firstNonwhitespaceNonseparatorCharFound) {
        firstNonwhitespaceNonseparatorCharFound = true;
        console.log(
          `080 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonwhitespaceNonseparatorCharFound`}\u001b[${39}m`} = ${firstNonwhitespaceNonseparatorCharFound}`
        );
      }

      // if there was only one separator up to now, wipe it
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          separatorsArr.forEach((separatorsIdx, orderNumber) => {
            if (orderNumber) {
              opts.errCb(
                [
                  [separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]
                ],
                "Remove separator."
              );
            }
          });
        }
        separatorsArr = [];
        console.log(
          `100 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`separatorsArr`}\u001b[${39}m`}`
        );
      }

      chunkStartsAt = i;
      console.log(
        `106 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
      );
    }

    // catch the ending of a chunk
    if (
      Number.isInteger(chunkStartsAt) &&
      ((i > chunkStartsAt &&
        (!str[i].trim().length ||
          (opts.separator && str[i] === opts.separator))) ||
        i + 1 === opts.to)
    ) {
      console.log(`118 chunk ends`);
      const chunk = str.slice(
        chunkStartsAt,
        i + 1 === opts.to && str[i] !== opts.separator && str[i].trim().length
          ? i + 1
          : i
      );
      console.log(
        `126 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`chunk`}\u001b[${39}m`} = "${`\u001b[${35}m${chunk}\u001b[${39}m`}"`
      );

      // ping the cb
      if (typeof opts.cb === "function") {
        console.log(
          `132 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            [
              chunkStartsAt + opts.offset,
              (i + 1 === opts.to &&
              str[i] !== opts.separator &&
              str[i].trim().length
                ? i + 1
                : i) + opts.offset
            ],
            null,
            4
          )}`
        );
        opts.cb(
          chunkStartsAt + opts.offset,
          (i + 1 === opts.to &&
          str[i] !== opts.separator &&
          str[i].trim().length
            ? i + 1
            : i) + opts.offset
        );
      }

      // reset
      chunkStartsAt = null;
      console.log(
        `158 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
      );
    }

    // catch the beginning of a whitespace
    if (!str[i].trim().length && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      console.log(
        `166 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
      );
    }

    // catch the ending of a whitespace
    if (
      whitespaceStartsAt !== null &&
      (str[i].trim().length || i + 1 === opts.to)
    ) {
      console.log(`175 whitespace ends`);

      if (whitespaceStartsAt === opts.from) {
        if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
          console.log(
            `180 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [
                [
                  whitespaceStartsAt + opts.offset,
                  (i + 1 === opts.to ? i + 1 : i) + opts.offset
                ],
                "Remove whitespace."
              ],
              null,
              4
            )}`
          );
          opts.errCb(
            [
              [
                whitespaceStartsAt + opts.offset,
                (i + 1 === opts.to ? i + 1 : i) + opts.offset
              ]
            ],
            "Remove whitespace."
          );
        }
        // else - fine
      } else if (
        i + 1 === opts.to &&
        str[i] !== opts.separator &&
        str[i].trim().length
      ) {
        // if it's trailing whitespace, we're on the last character
        // (right before opts.to)
        if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
          console.log(
            `212 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [[whitespaceStartsAt, i + 1], "Remove whitespace."],
              null,
              4
            )}`
          );
          opts.errCb(
            [[whitespaceStartsAt + opts.offset, i + 1 + opts.offset]],
            "Remove whitespace."
          );
        }
        // else - fine
      } else if (
        !opts.oneSpaceAfterCommaOK ||
        !(
          str[i].trim().length &&
          i > opts.from + 1 &&
          str[i - 1] === " " &&
          str[i - 2] === ","
        )
      ) {
        // exclude single space after a comma, with condition that something
        // non-whitespacey follows
        console.log(
          `236 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            [
              [
                whitespaceStartsAt,
                i + 1 === opts.to &&
                str[i] !== opts.separator &&
                str[i].trim().length
                  ? i + 1
                  : i
              ],
              "Remove whitespace."
            ],
            null,
            4
          )}`
        );

        // maybe opts.oneSpaceAfterCommaOK is on?
        let startingIdx = whitespaceStartsAt;
        let endingIdx = i;
        if (
          i + 1 === opts.to &&
          str[i] !== opts.separator &&
          !str[i].trim().length
        ) {
          endingIdx++;
        }
        // i + 1 === opts.to && str[i] !== opts.separator && str[i].trim().length
        //   ? i + 1
        //   : i;

        console.log(
          `268 ${`\u001b[${33}m${`endingIdx`}\u001b[${39}m`} = ${JSON.stringify(
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

        if (whatToAdd.length) {
          opts.errCb(
            [[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]],
            "Remove whitespace."
          );
        } else {
          opts.errCb(
            [[startingIdx + opts.offset, endingIdx + opts.offset]],
            "Remove whitespace."
          );
        }
      }

      // reset
      whitespaceStartsAt = null;
    }

    // catch the separator
    if (str[i] === opts.separator) {
      console.log(`309 separator caught`);
      if (!firstNonwhitespaceNonseparatorCharFound) {
        console.log(
          `312 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
            [i, i + 1, "Remove separator."],
            null,
            4
          )}`
        );
        opts.errCb(
          [[i + opts.offset, i + 1 + opts.offset]],
          "Remove separator."
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
      separatorsArr.forEach(separatorsIdx => {
        opts.errCb(
          [[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]],
          "Remove separator."
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
