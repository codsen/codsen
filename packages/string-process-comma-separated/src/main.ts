import { version as v } from "../package.json";
import { JSONValue } from "codsen-utils";

const version: string = v;

declare let DEV: boolean;

export type ErrCb = (
  indexes: [from: number, to: number, whatToAdd?: JSONValue][],
  explanation: string,
  isFixable: boolean,
) => void;

export interface Obj {
  [key: string]: any;
}

export interface Opts {
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

function processCommaSep(str: string, opts?: Partial<Opts>): void {
  DEV &&
    console.log(
      `034 processCommaSep: INCOMING ${`\u001b[${33}m${`str`}\u001b[${39}m`}: ${JSON.stringify(
        str,
        null,
        0,
      )}`,
    );
  DEV &&
    console.log(
      `042 processCommaSep: INCOMING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} keys: ${JSON.stringify(
        opts,
        null,
        0,
      )}`,
    );

  // insurance:
  if (typeof str !== "string") {
    throw new Error(
      `string-process-comma-separated: [THROW_ID_01] input must be string! It was given as ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  } else if (!str.length || !opts || (!opts.cb && !opts.errCb)) {
    // if input str is empty or there are no callbacks, exit early
    return;
  }
  // resolvedOpts preparation:
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
  let resolvedOpts: Opts = { ...defaults, ...opts };

  // patch from/to values, they might have been given as nulls etc.
  if (!Number.isInteger(opts.from)) {
    resolvedOpts.from = 0;
  }
  if (!Number.isInteger(opts.to)) {
    resolvedOpts.to = str.length;
  }
  if (!Number.isInteger(opts.offset)) {
    resolvedOpts.offset = 0;
  }

  DEV &&
    console.log(
      `090 processCommaSep: FINAL ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}; plus, ${typeof resolvedOpts.cb} resolvedOpts.cb; ${typeof resolvedOpts.errCb} resolvedOpts.errCb`,
    );

  // action:
  let chunkStartsAt: number | null = null;
  let whitespaceStartsAt: number | null = null;
  let firstNonWhitespaceNonSeparatorCharFound = false;
  let separatorsArr = []; // needed to catch trailing separators
  let lastNonWhitespaceCharAt: number | null = null;
  let fixable = true;

  for (let i = resolvedOpts.from; i < resolvedOpts.to; i++) {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`----------------------------------- str[${i}] = ${JSON.stringify(
          str[i],
          null,
          0,
        )} -----------------------------------`}\u001b[${39}m`}`,
      );

    // catch the last nonwhitespace char
    if (str[i].trim() && str[i] !== resolvedOpts.separator) {
      lastNonWhitespaceCharAt = i;
      DEV &&
        console.log(
          `120 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastNonWhitespaceCharAt`}\u001b[${39}m`} = ${lastNonWhitespaceCharAt}`,
        );
    }

    // catch the beginning of a chunk
    if (
      chunkStartsAt === null &&
      str[i].trim() &&
      (!resolvedOpts.separator || str[i] !== resolvedOpts.separator)
    ) {
      if (!firstNonWhitespaceNonSeparatorCharFound) {
        firstNonWhitespaceNonSeparatorCharFound = true;
        DEV &&
          console.log(
            `134 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonwhitespaceNonseparatorCharFound`}\u001b[${39}m`} = ${JSON.stringify(
              firstNonWhitespaceNonSeparatorCharFound,
            )}`,
          );
      }

      // if there was only one separator up to now, wipe it
      if (separatorsArr.length) {
        if (separatorsArr.length > 1) {
          separatorsArr.forEach((separatorsIdx, orderNumber) => {
            if (orderNumber && resolvedOpts.errCb) {
              resolvedOpts.errCb(
                [
                  [
                    separatorsIdx + resolvedOpts.offset,
                    separatorsIdx + 1 + resolvedOpts.offset,
                  ],
                ],
                "Remove separator.",
                fixable,
              );
            }
          });
        }
        separatorsArr = [];
        DEV &&
          console.log(
            `161 ${`\u001b[${31}m${`WIPE`}\u001b[${39}m`} ${`\u001b[${33}m${`separatorsArr`}\u001b[${39}m`}`,
          );
      }

      chunkStartsAt = i;
      DEV &&
        console.log(
          `168 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`,
        );
    }

    // catch the ending of a chunk
    if (
      Number.isInteger(chunkStartsAt) &&
      ((i > (chunkStartsAt as number) &&
        resolvedOpts.separator &&
        str[i] === resolvedOpts.separator) ||
        i + 1 === resolvedOpts.to)
    ) {
      DEV && console.log(`180 chunk ends`);
      let chunk = str.slice(
        chunkStartsAt as number,
        i + 1 === resolvedOpts.to &&
          str[i] !== resolvedOpts.separator &&
          str[i].trim()
          ? i + 1
          : i,
      );
      DEV &&
        console.log(
          `191 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`chunk`}\u001b[${39}m`} = "${`\u001b[${35}m${chunk}\u001b[${39}m`}"`,
        );

      // ping the cb
      if (typeof resolvedOpts.cb === "function") {
        DEV &&
          console.log(
            `198 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [
                (chunkStartsAt as number) + resolvedOpts.offset,
                (i + 1 === resolvedOpts.to &&
                str[i] !== resolvedOpts.separator &&
                str[i].trim()
                  ? i + 1
                  : (lastNonWhitespaceCharAt as number) + 1) +
                  resolvedOpts.offset,
              ],
              null,
              4,
            )}`,
          );
        resolvedOpts.cb(
          (chunkStartsAt as number) + resolvedOpts.offset,
          (i + 1 === resolvedOpts.to &&
          str[i] !== resolvedOpts.separator &&
          str[i].trim()
            ? i + 1
            : (lastNonWhitespaceCharAt as number) + 1) + resolvedOpts.offset,
        );
      }

      // reset
      chunkStartsAt = null;
      DEV &&
        console.log(
          `226 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${chunkStartsAt}`,
        );
    }

    // catch the beginning of a whitespace
    if (!str[i].trim() && whitespaceStartsAt === null) {
      whitespaceStartsAt = i;
      DEV &&
        console.log(
          `235 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`whitespaceStartsAt`}\u001b[${39}m`} = ${whitespaceStartsAt}`,
        );
    }

    // catch the ending of a whitespace
    if (
      whitespaceStartsAt !== null &&
      (str[i].trim() || i + 1 === resolvedOpts.to)
    ) {
      DEV && console.log(`244 whitespace ends`);

      if (whitespaceStartsAt === resolvedOpts.from) {
        DEV && console.log(`247 leading whitespace clauses`);
        if (
          !resolvedOpts.leadingWhitespaceOK &&
          typeof resolvedOpts.errCb === "function"
        ) {
          DEV &&
            console.log(
              `254 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
                [
                  [
                    whitespaceStartsAt + resolvedOpts.offset,
                    (i + 1 === resolvedOpts.to ? i + 1 : i) +
                      resolvedOpts.offset,
                  ],
                  "Remove whitespace.",
                ],
                null,
                4,
              )}`,
            );
          resolvedOpts.errCb(
            [
              [
                whitespaceStartsAt + resolvedOpts.offset,
                (i + 1 === resolvedOpts.to ? i + 1 : i) + resolvedOpts.offset,
              ],
            ],
            "Remove whitespace.",
            fixable,
          );
        }
        // else - fine
      } else if (!str[i].trim() && i + 1 === resolvedOpts.to) {
        // if it's trailing whitespace, we're on the last character
        // (right before resolvedOpts.to)
        DEV && console.log(`282 trailing whitespace clauses`);
        if (
          !resolvedOpts.trailingWhitespaceOK &&
          typeof resolvedOpts.errCb === "function"
        ) {
          DEV &&
            console.log(
              `289 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
                [[whitespaceStartsAt, i + 1], "Remove whitespace."],
                null,
                4,
              )}`,
            );
          resolvedOpts.errCb(
            [
              [
                whitespaceStartsAt + resolvedOpts.offset,
                i + 1 + resolvedOpts.offset,
              ],
            ],
            "Remove whitespace.",
            fixable,
          );
        }
        // else - fine
      } else if (
        (!resolvedOpts.oneSpaceAfterCommaOK ||
          !(
            str[i].trim() &&
            i > resolvedOpts.from + 1 &&
            str[i - 1] === " " &&
            str[i - 2] === ","
          )) &&
        (!resolvedOpts.innerWhitespaceAllowed ||
          !(
            firstNonWhitespaceNonSeparatorCharFound &&
            str[whitespaceStartsAt - 1] &&
            str[i].trim() &&
            str[i] !== resolvedOpts.separator &&
            str[whitespaceStartsAt - 1] !== resolvedOpts.separator
          ))
      ) {
        DEV &&
          console.log(
            `326 ███████████████████████████████████████ regular whitespace clauses`,
          );
        // exclude single space after a comma, with condition that something
        // non-whitespacey follows

        // maybe resolvedOpts.oneSpaceAfterCommaOK is on?
        let startingIdx = whitespaceStartsAt;
        let endingIdx = i;
        if (
          i + 1 === resolvedOpts.to &&
          str[i] !== resolvedOpts.separator &&
          !str[i].trim()
        ) {
          endingIdx += 1;
        }
        // i + 1 === resolvedOpts.to && str[i] !== resolvedOpts.separator && str[i].trim()
        //   ? i + 1
        //   : i;

        DEV &&
          console.log(
            `347 ${`\u001b[${33}m${`endingIdx`}\u001b[${39}m`} = ${JSON.stringify(
              endingIdx,
              null,
              4,
            )}`,
          );
        let whatToAdd = "";
        if (resolvedOpts.oneSpaceAfterCommaOK) {
          DEV && console.log(`resolvedOpts.oneSpaceAfterCommaOK is on`);
          if (
            str[whitespaceStartsAt] === " " &&
            str[whitespaceStartsAt - 1] === resolvedOpts.separator
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
            `379 ██ str[whitespaceStartsAt - 1] = ${
              str[whitespaceStartsAt - 1]
            }`,
          );
        if (
          !resolvedOpts.innerWhitespaceAllowed &&
          firstNonWhitespaceNonSeparatorCharFound &&
          str[whitespaceStartsAt - 1] &&
          str[i].trim() &&
          str[i] !== resolvedOpts.separator &&
          str[whitespaceStartsAt - 1] !== resolvedOpts.separator
        ) {
          fixable = false;
          message = "Bad whitespace.";
        }

        DEV &&
          console.log(
            `397 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [
                [
                  [
                    startingIdx + resolvedOpts.offset,
                    endingIdx + resolvedOpts.offset,
                    whatToAdd,
                  ],
                ],
                message,
                fixable,
              ],
              null,
              4,
            )}`,
          );

        if (whatToAdd.length && resolvedOpts.errCb) {
          resolvedOpts.errCb(
            [
              [
                startingIdx + resolvedOpts.offset,
                endingIdx + resolvedOpts.offset,
                whatToAdd,
              ],
            ],
            message,
            fixable,
          );
        } else if (resolvedOpts.errCb) {
          resolvedOpts.errCb(
            [
              [
                startingIdx + resolvedOpts.offset,
                endingIdx + resolvedOpts.offset,
              ],
            ],
            message,
            fixable,
          );
        }

        // reset fixable
        fixable = true;
      }

      // reset
      whitespaceStartsAt = null;
    }

    // catch the separator
    if (str[i] === resolvedOpts.separator) {
      DEV && console.log(`449 separator caught`);
      if (!firstNonWhitespaceNonSeparatorCharFound && resolvedOpts.errCb) {
        DEV &&
          console.log(
            `453 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} ${JSON.stringify(
              [i, i + 1, "Remove separator."],
              null,
              4,
            )}`,
          );
        resolvedOpts.errCb(
          [[i + resolvedOpts.offset, i + 1 + resolvedOpts.offset]],
          "Remove separator.",
          fixable,
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
    if (i + 1 === resolvedOpts.to && resolvedOpts.errCb) {
      separatorsArr.forEach((separatorsIdx) => {
        (resolvedOpts as any).errCb(
          [
            [
              separatorsIdx + resolvedOpts.offset,
              separatorsIdx + 1 + resolvedOpts.offset,
            ],
          ],
          "Remove separator.",
          fixable,
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
          0,
        )}`}\u001b[${39}m`}`,
      );
  }
}

export { processCommaSep, version };
