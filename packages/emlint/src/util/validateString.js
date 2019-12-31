import processCommaSeparated from "string-process-comma-separated";
import checkForWhitespace from "./checkForWhitespace";
import includesWithRegex from "./includesWithRegex";

// if value is not comma-separated chain of values, whole thing is passed to this
// if value is comma-separated, each extracted chunk is passed to this
// we keep it separate to keep it DRY
function validateValue(str, idxOffset, opts, charStart, charEnd, errorArr) {
  const extractedValue = str.slice(charStart, charEnd);
  if (
    !(
      includesWithRegex(opts.quickPermittedValues, extractedValue) ||
      includesWithRegex(opts.permittedValues, extractedValue)
    )
  ) {
    let fix = null;
    let message = `Unrecognised value: "${str.slice(charStart, charEnd)}".`;
    if (
      includesWithRegex(
        opts.quickPermittedValues,
        extractedValue.toLowerCase()
      ) ||
      includesWithRegex(opts.permittedValues, extractedValue.toLowerCase())
    ) {
      message = `Should be lowercase.`;
      fix = {
        ranges: [
          [
            charStart + idxOffset,
            charEnd + idxOffset,
            extractedValue.toLowerCase()
          ]
        ]
      };
    } else if (
      Array.isArray(opts.quickPermittedValues) &&
      opts.quickPermittedValues.length &&
      opts.quickPermittedValues.length < 6 &&
      opts.quickPermittedValues.every(val => typeof val === "string") &&
      (!Array.isArray(opts.permittedValues) || !opts.permittedValues.length)
    ) {
      // if all reference values are strings, if the case is simple,
      // for example, <td dir="tralala">, instead of message:
      // Unrecognised value: "tralala".
      // we can say:
      // Should be "rtl|ltr"
      message = `Should be "${opts.quickPermittedValues.join("|")}".`;
    } else if (
      Array.isArray(opts.permittedValues) &&
      opts.permittedValues.length &&
      opts.permittedValues.length < 6 &&
      opts.permittedValues.every(val => typeof val === "string") &&
      (!Array.isArray(opts.quickPermittedValues) ||
        !opts.quickPermittedValues.length)
    ) {
      // if all reference values are strings, if the case is simple,
      // for example, <td dir="tralala">, instead of message:
      // Unrecognised value: "tralala".
      // we can say:
      // Should be "rtl|ltr"
      message = `Should be "${opts.permittedValues.join("|")}".`;
    }

    errorArr.push({
      idxFrom: charStart + idxOffset,
      idxTo: charEnd + idxOffset,
      message,
      fix
    });
    console.log(
      `071 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
        errorArr,
        null,
        4
      )}`
    );
  }
}

// opts.quickPermittedValues [Array] - will be matched first, if not matched, will move on to opts.permittedValues
// opts.permittedValues      [Array] - matches value against that array
// opts.canBeCommaSeparated  [Bool]  - for example, HTML attribute "accept" is like that
function validateString(str, idxOffset, opts) {
  console.log(
    `085 ${`\u001b[${35}m${`validateString() called`}\u001b[${39}m`}`
  );
  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  console.log(
    `090 validateString(): ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd};\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  if (Number.isInteger(charStart)) {
    // continue checks only if there are non-whitespace characters in the value
    if (opts.canBeCommaSeparated) {
      console.log(
        `101 validateString(): ${`\u001b[${32}m${`call processCommaSeparated()`}\u001b[${39}m`}`
      );
      processCommaSeparated(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          console.log(
            `110 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} idxFrom = ${idxFrom}; idxTo = ${idxTo}`
          );

          const extractedValue = str.slice(
            idxFrom - idxOffset,
            idxTo - idxOffset
          );
          console.log(
            `118 ██ EXTRACTED VALUE: ${JSON.stringify(extractedValue, null, 0)}`
          );

          // if there are errors, validateValue() mutates the passed "errorArr",
          // pushing to it
          validateValue(
            str,
            idxOffset,
            opts,
            idxFrom - idxOffset, // processCommaSeparated() reports offset values so we need to restore indexes to start where this "str" above starts
            idxTo - idxOffset,
            errorArr
          );
        },
        errCb: (ranges, message) => {
          console.log(
            `134 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ranges = ${ranges}; message = ${message}`
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
            `145 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        }
      });
    } else {
      console.log(`154 validateString(): single value clauses`);

      const extractedValue = str.slice(charStart, charEnd);
      console.log(
        `158 validateString(): str.slice(charStart, charEnd): ${`\u001b[${36}m${extractedValue}\u001b[${39}m`}`
      );

      // if there are errors, validateValue() mutates the passed "errorArr",
      // pushing to it
      validateValue(str, idxOffset, opts, charStart, charEnd, errorArr);
    }
  }

  console.log(
    `168 validateString(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  return errorArr;
}

export default validateString;
