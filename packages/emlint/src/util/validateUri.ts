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
    `026 ${`\u001b[${32}m${`validateUri/validateValue() called`}\u001b[${39}m`}`
  );
  let defaults: ValidateValueOpts = {
    offset: 0,
    multipleOK: false,
    from: 0,
    to: str.length,
    attribStarts: 0,
    attribEnds: str.length,
  };
  let opts = { ...defaults, ...originalOpts };

  console.log(" ");
  let extractedValue = str.slice(opts.from, opts.to);
  console.log(
    `041 validateUri/validateValue(): ${`\u001b[${33}m${`extractedValue`}\u001b[${39}m`} = ${JSON.stringify(
      extractedValue,
      null,
      4
    )}`
  );
  console.log(
    `048 validateUri/validateValue(): CALCULATED ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `055 validateUri/validateValue(): real range: [${
      opts.offset + opts.from
    }, ${opts.offset + opts.to}]`
  );

  let calcultedIsRel = isRel(extractedValue);
  if (Array.from(extractedValue).some((val) => !val.trim().length)) {
    // try to find out, is it whitespace within one URL, or is it whitespace
    // separating two URL's:

    let ranges: Range[] = []; // whitespace ranges
    let foundCharacterRanges: Range[] = [];
    splitByWhitespace(
      extractedValue,
      (valueRangeArr) => {
        console.log(
          `071 validateUri/validateValue(): ${`\u001b[${33}m${`valueRangeArr`}\u001b[${39}m`} = ${JSON.stringify(
            valueRangeArr,
            null,
            4
          )}`
        );
        foundCharacterRanges.push(valueRangeArr);
      },
      (whitespaceRangeArr) => {
        console.log(
          `081 validateUri/validateValue(): ${`\u001b[${33}m${`whitespaceRangeArr`}\u001b[${39}m`} = ${JSON.stringify(
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
      `093 validateUri/validateValue(): ${`\u001b[${33}m${`foundCharacterRanges`}\u001b[${39}m`} = ${JSON.stringify(
        foundCharacterRanges,
        null,
        4
      )}`
    );
    let countOfURIs = foundCharacterRanges.reduce((acc, curr) => {
      console.log(
        `101 ███████████████████████████████████████ checking "${extractedValue.slice(
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
      `116 validateUri/validateValue(): ${`\u001b[${33}m${`countOfURIs`}\u001b[${39}m`} = ${JSON.stringify(
        countOfURIs,
        null,
        4
      )}`
    );

    // assemble the value without whitespace
    let valueWithoutWhitespace = foundCharacterRanges.reduce((acc, curr) => {
      return (
        acc + extractedValue.slice(curr[0] - opts.offset, curr[1] - opts.offset)
      );
    }, "");
    console.log(
      `130 validateUri/validateValue(): ${`\u001b[${33}m${`valueWithoutWhitespace`}\u001b[${39}m`} = ${JSON.stringify(
        valueWithoutWhitespace,
        null,
        4
      )}`
    );

    if (countOfURIs > 1) {
      console.log(`138 message: "There should be only one URI."`);
      errorArr.push({
        idxFrom: opts.from + opts.offset,
        idxTo: opts.to + opts.offset,
        message: `There should be only one URI.`,
        fix: null,
      });
    } else {
      console.log(`146 message: "Remove whitespace."`);
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
    console.log(`160 validateUri/validateValue(): ██ inside not-URL clauses`);

    // message:
    // Should be ${opts.separator}-separated list of URI's.
    // applies onto when multiple values are allowed and whole attribute is
    // reported as wrong (not one of chunks):

    let message = `Should be an URI.`;
    let idxFrom = opts.offset + opts.from;
    let idxTo = opts.offset + opts.to;

    let whatCouldBeExtractedAtAllFromRegex = extractedValue.match(urlRegex());
    console.log(
      `173 validateUri/validateValue(): ${`\u001b[${33}m${`whatCouldBeExtractedAtAllFromRegex`}\u001b[${39}m`} = ${JSON.stringify(
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
      `192 validateUri/validateValue(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [[${idxFrom}, ${idxTo}]]; message = "${message}"`
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
    `217 incoming originalOpts = ${JSON.stringify(originalOpts, null, 4)}`
  );
  let defaults = {
    offset: 0,
    multipleOK: false,
    separator: "space", // or "comma"
    oneSpaceAfterCommaOK: false,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false,
  };
  let opts = { ...defaults, ...originalOpts };
  console.log(
    `229 validateUri(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // checkForWhitespace() reports index range between the
  // first last non-whitespace character; nulls otherwise
  let { charStart, charEnd, errorArr } = checkForWhitespace(str, opts.offset);
  console.log(
    `240 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}`
  );
  console.log(
    `243 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd}`
  );
  console.log(
    `246 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  // now that we know where non-whitespace chars are, we can evaluate them

  if (Number.isInteger(charStart)) {
    console.log(
      `257 validateUri: ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
    if (opts.multipleOK) {
      // depends, is it comma or space-separated format
      if (opts.separator === "space") {
        console.log(`266 validateUri: use splitByWhitespace()`);
        splitByWhitespace(
          str,
          ([charFrom, charTo]) => {
            console.log(
              `271 validateUri: charFrom = ${charFrom}; charTo = ${charTo}`
            );
            let extractedName = str.slice(charFrom, charTo);
            console.log(
              `275 validateUri: ${`\u001b[${33}m${`extractedName`}\u001b[${39}m`} = ${JSON.stringify(
                extractedName,
                null,
                4
              )}`
            );
            // maybe it's comma-and-space-separated, like
            // <object archive="https://codsen.com, https://detergent.io">
            if (extractedName.endsWith(",") && extractedName.length > 1) {
              console.log(
                `285 validateUri: PUSH [${opts.offset + charTo - 1}, ${
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
          ([whitespaceFrom, whitespaceTo]) => {
            isSingleSpace(
              str,
              {
                from: whitespaceFrom,
                to: whitespaceTo,
                offset: opts.offset,
              },
              errorArr
            );
          },
          {
            from: charStart as number,
            to: charEnd as number,
          }
        );
      } else {
        console.log(`328 validateUri: use processCommaSep()`);
        processCommaSep(str, {
          offset: opts.offset,
          oneSpaceAfterCommaOK: false,
          leadingWhitespaceOK: true,
          trailingWhitespaceOK: true,
          cb: (idxFrom, idxTo) => {
            console.log(
              `336 validateUri: ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} idxFrom = ${idxFrom}; idxTo = ${idxTo}`
            );

            let extractedValue = str.slice(
              idxFrom - opts.offset,
              idxTo - opts.offset
            );
            console.log(
              `344 validateUri: ██ EXTRACTED VALUE: ${JSON.stringify(
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
              `370 validateUri: ${`\u001b[${32}m${`INCOMING errCb`}\u001b[${39}m`} ranges = ${JSON.stringify(
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
                `396 ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} fix = null`
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
              `408 validateUri: after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
          },
        });
      }
    } else {
      console.log(`418 validateUri: the whole attribute should be validated`);
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
