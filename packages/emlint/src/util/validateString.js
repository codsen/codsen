import processCommaSeparated from "string-process-comma-separated";
import checkForWhitespace from "./checkForWhitespace";
import includesWithRegex from "./includesWithRegex";

// opts.quickPermittedValues [Array] - will be matched first, if not matched, will move on to opts.permittedValues
// opts.permittedValues      [Array] - matches value against that array
// opts.canBeCommaSeparated  [Bool]  - for example, HTML attribute "accept" is like that
function validateString(str, idxOffset, opts) {
  console.log(
    `010 ${`\u001b[${35}m${`validateString() called`}\u001b[${39}m`}`
  );
  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  console.log(
    `015 validateString(): ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}; ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd};\n${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  if (Number.isInteger(charStart)) {
    // continue checks only if there are non-whitespace characters in the value
    if (opts.canBeCommaSeparated) {
      console.log(
        `026 validateString(): ${`\u001b[${32}m${`call processCommaSeparated()`}\u001b[${39}m`}`
      );
      processCommaSeparated(str, {
        offset: idxOffset,
        oneSpaceAfterCommaOK: false,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        cb: (idxFrom, idxTo) => {
          console.log(
            `035 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} idxFrom = ${idxFrom}; idxTo = ${idxTo}`
          );

          const extractedValue = str.slice(
            idxFrom - idxOffset,
            idxTo - idxOffset
          );
          console.log(
            `043 ██ EXTRACTED VALUE: ${JSON.stringify(extractedValue, null, 0)}`
          );

          let message = `Unrecognised value: "${str.slice(
            idxFrom - idxOffset,
            idxTo - idxOffset
          )}".`;
          let fix = null;
          if (
            !(
              includesWithRegex(opts.quickPermittedValues, extractedValue) ||
              includesWithRegex(opts.permittedValues, extractedValue)
            )
          ) {
            // check maybe it's a letter case issue
            if (
              includesWithRegex(
                opts.quickPermittedValues,
                extractedValue.toLowerCase()
              ) ||
              includesWithRegex(
                opts.permittedValues,
                extractedValue.toLowerCase()
              )
            ) {
              message = `Should be lowercase;`;
              fix = {
                ranges: [[idxFrom, idxTo, extractedValue.toLowerCase()]]
              };
            }

            errorArr.push({
              idxFrom: idxFrom,
              idxTo: idxTo,
              message,
              fix
            });
            console.log(
              `081 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
                errorArr,
                null,
                4
              )}`
            );
          }
        },
        errCb: (ranges, message) => {
          console.log(
            `091 cb(): ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ranges = ${ranges}; message = ${message}`
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
            `102 after errorArr push, ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
              errorArr,
              null,
              4
            )}`
          );
        }
      });
    } else if (
      !(
        (Array.isArray(opts.quickPermittedValues) &&
          includesWithRegex(
            opts.quickPermittedValues,
            str.slice(charStart, charEnd)
          )) ||
        (Array.isArray(opts.permittedValues) &&
          includesWithRegex(
            opts.permittedValues,
            str.slice(charStart, charEnd)
          ))
      )
    ) {
      console.log(`124 validateString(): single value clauses`);
      const extractedValue = str.slice(charStart, charEnd);
      console.log(
        `127 validateString(): str.slice(charStart, charEnd): ${`\u001b[${36}m${extractedValue}\u001b[${39}m`}`
      );

      let message = `Unrecognised value: "${str.slice(charStart, charEnd)}".`;
      let fix = null;
      // check maybe it's a letter case issue
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
              idxOffset + charStart,
              idxOffset + charEnd,
              extractedValue.toLowerCase()
            ]
          ]
        };
      }

      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message,
        fix
      });
    }
  }

  console.log(
    `162 validateString(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  return errorArr;
}

export default validateString;
