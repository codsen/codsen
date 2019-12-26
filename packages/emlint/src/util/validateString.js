import processCommaSeparatedList from "./processCommaSeparatedList";
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
    console.log(`020 validateString(): processing the value, "${str}"`);

    processCommaSeparatedList(
      str,
      charStart,
      charEnd,
      idxOffset,
      errorArr,
      opts
    );
  }

  return errorArr;
}

export default validateString;
