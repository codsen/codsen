// rule: attribute-malformed
// -----------------------------------------------------------------------------

// it flags up malformed HTML attributes

function attributeMalformed(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeMalformed() ███████████████████████████████████████`
      );
      console.log(
        `013 attributeMalformed(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeMalformed(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (
        node.attribValueStartAt !== null &&
        context.str[node.attribNameEndAt] !== "="
      ) {
        console.log(`027 RAISE ERROR`);
        context.report({
          ruleId: "attribute-malformed",
          message: `Equal is missing.`,
          idxFrom: node.attribStart,
          idxTo: node.attribEnd, // second elem. from last range
          fix: { ranges: [[node.attribNameEndAt, node.attribNameEndAt, "="]] }
        });
      }
    }
  };
}

export default attributeMalformed;
