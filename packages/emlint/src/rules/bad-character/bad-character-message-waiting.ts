import { Linter, RuleObjType } from "../../linter";

// rule: bad-character-message-waiting
// -----------------------------------------------------------------------------

// Catches raw character "MESSAGE WAITING":
// https://www.fileformat.info/info/unicode/char/0095/index.htm

function badCharacterMessageWaiting(context: Linter): RuleObjType {
  return {
    character({ chr, i }) {
      if (chr.charCodeAt(0) === 149) {
        context.report({
          ruleId: "bad-character-message-waiting",
          message: "Bad character - MESSAGE WAITING.",
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

export default badCharacterMessageWaiting;
