// rule: comment-conditional-nested
// -----------------------------------------------------------------------------

import traverse from "ast-monkey-traverse";
// import { pathPrev } from "ast-monkey-util";
import { isObj } from "../../util/util";
// import op from "object-path";

// function commentConditionalNested(context, ...opts) {
function commentConditionalNested(context) {
  return {
    ast: function (node) {
      console.log(
        `███████████████████████████████████████ commentConditionalNested() ███████████████████████████████████████`
      );
      console.log(
        `017 commentConditionalNested(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      const pathsWithOpeningComments = [];
      console.log(
        `${`\u001b[${90}m${`----------------------------------------`}\u001b[${39}m`}`
      );
      console.log(
        `${`\u001b[${90}m${`           AST TRAVERSAL STARTS`}\u001b[${39}m`}`
      );
      traverse(
        node,
        // (key, val, innerObj, stop) => {
        (key, val, innerObj) => {
          const current = val !== undefined ? val : key;
          if (isObj(current)) {
            // monkey will traverse every key, every string within.
            // We need to pick the objects of a type we need: "comment"
            console.log(
              `040 ██ ${`\u001b[${35}m${`commentConditionalNested()/traverse():`}\u001b[${39}m`} PING ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
                current,
                null,
                4
              )}`
            );

            if (current.type === "comment") {
              console.log(
                `049 FIY ${`\u001b[${33}m${`current token is opening`}\u001b[${39}m`}: ${JSON.stringify(
                  current,
                  null,
                  4
                )}`
              );
              // first, check, does any opening comment path strings match
              // the start of the current path - because if it is, it's nested
              // and should be reported
              if (
                pathsWithOpeningComments.some((pathStr) =>
                  innerObj.path.startsWith(pathStr)
                )
              ) {
                console.log(
                  `064 ${`\u001b[${31}m${`ERROR: comment inside comment!`}\u001b[${39}m`}`
                );
                context.report({
                  ruleId: "comment-conditional-nested",
                  message: `Don't nest comments.`,
                  idxFrom: current.start,
                  idxTo: current.end,
                  fix: null,
                });
              }

              if (!current.closing) {
                pathsWithOpeningComments.push(innerObj.path);
              }
            }

            console.log(
              `\u001b[${90}m${`██ pathsWithOpeningComments = ${JSON.stringify(
                pathsWithOpeningComments,
                null,
                4
              )}`}\u001b[${39}m`
            );
            console.log(
              `${`\u001b[${90}m${`----------------------------------------`}\u001b[${39}m`}`
            );
          }
          return current;
        }
      );
    },
  };
}

export default commentConditionalNested;
