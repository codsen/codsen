import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-interlinear-annotation-anchor
// -----------------------------------------------------------------------------

// Catches raw character "INTERLINEAR ANNOTATION ANCHOR":
// https://www.fileformat.info/info/unicode/char/fff9/index.htm

function badCharacterInterlinearAnnotationAnchor(context: Linter): RuleObjType {
  const charCode = 65529;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INTERLINEAR ANNOTATION ANCHOR.",
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

export default badCharacterInterlinearAnnotationAnchor;
