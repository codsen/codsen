import includesWithRegex from "./includesWithRegex";
import { right } from "string-left-right";

function processCommaSeparatedList(
  str,
  charStart,
  charEnd,
  idxOffset,
  errorArr,
  opts,
  cb
) {
  if (opts.canBeCommaSeparated && str.slice(charStart, charEnd).includes(",")) {
    console.log(
      `015 validateString(): comma spotted, value will be split and each chunk matched`
    );
    // but first, some insurance..

    // maybe there is more than one consecutive comma?
    if (/,\s*,/g.test(str.slice(charStart, charEnd))) {
      console.log(`021 double commas`);
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
      console.log(`032 spaces found`);
      // fish them all out
      const ranges = [];
      for (let i = charStart; i < charEnd; i++) {
        if (str[i] === "," && !str[i + 1].trim().length) {
          ranges.push([
            idxOffset + i + 1,
            idxOffset + right(str, i + 1) || str.length
          ]);
        }
      }
      console.log(
        `044 final ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
          ranges,
          null,
          4
        )}`
      );
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Whitespace after comma.`,
        fix: {
          ranges
        }
      });
    } else {
      console.log(`059 validate the value`);
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
      `078 validateString(): no comma, the whole value will be matched against the reference list`
    );
    if (
      (!Array.isArray(opts.quickPermittedValues) ||
        !includesWithRegex(
          opts.quickPermittedValues,
          str.slice(charStart, charEnd)
        )) &&
      (!Array.isArray(opts.permittedValues) ||
        !includesWithRegex(opts.permittedValues, str.slice(charStart, charEnd)))
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

export default processCommaSeparatedList;
