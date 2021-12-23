import { Linter, RuleObjType } from "../../linter";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;
// import { Range } from "../../../../../scripts/common";

// rule: attribute-on-closing-tag
// -----------------------------------------------------------------------------

interface AttributeOnClosingTag {
  (context: Linter): RuleObjType;
}
const attributeOnClosingTag: AttributeOnClosingTag = (context) => {
  return {
    tag(node) {
      DEV &&
        console.log(
          `███████████████████████████████████████ attributeOnClosingTag() ███████████████████████████████████████`
        );
      DEV &&
        console.log(
          `022 attributeOnClosingTag(): node = ${JSON.stringify(node, null, 4)}`
        );

      // if there is more than 1 attribute
      if (node.closing && Array.isArray(node.attribs) && node.attribs.length) {
        DEV && console.log(`027 attributeOnClosingTag(): RAISE ERROR`);
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
