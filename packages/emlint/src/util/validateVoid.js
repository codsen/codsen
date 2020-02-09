import { isObj } from "./util";

function validateVoid(node, context, errorArr, originalOpts) {
  console.log(
    `005 ${`\u001b[${35}m${`validateVoid() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
      [...arguments],
      null,
      4
    )}`
  );

  const defaults = {
    xhtml: false,
    enforceSiblingAttributes: null
  };

  const opts = Object.assign({}, defaults, originalOpts);

  //
  // further validation only applicable to input tags:
  //

  if (opts.xhtml) {
    // XHTML mode - enforcing node.attribName="node.attribName"
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
      node.attribValue !== node.attribName ||
      context.str.slice(node.attribNameEndsAt, node.attribEnd) !==
        `=${quotesType}${node.attribName}${quotesType}`
    ) {
      console.log(
        `046 ${`\u001b[${31}m${`XHTML requested`}\u001b[${39}m`} - attrib value is missing!`
      );

      console.log(
        `050 ${`\u001b[${32}m${`██ FINAL RANGES ██`}\u001b[${39}m`}: ${JSON.stringify(
          [
            node.attribNameEndsAt,
            node.attribEnd,
            `=${quotesType}${node.attribName}${quotesType}`
          ],
          null,
          4
        )}`
      );

      errorArr.push({
        idxFrom: node.attribNameStartsAt,
        idxTo: node.attribNameEndsAt,
        message: `It's XHTML, add value, ="${node.attribName}".`,
        fix: {
          ranges: [
            [
              node.attribNameEndsAt,
              node.attribEnd,
              `=${quotesType}${node.attribName}${quotesType}`
            ]
          ]
        }
      });
    }
  } else if (node.attribValue !== null) {
    errorArr.push({
      idxFrom: node.attribNameEndsAt,
      idxTo: node.attribEnd,
      message: `Should have no value.`,
      fix: {
        ranges: [[node.attribNameEndsAt, node.attribEnd]]
      }
    });
  }

  if (
    isObj(opts.enforceSiblingAttributes) &&
    Object.keys(opts.enforceSiblingAttributes).length
  ) {
    console.log(`091 validateVoid(): sibling attributes enforced`);
    Object.keys(opts.enforceSiblingAttributes).forEach(siblingAttr => {
      console.log(
        `094 validateVoid(): checking presence of attribute "${siblingAttr}"`
      );
      if (
        Array.isArray(node.parent.attribs) &&
        !node.parent.attribs.some(
          attribObj => attribObj.attribName === siblingAttr
        )
      ) {
        // parent tag is missing the requested attribute
        errorArr.push({
          idxFrom: node.parent.start,
          idxTo: node.parent.end,
          message: `Should have attribute "${siblingAttr}".`,
          fix: null
        });
      } else if (
        opts.enforceSiblingAttributes[siblingAttr] &&
        Array.isArray(opts.enforceSiblingAttributes[siblingAttr]) &&
        Array.isArray(node.parent.attribs) &&
        !node.parent.attribs.some(
          attribObj =>
            attribObj.attribName === siblingAttr &&
            opts.enforceSiblingAttributes[siblingAttr].includes(
              attribObj.attribValue
            )
        )
      ) {
        // enforce that, for example, "node.attribName"
        // should be present only on input tags of types
        // "checkbox" or "radio"

        // find out where that "type" attribute is located
        let idxFrom;
        let idxTo;
        for (let i = 0, len = node.parent.attribs.length; i < len; i++) {
          if (node.parent.attribs[i].attribName === siblingAttr) {
            idxFrom = node.parent.attribs[i].attribValueStartsAt;
            idxTo = node.parent.attribs[i].attribValueEndsAt;
            break;
          }
        }

        errorArr.push({
          idxFrom,
          idxTo,
          message: `Only tags with ${opts.enforceSiblingAttributes[siblingAttr]
            .map(val => `"${val}"`)
            .join(" or ")} attributes can be ${node.attribName}.`,
          fix: null
        });
      }
    });
  }

  return errorArr;
}

export default validateVoid;
