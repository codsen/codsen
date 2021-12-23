import { left } from "string-left-right";

import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

// rule: tag-bad-self-closing
// -----------------------------------------------------------------------------

// flags up all self-closing non-void tags, for example: <table ... />

function tagBadSelfClosing(context: Linter): RuleObjType {
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ tagBadSelfClosing() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `022 tagBadSelfClosing(): ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
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
        DEV &&
          console.log(
            `036 tagBadSelfClosing(): ${`\u001b[${31}m${`BAD SELF-CLOSING SLASH!`}\u001b[${39}m`}`
          );
        let idxFrom =
          node.start +
          (left(
            node.value,
            left(node.value, node.value.length - 1) as number
          ) as number) +
          1;
        let idxTo = node.start + node.value.length - 1;

        DEV &&
          console.log(
            `049 tagBadSelfClosing(): ${`\u001b[${33}m${`idxFrom`}\u001b[${39}m`} = ${JSON.stringify(
              idxFrom,
              null,
              4
            )}`
          );
        DEV &&
          console.log(
            `057 tagBadSelfClosing(): ${`\u001b[${33}m${`idxTo`}\u001b[${39}m`} = ${JSON.stringify(
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
