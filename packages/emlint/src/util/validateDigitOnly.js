import checkForWhitespace from "./checkForWhitespace";

// opts.type: integer|rational
// opts.percOK: true|false
function validateDigitOnly(str, idxOffset, opts) {
  console.log(
    `007 ${`\u001b[${35}m${`validateDigitOnly() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
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
      if (
        !"0123456789".includes(str[i]) &&
        (opts.type === "integer" ||
          (opts.type === "rational" && !["."].includes(str[i]))) &&
        (!opts.percOK || !(str[i] === "%" && charEnd === i + 1))
      ) {
        console.log(
          `026 ${`\u001b[${36}m${`looping`}\u001b[${39}m`} ${`\u001b[${33}m${`str[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
            str[i],
            null,
            0
          )}`
        );
        errorArr.push({
          idxFrom: idxOffset + i,
          idxTo: idxOffset + charEnd,
          message: `Should be ${opts.type}${
            opts.percOK ? `, either no units or percentage` : ", no units"
          }.`,
          fix: null
        });
        break;
      }
    }
  }

  return errorArr;
}

export default validateDigitOnly;
