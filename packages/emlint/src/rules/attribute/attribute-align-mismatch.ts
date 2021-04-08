import { TagTokenWithChildren } from "../../util/commonTypes";
import { Linter, RuleObjType } from "../../linter";

// rule: attribute-align-mismatch
// -----------------------------------------------------------------------------

interface AttributeAlignMismatch {
  (context: Linter): RuleObjType;
}
const attributeAlignMismatch: AttributeAlignMismatch = (context) => {
  return {
    tag(node) {
      if (
        // if it's a td
        node.tagName === "td" &&
        // opening-one
        !node.closing &&
        // and has some attributes
        node.attribs.length &&
        // and has children tags
        node.children.length
      ) {
        console.log(
          `███████████████████████████████████████ attributeAlignMismatch() ███████████████████████████████████████`
        );
        console.log(
          `027 ${`\u001b[${33}m${`node`}\u001b[${39}m`} = ${JSON.stringify(
            node,
            null,
            4
          )}`
        );

        console.log(`034 - find out align attr's value`);
        let alignAttrVal: string | undefined;
        for (let i = node.attribs.length; i--; ) {
          if (node.attribs[i].attribName === "align") {
            alignAttrVal = node.attribs[i].attribValueRaw;
            console.log(
              `040 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`alignAttrVal`}\u001b[${39}m`} = ${`\u001b[${35}m${alignAttrVal}\u001b[${39}m`}`
            );
            break;
          }
        }

        if (typeof alignAttrVal === "string") {
          console.log(`047 loop all children nodes, look for <table>s`);
          for (let i = node.children.length; i--; ) {
            if (
              node.children[i].type === "tag" &&
              (node.children[i] as TagTokenWithChildren).tagName === "table" &&
              !(node.children[i] as TagTokenWithChildren).closing
            ) {
              console.log(
                `055 ${`\u001b[${33}m${`node.children[i]`}\u001b[${39}m`} = ${JSON.stringify(
                  node.children[i],
                  null,
                  4
                )}`
              );
              if (
                Array.isArray(
                  (node.children[i] as TagTokenWithChildren).attribs
                ) &&
                (node.children[i] as TagTokenWithChildren).attribs.length
              ) {
                (node.children[i] as TagTokenWithChildren).attribs.forEach(
                  (attrib) => {
                    if (
                      attrib.attribName === "align" &&
                      attrib.attribValueRaw !== alignAttrVal
                    ) {
                      console.log(
                        `074 attributeAlignMismatch(): mismatching align: ${`\u001b[${35}m${
                          attrib.attribValueRaw
                        }\u001b[${39}m`}`
                      );
                      context.report({
                        ruleId: "attribute-align-mismatch",
                        message: `Does not match parent td's "align".`,
                        idxFrom: attrib.attribStarts,
                        idxTo: attrib.attribEnds,
                        fix: null,
                      });
                    }
                  }
                );
              }
            }
          }
        }
      }
    },
  };
};

export default attributeAlignMismatch;
