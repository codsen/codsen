import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-first-strong-isolate
// -----------------------------------------------------------------------------

// Catches raw character "FIRST STRONG ISOLATE":
// https://www.fileformat.info/info/unicode/char/2068/index.htm

function badCharacterFirstStrongIsolate(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 8296) {
        context.report({
          ruleId: "bad-character-first-strong-isolate",
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
