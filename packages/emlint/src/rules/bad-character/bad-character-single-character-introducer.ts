import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-single-character-introducer
// -----------------------------------------------------------------------------

// Catches raw character "SINGLE CHARACTER INTRODUCER":
// https://www.fileformat.info/info/unicode/char/009a/index.htm

function badCharacterSingleCharacterIntroducer(context: Linter): RuleObjType {
  const charCode = 154;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - SINGLE CHARACTER INTRODUCER.",
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

export default badCharacterSingleCharacterIntroducer;
