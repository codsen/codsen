// import { matchRight, matchRightIncl } from "string-match-left-right";

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (
    typeof str !== "string" ||
    !str.trim().length ||
    !Number.isInteger(idxOfAttrOpening) ||
    !Number.isInteger(isThisClosingIdx) ||
    !str[idxOfAttrOpening] ||
    !str[isThisClosingIdx] ||
    idxOfAttrOpening >= isThisClosingIdx
  ) {
    console.log(
      `014 ${`\u001b[${31}m${`WRONG INPUTS, RETURN FALSE`}\u001b[${39}m`}`
    );
    return false;
  }

  const openingQuote = `'"`.includes(str[idxOfAttrOpening])
    ? str[idxOfAttrOpening]
    : null;
  console.log(
    `023 ${`\u001b[${33}m${`openingQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${openingQuote}\u001b[${39}m`}`
  );

  // happy path scenario: quote character in question
  // (the one at str[isThisClosingIdx]) is matching the
  // character at the opening (str[idxOfAttrOpening])

  // traverse string from "idxOfAttrOpening" up to
  // "isThisClosingIdx" and look for interesting things:

  for (let i = idxOfAttrOpening; i < isThisClosingIdx; i++) {
    //
    // Logging:
    // -------------------------------------------------------------------------
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    // if =' or =" is encountered, it's false
    if (str[i] === "=" && `'"`.includes(str[i + 1])) {
      console.log(
        `048 ${`\u001b[${31}m${`NEW ATTR STARTS, RETURN FALSE`}\u001b[${39}m`}`
      );
      return false;
    }
  }

  // if this point was reached and loop didn't exit...

  // happy path scenario: current quote matches the opening
  // quote
  if (openingQuote && str[isThisClosingIdx] === str[isThisClosingIdx]) {
    console.log(
      `060 happy path, opening quote matched - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
    );
    return true;
  }

  // default is false
  return false;
}

export default isAttrClosing;
