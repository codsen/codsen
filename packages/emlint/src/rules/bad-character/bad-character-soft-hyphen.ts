import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-soft-hyphen
// -----------------------------------------------------------------------------

// Catches raw character "SOFT HYPHEN":
// https://www.fileformat.info/info/unicode/char/00ad/index.htm

function badCharacterSoftHyphen(context: Linter): RuleObjType {
  const charCode = 173;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - SOFT HYPHEN.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterSoftHyphen;
