import { left } from "string-left-right";

import { Linter, RuleObjType } from "../../linter";

// rule: tag-bad-self-closing
// -----------------------------------------------------------------------------

// flags up all self-closing non-void tags, for example: <table ... />

function tagBadSelfClosing(context: Linter): RuleObjType {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ tagBadSelfClosing() ███████████████████████████████████████`
      );
      console.log(
        `017 tagBadSelfClosing(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (
        !node.void &&
        node.value.endsWith(">") &&
        node.value[left(node.value, node.value.length - 1) as number] === "/"
      ) {
        console.log(
          `030 tagBadSelfClosing(): ${`\u001b[${31}m${`BAD SELF-CLOSING SLASH!`}\u001b[${39}m`}`
        );
        let idxFrom =
          node.start +
          (left(
            node.value,
            left(node.value, node.value.length - 1) as number
          ) as number) +
          1;
        let idxTo = node.start + node.value.length - 1;

        console.log(
          `042 tagBadSelfClosing(): ${`\u001b[${33}m${`idxFrom`}\u001b[${39}m`} = ${JSON.stringify(
            idxFrom,
            null,
            4
          )}`
        );
        console.log(
          `049 tagBadSelfClosing(): ${`\u001b[${33}m${`idxTo`}\u001b[${39}m`} = ${JSON.stringify(
            idxTo,
            null,
            4
          )}`
        );
        context.report({
          ruleId: "tag-bad-self-closing",
          message: "Remove the slash.",
          idxFrom,
          idxTo,
          fix: { ranges: [[idxFrom, idxTo]] },
        });
      }
    },
  };
}

export default tagBadSelfClosing;
