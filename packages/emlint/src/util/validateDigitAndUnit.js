import processCommaSeparated from "string-process-comma-separated";
import checkForWhitespace from "./checkForWhitespace";
import { knownUnits } from "./constants";
import isObj from "lodash.isplainobject";

// opts.type: integer|rational
function validateValue({ str, opts, charStart, charEnd, idxOffset, errorArr }) {
  // the rule is for pattern digit(s) + unit, so start from checking, does it
  // start with a digit
  console.log(` `);
  console.log(` `);
  console.log(` `);
  console.log(
    `014 validateValue(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      4
    )}; ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `025 validateValue(): INCOMING ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd}`
  );
  if (
    !"0123456789".includes(str[charStart]) &&
    !"0123456789".includes(str[charEnd - 1])
  ) {
    console.log(
      `032 validateValue(): no digits, PUSH [${idxOffset +
        charStart}, ${idxOffset + charEnd}]`
    );
    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message: opts.customGenericValueError || `Digits missing.`,
      fix: null
    });
  } else if (
    "0123456789".includes(str[charStart]) &&
    "0123456789".includes(str[charEnd - 1]) &&
    !opts.noUnitsIsFine
  ) {
    console.log(
      `047 validateValue(): units missing, PUSH [${idxOffset +
        charStart}, ${idxOffset + charEnd}]`
    );
    errorArr.push({
      idxFrom: idxOffset + charStart,
      idxTo: idxOffset + charEnd,
      message: opts.customGenericValueError || `Units missing.`,
      fix: null
    });
  } else {
    console.log(
      `058 validateValue(): separate digits from units, evaluate both`
    );
    for (let i = charStart; i < charEnd; i++) {
      console.log(
        `${`\u001b[${36}m${`str[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
          str[i],
          null,
          0
        )}`
      );
      if (
        !"0123456789".includes(str[i]) &&
        (opts.type !== "rational" || str[i] !== ".")
      ) {
        const endPart = str.slice(i, charEnd);
        console.log(
          `074 ${`\u001b[${33}m${`endPart`}\u001b[${39}m`} = ${JSON.stringify(
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
          // special case for "px"
          if (endPart === "px") {
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message: `Remove px.`,
              fix: {
                ranges: [[idxOffset + i, idxOffset + charEnd]]
              }
            });
          } else {
            errorArr.push({
              idxFrom: idxOffset + i,
              idxTo: idxOffset + charEnd,
              message: opts.customGenericValueError || `Bad unit.`,
              fix: null
            });
          }
        } else if (!knownUnits.includes(endPart)) {
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
            fix: null
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
function validateDigitAndUnit(str, idxOffset, originalOpts) {
  console.log(
    `146 ${`\u001b[${35}m${`validateDigitAndUnit() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
      [...arguments],
      null,
      4
    )}`
  );

  const defaultOpts = {
    whitelistValues: [],
    badUnits: [],
    noUnitsIsFine: true,
    canBeCommaSeparated: false,
    type: "integer",
    customGenericValueError: null
  };

  const opts = Object.assign({}, defaultOpts, originalOpts);

  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  console.log(
    `167 validateDigitAndUnit(): ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
      charStart,
      null,
      4
    )}`
  );
  console.log(
    `174 validateDigitAndUnit(): ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
      charEnd,
      null,
      4
    )}`
  );

  // now that we know where non-whitespace chars are, evaluate them
  if (Number.isInteger(charStart)) {
    if (opts.canBeCommaSeparated) {
      console.log(
        `185 validateDigitAndUnit(): opts.canBeCommaSeparated clauses`
      );
      // split by comma and process each
      processCommaSeparated(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          console.log(
            `195 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} idxFrom = ${idxFrom}; idxTo = ${idxTo}`
          );
          console.log(
            `198 ██ EXTRACTED VALUE: ${JSON.stringify(
              str.slice(idxFrom - idxOffset, idxTo - idxOffset),
              null,
              0
            )}`
          );

          // if the value is not whitelisted, evaluate it
          if (
            !Array.isArray(opts.whitelistValues) ||
            !opts.whitelistValues.includes(
              str.slice(idxFrom - idxOffset, idxTo - idxOffset)
            )
          ) {
            validateValue({
              str,
              opts,
              charStart: idxFrom - idxOffset,
              charEnd: idxTo - idxOffset,
              idxOffset,
              errorArr
            });
          }
        },
        errCb: (ranges, message) => {
          console.log(
            `224 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ranges = ${ranges}; message = ${message}`
          );
          errorArr.push({
            idxFrom: ranges[0][0],
            idxTo: ranges[ranges.length - 1][1],
            message,
            fix: {
              ranges
            }
          });
          console.log(
            `235 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        }
      });
    } else {
      console.log(
        `245 validateDigitAndUnit(): opts.canBeCommaSeparated is off, process the whole`
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
          errorArr
        });
      }
    }
  }
  return errorArr;
}

export default validateDigitAndUnit;
