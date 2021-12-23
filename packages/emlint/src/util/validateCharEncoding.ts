import he from "he";
import { notEmailFriendly } from "html-entities-not-email-friendly";

import { Linter } from "../linter";
// import { ErrorObj } from "./commonTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function validateCharEncoding(
  charStr: string, // string value of a character
  posIdx: number, // where this character is located (like token.start)
  mode: "named" | "numeric" = "named",
  context: Linter
): void {
  let encodedChr = he.encode(charStr, {
    useNamedReferences: mode === "named",
  });
  if (
    Object.keys(notEmailFriendly).includes(
      encodedChr.slice(1, encodedChr.length - 1)
    )
  ) {
    encodedChr = `&${
      notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)]
    };`;
  }

  DEV &&
    console.log(
      `031 ${`\u001b[${33}m${`encodedChr`}\u001b[${39}m`} = ${JSON.stringify(
        encodedChr,
        null,
        4
      )}`
    );

  let charName = "";
  if (charStr.charCodeAt(0) === 160) {
    charName = " no-break space";
  } else if (charStr.charCodeAt(0) === 38) {
    charName = " ampersand";
  } else if (charStr.charCodeAt(0) === 60) {
    charName = " less than";
  } else if (charStr.charCodeAt(0) === 62) {
    charName = " greater than";
  } else if (charStr.charCodeAt(0) === 34) {
    charName = " double quotes";
  } else if (charStr.charCodeAt(0) === 163) {
    charName = " pound sign";
  }

  context.report({
    ruleId: "character-encode",
    message: `Unencoded${charName} character.`,
    idxFrom: posIdx,
    idxTo: posIdx + 1,
    fix: {
      ranges: [[posIdx, posIdx + 1, encodedChr]],
    },
  });
}

export default validateCharEncoding;
