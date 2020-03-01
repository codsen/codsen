import splitByWhitespace from "./splitByWhitespace";

function validateCommentOpening(token) {
  const reference = {
    simple: /<!--/g,
    only: /<!--\[[^\]]+\]>/g,
    not: /<!--\[[^\]]+\]><!-->/g
  };

  console.log(
    `011 validateCommentOpening(): ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
      token,
      null,
      4
    )}`
  );

  // if all is fine, end quick
  if (
    (token.kind === "simple" && reference.simple.test(token.value)) ||
    (token.kind === "only" && reference.only.test(token.value)) ||
    (token.kind === "not" && reference.not(token.value))
  ) {
    return [];
  }

  const errorArr = [];

  // assemble string without whitespace:
  let valueWithoutWhitespace = "";

  // first, tackle any inner whitespace
  splitByWhitespace(
    token.value,
    ([charFrom, charTo]) => {
      valueWithoutWhitespace = `${valueWithoutWhitespace}${token.value.slice(
        charFrom,
        charTo
      )}`;
    },
    ([whitespaceFrom, whitespaceTo]) => {
      errorArr.push({
        ruleId: "comment-only-closing-malformed",
        idxFrom: token.start,
        idxTo: token.end,
        message: "Remove whitespace.",
        fix: {
          ranges: [[whitespaceFrom + token.start, whitespaceTo + token.start]]
        }
      });
    }
  );

  console.log(
    `055 ██ ${`\u001b[${33}m${`valueWithoutWhitespace`}\u001b[${39}m`} = ${JSON.stringify(
      valueWithoutWhitespace,
      null,
      4
    )}`
  );

  // if all it took was to remove some whitespace to get a correct value,
  // that's the end - return the "errorArr" with only whitespace ranges:
  if (
    (token.kind === "simple" &&
      reference.simple.test(valueWithoutWhitespace)) ||
    (token.kind === "only" && reference.only.test(valueWithoutWhitespace)) ||
    (token.kind === "not" && reference.not(valueWithoutWhitespace))
  ) {
    console.log(`070 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
    return errorArr;
  }
}

export default validateCommentOpening;
