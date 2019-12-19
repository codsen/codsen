import { knownUnits } from "./constants";
import checkForWhitespace from "./checkForWhitespace";

function isObj(something) {
  return something !== null && typeof something === "object";
}

// -----------------------------------------------------------------------------

function isEnabled(maybeARulesValue) {
  if (Number.isInteger(maybeARulesValue) && maybeARulesValue > 0) {
    return maybeARulesValue;
  } else if (
    Array.isArray(maybeARulesValue) &&
    maybeARulesValue.length &&
    Number.isInteger(maybeARulesValue[0]) &&
    maybeARulesValue[0] > 0
  ) {
    return maybeARulesValue[0];
  }
  return 0;
}

// -----------------------------------------------------------------------------

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
function validateDigitAndUnit(str, idxOffset, opts) {
  console.log(
    `046 ${`\u001b[${35}m${`validateDigitAndUnit() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
      [...arguments],
      null,
      4
    )}`
  );
  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars are, evaluate them
  if (Number.isInteger(charStart)) {
    // the rule is for pattern digit(s) + unit, so start from checking, does it
    // start with a digit
    if (
      !"0123456789".includes(str[charStart]) &&
      !"0123456789".includes(str[charEnd - 1])
    ) {
      // no digits
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Digits missing.`,
        fix: null
      });
    } else if (
      "0123456789".includes(str[charStart]) &&
      "0123456789".includes(str[charEnd - 1]) &&
      !opts.noUnitsIsFine
    ) {
      // units missing
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Units missing.`,
        fix: null
      });
    } else {
      console.log(`083 separate digits from units, evaluate both`);
      for (let i = charStart; i < charEnd; i++) {
        console.log(
          `${`\u001b[${36}m${`str[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[i],
            null,
            0
          )}`
        );
        if (!"0123456789".includes(str[i])) {
          const endPart = str.slice(i);
          console.log(
            `095 ${`\u001b[${33}m${`endPart`}\u001b[${39}m`} = ${JSON.stringify(
              endPart,
              null,
              4
            )}`
          );
          if (
            isObj(opts) &&
            Array.isArray(opts.badUnits) &&
            opts.badUnits.includes(endPart)
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
                message: `Bad unit.`,
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
  return errorArr;
}

function validateDigitOnly(str, idxOffset) {
  console.log(
    `150 ${`\u001b[${35}m${`validateDigitOnly() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
      [...arguments],
      null,
      4
    )}`
  );
  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars are, evaluate them
  if (Number.isInteger(charStart)) {
    for (let i = charStart; i < charEnd; i++) {
      if (!"0123456789".includes(str[i])) {
        errorArr.push({
          idxFrom: idxOffset + i,
          idxTo: idxOffset + charEnd,
          message: `Should be integer${
            /[a-zA-Z]/g.test(str) ? ", no letters" : ""
          }.`,
          fix: null
        });
        break;
      }
    }
  }

  return errorArr;
}

export { isEnabled, validateDigitAndUnit, validateDigitOnly };
