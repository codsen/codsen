// rule: attribute-duplicate
// -----------------------------------------------------------------------------

// it flags up duplicate HTML attributes

function attributeDuplicate(context, ...opts) {
  return {
    html: function(node) {
      console.log(
        `███████████████████████████████████████ attributeDuplicate() ███████████████████████████████████████`
      );
      console.log(
        `013 attributeDuplicate(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeDuplicate(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if there is more than 1 attribute
      if (Array.isArray(node.attribs) && node.attribs.length > 1) {
        const attrsGatheredSoFar = []; // record unique names
        for (let i = 0, len = node.attribs.length; i < len; i++) {
          if (!attrsGatheredSoFar.includes(node.attribs[i].attribName)) {
            attrsGatheredSoFar.push(node.attribs[i].attribName);
          } else {
            console.log(`030 attributeDuplicate(): RAISE ERROR`);
            context.report({
              ruleId: "attribute-duplicate",
              message: `Duplicate attribute "${node.attribs[i].attribName}".`,
              idxFrom: node.attribs[i].attribStart,
              idxTo: node.attribs[i].attribEnd,
              fix: null
            });
          }
        }
      }
    }
  };
}

export default attributeDuplicate;
