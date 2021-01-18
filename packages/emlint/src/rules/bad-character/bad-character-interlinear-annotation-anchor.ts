import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-interlinear-annotation-anchor
// -----------------------------------------------------------------------------

// Catches raw character "INTERLINEAR ANNOTATION ANCHOR":
// https://www.fileformat.info/info/unicode/char/fff9/index.htm

function badCharacterInterlinearAnnotationAnchor(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 65529) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-anchor",
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
