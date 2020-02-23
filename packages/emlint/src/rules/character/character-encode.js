// rule: character-encode
// -----------------------------------------------------------------------------

import he from "he";
import {
  // find,
  // get,
  // set,
  // drop,
  // del,
  // arrayFirstOnly,
  traverse
} from "ast-monkey";
import objectPath from "object-path";
import { notEmailFriendly } from "html-entities-not-email-friendly";
import { isObj, pathTwoUp, isAnEnabledValue } from "../../util/util";

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
        `045 ${`\u001b[${33}m${`encodedChr`}\u001b[${39}m`} = ${JSON.stringify(
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
    ast: function(ast) {
      console.log(
        `███████████████████████████████████████ characterEncode() ███████████████████████████████████████`
      );
      console.log(
        `${`\u001b[${36}m${`ast: ${JSON.stringify(
          ast,
          null,
          4
        )}`}\u001b[${39}m`}`
      );

      // call the monkey,
      // we'll traverse the AST and check each text node separately
      traverse(ast, (key, val, innerObj) => {
        const current = val !== undefined ? val : key;
        if (!isObj(current) || current.type !== "text") {
          // we're interested in only tokens, they are objects
          // because monkey will traverse everything, including each key
          return current;
        }
        console.log(`███████████████████████████████████████`);
        console.log(
          `${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            current,
            null,
            4
          )}; ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
            innerObj,
            null,
            4
          )}`
        );

        // settle the mode, is it "always" or a default, "never"
        let mode = "named";
        // opts array comes already sliced, without 1st element, so opts value
        // is 0th (and onwards if more)
        if (Array.isArray(opts) && ["named", "numeric"].includes(opts[0])) {
          mode = opts[0];
        }
        console.log(
          `157 characterEncode(): ${`\u001b[${35}m${`calculated mode`}\u001b[${39}m`} = "${mode}"`
        );

        // ACTION

        // precaution - if there are instances of "->" in this text token,
        // that might be broken closing comment tag, for example, "a<!--b->c"
        let grandparentToken;
        if (current.value.includes("->")) {
          // don't waste resources if this pattern "->" is not present!
          console.log(
            `168 characterEncode(): ${`\u001b[${33}m${`innerObj.path`}\u001b[${39}m`} = ${JSON.stringify(
              innerObj.path,
              null,
              4
            )}`
          );
          const pathTwoUpVal = pathTwoUp(innerObj.path);
          grandparentToken = objectPath.get(ast, pathTwoUpVal);
          console.log(
            `177 ██ characterEncode(): ${`\u001b[${33}m${`grandparentToken`}\u001b[${39}m`} = ${JSON.stringify(
              grandparentToken,
              null,
              4
            )}`
          );
        }
        if (
          innerObj.parentType === "array" &&
          isObj(grandparentToken) &&
          grandparentToken.type === "comment" &&
          grandparentToken.kind === "simple" &&
          !grandparentToken.closing &&
          isAnEnabledValue(
            context.processedRulesConfig["comment-closing-malformed"]
          )
        ) {
          console.log(
            `195 ${`\u001b[${31}m${`WARNING - looks like broken closing comment tag`}\u001b[${39}m`}`
          );
          const suspiciousEndingStartsAt = current.value.indexOf("->");

          context.report({
            ruleId: "comment-closing-malformed",
            message: `Malformed closing comment tag.`,
            idxFrom: current.start + suspiciousEndingStartsAt,
            idxTo: current.start + suspiciousEndingStartsAt + 2,
            fix: {
              ranges: [
                [
                  current.start + suspiciousEndingStartsAt,
                  current.start + suspiciousEndingStartsAt + 2,
                  "-->"
                ]
              ]
            }
          });

          if (suspiciousEndingStartsAt < current.value.length - 2) {
            console.log(`216 characterEncode(): pass text chunk that follows`);
            processStr(
              current.value.slice(suspiciousEndingStartsAt + 2),
              current.start + suspiciousEndingStartsAt + 2,
              context,
              mode
            );
          }
        } else {
          // send the whole string value to be processed:
          processStr(current.value, current.start, context, mode);
        }

        return current;
      });
    }
  };
}

export default characterEncode;
