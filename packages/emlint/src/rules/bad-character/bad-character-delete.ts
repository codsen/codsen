import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-delete
// -----------------------------------------------------------------------------

// Catches raw character "DELETE":
// https://www.fileformat.info/info/unicode/char/007f/index.htm

function badCharacterDelete(context: Linter): RuleObjType {
  const charCode = 127;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - DELETE.",
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

export default badCharacterDelete;
