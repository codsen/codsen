import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-first-strong-isolate
// -----------------------------------------------------------------------------

// Catches raw character "FIRST STRONG ISOLATE":
// https://www.fileformat.info/info/unicode/char/2068/index.htm

function badCharacterFirstStrongIsolate(context: Linter): RuleObjType {
  let charCode = 8296;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - FIRST STRONG ISOLATE.",
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

export default badCharacterFirstStrongIsolate;
