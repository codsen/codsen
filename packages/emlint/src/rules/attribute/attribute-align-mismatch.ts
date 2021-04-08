import { Linter, RuleObjType } from "../../linter";

// rule: attribute-align-mismatch
// -----------------------------------------------------------------------------

interface AttributeAlignMismatch {
  (context: Linter): RuleObjType;
}
const attributeAlignMismatch: AttributeAlignMismatch = (context) => {
  let temp1 = "";
  let temp2: any = {};
  return {
    tag(node) {
      if (
        node.tagName === "td" &&
        !node.closing &&
        Array.isArray(node.attribs) &&
        node.attribs.some((attrib) => {
          if (attrib.attribName === "align") {
            // make a note
            temp1 = attrib.attribValueRaw;
            return true;
          }
          return false;
        }) &&
        Array.isArray(node.children) &&
        node.children.some(
          (childNode) =>
            childNode.type === "tag" &&
            childNode.tagName === "table" &&
            !childNode.closing &&
            Array.isArray(childNode.attribs) &&
            childNode.attribs.some((attrib) => {
              if (
                attrib.attribName === "align" &&
                attrib.attribValueRaw !== temp1
              ) {
                temp2 = attrib;
                return true;
              }
              return false;
            })
        )
      ) {
        console.log(
          `███████████████████████████████████████ attributeAlignMismatch() ███████████████████████████████████████`
        );
        console.log(
          `049 attributeAlignMismatch(): mismatching align: ${JSON.stringify(
            temp2,
            null,
            4
          )}`
        );
        context.report({
          ruleId: "attribute-align-mismatch",
          message: `Does not match parent td's "align".`,
          idxFrom: temp2.attribStarts,
          idxTo: temp2.attribEnds,
          fix: null,
        });
      }
    },
  };
};

export default attributeAlignMismatch;
