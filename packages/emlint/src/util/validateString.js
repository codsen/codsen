import includesWithRegex from "./includesWithRegex";
import { right } from "string-left-right";
import checkForWhitespace from "./checkForWhitespace";

// opts.quickPermittedValues [Array] - will be matched first, if not matched, will move on to opts.permittedValues
// opts.permittedValues      [Array] - matches value against that array
// opts.canBeCommaSeparated  [Bool]  - for example, HTML attribute "accept" is like that
function validateString(str, idxOffset, opts) {
  // console.log(
  //   `191 ${`\u001b[${35}m${`validateString() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
  //     [...arguments],
  //     null,
  //     4
  //   )}`
  // );
  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars start and end, let's evaluate them
  if (Number.isInteger(charStart)) {
    console.log(`021 validateString(): processing the value, "${str}"`);
    if (
      opts.canBeCommaSeparated &&
      str.slice(charStart, charEnd).includes(",")
    ) {
      console.log(
        `027 validateString(): comma spotted, value will be split and each chunk matched`
      );
      // but first, some insurance..

      // maybe there is more than one consecutive comma?
      if (str.slice(charStart, charEnd).includes(",,")) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Consecutive commas.`,
          fix: null
        });
      } else if (
        opts.noSpaceAfterComma &&
        /,\s/g.test(str.slice(charStart, charEnd))
      ) {
        // fish them all out
        const ranges = [];
        for (let i = charStart; i < charEnd; i++) {
          if (str[i] === "," && !str[i + 1].trim().length) {
            ranges.push([
              idxOffset + i + 1,
              idxOffset + (right(str, i + 1) || str.length)
            ]);
          }
        }
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Whitespace after comma.`,
          fix: {
            ranges
          }
        });
      } else {
        // we can validate the value then
        str
          .slice(charStart, charEnd)
          .split(",")
          .forEach(oneOfValues => {
            // if (!opts.permittedValues.includes(oneOfValues)) {
            if (!includesWithRegex(opts.permittedValues, oneOfValues)) {
              errorArr.push({
                idxFrom: idxOffset + charStart,
                idxTo: idxOffset + charEnd,
                message: `Unrecognised value: ${oneOfValues}`,
                fix: null
              });
            }
          });
      }
    } else {
      console.log(
        `080 validateString(): no comma, the whole value will be matched against the reference list`
      );
      if (
        (!Array.isArray(opts.quickPermittedValues) ||
          !includesWithRegex(
            opts.quickPermittedValues,
            str.slice(charStart, charEnd)
          )) &&
        (!Array.isArray(opts.permittedValues) ||
          !includesWithRegex(
            opts.permittedValues,
            str.slice(charStart, charEnd)
          ))
      ) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Unrecognised value: "${str.slice(charStart, charEnd)}".`,
          fix: null
        });
      }
    }
  }

  return errorArr;
}

export default validateString;
