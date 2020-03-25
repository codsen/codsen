// rule: tag-bold
// -----------------------------------------------------------------------------

// it flags up any <bold> tags

function tagBold(context, ...opts) {
  return {
    tag: function (node) {
      console.log(
        `███████████████████████████████████████ tagBold() ███████████████████████████████████████`
      );
      console.log(
        `013 tagBold(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(`019 tagBold(): node = ${JSON.stringify(node, null, 4)}`);

      let suggested = "strong";
      if (
        Array.isArray(opts) &&
        typeof opts[0] === "string" &&
        opts[0].toLowerCase() === "b"
      ) {
        suggested = "b";
      }

      if (node.tagName === "bold") {
        console.log(`031 RAISE ERROR [${node.start}, ${node.end}]`);
        context.report({
          ruleId: "tag-bold",
          message: `Tag "bold" does not exist in HTML.`,
          idxFrom: node.start,
          idxTo: node.end, // second elem. from last range
          fix: {
            ranges: [[node.tagNameStartsAt, node.tagNameEndsAt, suggested]],
          },
        });
      }
    },
  };
}

export default tagBold;
