import { right } from "string-left-right";
import splitByWhitespace from "./splitByWhitespace";

function validateCommentClosing(str, idxOffset, opts) {
  const errorArr = [];

  console.log(
    `008 validateCommentClosing(): ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  console.log(
    `015 validateCommentClosing(): ${`\u001b[${33}m${`idxOffset`}\u001b[${39}m`} = ${JSON.stringify(
      idxOffset,
      null,
      4
    )}`
  );
  console.log(
    `022 validateCommentClosing(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // first, tackle any inner whitespace
  splitByWhitespace(str, null, ([from, to]) => {
    errorArr.push({
      ruleId: "comment-only-closing-malformed",
      idxFrom: idxOffset,
      idxTo: str.length + idxOffset,
      message: "Remove whitespace.",
      fix: {
        ranges: [[from + idxOffset, to + idxOffset]]
      }
    });
  });

  if (str[0] === "<") {
    const secondCharIdx = right(str, 0);
    if (str[secondCharIdx] !== "!") {
      // report missing excl. mark
      errorArr.push({
        ruleId: "comment-only-closing-malformed",
        idxFrom: idxOffset,
        idxTo: str.length + idxOffset,
        message: "Exclamation mark missing.",
        fix: {
          ranges: [[1 + idxOffset, 1 + idxOffset, "!"]]
        }
      });
    } else {
      // TODO
    }
  }

  return errorArr;
}

export default validateCommentClosing;
