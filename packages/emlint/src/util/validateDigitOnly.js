import checkForWhitespace from "./checkForWhitespace";

function validateDigitOnly(str, idxOffset, opts) {
  console.log(
    `005 ${`\u001b[${35}m${`validateDigitOnly() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
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
          (opts.type === "rational" && !["."].includes(str[i])))
      ) {
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

export default validateDigitOnly;
