import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// rule: bad-character-ogham-space-mark
// -----------------------------------------------------------------------------

// Catches raw character "OGHAM SPACE MARK":
// https://www.fileformat.info/info/unicode/char/1680/index.htm

function badCharacterOghamSpaceMark(context: Linter): RuleObjType {
  let charCode = 5760;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - OGHAM SPACE MARK.",
          idxFrom: i,
          idxTo: i + 1,
          fix: {
            ranges: [[i, i + 1, " "]], // replace with a normal space
          },
        });
      }
    },
  };
}

export default badCharacterOghamSpaceMark;
