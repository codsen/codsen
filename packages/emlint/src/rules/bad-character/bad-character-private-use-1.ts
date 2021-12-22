import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-private-use-1
// -----------------------------------------------------------------------------

// Catches raw character "PRIVATE USE ONE":
// https://www.fileformat.info/info/unicode/char/0091/index.htm

function badCharacterPrivateUseOne(context: Linter): RuleObjType {
  let charCode = 145;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - PRIVATE USE ONE.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]], // just delete it
          },
        });
      }
    },
  };
}

export default badCharacterPrivateUseOne;
