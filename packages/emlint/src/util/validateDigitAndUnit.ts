import { processCommaSep } from "string-process-comma-separated";

import checkForWhitespace from "./checkForWhitespace";
import { knownUnits } from "./constants";
import { isObj } from "./util";
import { ErrorObj } from "./commonTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

interface Opts {
  type: "integer" | "rational";
  whitelistValues: string[];
  theOnlyGoodUnits: null | string[];
  plusOK: boolean;
  negativeOK: boolean;
  zeroOK: boolean;
  badUnits: string[];
  enforceCount: null | number | "even" | "odd";
  noUnitsIsFine: boolean;
  canBeCommaSeparated: boolean;
  customGenericValueError: null | string;
  skipWhitespaceChecks: boolean;
  customPxMessage: null | string;
  maxValue: null | number;
}

const defaultOpts: Opts = {
  type: "integer",
  whitelistValues: [],
  theOnlyGoodUnits: null,
  plusOK: false,
  negativeOK: false,
  zeroOK: true,
  badUnits: [],
  enforceCount: null,
  noUnitsIsFine: true,
  canBeCommaSeparated: false,
  customGenericValueError: null,
  skipWhitespaceChecks: false,
  customPxMessage: null,
  maxValue: null,
};

interface InputObj {
  str: string;
  opts: Partial<Opts>;
  charStart: number;
  charEnd: number;
  idxOffset: number;
  errorArr: ErrorObj[];
}

