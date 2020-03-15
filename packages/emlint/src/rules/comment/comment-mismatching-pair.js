// rule: comment-mismatching-pair
// -----------------------------------------------------------------------------

import traverse from "ast-monkey-traverse";
// import { pathNext, pathPrev, pathUp } from "ast-monkey-util";
import { pathPrev } from "ast-monkey-util";
import { isObj } from "../../util/util";
import op from "object-path";

function commentMismatchingPair(context, ...opts) {
  return {
    ast: function(node) {
      console.log(
        `███████████████████████████████████████ commentMismatchingPair() ███████████████████████████████████████`
      );
      console.log(
        `017 commentMismatchingPair(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      // console.log(
      //   `021 commentMismatchingPair(): FIY, ${`\u001b[${32}m${`INCOMING`}\u001b[${39}m`} ${`\u001b[${33}m${`whole AST`}\u001b[${39}m`} = ${JSON.stringify(
      //     node,
      //     null,
      //     4
      //   )}`
      // );

      // we have raw AST, we need to traverse it and find mismatching-kind pairs
      // of type="comment" tokens, only-not or not-only

      traverse(
        node,
        // (key, val, innerObj, stop) => {
        (key, val, innerObj) => {
          const current = val !== undefined ? val : key;
          if (isObj(current)) {
            // monkey will traverse every key, every string within.
            // We need to pick the objects of a type we need: "comment"
            // console.log(
            //   `210 ██ ${`\u001b[${35}m${`linter/tagCb():`}\u001b[${39}m`} PING ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            //     current,
            //     null,
            //     4
            //   )}`
            // );

            if (current.type === "comment" && current.closing) {
              console.log(
                `052 FIY ${`\u001b[${33}m${`current token is closing`}\u001b[${39}m`}: ${JSON.stringify(
                  current,
                  null,
                  4
                )}`
              );

              const previousToken = op.get(node, pathPrev(innerObj.path));
              console.log(
                `061 ${`\u001b[${33}m${`previousToken`}\u001b[${39}m`} = ${JSON.stringify(
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
                  console.log(
                    `075 ${`\u001b[${31}m${`ERROR: head is "not"-kind comment, current token, a tail, is "only"`}\u001b[${39}m`}`
                  );
                  // turn tail into "not"-kind, add front part (<!--)
                  context.report({
                    ruleId: "comment-mismatching-pair",
                    message: `Add "<!--".`,
                    idxFrom: current.start,
                    idxTo: current.end,
                    fix: {
                      ranges: [[current.start, current.start, "<!--"]]
                    }
                  });
                } else if (
                  previousToken.kind === "only" &&
                  current.kind === "not"
                ) {
                  console.log(
                    `092 ${`\u001b[${31}m${`ERROR: head is "only"-kind comment, current token, a tail, is "not"`}\u001b[${39}m`}`
                  );
                  // turn tail into "only"-kind, remove front part (<!--)
                  context.report({
                    ruleId: "comment-mismatching-pair",
                    message: `Remove "<!--".`,
                    idxFrom: current.start,
                    idxTo: current.end,
                    fix: {
                      ranges: [[current.start, current.end, "<![endif]-->"]]
                    }
                  });
                }
              }
            }
          }
          return current;
        }
      );

      //   context.report(
      //     Object.assign({}, errorObj, {
      //       ruleId: "comment-mismatching-pair"
      //     })
    }
  };
}

export default commentMismatchingPair;
