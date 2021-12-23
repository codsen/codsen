// rule: comment-mismatching-pair
// -----------------------------------------------------------------------------

import { traverse } from "ast-monkey-traverse";
// import { pathNext, pathPrev, pathUp } from "ast-monkey-util";
import { pathPrev } from "ast-monkey-util";
import op from "object-path";

import { Linter, RuleObjType } from "../../linter";
import { isObj } from "../../util/util";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function commentMismatchingPair(context: Linter): RuleObjType {
  return {
    ast(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ commentMismatchingPair() ███████████████████████████████████████`
        );

      // we have raw AST, we need to traverse it and find mismatching-kind pairs
      // of type="comment" tokens, only-not or not-only

      traverse(
        node,
        // (key, val, innerObj, stop) => {
        (key, val, innerObj) => {
          let current = val !== undefined ? val : key;
          if (isObj(current)) {
            // monkey will traverse every key, every string within.
            // We need to pick the objects of a type we need: "comment"
            // DEV && console.log(
            //   `210 ██ ${`\u001b[${35}m${`linter/tagCb():`}\u001b[${39}m`} PING ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            //     current,
            //     null,
            //     4
            //   )}`
            // );

            if (current.type === "comment" && current.closing) {
              DEV &&
                console.log(
                  `045 FIY ${`\u001b[${33}m${`current token is closing`}\u001b[${39}m`}: ${JSON.stringify(
                    current,
                    null,
                    4
                  )}`
                );

              let previousToken = op.get(
                node,
                pathPrev(innerObj.path) as string
              );
              DEV &&
                console.log(
                  `058 ${`\u001b[${33}m${`previousToken`}\u001b[${39}m`} = ${JSON.stringify(
                    previousToken,
                    null,
                    4
                  )}`
                );

              if (
                isObj(previousToken) &&
                previousToken.type === "comment" &&
                !previousToken.closing
              ) {
                if (previousToken.kind === "not" && current.kind === "only") {
                  DEV &&
                    console.log(
                      `073 ${`\u001b[${31}m${`ERROR: head is "not"-kind comment, current token, a tail, is "only"`}\u001b[${39}m`}`
                    );

                  // turn tail into "not"-kind, add front part (<!--)

                  // Out of all raised errors, only one can have "ranges.fix" -
                  // all other fixes, if any present, will be removed.
                  // This is to simplify the rule fix clashing.
                  context.report({
                    ruleId: "comment-mismatching-pair",
                    keepSeparateWhenFixing: true,
                    message: `Add "<!--".`,
                    idxFrom: current.start,
                    idxTo: current.end,
                    fix: {
                      ranges: [[current.start, current.start, "<!--"]],
                    },
                  });
                } else if (
                  previousToken.kind === "only" &&
                  current.kind === "not"
                ) {
                  DEV &&
                    console.log(
                      `097 ${`\u001b[${31}m${`ERROR: head is "only"-kind comment, current token, a tail, is "not"`}\u001b[${39}m`}`
                    );

                  // turn tail into "only"-kind, remove front part (<!--)

                  // Out of all raised errors, only one can have "ranges.fix" -
                  // all other fixes, if any present, will be removed.
                  // This is to simplify the rule fix clashing.
                  context.report({
                    ruleId: "comment-mismatching-pair",
                    keepSeparateWhenFixing: true,
                    message: `Remove "<!--".`,
                    idxFrom: current.start,
                    idxTo: current.end,
                    fix: {
                      ranges: [[current.start, current.end, "<![endif]-->"]],
                    },
                  });
                }
              }
            }
          }
          return current;
        }
      );
    },
  };
}

export default commentMismatchingPair;
