import { Linter, RuleObjType } from "../../linter";
// import { Range } from "../../../../../scripts/common";

// rule: attribute-on-closing-tag
// -----------------------------------------------------------------------------

interface AttributeOnClosingTag {
  (context: Linter): RuleObjType;
}
const attributeOnClosingTag: AttributeOnClosingTag = (context) => {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ attributeOnClosingTag() ███████████████████████████████████████`
      );
      console.log(
        `017 attributeOnClosingTag(): node = ${JSON.stringify(node, null, 4)}`
      );

      // if there is more than 1 attribute
      if (node.closing && Array.isArray(node.attribs) && node.attribs.length) {
        console.log(`022 attributeOnClosingTag(): RAISE ERROR`);
        context.report({
          ruleId: "attribute-on-closing-tag",
          message: `Attribute on a closing tag.`,
          idxFrom: node.attribs[0].attribStarts,
          idxTo: node.attribs[node.attribs.length - 1].attribEnds,
          fix: null,
        });
      }
    },
  };
};

export default attributeOnClosingTag;
