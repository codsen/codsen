// rule: character-encode
// -----------------------------------------------------------------------------

import he from "he";
import { notEmailFriendly } from "html-entities-not-email-friendly";
import { isAnEnabledValue } from "../../util/util";

function processStr(str, offset, context, mode) {
  // traverse the value of this text node:
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      (str[i].charCodeAt(0) > 127 || `<>"&`.includes(str[i])) &&
      (str[i].charCodeAt(0) !== 160 ||
        !Object.keys(context.processedRulesConfig).includes(
          "bad-character-non-breaking-space"
        ) ||
        !isAnEnabledValue(
          context.processedRulesConfig["bad-character-non-breaking-space"]
        ))
    ) {
      let encodedChr = he.encode(str[i], {
        useNamedReferences: mode === "named"
      });
      if (
        Object.keys(notEmailFriendly).includes(
          encodedChr.slice(1, encodedChr.length - 1)
        )
      ) {
        encodedChr = `&${
          notEmailFriendly[encodedChr.slice(1, encodedChr.length - 1)]
        };`;
      }

      console.log(
        `035 ${`\u001b[${33}m${`encodedChr`}\u001b[${39}m`} = ${JSON.stringify(
          encodedChr,
          null,
          4
        )}`
      );

      let charName = "";
      if (str[i].charCodeAt(0) === 160) {
        charName = " no-break space";
      } else if (str[i].charCodeAt(0) === 38) {
        charName = " ampersand";
      } else if (str[i].charCodeAt(0) === 60) {
        charName = " less than";
      } else if (str[i].charCodeAt(0) === 62) {
        charName = " greater than";
      } else if (str[i].charCodeAt(0) === 34) {
        charName = " double quotes";
      } else if (str[i].charCodeAt(0) === 163) {
        charName = " pound sign";
      }

      context.report({
        ruleId: "character-encode",
        message: `Unencoded${charName} character.`,
        idxFrom: i + offset,
        idxTo: i + 1 + offset,
        fix: {
          ranges: [[i + offset, i + 1 + offset, encodedChr]]
        }
      });
    }
  }
}

// Catches characters outside ASCII and suggests encoding.
// Applies only to "text" scope

// This is rule to catch unencoded characters. If we relied on the tokenizer
// output only, just the particular chunk of "text" type token, we would
// lost the opportunity to catch whole class of errors; that would put more
// strain and responsibility onto the tokenizer.
//
// For example, imagine the case of missing dash, a<!--b->c
//
// Tokenizer will "think" that "b->c" is text.
//
// Here, we come and process this token.
//
// If we didn't process from AST, we could not tell, is that legit unencoded
// characters (piece of text) or is it broken closing comment tag. Without AST
// we can't look what was before! Well, we can simply traverse backwards but
// consider nested comments:
//
// a<!--<div><table><tr><td>z</td></tr></table></div>->c
//
// With its own errors inside that comment!
//
// We can't traverse left and from "->" and check, is the first encountered
// opening bracket followed by exclamation mark and two dashes...
//
// Thus, we use AST instead of listening on "character" being emitted:
//
// function characterEncode(context, ...opts) {
//   return {
//     character: function({ type, chr, i }) {
//     ...

function characterEncode(context, ...opts) {
  return {
    text: function(token) {
      console.log(
        `███████████████████████████████████████ characterEncode() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${36}m${`token: ${JSON.stringify(
          token,
          null,
          4
        )}`}\u001b[${39}m`}`
      );

      // settle the mode, is it "always" or a default, "never"
      let mode = "named";
      // opts array comes already sliced, without 1st element, so opts value
      // is 0th (and onwards if more)
      if (Array.isArray(opts) && ["named", "numeric"].includes(opts[0])) {
        mode = opts[0];
      }
      console.log(
        `125 characterEncode(): ${`\u001b[${35}m${`calculated mode`}\u001b[${39}m`} = "${mode}"`
      );

      // ACTION

      processStr(token.value, token.start, context, mode);
    }
  };
}

export default characterEncode;
