import { left, right } from "string-left-right";

const knownUnits = [
  "cm",
  "mm",
  "in",
  "px",
  "pt",
  "pc",
  "em",
  "ex",
  "ch",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "%"
];

function isObj(something) {
  return something !== null && typeof something === "object";
}

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
    `059 ${`\u001b[${35}m${`validateDigitAndUnit() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
      [...arguments],
      null,
      4
    )}`
  );
  const errorArr = [];

  // We'll catch surrounding whitespace and validate the value in one go. This means, we need to know where non-whitespace value is:
  let charStart = 0; // defaults
  let charEnd = str.length;
  let gatheredRanges = [];

  // tackle the inner wrapping whitespace first
  // ...left side:
  if (!str[0].trim().length) {
    charStart = right(str); // returns digit or null - index of next non whitespace char on the right
    if (charStart === null) {
      // it's just whitespace here
      charEnd = null;
      errorArr.push({
        idxFrom: idxOffset, // that is, idxOffset + 0
        idxTo: idxOffset + str.length,
        message: `Missing value.`,
        fix: null // can't fix - value is missing completely!
      });
    } else {
      gatheredRanges.push([idxOffset, idxOffset + charStart]);
    }
  }
  // ...right side:
  if (charEnd && !str[str.length - 1].trim().length) {
    charEnd = left(str, str.length - 1);
    console.log(
      `093 ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
        charEnd,
        null,
        4
      )}`
    );
    gatheredRanges.push([idxOffset + charEnd + 1, idxOffset + str.length]);
  }
  console.log(
    `102 ${`\u001b[${33}m${`gatheredRanges`}\u001b[${39}m`} = ${JSON.stringify(
      gatheredRanges,
      null,
      4
    )}`
  );
  if (gatheredRanges.length) {
    errorArr.push({
      idxFrom: gatheredRanges[0][0],
      idxTo: gatheredRanges[gatheredRanges.length - 1][1],
      message: `Remove whitespace.`,
      fix: { ranges: gatheredRanges } // we can fix - we delete this whitespace!
    });
    // reset:
    gatheredRanges = [];
  }
  console.log(`118`);

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
      console.log(`148 separate digits from units, evaluate both`);
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
            `160 ${`\u001b[${33}m${`endPart`}\u001b[${39}m`} = ${JSON.stringify(
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

export { isEnabled, validateDigitAndUnit, knownUnits };
