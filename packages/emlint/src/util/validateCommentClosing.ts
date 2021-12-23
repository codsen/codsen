import splitByWhitespace from "./splitByWhitespace";
import { CommentToken } from "../../../codsen-tokenizer/src/util/util";
import { ErrorObj } from "./commonTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function validateCommentClosing(token: CommentToken): ErrorObj[] {
  let reference = {
    simple: "-->",
    only: "<![endif]-->",
    not: "<!--<![endif]-->",
  };

  DEV &&
    console.log(
      `017 validateCommentClosing(): ${`\u001b[${33}m${`token`}\u001b[${39}m`} = ${JSON.stringify(
        token,
        null,
        4
      )}`
    );

  // if all is fine, end quick
  if (
    (token.kind === "simple" && token.value === "-->") ||
    (token.kind === "only" && token.value === "<![endif]-->") ||
    (token.kind === "not" && token.value === "<!--<![endif]-->")
  ) {
    return [];
  }

  let errorArr: ErrorObj[] = [];

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
          ranges: [[whitespaceFrom + token.start, whitespaceTo + token.start]],
        },
      });
    }
  );

  DEV &&
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
    (token.kind === "simple" && valueWithoutWhitespace === "-->") ||
    (token.kind === "only" && valueWithoutWhitespace === "<![endif]-->") ||
    (token.kind === "not" && valueWithoutWhitespace === "<!--<![endif]-->")
  ) {
    DEV &&
      console.log(
        `078 validateCommentClosing(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
      );
    return errorArr;
  }

  // if processing continues, it means something more is wrong
  DEV && console.log(`084 validateCommentClosing(): something is wrong`);
  DEV &&
    console.log(
      `087 validateCommentClosing(): errorArr so far: ${JSON.stringify(
        errorArr,
        null,
        4
      )}`
    );
  errorArr.push({
    idxFrom: token.start,
    idxTo: token.end,
    message: "Malformed closing comment tag.",
    fix: {
      ranges: [[token.start, token.end, (reference as any)[token.kind]]],
    },
  });

  return errorArr;
}

export default validateCommentClosing;
