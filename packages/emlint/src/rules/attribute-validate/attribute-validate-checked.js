// rule: attribute-validate-checked
// -----------------------------------------------------------------------------

// import { right } from "string-left-right";

function attributeValidateChecked(context, ...opts) {
  return {
    attribute: function(node) {
      console.log(
        `███████████████████████████████████████ attributeValidateChecked() ███████████████████████████████████████`
      );
      console.log(
        `013 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
          opts,
          null,
          4
        )}`
      );
      console.log(
        `020 attributeValidateChecked(): node = ${JSON.stringify(
          node,
          null,
          4
        )}`
      );

      const errorArr = [];

      if (node.attribName === "checked") {
        // validate the parent
        if (node.parent.tagName !== "input") {
          errorArr.push({
            idxFrom: node.attribStart,
            idxTo: node.attribEnd,
            message: `Tag "${node.parent.tagName}" can't have this attribute.`,
            fix: null
          });
        } else {
          //
          // further validation only applicable to input tags:
          //

          if (
            Array.isArray(opts) &&
            opts.length &&
            opts.some(val => val.toLowerCase() === "xhtml")
          ) {
            // XHTML mode - enforcing checked="checked"
            let quotesType = `"`;
            if (
              node.attribOpeningQuoteAt !== null &&
              context.str[node.attribOpeningQuoteAt] === `'`
            ) {
              quotesType = `'`;
            } else if (
              node.attribClosingQuoteAt !== null &&
              context.str[node.attribClosingQuoteAt] === `'`
            ) {
              quotesType = `'`;
            }

            // equal might be missing or there might be some rogue whitespace,
            // for example - only value check is not enough
            if (
              node.attribValue !== "checked" ||
              context.str.slice(node.attribNameEndAt, node.attribEnd) !==
                `=${quotesType}checked${quotesType}`
            ) {
              console.log(
                `070 ${`\u001b[${31}m${`XHTML requested`}\u001b[${39}m`} - attrib value is missing!`
              );

              console.log(
                `074 ${`\u001b[${32}m${`██ FINAL RANGES ██`}\u001b[${39}m`}: ${JSON.stringify(
                  [
                    node.attribNameEndAt,
                    node.attribEnd,
                    `=${quotesType}checked${quotesType}`
                  ],
                  null,
                  4
                )}`
              );

              errorArr.push({
                idxFrom: node.attribNameStartAt,
                idxTo: node.attribNameEndAt,
                message: `It's XHTML, add value, ="checked".`,
                fix: {
                  ranges: [
                    [
                      node.attribNameEndAt,
                      node.attribEnd,
                      `=${quotesType}checked${quotesType}`
                    ]
                  ]
                }
              });
            }
          } else if (node.attribValue !== null) {
            errorArr.push({
              idxFrom: node.attribNameEndAt,
              idxTo: node.attribEnd,
              message: `Should have no value.`,
              fix: {
                ranges: [[node.attribNameEndAt, node.attribEnd]]
              }
            });
          }

          if (
            Array.isArray(node.parent.attribs) &&
            !node.parent.attribs.some(
              attribObj => attribObj.attribName === "type"
            )
          ) {
            // parent "input" tag is missing "type" attribute
            errorArr.push({
              idxFrom: node.parent.start,
              idxTo: node.parent.end,
              message: `Should have attribute "type".`,
              fix: null
            });
          } else if (
            Array.isArray(node.parent.attribs) &&
            !node.parent.attribs.some(
              attribObj =>
                attribObj.attribName === "type" &&
                ["checkbox", "radio"].includes(attribObj.attribValue)
            )
          ) {
            // enforce that "checked" should be present only on input tags of types
            // "checkbox" or "radio"

            // find out where that "type" attribute is located
            let idxFrom;
            let idxTo;
            for (let i = 0, len = node.parent.attribs.length; i < len; i++) {
              if (node.parent.attribs[i].attribName === "type") {
                idxFrom = node.parent.attribs[i].attribValueStartAt;
                idxTo = node.parent.attribs[i].attribValueEndAt;
                break;
              }
            }

            errorArr.push({
              idxFrom,
              idxTo,
              message: `Only "checkbox" or "radio" types can be checked.`,
              fix: null
            });
          }
        }

        // finally, report gathered errors:
        errorArr.forEach(errorObj => {
          console.log(`157 RAISE ERROR`);
          context.report(
            Object.assign({}, errorObj, {
              ruleId: "attribute-validate-checked"
            })
          );
        });
      }
    }
  };
}

export default attributeValidateChecked;
