// rule: tag-name-case
// -----------------------------------------------------------------------------

function tagNameCase(context) {
  const knownUpperCaseTags = ["DOCTYPE", "CDATA"];
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

      if (node.tagName && node.recognised === true) {
        console.log(`022 recognised tag`);

        console.log(
          `${`\u001b[${33}m${`knownUpperCaseTags.includes(node.tagName.toUpperCase())`}\u001b[${39}m`} = ${JSON.stringify(
            knownUpperCaseTags.includes(node.tagName.toUpperCase()),
            null,
            4
          )}`
        );
        console.log(
          `${`\u001b[${33}m${`node.tagName`}\u001b[${39}m`} = ${JSON.stringify(
            node.tagName,
            null,
            4
          )}`
        );
        console.log(
          `${`\u001b[${33}m${`node.tagName.toUpperCase()`}\u001b[${39}m`} = ${JSON.stringify(
            node.tagName.toUpperCase(),
            null,
            4
          )}`
        );

        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          if (node.tagName !== node.tagName.toUpperCase()) {
            console.log(`048 wrong tag case!`);
            const ranges = [
              [
                node.tagNameStartAt,
                node.tagNameEndAt,
                node.tagName.toUpperCase()
              ]
            ];

            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartAt,
              idxTo: node.tagNameEndAt,
              fix: { ranges }
            });
          }
          // else - FINE
        } else if (node.tagName !== node.tagName.toLowerCase()) {
          console.log(`067 wrong tag case!`);
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
    }
  };
}

export default tagNameCase;
