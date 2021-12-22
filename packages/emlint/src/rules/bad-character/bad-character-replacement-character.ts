import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-replacement-character
// -----------------------------------------------------------------------------

// Catches raw character "REPLACEMENT CHARACTER":
// https://www.fileformat.info/info/unicode/char/fffd/index.htm

function badCharacterReplacementCharacter(context: Linter): RuleObjType {
  let charCode = 65533;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - REPLACEMENT CHARACTER.",
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

export default badCharacterReplacementCharacter;
