import { processCommaSep } from "string-process-comma-separated";
import { isRel } from "is-relative-uri";
import urlRegex from "url-regex";
import checkForWhitespace from "./checkForWhitespace";
import splitByWhitespace from "./splitByWhitespace";
import isSingleSpace from "./isSingleSpace";
import { ErrorObj, Range } from "./commonTypes";

interface ValidateValueOpts {
  from: number;
  to: number;
  offset: number;
  multipleOK?: boolean;
  attribStarts?: number;
  attribEnds?: number;
}

function validateValue(
  str: string,
  originalOpts: ValidateValueOpts,
  errorArr: ErrorObj[]
): void {
  console.log(" ");
  console.log(
    `025 ${`\u001b[${32}m${`validateUri/validateValue() called`}\u001b[${39}m`}`
  );
  const defaults: ValidateValueOpts = {
    offset: 0,
    multipleOK: false,
    from: 0,
    to: str.length,
    attribStarts: 0,
    attribEnds: str.length,
  };
  const opts = { ...defaults, ...originalOpts };

  console.log(" ");
  const extractedValue = str.slice(opts.from, opts.to);
  console.log(
    `040 validateUri/validateValue(): ${`\u001b[${33}m${`extractedValue`}\u001b[${39}m`} = ${JSON.stringify(
      extractedValue,
      null,
      4
    )}`
  );
  console.log(
    `047 validateUri/validateValue(): CALCULATED ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `054 validateUri/validateValue(): real range: [${
      opts.offset + opts.from
    }, ${opts.offset + opts.to}]`
  );

  const calcultedIsRel = isRel(extractedValue);
  if (Array.from(extractedValue).some((val) => !val.trim().length)) {
    // try to find out, is it whitespace within one URL, or is it whitespace
    // separating two URL's:

    const ranges: Range[] = []; // whitespace ranges
    const foundCharacterRanges: Range[] = [];
    splitByWhitespace(
      extractedValue,
      (valueRangeArr) => {
        console.log(
          `070 validateUri/validateValue(): ${`\u001b[${33}m${`valueRangeArr`}\u001b[${39}m`} = ${JSON.stringify(
            valueRangeArr,
            null,
            4
          )}`
        );
        foundCharacterRanges.push(valueRangeArr);
      },
      (whitespaceRangeArr) => {
        console.log(
          `080 validateUri/validateValue(): ${`\u001b[${33}m${`whitespaceRangeArr`}\u001b[${39}m`} = ${JSON.stringify(
            whitespaceRangeArr,
            null,
            4
          )}`
        );
        ranges.push(whitespaceRangeArr);
      },
      originalOpts
    );

    console.log(
      `092 validateUri/validateValue(): ${`\u001b[${33}m${`foundCharacterRanges`}\u001b[${39}m`} = ${JSON.stringify(
        foundCharacterRanges,
        null,
        4
      )}`
    );
    const countOfURIs = foundCharacterRanges.reduce((acc, curr) => {
      console.log(
        `100 ███████████████████████████████████████ checking "${extractedValue.slice(
          curr[0] - opts.offset,
          curr[1] - opts.offset
        )}"`
      );
      if (
        extractedValue
          .slice(curr[0] - opts.offset, curr[1] - opts.offset)
          .match(urlRegex({ exact: true }))
      ) {
        return acc + 1;
      }
      return acc;
    }, 0);
    console.log(
      `115 validateUri/validateValue(): ${`\u001b[${33}m${`countOfURIs`}\u001b[${39}m`} = ${JSON.stringify(
        countOfURIs,
        null,
        4
      )}`
    );

    // assemble the value without whitespace
    const valueWithoutWhitespace = foundCharacterRanges.reduce((acc, curr) => {
      return (
        acc + extractedValue.slice(curr[0] - opts.offset, curr[1] - opts.offset)
      );
    }, "");
    console.log(
      `129 validateUri/validateValue(): ${`\u001b[${33}m${`valueWithoutWhitespace`}\u001b[${39}m`} = ${JSON.stringify(
        valueWithoutWhitespace,
        null,
        4
      )}`
    );

    if (countOfURIs > 1) {
      console.log(`137 message: "There should be only one URI."`);
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: `There should be only one URI.`,
        fix: null,
      });
    } else {
      console.log(`145 message: "Remove whitespace."`);
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: `Remove whitespace.`,
        fix: {
          ranges,
        },
      });
    }
  } else if (
    !extractedValue.startsWith("tel:") &&
    !(urlRegex({ exact: true }).test(extractedValue) || calcultedIsRel.res)
  ) {
    console.log(`159 validateUri/validateValue(): ██ inside not-URL clauses`);

    // message:
    // Should be ${opts.separator}-separated list of URI's.
    // applies onto when multiple values are allowed and whole attribute is
    // reported as wrong (not one of chunks):

    let message = `Should be an URI.`;
    let idxFrom = opts.offset + opts.from;
    let idxTo = opts.offset + opts.to;

    const whatCouldBeExtractedAtAllFromRegex = extractedValue.match(urlRegex());
    console.log(
      `172 validateUri/validateValue(): ${`\u001b[${33}m${`whatCouldBeExtractedAtAllFromRegex`}\u001b[${39}m`} = ${JSON.stringify(
        whatCouldBeExtractedAtAllFromRegex,
        null,
        4
      )}`
    );
    // if URL's were extracted
    if (Array.isArray(whatCouldBeExtractedAtAllFromRegex)) {
      // something was indeed extracted
      if (whatCouldBeExtractedAtAllFromRegex.length > 1 && !opts.multipleOK) {
        message = `There should be only one URI.`;
      } else {
        message = `URI's should be separated with a single space.`;
      }
      idxFrom = opts.offset + (opts.attribStarts as number);
      idxTo = opts.offset + (opts.attribEnds as number);
    }

    console.log(
      `191 validateUri/validateValue(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [[${idxFrom}, ${idxTo}]]; message = "${message}"`
    );
    errorArr.push({
      idxFrom,
      idxTo,
      message,
      fix: null,
    });
  }
}

interface ValidateUriOpts {
  offset: number;
  multipleOK: boolean;
  separator: "space" | "comma";
  oneSpaceAfterCommaOK: boolean;
  leadingWhitespaceOK: boolean;
  trailingWhitespaceOK: boolean;
}

function validateUri(
  str: string,
  originalOpts?: Partial<ValidateUriOpts>
): ErrorObj[] {
  console.log(
    `216 incoming originalOpts = ${JSON.stringify(originalOpts, null, 4)}`
  );
  const defaults = {
    offset: 0,
    multipleOK: false,
    separator: "space", // or "comma"
    oneSpaceAfterCommaOK: false,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false,
  };
  const opts = { ...defaults, ...originalOpts };
  console.log(
    `228 validateUri(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // checkForWhitespace() reports index range between the
  // first last non-whitespace character; nulls otherwise
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, opts.offset);
  console.log(
    `239 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}`
  );
  console.log(
    `242 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd}`
  );
  console.log(
    `245 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  // now that we know where non-whitespace chars are, we can evaluate them

  if (Number.isInteger(charStart)) {
    console.log(
      `256 validateUri: ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
    if (opts.multipleOK) {
      // depends, is it comma or space-separated format
      if (opts.separator === "space") {
        console.log(`265 validateUri: use splitByWhitespace()`);
        splitByWhitespace(
          str,
          ([charFrom, charTo]) => {
            console.log(
              `270 validateUri: charFrom = ${charFrom}; charTo = ${charTo}`
            );
            const extractedName = str.slice(charFrom, charTo);
            console.log(
              `274 validateUri: ${`\u001b[${33}m${`extractedName`}\u001b[${39}m`} = ${JSON.stringify(
                extractedName,
                null,
                4
              )}`
            );
            // maybe it's comma-and-space-separated, like
            // <object archive="https://codsen.com, https://detergent.io">
            if (extractedName.endsWith(",") && extractedName.length > 1) {
              console.log(
                `284 validateUri: PUSH [${opts.offset + charTo - 1}, ${
                  opts.offset + charTo
                }]`
              );
              errorArr.push({
                idxFrom: opts.offset + charTo - 1,
                idxTo: opts.offset + charTo,
                message: `No commas.`,
                fix: null,
              });
            } else {
              // Object assign needed to retain opts.multipleOK
              validateValue(
                str,
                {
                  ...opts,
                  from: charFrom,
                  to: charTo,
                  attribStarts: charStart as number,
                  attribEnds: charEnd as number,
                  offset: opts.offset,
                },
                errorArr
              );
            }
          },
          ([whitespaceFrom, whitespaceTo]) =>
            isSingleSpace(
              str,
              {
                from: whitespaceFrom,
                to: whitespaceTo,
                offset: opts.offset,
              },
              errorArr
            ),
          {
            from: charStart as number,
            to: charEnd as number,
          }
        );
      } else {
        console.log(`326 validateUri: use processCommaSep()`);
        processCommaSep(str, {
          offset: opts.offset,
          oneSpaceAfterCommaOK: false,
          leadingWhitespaceOK: true,
          trailingWhitespaceOK: true,
          cb: (idxFrom, idxTo) => {
            console.log(
              `334 validateUri: ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} idxFrom = ${idxFrom}; idxTo = ${idxTo}`
            );

            const extractedValue = str.slice(
              idxFrom - opts.offset,
              idxTo - opts.offset
            );
            console.log(
              `342 validateUri: ██ EXTRACTED VALUE: ${JSON.stringify(
                extractedValue,
                null,
                0
              )}`
            );

            // if there are errors, validateValue() mutates the passed "errorArr",
            // pushing to it

            // Object assign needed to retain opts.multipleOK
            validateValue(
              str,
              {
                ...opts,
                from: idxFrom - opts.offset,
                to: idxTo - opts.offset,
                attribStarts: charStart as number,
                attribEnds: charEnd as number,
                offset: opts.offset,
              },
              errorArr
            );
          },
          errCb: (ranges, message) => {
            console.log(
              `368 validateUri: ${`\u001b[${32}m${`INCOMING errCb`}\u001b[${39}m`} ranges = ${JSON.stringify(
                ranges,
                null,
                4
              )}; message = ${message}`
            );

            interface Fix {
              ranges: Range[];
            }
            let fix: null | Fix = {
              ranges,
            };

            // Some bad whitespace errors like spaces in the middle or URL
            // can't be fixed. We need to cater those cases.
            if (
              !str[ranges[0][0] - opts.offset].trim().length &&
              str[ranges[0][0] - opts.offset - 1] &&
              (charStart as number) < ranges[0][0] - 1 &&
              (opts.separator === "space" ||
                (str[ranges[0][0] - opts.offset - 1] !== "," &&
                  str[ranges[0][1] - opts.offset] !== ","))
            ) {
              // if it's not outer whitespace, skip the fix
              console.log(
                `394 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} fix = null`
              );
              fix = null;
            }

            errorArr.push({
              idxFrom: ranges[0][0],
              idxTo: ranges[ranges.length - 1][1],
              message,
              fix,
            });
            console.log(
              `406 validateUri: after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
          },
        });
      }
    } else {
      console.log(`416 validateUri: the whole attribute should be validated`);
      // we pass whole value to validateValue(), "cropping" the whitespace:
      validateValue(
        str,
        {
          from: charStart as number,
          to: charEnd as number,
          offset: opts.offset,
        },
        errorArr
      );
    }
  }

  return errorArr;
}

export default validateUri;
