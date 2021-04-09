import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-left-to-right-isolate
// -----------------------------------------------------------------------------

// Catches raw character "LEFT-TO-RIGHT ISOLATE":
// https://www.fileformat.info/info/unicode/char/2066/index.htm

function badCharacterLeftToRightIsolate(context: Linter): RuleObjType {
  const charCode = 8294;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - LEFT-TO-RIGHT ISOLATE.",
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

export default badCharacterLeftToRightIsolate;
