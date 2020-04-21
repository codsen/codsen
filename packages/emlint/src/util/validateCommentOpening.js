import findMalformed from "string-find-malformed";
import { matchRight } from "string-match-left-right";
import splitByWhitespace from "./splitByWhitespace";

function validateCommentOpening(token) {
  const reference = {
    simple: /<!--/g,
    only: /<!--\[[^\]]+\]>/g,
    not: /<!--\[[^\]]+\]><!-->/g,
  };

  console.log(
    `013 validateCommentOpening(): ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`026 validateCommentOpening(): REGEX PASSES, EARLY EXIT`);
    return [];
  }

  const errorArr = [];

  // assemble string without whitespace:
  let valueWithoutWhitespace = "";

  if (token.kind === "simple") {
    console.log(`036 validateCommentOpening(): simple comment clauses`);
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
            ranges: [
              [whitespaceFrom + token.start, whitespaceTo + token.start],
            ],
          },
        });
      }
    );
  }

  console.log(
    `062 ██ ${`\u001b[${33}m${`valueWithoutWhitespace`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`077 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
    return errorArr;
  }

  // if processing continues, it means something more is wrong
  console.log(`082 validateCommentOpening(): something is wrong`);
  console.log(
    `084 validateCommentOpening(): errorArr so far: ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  let wrongBracketType;

  // check the opening tag's beginning:
  if (["only", "not"].includes(token.kind)) {
    // if beginning is malformed:
    findMalformed(token.value, "<!--[", ({ idxFrom, idxTo }) => {
      let finalIdxTo = idxTo;
      // take precaution, "not" type openings have very similar
      // ending, <!--> which will get caught as well here!
      if (idxFrom === token.start) {
        console.log(
          `102 validateCommentOpening(): DETECTED MALFORMED RANGE [${idxFrom}, ${idxTo}]`
        );
        console.log(
          `105 ███████████████████████████████████████ ${`\u001b[${33}m${`token.value[idxFrom]`}\u001b[${39}m`} = ${JSON.stringify(
            token.value[idxFrom],
            null,
            4
          )}`
        );
        if (
          // imagine, we searched for "<!--[" in "<!--{if !mso}><!-->" -
          // the idxTo is currently at "{" - search stopped at "{" and caught
          // only "<!--", the frontal part.
          // We check, maybe there's wrong type opening bracket, followed by "if"
          "{(".includes(token.value[idxTo]) &&
          // and "if" follows
          matchRight(token.value, idxTo, "if", {
            trimBeforeMatching: true,
          })
        ) {
          wrongBracketType = true;
          finalIdxTo += 1;
          console.log(
            `125 validateCommentOpening(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} finalIdxTo = ${finalIdxTo}`
          );
        }
        errorArr.push({
          idxFrom: token.start,
          idxTo: token.end,
          message: "Malformed opening comment tag.",
          fix: {
            ranges: [
              [idxFrom + token.start, finalIdxTo + token.start, "<!--["],
            ],
          },
        });
      }
    });
  }

  // check the ending part:
  if (token.kind === "not") {
    console.log(`144 validateCommentOpening(): "not"-kind comment clauses`);
    // if ending of the opening is malformed:
    findMalformed(token.value, "]><!-->", ({ idxFrom, idxTo }) => {
      let finalIdxFrom = idxFrom;
      if (
        "})".includes(token.value[idxFrom - 1]) &&
        // also require that token would start with:
        // "<!--{if" or "<!--(if"
        wrongBracketType
      ) {
        finalIdxFrom -= 1;
      }

      console.log(
        `158 validateCommentOpening(): DETECTED MALFORMED RANGE [${idxFrom}, ${idxTo}]`
      );
      errorArr.push({
        idxFrom: token.start,
        idxTo: token.end,
        message: "Malformed opening comment tag.",
        fix: {
          ranges: [
            [finalIdxFrom + token.start, idxTo + token.start, "]><!-->"],
          ],
        },
      });
    });
  } else if (token.kind === "only") {
    console.log(`172 validateCommentOpening(): "only"-kind comment clauses`);
    // plan: take the value, chomp all ">" and "]" characters
    // from the end of it, then if anything's suspicious,
    // replace all that with tight "]>".

    for (let i = token.value.length; i--; ) {
      if (token.value[i].trim().length && !">]".includes(token.value[i])) {
        // if heads already report wrong bracket type, extend by one character
        // and remove that bracket too
        let rangeStart = i + 1;
        if ("})".includes(token.value[i]) && wrongBracketType) {
          rangeStart -= 1;
        }
        if (token.value.slice(i + 1) !== "]>") {
          errorArr.push({
            idxFrom: token.start,
            idxTo: token.end,
            message: "Malformed opening comment tag.",
            fix: {
              ranges: [[rangeStart + token.start, token.end, "]>"]],
            },
          });
        }
        break;
      }
    }
  }

  return errorArr;
}

export default validateCommentOpening;
