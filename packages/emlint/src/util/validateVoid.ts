import { isObj } from "./util";
import { Linter } from "../linter";
import { ErrorObj } from "./commonTypes";
import { Attrib } from "../../../codsen-tokenizer/src/util/util";

interface Obj {
  [key: string]: any;
}

interface Opts {
  xhtml: boolean;
  enforceSiblingAttributes: null | { type: string[] };
}

function validateVoid(
  node: Obj,
  context: Linter,
  errorArr: ErrorObj[],
  originalOpts?: Partial<Opts>
): ErrorObj[] {
  //
  // prepare the opts
  //

  const defaults: Opts = {
    xhtml: false,
    enforceSiblingAttributes: null,
  };
  const opts: Opts = { ...defaults, ...originalOpts };

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
      node.attribValueRaw !== node.attribName ||
      context.str.slice(node.attribNameEndsAt, node.attribEnds) !==
        `=${quotesType}${node.attribName}${quotesType}`
    ) {
      console.log(
        `038 validateVoid(): ${`\u001b[${31}m${`XHTML requested`}\u001b[${39}m`} - attrib value is missing!`
      );

      console.log(
        `042 validateVoid(): ${`\u001b[${32}m${`██ FINAL RANGES ██`}\u001b[${39}m`}: ${JSON.stringify(
          [
            node.attribNameEndsAt,
            node.attribEnds,
            `=${quotesType}${node.attribName}${quotesType}`,
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
              node.attribEnds,
              `=${quotesType}${node.attribName}${quotesType}`,
            ],
          ],
        },
      });
    }
  } else if (node.attribValueRaw !== null) {
    errorArr.push({
      idxFrom: node.attribNameEndsAt,
      idxTo: node.attribEnds,
      message: `Should have no value.`,
      fix: {
        ranges: [[node.attribNameEndsAt, node.attribEnds]],
      },
    });
  }

  if (
    isObj(opts.enforceSiblingAttributes) &&
    Object.keys(opts.enforceSiblingAttributes as Obj).length
  ) {
    console.log(`083 validateVoid(): sibling attributes enforced`);
    Object.keys(opts.enforceSiblingAttributes as Obj).forEach((siblingAttr) => {
      console.log(
        `086 validateVoid(): checking presence of attribute "${siblingAttr}"`
      );
      if (
        Array.isArray(node.parent.attribs) &&
        !node.parent.attribs.some(
          (attribObj: Attrib) => attribObj.attribName === siblingAttr
        )
      ) {
        // parent tag is missing the requested attribute
        errorArr.push({
          idxFrom: node.parent.start,
          idxTo: node.parent.end,
          message: `Should have attribute "${siblingAttr}".`,
          fix: null,
        });
      } else if (
        (opts.enforceSiblingAttributes as Obj)[siblingAttr] &&
        Array.isArray((opts.enforceSiblingAttributes as Obj)[siblingAttr]) &&
        Array.isArray(node.parent.attribs) &&
        !node.parent.attribs.some(
          (attribObj: Attrib) =>
            attribObj.attribName === siblingAttr &&
            (opts.enforceSiblingAttributes as Obj)[siblingAttr].includes(
              attribObj.attribValueRaw
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
          message: `Only tags with ${(opts.enforceSiblingAttributes as Obj)[
            siblingAttr
          ]
            .map((val: string) => `"${val}"`)
            .join(" or ")} attributes can be ${node.attribName}.`,
          fix: null,
        });
      }
    });
  }

  return errorArr;
}

export default validateVoid;
