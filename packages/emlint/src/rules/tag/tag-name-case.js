// rule: tag-name-case
// -----------------------------------------------------------------------------

function tagNameCase(context) {
  const knownUpperCaseTags = ["DOCTYPE", "CDATA"];
  return {
    tag: function (node) {
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
        console.log(`022 tagNameCase(): recognised tag`);

        console.log(
          `025 tagNameCase(): ${`\u001b[${33}m${`knownUpperCaseTags.includes(node.tagName.toUpperCase())`}\u001b[${39}m`} = ${JSON.stringify(
            knownUpperCaseTags.includes(node.tagName.toUpperCase()),
            null,
            4
          )}`
        );
        console.log(
          `032 tagNameCase(): ${`\u001b[${33}m${`node.tagName`}\u001b[${39}m`} = ${JSON.stringify(
            node.tagName,
            null,
            4
          )}`
        );

        if (knownUpperCaseTags.includes(node.tagName.toUpperCase())) {
          // node.tagName will arrive lowercased, so we have to retrieve
          // the real characters by slicing from ranges
          if (
            context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !==
            node.tagName.toUpperCase()
          ) {
            console.log(`046 tagNameCase(): wrong tag case!`);
            const ranges = [
              [
                node.tagNameStartsAt,
                node.tagNameEndsAt,
                node.tagName.toUpperCase(),
              ],
            ];

            context.report({
              ruleId: "tag-name-case",
              message: "Bad tag name case.",
              idxFrom: node.tagNameStartsAt,
              idxTo: node.tagNameEndsAt,
              fix: { ranges },
            });
          }
          // else - FINE
        } else if (
          context.str.slice(node.tagNameStartsAt, node.tagNameEndsAt) !==
          node.tagName
        ) {
          console.log(`068 tagNameCase(): wrong tag case!`);
          const ranges = [
            [node.tagNameStartsAt, node.tagNameEndsAt, node.tagName],
          ];

          context.report({
            ruleId: "tag-name-case",
            message: "Bad tag name case.",
            idxFrom: node.tagNameStartsAt,
            idxTo: node.tagNameEndsAt,
            fix: { ranges },
          });
        }
      }
    },
  };
}

export default tagNameCase;
