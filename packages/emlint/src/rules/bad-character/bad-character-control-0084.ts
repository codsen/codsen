import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-control-0084
// -----------------------------------------------------------------------------

// Catches raw character "CONTROL" (hex 84):
// https://www.fileformat.info/info/unicode/char/0084/index.htm

function badCharacterControl0084(context: Linter): RuleObjType {
  const charCode = 132;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - CONTROL.",
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

export default badCharacterControl0084;
