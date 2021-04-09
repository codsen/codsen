import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-word-joiner
// -----------------------------------------------------------------------------

// Catches raw character "WORD JOINER":
// https://www.fileformat.info/info/unicode/char/2060/index.htm

function badCharacterWordJoiner(context: Linter): RuleObjType {
  const charCode = 8288;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - WORD JOINER.",
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

export default badCharacterWordJoiner;
