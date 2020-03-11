import findMalformed from "string-find-malformed";
import splitByWhitespace from "./splitByWhitespace";

function validateCommentOpening(token) {
  const reference = {
    simple: /<!--/g,
    only: /<!--\[[^\]]+\]>/g,
    not: /<!--\[[^\]]+\]><!-->/g
  };

  console.log(
    `012 validateCommentOpening(): ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
      token,
      null,
      4
    )}`
  );

  // if all is fine, end quick
  if (
    (token.kind === "simple" && reference.simple.test(token.value)) ||
    (token.kind === "only" && reference.only.test(token.value)) ||
    (token.kind === "not" && reference.not.test(token.value))
  ) {
    return [];
  }

  const errorArr = [];

  // assemble string without whitespace:
  let valueWithoutWhitespace = "";

  if (token.kind === "simple") {
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
  }

  console.log(
    `058 ██ ${`\u001b[${33}m${`valueWithoutWhitespace`}\u001b[${39}m`} = ${JSON.stringify(
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
    (token.kind === "not" && reference.not.test(valueWithoutWhitespace))
  ) {
    console.log(`073 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
    return errorArr;
  }

  // if processing continues, it means something more is wrong
  console.log(`078 validateCommentClosing(): something is wrong`);
  console.log(
    `080 validateCommentClosing(): errorArr so far: ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  // check the opening tag's beginning:
  if (["only", "not"].includes(token.kind)) {
    // if beginning is malformed:
    findMalformed(token.value, "<!--[", ({ idxFrom, idxTo }) => {
      // take precaution, "not" type openings have very similar
      // ending, <!--> which will get caught as well here!
      if (idxFrom === token.start) {
        console.log(`094 DETECTED MALFORMED RANGE [${idxFrom}, ${idxTo}]`);
        errorArr.push({
          idxFrom: token.start,
          idxTo: token.end,
          message: "Malformed opening comment tag.",
          ruleId: "comment-opening-malformed",
          fix: {
            ranges: [[idxFrom + token.start, idxTo + token.start, "<!--["]]
          }
        });
      }
    });
  }

  // check the ending part:
  if (token.kind === "not") {
    // if ending of the opening is malformed:
    findMalformed(token.value, "]><!-->", ({ idxFrom, idxTo }) => {
      console.log(`112 DETECTED MALFORMED RANGE [${idxFrom}, ${idxTo}]`);
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Malformed opening comment tag.",
        ruleId: "comment-opening-malformed",
        fix: {
          ranges: [[idxFrom + token.start, idxTo + token.start, "]><!-->"]]
        }
      });
    });
  }

  return errorArr;
}

export default validateCommentOpening;