function validateValue({
  str,
  opts,
  charStart,
  charEnd,
  idxOffset,
  errorArr,
}: InputObj): void {
  // the rule is for pattern digit(s) + unit, so start from checking, does it
  // start with a digit
  DEV && console.log(` `);
  DEV && console.log(` `);
  DEV && console.log(` `);
  DEV &&
    console.log(
      `069 validateValue(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}; ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `081 validateValue(): INCOMING ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd}`
    );

  // insurance
  if (typeof str !== "string") {
    return;
  }

  // applies to rational and integer types
  if (str[charStart] === "0") {
    if (charEnd === charStart + 1) {
      // so length === 1
      if (!opts.zeroOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Zero not allowed.`,
          fix: null,
        });
      }
    } else if ("0123456789".includes(str[charStart + 1])) {
      // we have padded cases like 08
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Number padded with zero.`,
        fix: null,
      });
    }
  }

  if (
    !"0123456789".includes(str[charStart]) &&
    !"0123456789".includes(str[charEnd - 1])
  ) {
    DEV &&
      console.log(
        `118 validateValue(): no digits, PUSH [${idxOffset + charStart}, ${
          idxOffset + charEnd
        }]`
      );

    // calculate the message
    let message = `Digits missing.`;
    if (opts.customGenericValueError) {
      message = opts.customGenericValueError;
    } else if (
      Array.isArray(opts.theOnlyGoodUnits) &&
      !opts.theOnlyGoodUnits.length &&
      opts.type === "integer"
    ) {
      message = `Should be integer, no units.`;
    }

    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message,
      fix: null,
    });
  } else if (
    "0123456789".includes(str[charStart]) &&
    "0123456789".includes(str[charEnd - 1]) &&
    (!opts.noUnitsIsFine ||
      (opts.type === "integer" &&
        opts.maxValue &&
        str.slice(charStart, charEnd).match(/^\d+$/) &&
        Number.parseInt(str.slice(charStart, charEnd), 10) > opts.maxValue))
  ) {
    DEV && console.log(`150 validateValue(): inside digits-only clauses`);
    if (!opts.noUnitsIsFine) {
      DEV &&
        console.log(
          `154 validateValue(): units missing, PUSH [${
            idxOffset + charStart
          }, ${idxOffset + charEnd}]`
        );
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: opts.customGenericValueError || `Units missing.`,
        fix: null,
      });
    } else {
      DEV &&
        console.log(
          `167 validateValue(): maximum exceeded, PUSH [${
            idxOffset + charStart
          }, ${idxOffset + charEnd}]`
        );
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Maximum, ${opts.maxValue} exceeded.`,
        fix: null,
      });
    }
  } else {
    DEV &&
      console.log(
        `181 validateValue(): separate digits from units, evaluate both`
      );
    for (let i = charStart; i < charEnd; i++) {
      DEV &&
        console.log(
          `186 validateValue(): ${`\u001b[${36}m${`loop`}\u001b[${39}m`} ${`\u001b[${36}m${`str[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[i],
            null,
            0
          )}`
        );
      if (
        !"0123456789".includes(str[i]) &&
        (str[i] !== "." || opts.type !== "rational") &&
        (str[i] !== "-" || !(opts.negativeOK && i === 0)) &&
        (str[i] !== "+" || !(opts.plusOK && i === 0))
      ) {
        // dash can be in the middle! For example, colspan="1-1"
        let endPart = str.slice(i, charEnd);
        DEV &&
          console.log(
            `202 ${`\u001b[${33}m${`endPart`}\u001b[${39}m`} = ${JSON.stringify(
              endPart,
              null,
              4
            )}`
          );
        if (
          isObj(opts) &&
          ((Array.isArray(opts.theOnlyGoodUnits) &&
            !opts.theOnlyGoodUnits.includes(endPart)) ||
            (Array.isArray(opts.badUnits) && opts.badUnits.includes(endPart)))
        ) {
          DEV && console.log(`214 recognised unit clauses`);
          // special case for "px"
          if (endPart === "px") {
            let message = opts.customPxMessage
              ? opts.customPxMessage
              : `Remove px.`;
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message,
              fix: opts.customPxMessage
                ? null
                : {
                    ranges: [[idxOffset + i, idxOffset + charEnd]],
                  },
            });
          } else {
            // validate against the known units and serve a separate
            // message, depending on was it recognised
            // calculate the message
            let message = `Bad unit.`;
            if (str.match(/-\s*-/g)) {
              message = `Repeated minus.`;
            } else if (str.match(/\+\s*\+/g)) {
              message = `Repeated plus.`;
            } else if (
              Array.isArray(opts.theOnlyGoodUnits) &&
              opts.theOnlyGoodUnits.length &&
              opts.theOnlyGoodUnits.includes(endPart.trim())
            ) {
              // if trimmed end part matches "good" units, it's the whitespace
              message = "Rogue whitespace.";
            } else if (opts.customGenericValueError) {
              message = opts.customGenericValueError;
            } else if (
              Array.isArray(opts.theOnlyGoodUnits) &&
              !opts.theOnlyGoodUnits.length &&
              opts.type === "integer"
            ) {
              message = `Should be integer, no units.`;
            }

            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message,
              fix: null,
            });
          }
        } else if (!knownUnits.includes(endPart)) {
          DEV && console.log(`264 unrecognised unit clauses`);
          let message = "Unrecognised unit.";
          if (/\d/.test(endPart)) {
            message = "Messy value.";
          } else if (knownUnits.includes(endPart.trim())) {
            message = "Rogue whitespace.";
          }
          errorArr.push({
            idxFrom: idxOffset + i,
            idxTo: idxOffset + charEnd,
            message,
            fix: null,
          });
        }

        // stop the loop
        break;
      }
    }
  }
}

// function below is used to validate attribute values which contain
// digits and a unit, for example, "100%" of an HTML attribute
// width="100%"
// or
// "100%" of CSS head style "width:100%;"

// it returns array of ready error objects, except without ruleId, something like:
//
// {
//   idxFrom: 17,
//   idxTo: 19,
//   message: `Remove px.`,
//   fix: {
//     ranges: [[17, 19]]
//   }
// }
//
// if it can't fix, key "fix" value is null
function validateDigitAndUnit(
  str: string,
  idxOffset: number,
  originalOpts?: Partial<Opts>
): ErrorObj[] {
  if (typeof str !== "string") {
    DEV &&
      console.log(
        `312 ${`\u001b[${35}m${`validateDigitAndUnit() called`}\u001b[${39}m`} quick return, no content in the input`
      );
    return [];
  }

  let opts: Opts = { ...defaultOpts, ...originalOpts };

  // we get trimmed string start and end positions, also an encountered errors array

  let charStart = 0;
  let charEnd = str.length;
  let errorArr: ErrorObj[] = [];

  if (!opts.skipWhitespaceChecks) {
    let retrievedWhitespaceChecksObj = checkForWhitespace(str, idxOffset);
    charStart = retrievedWhitespaceChecksObj.charStart as number;
    charEnd = retrievedWhitespaceChecksObj.charEnd as number;
    errorArr = retrievedWhitespaceChecksObj.errorArr;
  }

  DEV &&
    console.log(
      `334 validateDigitAndUnit(): ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
        charStart,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `342 validateDigitAndUnit(): ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
        charEnd,
        null,
        4
      )}`
    );

  // now that we know where non-whitespace chars are, evaluate them
  if (Number.isInteger(charStart)) {
    DEV && console.log(`351 validateDigitAndUnit(): it is integer.`);
    if (opts.canBeCommaSeparated) {
      DEV &&
        console.log(
          `355 validateDigitAndUnit(): opts.canBeCommaSeparated clauses`
        );
      // split by comma and process each
      let extractedValues: string[] = [];

      processCommaSep(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          DEV &&
            console.log(
              `368 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} idxFrom = ${idxFrom}; idxTo = ${idxTo}`
            );
          DEV &&
            console.log(
              `372 ██ EXTRACTED VALUE: ${JSON.stringify(
                str.slice(idxFrom - idxOffset, idxTo - idxOffset),
                null,
                0
              )}`
            );

          let extractedValue = str.slice(
            idxFrom - idxOffset,
            idxTo - idxOffset
          );

          // if the value is not whitelisted, evaluate it
          if (
            !Array.isArray(opts.whitelistValues) ||
            !opts.whitelistValues.includes(extractedValue)
          ) {
            validateValue({
              str,
              opts,
              charStart: idxFrom - idxOffset,
              charEnd: idxTo - idxOffset,
              idxOffset,
              errorArr,
            });
          }

          extractedValues.push(extractedValue);
        },
        errCb: (ranges, message) => {
          DEV &&
            console.log(
              `404 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ranges = ${ranges}; message = ${message}`
            );
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message,
            fix: {
              ranges,
            },
          });
          DEV &&
            console.log(
              `416 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
        },
      });

      // enforce the "extractedValues" count
      DEV &&
        console.log(
          `428 validateDigitAndUnit(): ${`\u001b[${33}m${`extractedValues`}\u001b[${39}m`} = ${JSON.stringify(
            extractedValues,
            null,
            4
          )}`
        );

      if (
        Number.isInteger(opts.enforceCount) &&
        extractedValues.length !== opts.enforceCount
      ) {
        errorArr.push({
          idxFrom: charStart + idxOffset,
          idxTo: charEnd + idxOffset,
          message: `There should be ${opts.enforceCount} values.`,
          fix: null,
        });
        DEV &&
          console.log(
            `447 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
      } else if (
        typeof opts.enforceCount === "string" &&
        ["even", "odd"].includes(opts.enforceCount.toLowerCase())
      ) {
        if (
          opts.enforceCount.toLowerCase() === "even" &&
          extractedValues.length % 2 !== 0
        ) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: `Should be an even number of values but found ${extractedValues.length}.`,
            fix: null,
          });
          DEV &&
            console.log(
              `469 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
        } else if (
          opts.enforceCount.toLowerCase() !== "even" &&
          extractedValues.length % 2 === 0
        ) {
          errorArr.push({
            idxFrom: charStart + idxOffset,
            idxTo: charEnd + idxOffset,
            message: `Should be an odd number of values but found ${extractedValues.length}.`,
            fix: null,
          });
          DEV &&
            console.log(
              `487 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
        }
      }
    } else {
      DEV &&
        console.log(
          `498 validateDigitAndUnit(): opts.canBeCommaSeparated is off, process the whole`
        );
      // if the value is not whitelisted, evaluate it
      if (
        !Array.isArray(opts.whitelistValues) ||
        !opts.whitelistValues.includes(str.slice(charStart, charEnd))
      ) {
        validateValue({
          str,
          opts,
          charStart,
          charEnd,
          idxOffset,
          errorArr,
        });
      }
    }
  }
  return errorArr;
}

export default validateDigitAndUnit;
