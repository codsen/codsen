import checkForWhitespace from "./checkForWhitespace";

function validateScript(str, idxOffset, opts) {
  console.log(
    `005 validateScript(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // we get trimmed string start and end positions, also an encountered errors array
  // const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  const { errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars are, we can evaluate them

  // if (Number.isInteger(charStart)) {
  //   // DO SOMETHING MORE
  // }

  return errorArr;
}

export default validateScript;
