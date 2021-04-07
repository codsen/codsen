import { Linter, RuleObjType } from "../../linter";

// rule: attribute-required
// -----------------------------------------------------------------------------

interface Opts {
  [tagName: string]: {
    [attrName: string]: undefined | null | boolean;
  };
}
interface AttributeRequired {
  (context: Linter, opts: Opts): RuleObjType;
}
const attributeRequired: AttributeRequired = (context, opts) => {
  return {
    tag(node) {
      console.log(
        `███████████████████████████████████████ attributeRequired() ███████████████████████████████████████`
      );
      console.log(
        `021 attributeRequired(): node = ${JSON.stringify(node, null, 4)}`
      );

      if (
        opts &&
        Object.keys(opts).includes(node.tagName) &&
        opts[node.tagName] &&
        typeof opts[node.tagName] === "object"
      ) {
        console.log(`030 attributeRequired(): check attrs`);

        Object.keys(opts[node.tagName])
          // filter out boolean true
          .filter((attr) => {
            return opts[node.tagName][attr];
          })
          // check is each one present
          .forEach((attr) => {
            if (
              !node.attribs ||
              !node.attribs.some((attrObj) => attrObj.attribName === attr)
            ) {
              console.log(
                `044 attributeRequired(): ${`\u001b[${31}m${`${attr} missing`}\u001b[${39}m`}`
              );
              context.report({
                ruleId: "attribute-required",
                message: `Attribute "${attr}" is missing.`,
                idxFrom: node.start,
                idxTo: node.end,
                fix: null,
              });
            }
          });
      }
    },
  };
};

export default attributeRequired;
