import splitByWhitespace from "./splitByWhitespace";

function validateCommentClosing(token) {
  const reference = {
    simple: "-->",
    only: "<![endif]-->",
    not: "<!--<![endif]-->"
  };

  const errorArr = [];

  console.log(
    `013 validateCommentClosing(): ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
      token,
      null,
      4
    )}`
  );

  // first, tackle any inner whitespace
  splitByWhitespace(token.value, null, ([from, to]) => {
    errorArr.push({
      ruleId: "comment-only-closing-malformed",
      idxFrom: token.start,
      idxTo: token.end,
      message: "Remove whitespace.",
      fix: {
        ranges: [[from + token.start, to + token.start]]
      }
    });
  });

  // if all is fine, end quick
  if (
    (token.kind === "simple" && token.value === "-->") ||
    (token.kind === "only" && token.value === "<![endif]-->") ||
    (token.kind === "not" && token.value === "<!--<![endif]-->")
  ) {
    return errorArr;
  }
  // if processing continues, it means something more is wrong
  errorArr.push({
    ruleId: "comment-only-closing-malformed",
    idxFrom: token.start,
    idxTo: token.end,
    message: "Malformed closing comment tag.",
    fix: {
      ranges: [[token.start, token.end, reference[token.kind]]]
    }
  });

  return errorArr;
}

export default validateCommentClosing;
