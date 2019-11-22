// rule: tag-name-case
// -----------------------------------------------------------------------------

function tagNameCase(context) {
  return {
    html: function(node) {
      console.log(
        `███████████████████████████████████████ tagNameCase() ███████████████████████████████████████`
      );
      // since we know the location of the closing bracket,
      // let's look to the left, is there a slash and check the distance
      console.log(
        `${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      if (
        node.tagName &&
        node.recognised === true &&
        node.tagName !== node.tagName.toLowerCase()
      ) {
        console.log(`025 wrong tag case!`);
        const ranges = [
          [node.tagNameStartAt, node.tagNameEndAt, node.tagName.toLowerCase()]
        ];

        context.report({
          ruleId: "tag-name-case",
          message: "Bad tag name case.",
          idxFrom: node.tagNameStartAt,
          idxTo: node.tagNameEndAt,
          fix: { ranges }
        });
      }
    }
  };
}

export default tagNameCase;
