// rule: tag-space-after-opening-bracket
// -----------------------------------------------------------------------------

// it flags up any tags which have whitespace between opening bracket and first
// tag name letter:
//
// < table>
// <   a href="">
// <\n\nspan>

function tagSpaceAfterOpeningBracket(context, ...opts) {
  return {
    html: function(node) {
      console.log(`014 inside rule: node = ${JSON.stringify(node, null, 4)}`);
      const gapValue = context.str.slice(node.start + 1, node.tagNameStartAt);
      console.log(`016 gapValue = ${JSON.stringify(gapValue, null, 4)}`);

      console.log(
        `019 ${`\u001b[${33}m${`context.str[${node.tagNameStartAt}]`}\u001b[${39}m`} = ${JSON.stringify(
          context.str[node.tagNameStartAt],
          null,
          4
        )}`
      );
      console.log(
        `026 tagSpaceAfterOpeningBracket(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      if (
        node.tagNameStartAt > node.start + 1 &&
        (!gapValue.trim().length ||
          (gapValue !== "/" && gapValue.trim() === "/"))
      ) {
        const ranges = [];
        if (gapValue.indexOf("/") !== -1) {
          if (node.start + 1 + gapValue.indexOf("/") > node.start + 1) {
            // space is before slash
            ranges.push([
              node.start + 1,
              node.start + 1 + gapValue.indexOf("/")
            ]);
            console.log(
              `046 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${node.start +
                1}, ${node.start + 1 + gapValue.indexOf("/")}]`
            );
          }
          if (
            node.start + 1 + gapValue.indexOf("/") <
            node.tagNameStartAt - 1
          ) {
            ranges.push([
              node.start + 1 + gapValue.indexOf("/") + 1,
              node.tagNameStartAt
            ]);
            console.log(
              `059 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${node.start +
                1 +
                gapValue.indexOf("/") +
                1}, ${node.tagNameStartAt}]`
            );
          }
        } else {
          // simply push from opening bracket to tag name
          ranges.push([
            node.start + 1 + gapValue.indexOf("/") + 1,
            node.tagNameStartAt
          ]);
          console.log(
            `072 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${node.start +
              1 +
              gapValue.indexOf("/") +
              1}, ${node.tagNameStartAt}]`
          );
        }
        console.log(
          `079 tagSpaceAfterOpeningBracket(): ${JSON.stringify(
            ranges,
            null,
            4
          )}`
        );
        context.report({
          ruleId: "tag-space-after-opening-bracket",
          message: "Bad whitespace.",
          idxFrom: ranges[0][0],
          idxTo: ranges[ranges.length - 1][1], // ending of the last range
          fix: { ranges }
        });
      }
    }
  };
}

export default tagSpaceAfterOpeningBracket;
