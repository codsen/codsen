import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-interlinear-annotation-separator
// -----------------------------------------------------------------------------

// Catches raw character "INTERLINEAR ANNOTATION SEPARATOR":
// https://www.fileformat.info/info/unicode/char/fffa/index.htm

function badCharacterInterlinearAnnotationSeparator(
  context: Linter
): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 65530) {
        context.report({
          ruleId: "bad-character-interlinear-annotation-separator",
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
