import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-interlinear-annotation-terminator
// -----------------------------------------------------------------------------

// Catches raw character "INTERLINEAR ANNOTATION TERMINATOR":
// https://www.fileformat.info/info/unicode/char/fffb/index.htm

function badCharacterInterlinearAnnotationTerminator(
  context: Linter
): RuleObjType {
  let charCode = 65531;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - INTERLINEAR ANNOTATION TERMINATOR.",
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

export default badCharacterInterlinearAnnotationTerminator;
