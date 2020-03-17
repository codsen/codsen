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
    console.log(`025 validateCommentOpening(): REGEX PASSES, EARLY EXIT`);
    return [];
  }

  const errorArr = [];

  // assemble string without whitespace:
  let valueWithoutWhitespace = "";

  if (token.kind === "simple") {
    console.log(`035 validateCommentOpening(): simple comment clauses`);
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
    `059 ██ ${`\u001b[${33}m${`valueWithoutWhitespace`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`074 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
    return errorArr;
  }

  // if processing continues, it means something more is wrong
  console.log(`079 validateCommentOpening(): something is wrong`);
  console.log(
    `081 validateCommentOpening(): errorArr so far: ${JSON.stringify(
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
        console.log(
          `096 validateCommentOpening(): DETECTED MALFORMED RANGE [${idxFrom}, ${idxTo}]`
        );
        errorArr.push({
          idxFrom: token.start,
          idxTo: token.end,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [[idxFrom + token.start, idxTo + token.start, "<!--["]]
          }
        });
      }
    });
  }

  // check the ending part:
  if (token.kind === "not") {
    console.log(`112 validateCommentOpening(): "not"-kind comment clauses`);
    // if ending of the opening is malformed:
    findMalformed(token.value, "]><!-->", ({ idxFrom, idxTo }) => {
      console.log(
        `116 validateCommentOpening(): DETECTED MALFORMED RANGE [${idxFrom}, ${idxTo}]`
      );
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [[idxFrom + token.start, idxTo + token.start, "]><!-->"]]
        }
      });
    });
  } else if (token.kind === "only") {
    console.log(`128 validateCommentOpening(): "only"-kind comment clauses`);
    // plan: take the value, chomp all ">" and "]" characters
    // from the end of it, then if anything's suspicious,
    // replace all that with tight "]>".

    for (let i = token.value.length; i--; ) {
      if (token.value[i].trim().length && !">]".includes(token.value[i])) {
        if (token.value.slice(i + 1) !== "]>") {
          errorArr.push({
            idxFrom: token.start,
            idxTo: token.end,
            message: "Malformed opening comment tag.",
            fix: {
              ranges: [[i + 1 + token.start, token.end, "]>"]]
            }
          });
        }
        break;
      }
    }
  }

  return errorArr;
}

export default validateCommentOpening;
