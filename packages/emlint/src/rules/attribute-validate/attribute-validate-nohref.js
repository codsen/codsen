// rule: attribute-validate-nohref
// -----------------------------------------------------------------------------

import validateVoid from "../../util/validateVoid";

function attributeValidateNohref(context, ...originalOpts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateNohref() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`originalOpts`}\u001b[${39}m`} = ${JSON.stringify(
          originalOpts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateNohref(): node = ${JSON.stringify(node, null, 4)}`
      );

      const opts = {
        xhtml: false
      };

      // normalize the given opts (array) and turn them
      // into a plain object
      if (
        Array.isArray(originalOpts) &&
        originalOpts.length &&
        originalOpts.some(val => val.toLowerCase() === "xhtml")
      ) {
        opts.xhtml = true;
      }

      const errorArr = [];

      if (node.attribName === "nohref") {
        // validate the parent
        if (node.parent.tagName !== "area") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          // validate the value (or absence thereof)
          validateVoid(
            node,
            context,
            errorArr,
            Object.assign({}, opts, {
              enforceSiblingAttributes: null
            })
          );
        }

        // finally, report gathered errors:
        if (errorArr.length) {
          errorArr.forEach(errorObj => {
            console.log(`063 RAISE ERROR`);
            context.report(
              Object.assign({}, errorObj, {
                ruleId: "attribute-validate-nohref"
              })
            );
          });
        }
      }
    }
  };
}

export default attributeValidateNohref;
