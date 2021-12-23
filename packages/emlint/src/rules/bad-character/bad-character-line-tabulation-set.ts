import { Linter, RuleObjType } from "../../linter";
import { badChars } from "../../util/bad-character-all";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: bad-character-line-tabulation-set
// -----------------------------------------------------------------------------

// Catches raw character "LINE TABULATION SET":
// https://www.fileformat.info/info/unicode/char/008a/index.htm

function badCharacterLineTabulationSet(context: Linter): RuleObjType {
  let charCode = 138;
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === charCode) {
        context.report({
          ruleId: badChars.get(charCode) as string,
          message: "Bad character - LINE TABULATION SET.",
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

export default badCharacterLineTabulationSet;
