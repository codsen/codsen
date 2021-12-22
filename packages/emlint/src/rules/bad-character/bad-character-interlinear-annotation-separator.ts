import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-interlinear-annotation-separator
// -----------------------------------------------------------------------------

// Catches raw character "INTERLINEAR ANNOTATION SEPARATOR":
// https://www.fileformat.info/info/unicode/char/fffa/index.htm

function badCharacterInterlinearAnnotationSeparator(
  context: Linter
): RuleObjType {
  let charCode = 65530;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INTERLINEAR ANNOTATION SEPARATOR.",
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

export default badCharacterInterlinearAnnotationSeparator;
