import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

type ErrCb = (
  indexes: [from: number, to: number][],
  explanation: string,
  isFixable: boolean
) => void;

interface Obj {
  [key: string]: any;
}

interface Opts {
  from: number;
  to: number;
  offset: number;
  leadingWhitespaceOK: boolean;
  trailingWhitespaceOK: boolean;
  oneSpaceAfterCommaOK: boolean;
  innerWhitespaceAllowed: boolean;
  separator: string;
  cb: null | ((from: number, to: number) => void);
  errCb: null | ErrCb;
}

function processCommaSep(str: string, originalOpts?: Partial<Opts>): void {
  DEV &&
    console.log(
      `033 processCommaSep: INCOMING ${`\u001b[${33}m${`str`}\u001b[${39}m`}: ${JSON.stringify(
        str,
        null,
        0
      )}`
    );
  DEV &&
    console.log(
      `041 processCommaSep: INCOMING ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} keys: ${JSON.stringify(
        originalOpts,
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
  } else if (
    !str.length ||
    !originalOpts ||
    (!originalOpts.cb && !originalOpts.errCb)
  ) {
    // if input str is empty or there are no callbacks, exit early
    return;
  }
  // opts preparation:
  let defaults: Opts = {
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
  let opts: Opts = { ...defaults, ...originalOpts };

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

  DEV &&
    console.log(
      `093 processCommaSep: FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}; plus, ${typeof opts.cb} opts.cb; ${typeof opts.errCb} opts.errCb`
    );

  // action:
  let chunkStartsAt: number | null = null;
  let whitespaceStartsAt: number | null = null;
  let firstNonwhitespaceNonseparatorCharFound = false;
  let separatorsArr = []; // needed to catch trailing separators
  let lastNonWhitespaceCharAt: number | null = null;
  let fixable = true;

  for (let i = opts.from; i < opts.to; i++) {
    DEV &&
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
      DEV &&
        console.log(
          `123 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastNonWhitespaceCharAt`}\u001b[${39}m`} = ${lastNonWhitespaceCharAt}`
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
        DEV &&
          console.log(
            `137 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonwhitespaceNonseparatorCharFound`}\u001b[${39}m`} = ${firstNonwhitespaceNonseparatorCharFound}`
          );
      }

      // if there was only one separator up to now, wipe it
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          // eslint-disable-next-line no-loop-func
          separatorsArr.forEach((separatorsIdx, orderNumber) => {
            if (orderNumber) {
              (opts as Obj).errCb(
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
        DEV &&
          console.log(
            `163 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`separatorsArr`}\u001b[${39}m`}`
          );
      }

      chunkStartsAt = i;
      DEV &&
        console.log(
          `170 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
        );
    }

    // catch the ending of a chunk
    if (
      Number.isInteger(chunkStartsAt) &&
      ((i > (chunkStartsAt as number) &&
        opts.separator &&
        str[i] === opts.separator) ||
        i + 1 === opts.to)
    ) {
      DEV && console.log(`182 chunk ends`);
      let chunk = str.slice(
        chunkStartsAt as number,
        i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
          ? i + 1
          : i
      );
      DEV &&
        console.log(
          `191 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`chunk`}\u001b[${39}m`} = "${`\u001b[${35}m${chunk}\u001b[${39}m`}"`
        );

      // ping the cb
      if (typeof opts.cb === "function") {
        DEV &&
          console.log(
            `198 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [
                (chunkStartsAt as number) + opts.offset,
                (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
                  ? i + 1
                  : (lastNonWhitespaceCharAt as number) + 1) + opts.offset,
              ],
              null,
              4
            )}`
          );
        opts.cb(
          (chunkStartsAt as number) + opts.offset,
          (i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
            ? i + 1
            : (lastNonWhitespaceCharAt as number) + 1) + opts.offset
        );
      }

      // reset
      chunkStartsAt = null;
      DEV &&
        console.log(
          `221 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`
        );
    }

    // catch the beginning of a whitespace
    if (!str[i].trim() && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      DEV &&
        console.log(
          `230 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`
        );
    }

    // catch the ending of a whitespace
    if (whitespaceStartsAt !== null && (str[i].trim() || i + 1 === opts.to)) {
      DEV && console.log(`236 whitespace ends`);

      if (whitespaceStartsAt === opts.from) {
        DEV && console.log(`239 leading whitespace clauses`);
        if (!opts.leadingWhitespaceOK && typeof opts.errCb === "function") {
          DEV &&
            console.log(
              `243 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
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
        DEV && console.log(`270 trailing whitespace clauses`);
        if (!opts.trailingWhitespaceOK && typeof opts.errCb === "function") {
          DEV &&
            console.log(
              `274 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
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
        DEV &&
          console.log(
            `306 ███████████████████████████████████████ regular whitespace clauses`
          );
        // exclude single space after a comma, with condition that something
        // non-whitespacey follows

        // maybe opts.oneSpaceAfterCommaOK is on?
        let startingIdx = whitespaceStartsAt;
        let endingIdx = i;
        if (i + 1 === opts.to && str[i] !== opts.separator && !str[i].trim()) {
          endingIdx += 1;
        }
        // i + 1 === opts.to && str[i] !== opts.separator && str[i].trim()
        //   ? i + 1
        //   : i;

        DEV &&
          console.log(
            `323 ${`\u001b[${33}m${`endingIdx`}\u001b[${39}m`} = ${JSON.stringify(
              endingIdx,
              null,
              4
            )}`
          );
        let whatToAdd = "";
        if (opts.oneSpaceAfterCommaOK) {
          DEV && console.log(`opts.oneSpaceAfterCommaOK is on`);
          if (
            str[whitespaceStartsAt] === " " &&
            str[whitespaceStartsAt - 1] === opts.separator
          ) {
            // if first whitespace chunk's character is a space, leave it
            startingIdx += 1;
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

        DEV &&
          console.log(
            `355 ██ str[whitespaceStartsAt - 1] = ${
              str[whitespaceStartsAt - 1]
            }`
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

        DEV &&
          console.log(
            `373 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [
                [
                  [
                    startingIdx + opts.offset,
                    endingIdx + opts.offset,
                    whatToAdd,
                  ],
                ],
                message,
                fixable,
              ],
              null,
              4
            )}`
          );

        if (whatToAdd.length) {
          (opts as Obj).errCb(
            [[startingIdx + opts.offset, endingIdx + opts.offset, whatToAdd]],
            message,
            fixable
          );
        } else {
          (opts as Obj).errCb(
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
      DEV && console.log(`414 separator caught`);
      if (!firstNonwhitespaceNonseparatorCharFound) {
        DEV &&
          console.log(
            `418 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [i, i + 1, "Remove separator."],
              null,
              4
            )}`
          );
        (opts as Obj).errCb(
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
      // eslint-disable-next-line no-loop-func
      separatorsArr.forEach((separatorsIdx) => {
        (opts as Obj).errCb(
          [[separatorsIdx + opts.offset, separatorsIdx + 1 + opts.offset]],
          "Remove separator.",
          fixable
        );
      });
    }

    // logging
    DEV && console.log(`${`\u001b[${90}m${`ENDING`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `${`\u001b[${90}m${`separatorsArr = ${JSON.stringify(
          separatorsArr,
          null,
          0
        )}`}\u001b[${39}m`}`
      );
  }
}

export { processCommaSep, version };
