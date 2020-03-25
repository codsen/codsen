// rule: tag-is-present
// -----------------------------------------------------------------------------

import matcher from "matcher";

// it flags up any tags from the blacklist

function tagIsPresent(context, ...opts) {
  return {
    tag: function (node) {
      console.log(
        `███████████████████████████████████████ tagIsPresent() ███████████████████████████████████████`
      );
      console.log(
        `015 tagIsPresent(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `022 tagIsPresent(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (Array.isArray(opts) && opts.length) {
        const temp = matcher([node.tagName], opts);
        console.log(
          `028 ${`\u001b[${33}m${`matcher([${JSON.stringify(
            node.tagName,
            null,
            0
          )}], ${JSON.stringify(
            opts,
            null,
            0
          )})`}\u001b[${39}m`} = ${JSON.stringify(temp, null, 4)}`
        );
        if (matcher([node.tagName], opts).length) {
          console.log(`039 RAISE ERROR [${node.start}, ${node.end}]`);
          context.report({
            ruleId: "tag-is-present",
            message: `${node.tagName} is not allowed.`,
            idxFrom: node.start,
            idxTo: node.end, // second elem. from last range
            fix: { ranges: [[node.start, node.end]] },
          });
        }
      }
    },
  };
}

export default tagIsPresent;
