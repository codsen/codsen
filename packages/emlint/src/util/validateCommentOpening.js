// import { right } from "string-left-right";
import checkForWhitespace from "./checkForWhitespace";

function validateCommentClosing(str, idxOffset, opts) {
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);

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

  // TODO

  return errorArr;
}

export default validateCommentClosing;
